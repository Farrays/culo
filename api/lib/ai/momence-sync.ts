/**
 * Momence Sync Service - Sincronización automática de datos
 *
 * Sincroniza profesores y clases desde Momence al Knowledge Base:
 * - Detecta nuevos profesores automáticamente
 * - Actualiza estilos disponibles según las clases reales
 * - Cachea datos en Redis para respuestas rápidas
 *
 * @see ENTERPRISE_AGENT_PLAN.md - Fase 5
 */

import type { Redis } from '@upstash/redis';
import { Buffer } from 'node:buffer';
import { detectStyleFromName } from '../../../constants/style-mappings.js';

// ============================================================================
// TYPES
// ============================================================================

export interface SyncedTeacher {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  pictureUrl?: string;
  styles: string[]; // Estilos que imparte (detectados de sus clases)
  classCount: number; // Número de clases que imparte
  bio?: string;
}

export interface SyncedStyle {
  name: string;
  slug: string;
  classCount: number;
  teachers: string[]; // Nombres de profesores que lo imparten
  levels: string[]; // Niveles disponibles
  nextClass?: {
    date: string;
    time: string;
    teacher: string;
  };
}

export interface SyncResult {
  success: boolean;
  timestamp: string;
  teachers: {
    total: number;
    new: number;
    updated: number;
  };
  styles: {
    total: number;
    active: number;
  };
  errors?: string[];
}

export interface SyncedData {
  teachers: SyncedTeacher[];
  styles: SyncedStyle[];
  lastSync: string;
  nextSync: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';

// Cache keys
const SYNC_TEACHERS_KEY = 'momence:sync:teachers';
const SYNC_STYLES_KEY = 'momence:sync:styles';
const SYNC_LAST_KEY = 'momence:sync:last';
const SYNC_LOCK_KEY = 'momence:sync:lock';

// TTL: 6 hours (sync every 6 hours)
const SYNC_CACHE_TTL = 6 * 60 * 60;
// Lock TTL: 5 minutes (prevent concurrent syncs)
const SYNC_LOCK_TTL = 5 * 60;

// ============================================================================
// MOMENCE SYNC SERVICE
// ============================================================================

export class MomenceSyncService {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Ejecutar sincronización completa
   */
  async sync(force: boolean = false): Promise<SyncResult> {
    const startTime = Date.now();
    const errors: string[] = [];

    // Check if sync is needed (unless forced)
    if (!force && this.redis) {
      const lastSync = await this.redis.get(SYNC_LAST_KEY);
      if (lastSync) {
        const lastSyncTime = new Date(lastSync as string).getTime();
        const timeSinceSync = Date.now() - lastSyncTime;
        if (timeSinceSync < SYNC_CACHE_TTL * 1000) {
          console.log('[momence-sync] Skipping sync - cache still valid');
          return {
            success: true,
            timestamp: new Date().toISOString(),
            teachers: { total: 0, new: 0, updated: 0 },
            styles: { total: 0, active: 0 },
          };
        }
      }
    }

    // Acquire lock to prevent concurrent syncs
    if (this.redis) {
      const lockAcquired = await this.redis.set(SYNC_LOCK_KEY, '1', {
        ex: SYNC_LOCK_TTL,
        nx: true,
      });
      if (!lockAcquired) {
        console.log('[momence-sync] Sync already in progress');
        return {
          success: false,
          timestamp: new Date().toISOString(),
          teachers: { total: 0, new: 0, updated: 0 },
          styles: { total: 0, active: 0 },
          errors: ['Sync already in progress'],
        };
      }
    }

    try {
      console.log('[momence-sync] Starting sync...');

      // Get Momence token
      const token = await this.getMomenceToken();
      if (!token) {
        throw new Error('Failed to get Momence token');
      }

      // Fetch all sessions for the next 28 days
      const sessions = await this.fetchAllSessions(token, 28);
      console.log(`[momence-sync] Fetched ${sessions.length} sessions`);

      // Extract teachers and styles from sessions
      const { teachers, styles } = this.processSessions(sessions);

      // Get previous data for comparison
      let previousTeachers: SyncedTeacher[] = [];
      if (this.redis) {
        const cached = await this.redis.get(SYNC_TEACHERS_KEY);
        if (cached) {
          previousTeachers = JSON.parse(cached as string);
        }
      }

      // Calculate stats
      const previousTeacherIds = new Set(previousTeachers.map(t => t.id));
      const newTeachers = teachers.filter(t => !previousTeacherIds.has(t.id));
      const updatedTeachers = teachers.filter(t => previousTeacherIds.has(t.id));

      // Save to Redis
      if (this.redis) {
        await Promise.all([
          this.redis.setex(SYNC_TEACHERS_KEY, SYNC_CACHE_TTL, JSON.stringify(teachers)),
          this.redis.setex(SYNC_STYLES_KEY, SYNC_CACHE_TTL, JSON.stringify(styles)),
          this.redis.set(SYNC_LAST_KEY, new Date().toISOString()),
        ]);
      }

      const elapsed = Date.now() - startTime;
      console.log(`[momence-sync] Sync completed in ${elapsed}ms`);
      console.log(`[momence-sync] Teachers: ${teachers.length} (${newTeachers.length} new)`);
      console.log(`[momence-sync] Styles: ${styles.length} active`);

      return {
        success: true,
        timestamp: new Date().toISOString(),
        teachers: {
          total: teachers.length,
          new: newTeachers.length,
          updated: updatedTeachers.length,
        },
        styles: {
          total: styles.length,
          active: styles.filter(s => s.classCount > 0).length,
        },
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('[momence-sync] Sync failed:', error);
      return {
        success: false,
        timestamp: new Date().toISOString(),
        teachers: { total: 0, new: 0, updated: 0 },
        styles: { total: 0, active: 0 },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    } finally {
      // Release lock
      if (this.redis) {
        await this.redis.del(SYNC_LOCK_KEY);
      }
    }
  }

  /**
   * Obtener datos sincronizados (desde cache)
   */
  async getSyncedData(): Promise<SyncedData | null> {
    if (!this.redis) {
      return null;
    }

    try {
      const [teachersRaw, stylesRaw, lastSync] = await Promise.all([
        this.redis.get(SYNC_TEACHERS_KEY),
        this.redis.get(SYNC_STYLES_KEY),
        this.redis.get(SYNC_LAST_KEY),
      ]);

      if (!teachersRaw || !stylesRaw) {
        return null;
      }

      const teachers = JSON.parse(teachersRaw as string) as SyncedTeacher[];
      const styles = JSON.parse(stylesRaw as string) as SyncedStyle[];

      // Calculate next sync time
      const lastSyncTime = lastSync ? new Date(lastSync as string) : new Date();
      const nextSyncTime = new Date(lastSyncTime.getTime() + SYNC_CACHE_TTL * 1000);

      return {
        teachers,
        styles,
        lastSync: lastSyncTime.toISOString(),
        nextSync: nextSyncTime.toISOString(),
      };
    } catch (error) {
      console.error('[momence-sync] Failed to get synced data:', error);
      return null;
    }
  }

  /**
   * Obtener profesores sincronizados
   */
  async getTeachers(): Promise<SyncedTeacher[]> {
    const data = await this.getSyncedData();
    return data?.teachers || [];
  }

  /**
   * Obtener estilos con clases activas
   */
  async getActiveStyles(): Promise<SyncedStyle[]> {
    const data = await this.getSyncedData();
    return data?.styles.filter(s => s.classCount > 0) || [];
  }

  /**
   * Buscar profesor por nombre
   */
  async findTeacher(name: string): Promise<SyncedTeacher | null> {
    const teachers = await this.getTeachers();
    const lowerName = name.toLowerCase();

    return (
      teachers.find(
        t =>
          t.fullName.toLowerCase().includes(lowerName) ||
          t.firstName.toLowerCase().includes(lowerName) ||
          t.lastName.toLowerCase().includes(lowerName)
      ) || null
    );
  }

  /**
   * Generar contexto para el agente sobre profesores
   */
  async getTeachersContext(): Promise<string> {
    const teachers = await this.getTeachers();
    if (teachers.length === 0) {
      return '';
    }

    const lines = ['PROFESORES ACTUALES:'];
    for (const teacher of teachers.slice(0, 10)) {
      // Top 10 por clases
      const stylesStr = teacher.styles.slice(0, 3).join(', ');
      lines.push(`- ${teacher.fullName}: ${stylesStr} (${teacher.classCount} clases/semana)`);
    }

    return lines.join('\n');
  }

  /**
   * Generar contexto para el agente sobre estilos disponibles
   */
  async getStylesContext(): Promise<string> {
    const styles = await this.getActiveStyles();
    if (styles.length === 0) {
      return '';
    }

    const byCategory: Record<string, SyncedStyle[]> = {};
    for (const style of styles) {
      const category = this.categorizeStyle(style.name);
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(style);
    }

    const lines = ['ESTILOS DISPONIBLES ESTA SEMANA:'];
    for (const [category, categoryStyles] of Object.entries(byCategory)) {
      const styleNames = categoryStyles.map(s => s.name).join(', ');
      lines.push(`${category}: ${styleNames}`);
    }

    return lines.join('\n');
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  private async getMomenceToken(): Promise<string | null> {
    const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
      process.env;

    if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
      console.error('[momence-sync] Missing Momence credentials');
      return null;
    }

    const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString(
      'base64'
    );

    try {
      const response = await fetch(MOMENCE_AUTH_URL, {
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
        console.error('[momence-sync] Auth failed:', response.status);
        return null;
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('[momence-sync] Auth error:', error);
      return null;
    }
  }

  private async fetchAllSessions(token: string, daysAhead: number): Promise<MomenceSession[]> {
    const now = new Date();
    const futureLimit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const allSessions: MomenceSession[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore && page < 10) {
      try {
        const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('pageSize', '100');
        url.searchParams.set('startAfter', now.toISOString());
        url.searchParams.set('startBefore', futureLimit.toISOString());
        url.searchParams.set('sortBy', 'startsAt');
        url.searchParams.set('sortOrder', 'ASC');

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(`[momence-sync] API returned ${response.status}`);
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
        console.warn('[momence-sync] Error fetching page:', error);
        break;
      }
    }

    return allSessions;
  }

  private processSessions(sessions: MomenceSession[]): {
    teachers: SyncedTeacher[];
    styles: SyncedStyle[];
  } {
    const teacherMap = new Map<number, SyncedTeacher>();
    const styleMap = new Map<string, SyncedStyle>();

    for (const session of sessions) {
      const style = detectStyleFromName(session.name);
      const level = this.detectLevel(session.name);
      const teacherName = session.teacher
        ? `${session.teacher.firstName} ${session.teacher.lastName}`.trim()
        : '';

      // Update teacher data
      if (session.teacher) {
        const existingTeacher = teacherMap.get(session.teacher.id);
        if (existingTeacher) {
          existingTeacher.classCount++;
          if (!existingTeacher.styles.includes(style)) {
            existingTeacher.styles.push(style);
          }
        } else {
          teacherMap.set(session.teacher.id, {
            id: session.teacher.id,
            firstName: session.teacher.firstName,
            lastName: session.teacher.lastName,
            fullName: teacherName,
            pictureUrl: session.teacher.pictureUrl || undefined,
            styles: [style],
            classCount: 1,
          });
        }
      }

      // Update style data
      const existingStyle = styleMap.get(style);
      if (existingStyle) {
        existingStyle.classCount++;
        if (teacherName && !existingStyle.teachers.includes(teacherName)) {
          existingStyle.teachers.push(teacherName);
        }
        if (level && !existingStyle.levels.includes(level)) {
          existingStyle.levels.push(level);
        }
        // Update next class if earlier
        if (!existingStyle.nextClass) {
          existingStyle.nextClass = {
            date: new Date(session.startsAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            }),
            time: new Date(session.startsAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            teacher: teacherName,
          };
        }
      } else {
        styleMap.set(style, {
          name: style,
          slug: style.toLowerCase().replace(/\s+/g, '-'),
          classCount: 1,
          teachers: teacherName ? [teacherName] : [],
          levels: level ? [level] : [],
          nextClass: {
            date: new Date(session.startsAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
            }),
            time: new Date(session.startsAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            teacher: teacherName,
          },
        });
      }
    }

    // Convert to arrays and sort
    const teachers = Array.from(teacherMap.values()).sort((a, b) => b.classCount - a.classCount);

    const styles = Array.from(styleMap.values()).sort((a, b) => b.classCount - a.classCount);

    return { teachers, styles };
  }

  private detectLevel(name: string): string {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes('iniciación') ||
      lowerName.includes('iniciacion') ||
      lowerName.includes('init')
    ) {
      return 'Iniciación';
    }
    if (
      lowerName.includes('básico') ||
      lowerName.includes('basico') ||
      lowerName.includes('basic')
    ) {
      return 'Básico';
    }
    if (lowerName.includes('intermedio') || lowerName.includes('intermediate')) {
      return 'Intermedio';
    }
    if (lowerName.includes('avanzado') || lowerName.includes('advanced')) {
      return 'Avanzado';
    }
    if (
      lowerName.includes('open') ||
      lowerName.includes('abierto') ||
      lowerName.includes('todos')
    ) {
      return 'Todos los niveles';
    }
    return '';
  }

  private categorizeStyle(style: string): string {
    const lowerStyle = style.toLowerCase();

    if (['salsa', 'bachata', 'kizomba', 'timba', 'son'].some(s => lowerStyle.includes(s))) {
      return '💃 Latino';
    }
    if (
      [
        'hip hop',
        'hiphop',
        'dancehall',
        'twerk',
        'afrobeat',
        'k-pop',
        'kpop',
        'reggaeton',
        'commercial',
      ].some(s => lowerStyle.includes(s))
    ) {
      return '🔥 Urbano';
    }
    if (['heels', 'femmology', 'sexy', 'lady'].some(s => lowerStyle.includes(s))) {
      return '👠 Heels';
    }
    if (['ballet', 'contempor', 'jazz', 'modern'].some(s => lowerStyle.includes(s))) {
      return '🩰 Danza';
    }
    if (['stretch', 'fit', 'yoga', 'pilates'].some(s => lowerStyle.includes(s))) {
      return '💪 Fitness';
    }
    return '🎵 Otros';
  }
}

// ============================================================================
// TYPES (internal)
// ============================================================================

interface MomenceSession {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookingCount: number;
  teacher?: {
    id: number;
    firstName: string;
    lastName: string;
    pictureUrl?: string | null;
  };
}

// ============================================================================
// SINGLETON & EXPORTS
// ============================================================================

let syncInstance: MomenceSyncService | null = null;

export function getMomenceSyncService(redis: Redis | null = null): MomenceSyncService {
  if (!syncInstance) {
    syncInstance = new MomenceSyncService(redis);
  }
  return syncInstance;
}

/**
 * Trigger sync (can be called from cron job or API)
 */
export async function triggerSync(
  redis: Redis | null,
  force: boolean = false
): Promise<SyncResult> {
  const service = getMomenceSyncService(redis);
  return service.sync(force);
}

/**
 * Get fresh context for agent prompts
 */
export async function getSyncedContext(redis: Redis | null): Promise<string> {
  const service = getMomenceSyncService(redis);

  // Trigger sync if needed
  await service.sync(false);

  const [teachersContext, stylesContext] = await Promise.all([
    service.getTeachersContext(),
    service.getStylesContext(),
  ]);

  if (!teachersContext && !stylesContext) {
    return '';
  }

  return `
${teachersContext}

${stylesContext}
  `.trim();
}
