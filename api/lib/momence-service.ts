/**
 * Momence Service - Unified API for Momence Integration
 *
 * This service centralizes all Momence API interactions with:
 * - Intelligent caching (30 min for sessions, 24h for teachers)
 * - Query builder for complex filters
 * - Natural language query parsing
 * - Token management with auto-refresh
 *
 * Used by:
 * - agent.ts (schedule queries)
 * - member-lookup.ts (member info)
 * - booking-flow.ts (class selection)
 * - clases.ts (API endpoint)
 *
 * @see ENTERPRISE_AGENT_PLAN.md - Fase 3
 */

import type { Redis } from '@upstash/redis';
import { Buffer } from 'node:buffer';
import {
  detectStyleFromName,
  detectLevelFromName,
  STYLE_KEYWORDS,
} from '../../constants/style-mappings.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_BUSINESS_SLUG = "Farray's-International-Dance-Center";

// Cache TTLs
const CACHE_TTL_SESSIONS = 30 * 60; // 30 minutes for sessions
const CACHE_TTL_TEACHERS = 24 * 60 * 60; // 24 hours for teachers
const CACHE_TTL_TOKEN = 3500; // ~1 hour for token (expires at 3600)

// Cache keys
const CACHE_KEY_SESSIONS = 'momence:sessions';
const CACHE_KEY_TEACHERS = 'momence:teachers';
const CACHE_KEY_TOKEN = 'momence:access_token';

// Spain timezone
const SPAIN_TIMEZONE = 'Europe/Madrid';

// ============================================================================
// TYPES
// ============================================================================

export interface MomenceSession {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookingCount: number;
  locationName?: string;
  inPersonLocation?: string;
  description?: string;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    pictureUrl?: string;
  };
}

export interface NormalizedSession {
  id: number;
  name: string;
  startsAt: string;
  date: string; // "10 ene"
  time: string; // "19:00"
  dayOfWeek: string; // "Lunes"
  dayOfWeekKey: string; // "lunes" (for filtering)
  spotsAvailable: number;
  isFull: boolean;
  instructor: string;
  style: string;
  level: string;
  description: string;
  duration: number;
  checkoutUrl: string;
}

export interface MomenceTeacher {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  pictureUrl?: string;
  bio?: string;
  specialties: string[];
}

export interface SessionQuery {
  style?: string;
  dayOfWeek?: string; // "lunes", "martes", "hoy", "mañana"
  timeRange?: 'morning' | 'afternoon' | 'evening';
  instructor?: string;
  level?: string;
  daysAhead?: number;
  includeFullClasses?: boolean;
  limit?: number;
}

export interface ParsedQuery extends SessionQuery {
  rawText: string;
  confidence: number;
}

// ============================================================================
// MOMENCE SERVICE CLASS
// ============================================================================

export class MomenceService {
  private redis: Redis | null;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  // ==========================================================================
  // QUERY BUILDER
  // ==========================================================================

  /**
   * Query classes with complex filters
   * Example: "bachata on mondays in the evening"
   */
  async queryClasses(query: SessionQuery): Promise<NormalizedSession[]> {
    const {
      style,
      dayOfWeek,
      timeRange,
      instructor,
      level,
      daysAhead = 7,
      includeFullClasses = false,
      limit,
    } = query;

    // 1. Get all sessions for the period (from cache or API)
    const allSessions = await this.fetchSessions(daysAhead);

    // 2. Normalize sessions
    let normalized = allSessions.map(s => this.normalizeSession(s));

    // 3. Apply filters
    // Filter by style
    if (style) {
      const normalizedStyle = style.toLowerCase();
      normalized = normalized.filter(
        s => s.style === normalizedStyle || s.name.toLowerCase().includes(normalizedStyle)
      );
    }

    // Filter by day of week
    if (dayOfWeek) {
      const targetDay = this.resolveDay(dayOfWeek);
      if (targetDay.type === 'specific' && targetDay.date) {
        normalized = normalized.filter(s => s.startsAt.startsWith(targetDay.date));
      } else if (targetDay.type === 'dayOfWeek') {
        normalized = normalized.filter(s => s.dayOfWeekKey === targetDay.dayKey);
      }
    }

    // Filter by time range
    if (timeRange) {
      normalized = normalized.filter(s => {
        const hour = new Date(s.startsAt).getHours();
        switch (timeRange) {
          case 'morning':
            return hour >= 9 && hour < 13;
          case 'afternoon':
            return hour >= 13 && hour < 18;
          case 'evening':
            return hour >= 18 && hour < 23;
          default:
            return true;
        }
      });
    }

    // Filter by instructor
    if (instructor) {
      const normalizedInstructor = instructor.toLowerCase();
      normalized = normalized.filter(s =>
        s.instructor.toLowerCase().includes(normalizedInstructor)
      );
    }

    // Filter by level
    if (level) {
      const normalizedLevel = level.toLowerCase();
      normalized = normalized.filter(s => s.level === normalizedLevel);
    }

    // Filter out full classes
    if (!includeFullClasses) {
      normalized = normalized.filter(s => !s.isFull);
    }

    // Apply limit
    if (limit && limit > 0) {
      normalized = normalized.slice(0, limit);
    }

    return normalized;
  }

  /**
   * Parse natural language query into SessionQuery
   * Example: "bachata los lunes por la mañana" → { style: 'bachata', dayOfWeek: 'lunes', timeRange: 'morning' }
   */
  parseNaturalQuery(text: string): ParsedQuery {
    const lowerText = text.toLowerCase();
    const query: ParsedQuery = {
      rawText: text,
      confidence: 0.5,
    };

    // Detect style using centralized STYLE_KEYWORDS
    for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
      if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
        query.style = style;
        query.confidence += 0.15;
        break;
      }
    }

    // Detect day of week
    const dayPatterns: Record<string, string[]> = {
      hoy: ['hoy', 'today', 'avui', "aujourd'hui"],
      mañana: ['mañana', 'tomorrow', 'demà', 'demain'],
      lunes: ['lunes', 'monday', 'dilluns', 'lundi'],
      martes: ['martes', 'tuesday', 'dimarts', 'mardi'],
      miércoles: ['miércoles', 'miercoles', 'wednesday', 'dimecres', 'mercredi'],
      jueves: ['jueves', 'thursday', 'dijous', 'jeudi'],
      viernes: ['viernes', 'friday', 'divendres', 'vendredi'],
      sábado: ['sábado', 'sabado', 'saturday', 'dissabte', 'samedi'],
      domingo: ['domingo', 'sunday', 'diumenge', 'dimanche'],
    };

    for (const [day, patterns] of Object.entries(dayPatterns)) {
      if (patterns.some(p => lowerText.includes(p))) {
        query.dayOfWeek = day;
        query.confidence += 0.1;
        break;
      }
    }

    // Detect time range (be careful with "mañana" which can mean "tomorrow" or "morning")
    if (
      lowerText.includes('por la mañana') ||
      lowerText.includes('de mañana') ||
      lowerText.includes('morning') ||
      lowerText.includes('matí')
    ) {
      query.timeRange = 'morning';
      query.confidence += 0.1;
    } else if (
      lowerText.includes('por la tarde') ||
      lowerText.includes('afternoon') ||
      lowerText.includes('tarda')
    ) {
      query.timeRange = 'afternoon';
      query.confidence += 0.1;
    } else if (
      lowerText.includes('por la noche') ||
      lowerText.includes('evening') ||
      lowerText.includes('nit') ||
      lowerText.includes('soir')
    ) {
      query.timeRange = 'evening';
      query.confidence += 0.1;
    }

    // Detect level
    const levelPatterns: Record<string, string[]> = {
      iniciacion: ['iniciación', 'iniciacion', 'principiante', 'beginner', 'intro', 'nunca he'],
      basico: ['básico', 'basico', 'basic'],
      intermedio: ['intermedio', 'intermediate'],
      avanzado: ['avanzado', 'advanced', 'pro'],
    };

    for (const [level, patterns] of Object.entries(levelPatterns)) {
      if (patterns.some(p => lowerText.includes(p))) {
        query.level = level;
        query.confidence += 0.1;
        break;
      }
    }

    return query;
  }

  // ==========================================================================
  // SESSIONS API
  // ==========================================================================

  /**
   * Fetch sessions with intelligent caching
   */
  async fetchSessions(daysAhead: number = 7): Promise<MomenceSession[]> {
    const cacheKey = `${CACHE_KEY_SESSIONS}:${daysAhead}`;

    // Try cache first
    if (this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          const sessions =
            typeof cached === 'string' ? JSON.parse(cached) : (cached as MomenceSession[]);

          // Validate cache has content
          if (sessions.length > 0) {
            console.log(`[momence-service] Cache hit: ${sessions.length} sessions`);
            return sessions;
          }
        }
      } catch (e) {
        console.warn('[momence-service] Cache read error:', e);
      }
    }

    // Fetch from API
    console.log(`[momence-service] Fetching sessions for ${daysAhead} days`);
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Unable to authenticate with Momence');
    }

    const now = new Date();
    const futureLimit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const allSessions: MomenceSession[] = [];
    let page = 0;
    let hasMore = true;

    // Paginate through all sessions
    while (hasMore && page < 5) {
      const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('pageSize', '100');
      url.searchParams.set('startAfter', now.toISOString());
      url.searchParams.set('startBefore', futureLimit.toISOString());
      url.searchParams.set('sortBy', 'startsAt');
      url.searchParams.set('sortOrder', 'ASC');

      try {
        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(`[momence-service] API returned ${response.status}`);
          break;
        }

        const data = await response.json();
        const sessions = data.payload || [];
        allSessions.push(...sessions);

        const totalCount = data.pagination?.totalCount || 0;
        const fetchedCount = (page + 1) * 100;
        hasMore = fetchedCount < totalCount && sessions.length === 100;
        page++;
      } catch (error) {
        console.warn('[momence-service] Fetch error:', error);
        break;
      }
    }

    // Cache results
    if (this.redis && allSessions.length > 0) {
      try {
        await this.redis.setex(cacheKey, CACHE_TTL_SESSIONS, JSON.stringify(allSessions));
        console.log(`[momence-service] Cached ${allSessions.length} sessions`);
      } catch (e) {
        console.warn('[momence-service] Cache write error:', e);
      }
    }

    return allSessions;
  }

  /**
   * Normalize a Momence session to a consistent format
   */
  private normalizeSession(session: MomenceSession): NormalizedSession {
    const startDate = new Date(session.startsAt);
    const endDate = new Date(session.endsAt);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    // Format day of week
    const dayFormatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      timeZone: SPAIN_TIMEZONE,
    });
    const dayNameRaw = dayFormatter.format(startDate);
    const dayOfWeek = dayNameRaw.charAt(0).toUpperCase() + dayNameRaw.slice(1);
    const dayOfWeekKey = dayNameRaw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return {
      id: session.id,
      name: session.name,
      startsAt: session.startsAt,
      date: startDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        timeZone: SPAIN_TIMEZONE,
      }),
      time: startDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: SPAIN_TIMEZONE,
      }),
      dayOfWeek,
      dayOfWeekKey,
      spotsAvailable: Math.max(0, session.capacity - session.bookingCount),
      isFull: session.bookingCount >= session.capacity,
      instructor: session.teacher
        ? `${session.teacher.firstName} ${session.teacher.lastName}`.trim()
        : '',
      style: detectStyleFromName(session.name),
      level: detectLevelFromName(session.name),
      description: session.description || '',
      duration: durationMinutes > 0 ? durationMinutes : 60,
      checkoutUrl: this.buildCheckoutUrl(session.id, session.name),
    };
  }

  /**
   * Resolve day filter to specific date or day of week
   */
  private resolveDay(
    dayFilter: string
  ): { type: 'specific'; date: string } | { type: 'dayOfWeek'; dayKey: string } {
    const now = new Date();
    const normalized = dayFilter
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (normalized === 'hoy' || normalized === 'today') {
      return { type: 'specific', date: now.toISOString().split('T')[0] ?? '' };
    }

    if (normalized === 'manana' || normalized === 'tomorrow') {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return { type: 'specific', date: tomorrow.toISOString().split('T')[0] ?? '' };
    }

    // Day of week
    const dayMap: Record<string, string> = {
      lunes: 'lunes',
      monday: 'lunes',
      martes: 'martes',
      tuesday: 'martes',
      miercoles: 'miercoles',
      wednesday: 'miercoles',
      jueves: 'jueves',
      thursday: 'jueves',
      viernes: 'viernes',
      friday: 'viernes',
      sabado: 'sabado',
      saturday: 'sabado',
      domingo: 'domingo',
      sunday: 'domingo',
    };

    return { type: 'dayOfWeek', dayKey: dayMap[normalized] || normalized };
  }

  // ==========================================================================
  // TEACHERS API
  // ==========================================================================

  /**
   * Fetch and sync teachers from Momence
   */
  async fetchTeachers(forceRefresh: boolean = false): Promise<MomenceTeacher[]> {
    const cacheKey = CACHE_KEY_TEACHERS;

    // Try cache first (unless forcing refresh)
    if (!forceRefresh && this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          const teachers =
            typeof cached === 'string' ? JSON.parse(cached) : (cached as MomenceTeacher[]);
          if (teachers.length > 0) {
            return teachers;
          }
        }
      } catch (e) {
        console.warn('[momence-service] Teachers cache read error:', e);
      }
    }

    // Fetch from API
    const token = await this.getAccessToken();
    if (!token) {
      throw new Error('Unable to authenticate with Momence');
    }

    try {
      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/trainers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Momence trainers API error: ${response.status}`);
      }

      const data = await response.json();
      const trainers: MomenceTeacher[] = (data.payload || []).map(
        (t: {
          id: number;
          firstName: string;
          lastName: string;
          pictureUrl?: string;
          bio?: string;
        }) => ({
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
          fullName: `${t.firstName} ${t.lastName}`.trim(),
          pictureUrl: t.pictureUrl,
          bio: t.bio,
          specialties: [], // Could be inferred from classes they teach
        })
      );

      // Cache results
      if (this.redis && trainers.length > 0) {
        try {
          await this.redis.setex(cacheKey, CACHE_TTL_TEACHERS, JSON.stringify(trainers));
        } catch (e) {
          console.warn('[momence-service] Teachers cache write error:', e);
        }
      }

      return trainers;
    } catch (error) {
      console.error('[momence-service] Teachers fetch error:', error);
      return [];
    }
  }

  /**
   * Infer teacher specialties from the classes they teach
   */
  async inferTeacherSpecialties(): Promise<Map<number, string[]>> {
    const sessions = await this.fetchSessions(28); // 4 weeks of data
    const specialties = new Map<number, Set<string>>();

    for (const session of sessions) {
      if (session.teacher) {
        const teacherId = session.teacher.id;
        const style = detectStyleFromName(session.name);

        if (!specialties.has(teacherId)) {
          specialties.set(teacherId, new Set());
        }
        specialties.get(teacherId)?.add(style);
      }
    }

    // Convert Sets to arrays
    const result = new Map<number, string[]>();
    for (const [teacherId, styles] of specialties) {
      result.set(teacherId, Array.from(styles));
    }

    return result;
  }

  // ==========================================================================
  // AUTHENTICATION
  // ==========================================================================

  /**
   * Get Momence access token with caching
   */
  private async getAccessToken(): Promise<string | null> {
    const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
      process.env;

    if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
      console.error('[momence-service] Missing OAuth credentials');
      return null;
    }

    // Check in-memory cache first
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token;
    }

    // Check Redis cache
    if (this.redis) {
      try {
        const cachedToken = await this.redis.get(CACHE_KEY_TOKEN);
        if (cachedToken) {
          const token = String(cachedToken);
          // Also populate in-memory cache
          this.tokenCache = { token, expiresAt: Date.now() + CACHE_TTL_TOKEN * 1000 };
          return token;
        }
      } catch (e) {
        console.warn('[momence-service] Token cache read error:', e);
      }
    }

    // Fetch new token
    const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString(
      'base64'
    );

    try {
      const response = await fetch(`${MOMENCE_API_URL}/api/v2/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: MOMENCE_USERNAME,
          password: MOMENCE_PASSWORD,
        }),
      });

      if (!response.ok) {
        console.error('[momence-service] Auth failed:', response.status);
        return null;
      }

      const data = await response.json();
      const token = data.access_token;

      if (token) {
        // Cache in memory
        this.tokenCache = { token, expiresAt: Date.now() + CACHE_TTL_TOKEN * 1000 };

        // Cache in Redis
        if (this.redis) {
          try {
            await this.redis.setex(CACHE_KEY_TOKEN, CACHE_TTL_TOKEN, token);
          } catch (e) {
            console.warn('[momence-service] Token cache write error:', e);
          }
        }
      }

      return token;
    } catch (error) {
      console.error('[momence-service] Auth error:', error);
      return null;
    }
  }

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  /**
   * Build Momence checkout URL for a session
   */
  private buildCheckoutUrl(sessionId: number, sessionName: string): string {
    const nameSlug = sessionName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    return `https://momence.com/${MOMENCE_BUSINESS_SLUG}/${nameSlug}/${sessionId}`;
  }

  /**
   * Format sessions for display in WhatsApp
   */
  formatSessionsForWhatsApp(
    sessions: NormalizedSession[],
    lang: 'es' | 'ca' | 'en' | 'fr' = 'es'
  ): string {
    if (sessions.length === 0) {
      const noClasses: Record<'es' | 'ca' | 'en' | 'fr', string> = {
        es: 'No hay clases disponibles con esos criterios.',
        ca: 'No hi ha classes disponibles amb aquests criteris.',
        en: 'No classes available with those criteria.',
        fr: 'Aucun cours disponible avec ces critères.',
      };
      return noClasses[lang] || noClasses.es;
    }

    // Group by day
    const byDay: Record<string, NormalizedSession[]> = {};
    for (const session of sessions) {
      const key = `${session.dayOfWeek} ${session.date}`;
      if (!byDay[key]) byDay[key] = [];
      byDay[key].push(session);
    }

    const lines: string[] = [];
    for (const [dayLabel, daySessions] of Object.entries(byDay)) {
      lines.push(`📅 *${dayLabel}*`);
      for (const s of daySessions) {
        const spotsText = s.isFull
          ? '(LLENA)'
          : lang === 'en'
            ? `(${s.spotsAvailable} spots)`
            : `(${s.spotsAvailable} plazas)`;
        const instructor = s.instructor ? ` - ${s.instructor}` : '';
        lines.push(`  ${s.time} ${s.name}${instructor} ${spotsText}`);
      }
      lines.push('');
    }

    return lines.join('\n').trim();
  }

  /**
   * Invalidate session cache (call after booking)
   */
  async invalidateSessionCache(): Promise<void> {
    if (!this.redis) return;

    try {
      // Delete all session cache keys
      const keys = await this.redis.keys(`${CACHE_KEY_SESSIONS}:*`);
      if (keys.length > 0) {
        for (const key of keys) {
          await this.redis.del(key);
        }
        console.log(`[momence-service] Invalidated ${keys.length} cache keys`);
      }
    } catch (e) {
      console.warn('[momence-service] Cache invalidation error:', e);
    }
  }
}

// ============================================================================
// SINGLETON & EXPORTS
// ============================================================================

let serviceInstance: MomenceService | null = null;

/**
 * Get singleton MomenceService instance
 */
export function getMomenceService(redis: Redis | null = null): MomenceService {
  if (!serviceInstance) {
    serviceInstance = new MomenceService(redis);
  }
  return serviceInstance;
}

/**
 * Quick query helper for use in agent
 */
export async function queryMomenceClasses(
  redis: Redis | null,
  query: SessionQuery
): Promise<NormalizedSession[]> {
  const service = getMomenceService(redis);
  return service.queryClasses(query);
}

/**
 * Quick natural language query helper
 */
export async function queryMomenceNatural(
  redis: Redis | null,
  text: string
): Promise<NormalizedSession[]> {
  const service = getMomenceService(redis);
  const parsed = service.parseNaturalQuery(text);
  return service.queryClasses(parsed);
}
