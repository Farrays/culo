/**
 * Member Lookup Service
 *
 * Handles looking up existing members by phone number.
 * Uses Redis cache as primary source (fast), falls back to Momence API.
 *
 * Strategy:
 * 1. Check Redis cache first (member:phone:{phone})
 * 2. If not found, try Momence API with query parameter
 * 3. Cache results in Redis for future lookups
 *
 * @see ROADMAP.md - Fase 5: Detección Usuario Existente
 */

import type { Redis } from '@upstash/redis';
import { Buffer } from 'node:buffer';
import { detectStyleFromName } from '../../../constants/style-mappings.js';

// ============================================================================
// TYPES
// ============================================================================

export interface MemberInfo {
  memberId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  // Membership info (populated when fetched from Momence)
  hasActiveMembership?: boolean;
  creditsAvailable?: number;
  membershipName?: string;
  memberSince?: string;
}

export interface MemberLookupResult {
  found: boolean;
  member?: MemberInfo;
  source: 'cache' | 'momence' | 'not_found';
}

export interface MemberVisit {
  className: string;
  date: string;
  instructorName?: string;
}

export interface MemberBooking {
  bookingId: number;
  sessionId: number;
  className: string;
  date: string;
  instructorName?: string;
  canCancel: boolean;
}

export interface UpcomingSession {
  id: number;
  name: string;
  startsAt: string;
  date: string; // formatted: "10 ene"
  time: string; // formatted: "19:00"
  dayOfWeek: string; // "Lunes"
  spotsAvailable: number;
  isFull: boolean;
  instructor: string;
  style: string;
}

// Internal type for Momence API response
interface MomenceVisit {
  sessionName?: string;
  className?: string;
  name?: string;
  date?: string;
  startTime?: string;
  checkinTime?: string;
  instructorName?: string;
  trainerName?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MEMBER_CACHE_PREFIX = 'member:phone:';
const MEMBER_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days
const MOMENCE_API_URL = 'https://api.momence.com';

// ============================================================================
// MEMBER LOOKUP SERVICE
// ============================================================================

export class MemberLookupService {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Look up a member by phone number
   * Returns member info if found, null if not
   */
  async lookupByPhone(phone: string): Promise<MemberLookupResult> {
    const normalizedPhone = this.normalizePhone(phone);

    // 1. Try Redis cache first (fast path)
    const cachedMember = await this.getFromCache(normalizedPhone);
    if (cachedMember) {
      console.log(`[member-lookup] Found in cache: ${normalizedPhone.slice(-4)}`);
      return {
        found: true,
        member: cachedMember,
        source: 'cache',
      };
    }

    // 2. Try Momence API with query
    const momenceMember = await this.searchInMomence(normalizedPhone);
    if (momenceMember) {
      console.log(`[member-lookup] Found in Momence: ${normalizedPhone.slice(-4)}`);
      // Cache for future lookups
      await this.saveToCache(normalizedPhone, momenceMember);
      return {
        found: true,
        member: momenceMember,
        source: 'momence',
      };
    }

    // 3. Not found anywhere
    console.log(`[member-lookup] Not found: ${normalizedPhone.slice(-4)}`);
    return {
      found: false,
      source: 'not_found',
    };
  }

  /**
   * Save member info to Redis cache
   * Called after successful booking creation
   */
  async saveMemberToCache(member: MemberInfo): Promise<void> {
    const normalizedPhone = this.normalizePhone(member.phone);
    await this.saveToCache(normalizedPhone, member);
    console.log(`[member-lookup] Cached member: ${normalizedPhone.slice(-4)}`);
  }

  /**
   * Get member info from Redis cache
   */
  private async getFromCache(phone: string): Promise<MemberInfo | null> {
    if (!this.redis) return null;

    try {
      const key = `${MEMBER_CACHE_PREFIX}${phone}`;
      const data = await this.redis.get(key);

      if (data) {
        // Upstash returns object directly or string
        if (typeof data === 'object') {
          return data as MemberInfo;
        }
        return JSON.parse(String(data)) as MemberInfo;
      }
    } catch (error) {
      console.error('[member-lookup] Redis cache read error:', error);
    }

    return null;
  }

  /**
   * Save member info to Redis cache
   */
  private async saveToCache(phone: string, member: MemberInfo): Promise<void> {
    if (!this.redis) return;

    try {
      const key = `${MEMBER_CACHE_PREFIX}${phone}`;
      await this.redis.setex(key, MEMBER_CACHE_TTL, JSON.stringify(member));
    } catch (error) {
      console.error('[member-lookup] Redis cache write error:', error);
    }
  }

  /**
   * Search for member in Momence by phone number using query parameter
   * ENTERPRISE: Logs detallados para diagnóstico
   */
  private async searchInMomence(phone: string): Promise<MemberInfo | null> {
    console.log(`[member-lookup] Searching Momence for phone: ${phone.slice(-4)}`);

    try {
      const token = await this.getMomenceToken();
      if (!token) {
        console.warn('[member-lookup] ❌ No Momence token available - cannot search');
        return null;
      }

      // Use POST /api/v2/host/members/list with query parameter
      console.log('[member-lookup] Calling Momence API: POST /api/v2/host/members/list');
      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/members/list`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: phone,
          page: 0,
          pageSize: 10,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'unknown');
        console.warn(`[member-lookup] ❌ Momence search failed: ${response.status} - ${errorText}`);
        return null;
      }

      const data = await response.json();
      const members = data.payload || [];
      console.log(`[member-lookup] Momence returned ${members.length} member(s)`);

      // Find member with matching phone number
      const matchedMember = members.find((m: { phoneNumber?: string; phone?: string }) => {
        const memberPhone = this.normalizePhone(m.phoneNumber || m.phone || '');
        return memberPhone === phone || memberPhone.endsWith(phone.slice(-9));
      });

      if (!matchedMember) {
        console.log(`[member-lookup] No matching member found for phone: ${phone.slice(-4)}`);
        return null;
      }

      console.log(
        `[member-lookup] ✓ Member found: ${matchedMember.firstName} ${matchedMember.lastName}`
      );

      // Map to MemberInfo format
      return {
        memberId: matchedMember.id,
        email: matchedMember.email || '',
        firstName: matchedMember.firstName || '',
        lastName: matchedMember.lastName || '',
        phone: phone,
        memberSince: matchedMember.firstSeen || matchedMember.createdAt,
      };
    } catch (error) {
      console.error('[member-lookup] ❌ Momence search error:', error);
      return null;
    }
  }

  /**
   * Fetch member's active memberships and credits from Momence
   * Uses GET /api/v2/host/members/{memberId}/bought-memberships/active
   * @see https://api.momence.com docs
   */
  async fetchMembershipInfo(memberId: number): Promise<{
    hasActiveMembership: boolean;
    creditsAvailable: number;
    membershipName?: string;
  }> {
    console.log(`[member-lookup] 📊 fetchMembershipInfo for member: ${memberId}`);
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        console.warn('[member-lookup] ❌ No token for membership fetch');
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      // Correct endpoint: /bought-memberships/active with pagination
      const url = `${MOMENCE_API_URL}/api/v2/host/members/${memberId}/bought-memberships/active?page=0&pageSize=50`;
      console.log(
        `[member-lookup] 🔄 Fetching active memberships from: /api/v2/host/members/${memberId}/bought-memberships/active`
      );
      const startTime = Date.now();

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      let response: Awaited<ReturnType<typeof fetch>>;
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        console.log(
          `[member-lookup] ✅ Active memberships response: ${response.status} in ${Date.now() - startTime}ms`
        );

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'unknown');
          console.warn(
            `[member-lookup] ❌ Active memberships fetch failed: ${response.status} - ${errorText}`
          );
          return { hasActiveMembership: false, creditsAvailable: 0 };
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.error('[member-lookup] ❌ Active memberships fetch TIMEOUT (10s)');
        } else {
          console.error('[member-lookup] ❌ Active memberships fetch error:', fetchError);
        }
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      const data = await response.json();
      const memberships = data.payload || [];

      console.log(`[member-lookup] 📋 Found ${memberships.length} active membership(s)`);

      if (!Array.isArray(memberships) || memberships.length === 0) {
        console.log('[member-lookup] 💳 No active memberships found');
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      // Sum credits from all active memberships
      // Fields per Momence API docs:
      // - eventCreditsLeft: credits for package-events
      // - moneyCreditsLeft: credits for package-money
      // - usageLimitForSessions - usedSessions: remaining for subscriptions
      // - combinedUsageLimit - combinedUsage: combined limits
      let totalCredits = 0;
      let activeMembershipName = '';

      for (const m of memberships) {
        // Skip frozen memberships
        if (m.isFrozen) continue;

        // Package credits (eventCreditsLeft for class packages)
        if (typeof m.eventCreditsLeft === 'number' && m.eventCreditsLeft > 0) {
          totalCredits += m.eventCreditsLeft;
          console.log(`[member-lookup] 📦 Package credits: ${m.eventCreditsLeft}`);
        }

        // Money credits
        if (typeof m.moneyCreditsLeft === 'number' && m.moneyCreditsLeft > 0) {
          totalCredits += m.moneyCreditsLeft;
          console.log(`[member-lookup] 💰 Money credits: ${m.moneyCreditsLeft}`);
        }

        // Subscription with session limits
        if (typeof m.usageLimitForSessions === 'number' && typeof m.usedSessions === 'number') {
          const remaining = m.usageLimitForSessions - m.usedSessions;
          if (remaining > 0) {
            totalCredits += remaining;
            console.log(`[member-lookup] 📅 Subscription sessions remaining: ${remaining}`);
          }
        }

        // Combined usage limits
        if (typeof m.combinedUsageLimit === 'number' && typeof m.combinedUsage === 'number') {
          const remaining = m.combinedUsageLimit - m.combinedUsage;
          if (remaining > 0) {
            totalCredits += remaining;
            console.log(`[member-lookup] 🔢 Combined usage remaining: ${remaining}`);
          }
        }

        // Get membership name
        if (!activeMembershipName && m.membership?.name) {
          activeMembershipName = m.membership.name;
        }
      }

      console.log(
        `[member-lookup] 💳 Total credits: ${totalCredits}, membership: ${activeMembershipName || 'none'}`
      );

      return {
        hasActiveMembership: memberships.length > 0,
        creditsAvailable: totalCredits,
        membershipName: activeMembershipName || undefined,
      };
    } catch (error) {
      console.error('[member-lookup] Membership fetch error:', error);
      return { hasActiveMembership: false, creditsAvailable: 0 };
    }
  }

  /**
   * Fetch member's visit history from Momence
   * Returns recent class visits
   */
  async fetchMemberVisits(memberId: number): Promise<MemberVisit[]> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return [];
      }

      // GET /api/v2/host/members/{memberId} includes visits field
      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/members/${memberId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`[member-lookup] Member fetch failed: ${response.status}`);
        return [];
      }

      const data = await response.json();
      const member = data.payload || data;

      // Extract visits from member profile
      const visits = member.visits || member.classVisits || [];

      return visits.slice(0, 10).map((visit: MomenceVisit) => ({
        className: visit.sessionName || visit.className || visit.name || 'Clase',
        date: visit.date || visit.startTime || visit.checkinTime,
        instructorName: visit.instructorName || visit.trainerName,
      }));
    } catch (error) {
      console.error('[member-lookup] Visits fetch error:', error);
      return [];
    }
  }

  /**
   * Fetch member's upcoming bookings from Momence
   * Returns bookings that can be cancelled
   */
  async fetchMemberUpcomingBookings(memberId: number): Promise<MemberBooking[]> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return [];
      }

      // Get upcoming sessions and filter for this member's bookings
      // First, get sessions for the next 14 days
      const now = new Date();
      const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

      const response = await fetch(
        `${MOMENCE_API_URL}/api/v2/host/sessions?` +
          new URLSearchParams({
            startTime: now.toISOString(),
            endTime: twoWeeksLater.toISOString(),
          }),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`[member-lookup] Sessions fetch failed: ${response.status}`);
        return [];
      }

      const sessionsData = await response.json();
      const sessions = sessionsData.payload || sessionsData || [];

      const bookings: MemberBooking[] = [];

      // Check each session for this member's bookings
      for (const session of sessions.slice(0, 30)) {
        // Limit API calls
        try {
          const bookingsResponse = await fetch(
            `${MOMENCE_API_URL}/api/v2/host/sessions/${session.id}/bookings`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            const sessionBookings = bookingsData.payload || bookingsData || [];

            // Find this member's booking
            const memberBooking = sessionBookings.find(
              (b: { memberId?: number; member?: { id: number } }) =>
                b.memberId === memberId || b.member?.id === memberId
            );

            if (memberBooking) {
              bookings.push({
                bookingId: memberBooking.id,
                sessionId: session.id,
                className: session.name || session.sessionName || 'Clase',
                date: session.startTime || session.date,
                instructorName: session.instructorName || session.trainerName,
                canCancel: true, // Could check cancellation policy
              });
            }
          }
        } catch {
          // Continue to next session
        }
      }

      return bookings;
    } catch (error) {
      console.error('[member-lookup] Bookings fetch error:', error);
      return [];
    }
  }

  /**
   * Cancel a booking in Momence
   */
  async cancelBooking(bookingId: number): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/session-bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: (errorData as { message?: string }).message || `HTTP ${response.status}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('[member-lookup] Cancel booking error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Add member to session waitlist in Momence (Fase 7)
   */
  async addToWaitlist(
    sessionId: number,
    memberId: number,
    membershipIds?: number[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const body: { memberId: number; useBoughtMembershipIds?: number[] } = { memberId };
      if (membershipIds && membershipIds.length > 0) {
        body.useBoughtMembershipIds = membershipIds;
      }

      const response = await fetch(
        `${MOMENCE_API_URL}/api/v2/host/sessions/${sessionId}/waitlist`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: (errorData as { message?: string }).message || `HTTP ${response.status}`,
        };
      }

      console.log(`[member-lookup] Added member ${memberId} to waitlist for session ${sessionId}`);
      return { success: true };
    } catch (error) {
      console.error('[member-lookup] Waitlist error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update member's email in Momence
   */
  async updateMemberEmail(
    memberId: number,
    newEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/members/${memberId}/email`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: (errorData as { message?: string }).message || `HTTP ${response.status}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('[member-lookup] Update email error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update member's name in Momence
   */
  async updateMemberName(
    memberId: number,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch(`${MOMENCE_API_URL}/api/v2/host/members/${memberId}/name`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: (errorData as { message?: string }).message || `HTTP ${response.status}`,
        };
      }

      return { success: true };
    } catch (error) {
      console.error('[member-lookup] Update name error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Fetch upcoming sessions/classes from Momence
   * Used to answer real-time schedule questions
   *
   * @param styleFilter - Optional style filter (e.g., "bachata", "salsa")
   * @param daysAhead - Number of days to look ahead (default: 7)
   * @returns Array of upcoming sessions
   */
  async fetchUpcomingSessions(
    styleFilter?: string,
    daysAhead: number = 7
  ): Promise<UpcomingSession[]> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        console.warn('[member-lookup] No Momence token for sessions fetch');
        return [];
      }

      const now = new Date();
      const futureLimit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      // Use Momence API with date filtering
      const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
      url.searchParams.set('page', '0');
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
        console.warn(`[member-lookup] Sessions API returned ${response.status}`);
        return [];
      }

      const data = await response.json();
      const sessions = data.payload || [];

      // Normalize and optionally filter
      const normalized: UpcomingSession[] = sessions.map(
        (s: {
          id: number;
          name: string;
          startsAt: string;
          capacity: number;
          bookingCount: number;
          teacher?: { firstName?: string; lastName?: string };
        }) => {
          const startDate = new Date(s.startsAt);
          const dayFormatter = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            timeZone: 'Europe/Madrid',
          });
          const dayNameRaw = dayFormatter.format(startDate);
          const dayOfWeek = dayNameRaw.charAt(0).toUpperCase() + dayNameRaw.slice(1);

          return {
            id: s.id,
            name: s.name,
            startsAt: s.startsAt,
            date: startDate.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              timeZone: 'Europe/Madrid',
            }),
            time: startDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Madrid',
            }),
            dayOfWeek,
            spotsAvailable: Math.max(0, s.capacity - s.bookingCount),
            isFull: s.bookingCount >= s.capacity,
            instructor: s.teacher
              ? `${s.teacher.firstName || ''} ${s.teacher.lastName || ''}`.trim()
              : '',
            style: detectStyleFromName(s.name),
          };
        }
      );

      // Filter by style if provided
      if (styleFilter) {
        const lowerFilter = styleFilter.toLowerCase();
        return normalized.filter(
          s => s.style === lowerFilter || s.name.toLowerCase().includes(lowerFilter)
        );
      }

      return normalized;
    } catch (error) {
      console.error('[member-lookup] Sessions fetch error:', error);
      return [];
    }
  }

  // Style detection moved to constants/style-mappings.ts for consistency
  // Now uses detectStyleFromName() with 30+ styles

  /**
   * Get Momence access token
   * ENTERPRISE: Añadidos logs detallados para diagnóstico
   */
  private async getMomenceToken(): Promise<string | null> {
    const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
      process.env;

    // Diagnóstico: verificar qué credenciales están presentes
    const hasClientId = !!MOMENCE_CLIENT_ID;
    const hasClientSecret = !!MOMENCE_CLIENT_SECRET;
    const hasUsername = !!MOMENCE_USERNAME;
    const hasPassword = !!MOMENCE_PASSWORD;

    console.log(
      `[member-lookup] Momence credentials check: clientId=${hasClientId}, secret=${hasClientSecret}, username=${hasUsername}, password=${hasPassword}`
    );

    if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
      console.error(
        '[member-lookup] ❌ Missing Momence OAuth credentials - member lookup disabled'
      );
      return null;
    }

    // Check cache first
    if (this.redis) {
      try {
        const cachedToken = await this.redis.get('momence:access_token');
        if (cachedToken) {
          console.log('[member-lookup] ✓ Using cached Momence token');
          return String(cachedToken);
        }
      } catch (cacheError) {
        console.warn('[member-lookup] Cache read error:', cacheError);
      }
    }

    // Fetch new token
    console.log('[member-lookup] Fetching new Momence token...');
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
        const errorText = await response.text().catch(() => 'unknown');
        console.error(`[member-lookup] ❌ Momence auth failed: ${response.status} - ${errorText}`);
        return null;
      }

      const data = await response.json();
      const token = data.access_token;

      if (!token) {
        console.error('[member-lookup] ❌ No access_token in Momence response');
        return null;
      }

      console.log('[member-lookup] ✓ Got new Momence token');

      // Cache token
      if (this.redis) {
        try {
          await this.redis.setex('momence:access_token', 3500, token);
          console.log('[member-lookup] ✓ Token cached in Redis');
        } catch (cacheError) {
          console.warn('[member-lookup] Cache write error:', cacheError);
        }
      }

      return token;
    } catch (fetchError) {
      console.error('[member-lookup] ❌ Momence auth network error:', fetchError);
      return null;
    }
  }

  /**
   * Normalize phone number to E.164 format without +
   */
  private normalizePhone(phone: string): string {
    // Remove all non-digits except leading +
    let cleaned = phone.replace(/[\s().-]/g, '');

    // Remove leading +
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }

    // If Spanish number without country code (9 digits starting with 6,7,8,9)
    if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
      cleaned = '34' + cleaned;
    }

    return cleaned;
  }
}

// ============================================================================
// SINGLETON & HELPER FUNCTIONS
// ============================================================================

let memberLookupInstance: MemberLookupService | null = null;

/**
 * Get singleton instance of MemberLookupService
 */
export function getMemberLookup(redis: Redis | null = null): MemberLookupService {
  if (!memberLookupInstance) {
    memberLookupInstance = new MemberLookupService(redis);
  }
  return memberLookupInstance;
}

/**
 * Quick lookup function for use in agent
 */
export async function lookupMemberByPhone(
  redis: Redis | null,
  phone: string
): Promise<MemberLookupResult> {
  const service = getMemberLookup(redis);
  return service.lookupByPhone(phone);
}

/**
 * Save member to cache (called from reservar.ts after successful booking)
 */
export async function cacheMemberInfo(redis: Redis | null, member: MemberInfo): Promise<void> {
  const service = getMemberLookup(redis);
  await service.saveMemberToCache(member);
}
