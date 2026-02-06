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
   */
  private async searchInMomence(phone: string): Promise<MemberInfo | null> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        console.warn('[member-lookup] No Momence token available');
        return null;
      }

      // Use POST /api/v2/host/members/list with query parameter
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
        console.warn(`[member-lookup] Momence search failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const members = data.payload || [];

      // Find member with matching phone number
      const matchedMember = members.find((m: { phoneNumber?: string; phone?: string }) => {
        const memberPhone = this.normalizePhone(m.phoneNumber || m.phone || '');
        return memberPhone === phone || memberPhone.endsWith(phone.slice(-9));
      });

      if (!matchedMember) {
        return null;
      }

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
      console.error('[member-lookup] Momence search error:', error);
      return null;
    }
  }

  /**
   * Fetch member's active memberships and credits from Momence
   */
  async fetchMembershipInfo(memberId: number): Promise<{
    hasActiveMembership: boolean;
    creditsAvailable: number;
    membershipName?: string;
  }> {
    try {
      const token = await this.getMomenceToken();
      if (!token) {
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      // Get hostId from environment or use default
      const hostId = process.env['MOMENCE_HOST_ID'] || '';

      // Endpoint: GET /api/v2/host/{hostId}/members/{memberId}/bought-memberships
      const url = hostId
        ? `${MOMENCE_API_URL}/api/v2/host/${hostId}/members/${memberId}/bought-memberships`
        : `${MOMENCE_API_URL}/api/v2/host/members/${memberId}/bought-memberships`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`[member-lookup] Membership fetch failed: ${response.status}`);
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      const data = await response.json();
      const memberships = data.payload || data || [];

      if (!Array.isArray(memberships) || memberships.length === 0) {
        return { hasActiveMembership: false, creditsAvailable: 0 };
      }

      // Find active membership with credits
      let totalCredits = 0;
      let activeMembershipName = '';

      for (const membership of memberships) {
        // Check if membership is active
        const isActive =
          membership.status === 'active' ||
          membership.state === 'active' ||
          !membership.cancelledAt;

        if (isActive) {
          // Sum up credits
          const credits =
            membership.remainingCredits ||
            membership.creditsRemaining ||
            membership.classesRemaining ||
            0;
          totalCredits += credits;

          if (!activeMembershipName && membership.name) {
            activeMembershipName = membership.name;
          }
        }
      }

      return {
        hasActiveMembership:
          totalCredits > 0 || memberships.some((m: { status?: string }) => m.status === 'active'),
        creditsAvailable: totalCredits,
        membershipName: activeMembershipName || undefined,
      };
    } catch (error) {
      console.error('[member-lookup] Membership fetch error:', error);
      return { hasActiveMembership: false, creditsAvailable: 0 };
    }
  }

  /**
   * Get Momence access token
   */
  private async getMomenceToken(): Promise<string | null> {
    const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
      process.env;

    if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
      return null;
    }

    // Check cache first
    if (this.redis) {
      try {
        const cachedToken = await this.redis.get('momence:access_token');
        if (cachedToken) {
          return String(cachedToken);
        }
      } catch {
        // Ignore cache errors
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
        return null;
      }

      const data = await response.json();
      const token = data.access_token;

      // Cache token
      if (this.redis && token) {
        try {
          await this.redis.setex('momence:access_token', 3500, token);
        } catch {
          // Ignore cache errors
        }
      }

      return token;
    } catch {
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
