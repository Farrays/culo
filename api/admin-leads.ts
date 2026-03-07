import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { MomenceApiClient } from './lib/momence-client.js';

/**
 * API Route: /api/admin-leads
 *
 * CRM de leads: agrupa todas las reservas trial por email para obtener
 * un perfil completo de cada lead con historial, asistencia y membresía.
 *
 * Endpoints:
 * - GET /api/admin-leads                        → Todos los leads (paginado)
 * - GET /api/admin-leads?search=jose             → Buscar por nombre/email/phone
 * - GET /api/admin-leads?status=converted        → Filtrar por estado
 * - GET /api/admin-leads?page=0&pageSize=50      → Paginación
 *
 * Headers: Authorization: Bearer {ADMIN_BOOKINGS_TOKEN}
 */

// ============================================================================
// TYPES
// ============================================================================

interface BookingDetails {
  eventId: string;
  bookingType?: 'trial';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  createdAt: string;
  status?: 'confirmed' | 'cancelled';
  reconciliationStatus?:
    | 'pending'
    | 'attended'
    | 'no_show'
    | 'no_show_unresolved'
    | 'cancelled_on_time'
    | 'cancelled_late'
    | 'rescheduled';
  momenceBookingId?: number | null;
  sessionId?: string | null;
  rescheduleCount?: number;
  rescheduledFrom?: string | null;
  rescheduledTo?: string | null;
  checkedIn?: boolean;
}

interface LeadBooking {
  eventId: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  status: 'confirmed' | 'cancelled';
  reconciliationStatus: string;
  checkedIn: boolean;
  rescheduledTo: string | null;
  rescheduleCount: number;
}

interface Lead {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  estilo: string | null;
  sourceId: string | null;
  totalBookings: number;
  attended: number;
  noShow: number;
  cancelled: number;
  rescheduled: number;
  pending: number;
  firstBookingDate: string;
  lastActivityDate: string;
  membershipStatus: 'none' | 'active' | 'unknown';
  membershipName: string | null;
  hasConversation: boolean;
  whatsappUrl: string;
  bookings: LeadBooking[];
}

interface LeadsSummary {
  totalLeads: number;
  converted: number;
  noShowOnly: number;
  withMembership: number;
  avgBookingsPerLead: number;
  conversionRate: number;
  altaRate: number;
}

// ============================================================================
// REDIS
// ============================================================================

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// ============================================================================
// AUTH
// ============================================================================

function validateAuth(req: VercelRequest): boolean {
  const token = process.env['ADMIN_BOOKINGS_TOKEN'];
  if (!token) return true;

  const authHeader = req.headers['authorization'];
  if (!authHeader) return false;

  const bearerToken = authHeader.replace('Bearer ', '');
  return bearerToken === token;
}

// ============================================================================
// HELPERS
// ============================================================================

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-+()]/g, '');
}

function toLeadBooking(d: BookingDetails): LeadBooking {
  return {
    eventId: d.eventId,
    className: d.className,
    classDate: (d.classDate || '').replace(/T.*$/, ''),
    classTime: d.classTime,
    category: d.category,
    status: d.status || 'confirmed',
    reconciliationStatus: d.reconciliationStatus || 'pending',
    checkedIn: d.checkedIn || false,
    rescheduledTo: d.rescheduledTo || null,
    rescheduleCount: d.rescheduleCount || 0,
  };
}

// ============================================================================
// MOMENCE ENRICHMENT (membership only — lighter than admin-bookings)
// ============================================================================

async function enrichLeadsWithMembership(leads: Lead[]): Promise<void> {
  let momence: MomenceApiClient;
  try {
    momence = new MomenceApiClient(null);
    await momence.getAccessToken();
  } catch {
    return;
  }

  const results = await Promise.allSettled(
    leads.map(async lead => {
      const searchResult = await momence.searchMembers({
        page: 0,
        pageSize: 5,
        query: lead.email,
      });

      const member = searchResult.payload.find(
        m => m.email?.toLowerCase() === lead.email.toLowerCase()
      );
      if (!member) return { email: lead.email, status: 'none' as const, name: null };

      const membershipsResult = await momence.getMemberBoughtMemberships(member.id, {
        page: 0,
        pageSize: 10,
      });
      const active = membershipsResult.payload.filter(m => !m.isFrozen);
      if (active.length > 0) {
        return {
          email: lead.email,
          status: 'active' as const,
          name: active[0]?.membership?.name || null,
        };
      }
      return { email: lead.email, status: 'none' as const, name: null };
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const lead = leads.find(l => l.email.toLowerCase() === result.value.email.toLowerCase());
      if (lead) {
        lead.membershipStatus = result.value.status;
        lead.membershipName = result.value.name;
      }
    }
  }
}

// ============================================================================
// HANDLER
// ============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!validateAuth(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const redis = getRedisClient();
  if (!redis) {
    res.status(503).json({ error: 'Redis not available' });
    return;
  }

  try {
    const { search, status, page: pageParam, pageSize: pageSizeParam } = req.query;
    const searchQuery =
      typeof search === 'string' && search.trim().length >= 2 ? search.trim().toLowerCase() : '';
    const statusFilter = typeof status === 'string' ? status : 'all';
    const page = Math.max(0, Number(pageParam) || 0);
    const pageSize = Math.min(100, Math.max(1, Number(pageSizeParam) || 50));

    // =========================================================================
    // 1. FETCH ALL BOOKING IDs
    // =========================================================================

    let allEventIds = await redis.smembers('all_trial_booking_ids');

    if (allEventIds.length === 0) {
      const scannedIds: string[] = [];
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          'MATCH',
          'booking_details:*',
          'COUNT',
          200
        );
        cursor = nextCursor;
        for (const key of keys) {
          const id = key.replace('booking_details:', '');
          if (id) scannedIds.push(id);
        }
      } while (cursor !== '0');

      if (scannedIds.length > 0) {
        await redis.sadd('all_trial_booking_ids', ...scannedIds);
        allEventIds = scannedIds;
      }
    }

    if (allEventIds.length === 0) {
      res.status(200).json({
        success: true,
        summary: {
          totalLeads: 0,
          converted: 0,
          noShowOnly: 0,
          withMembership: 0,
          avgBookingsPerLead: 0,
          conversionRate: 0,
          altaRate: 0,
        },
        leads: [],
        total: 0,
        page,
        pageSize,
      });
      return;
    }

    // =========================================================================
    // 2. BATCH FETCH BOOKING DETAILS
    // =========================================================================

    const allBookings: BookingDetails[] = [];
    const CHUNK_SIZE = 200;

    for (let i = 0; i < allEventIds.length; i += CHUNK_SIZE) {
      const chunk = allEventIds.slice(i, i + CHUNK_SIZE);
      const pipeline = redis.pipeline();
      for (const eventId of chunk) {
        pipeline.get(`booking_details:${eventId}`);
      }
      const results = await pipeline.exec();
      if (!results) continue;

      for (let j = 0; j < results.length; j++) {
        const [err, result] = results[j] as [Error | null, string | null];
        if (err || !result) continue;
        try {
          const details: BookingDetails = JSON.parse(result);
          if (details.bookingType && details.bookingType !== 'trial') continue;
          if (!details.email) continue;
          allBookings.push(details);
        } catch {
          // Skip malformed
        }
      }
    }

    // =========================================================================
    // 3. GROUP BY EMAIL → BUILD LEADS
    // =========================================================================

    const leadMap = new Map<
      string,
      { bookings: BookingDetails[]; firstName: string; lastName: string; phone: string }
    >();

    for (const booking of allBookings) {
      const emailKey = booking.email.toLowerCase();
      const existing = leadMap.get(emailKey);
      if (existing) {
        existing.bookings.push(booking);
        // Use the most recent name/phone
        if (booking.createdAt > (existing.bookings[0]?.createdAt || '')) {
          existing.firstName = booking.firstName;
          existing.lastName = booking.lastName;
          if (booking.phone) existing.phone = booking.phone;
        }
      } else {
        leadMap.set(emailKey, {
          bookings: [booking],
          firstName: booking.firstName,
          lastName: booking.lastName,
          phone: booking.phone || '',
        });
      }
    }

    // =========================================================================
    // 4. CROSS-REFERENCE WITH lead:{email} DATA
    // =========================================================================

    const emails = [...leadMap.keys()];
    const leadDataMap = new Map<string, { estilo: string | null; sourceId: string | null }>();

    if (emails.length > 0) {
      const leadPipeline = redis.pipeline();
      for (const email of emails) {
        leadPipeline.get(`lead:${email}`);
      }
      const leadResults = await leadPipeline.exec();
      if (leadResults) {
        for (let i = 0; i < leadResults.length; i++) {
          const [err, result] = leadResults[i] as [Error | null, string | null];
          if (err || !result) {
            leadDataMap.set(emails[i] as string, { estilo: null, sourceId: null });
            continue;
          }
          try {
            const data = JSON.parse(result) as { estilo?: string; sourceId?: string };
            leadDataMap.set(emails[i] as string, {
              estilo: data.estilo || null,
              sourceId: data.sourceId || null,
            });
          } catch {
            leadDataMap.set(emails[i] as string, { estilo: null, sourceId: null });
          }
        }
      }
    }

    // =========================================================================
    // 5. CROSS-REFERENCE WITH CONVERSATIONS
    // =========================================================================

    const phoneToEmail = new Map<string, string>();
    for (const [email, data] of leadMap) {
      if (data.phone) {
        const normalized = normalizePhone(data.phone);
        const withPrefix = normalized.startsWith('34') ? normalized : `34${normalized}`;
        phoneToEmail.set(withPrefix, email);
      }
    }

    const conversationEmails = new Set<string>();
    if (phoneToEmail.size > 0) {
      const convPipeline = redis.pipeline();
      const phoneList = [...phoneToEmail.keys()];
      for (const phone of phoneList) {
        convPipeline.zscore('conversations:active', phone);
      }
      const convResults = await convPipeline.exec();
      if (convResults) {
        for (let i = 0; i < convResults.length; i++) {
          const [err, score] = convResults[i] as [Error | null, string | null];
          if (!err && score !== null) {
            const email = phoneToEmail.get(phoneList[i] as string);
            if (email) conversationEmails.add(email);
          }
        }
      }
    }

    // =========================================================================
    // 6. BUILD LEAD OBJECTS
    // =========================================================================

    let leads: Lead[] = [];

    for (const [email, data] of leadMap) {
      const sortedBookings = data.bookings.sort((a, b) =>
        (a.classDate || '').localeCompare(b.classDate || '')
      );

      let attended = 0;
      let noShow = 0;
      let cancelled = 0;
      let rescheduled = 0;
      let pending = 0;

      // Use category from bookings if no estilo from lead form
      let inferredEstilo: string | null = null;

      for (const b of sortedBookings) {
        const recon = b.reconciliationStatus || 'pending';
        if (recon === 'attended') attended++;
        else if (recon === 'no_show' || recon === 'no_show_unresolved') noShow++;
        else if (recon === 'cancelled_on_time' || recon === 'cancelled_late') cancelled++;
        else if (recon === 'rescheduled') rescheduled++;
        else if (b.status === 'cancelled') cancelled++;
        else pending++;

        if (!inferredEstilo && b.category) inferredEstilo = b.category;
      }

      const leadFormData = leadDataMap.get(email);
      const phone = normalizePhone(data.phone);
      const phoneForWa = phone.startsWith('34') ? phone : `34${phone}`;

      leads.push({
        email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        estilo: leadFormData?.estilo || inferredEstilo,
        sourceId: leadFormData?.sourceId || null,
        totalBookings: sortedBookings.length,
        attended,
        noShow,
        cancelled,
        rescheduled,
        pending,
        firstBookingDate: (sortedBookings[0]?.classDate || '').replace(/T.*$/, ''),
        lastActivityDate: (sortedBookings[sortedBookings.length - 1]?.classDate || '').replace(
          /T.*$/,
          ''
        ),
        membershipStatus: 'unknown',
        membershipName: null,
        hasConversation: conversationEmails.has(email),
        whatsappUrl: `https://wa.me/${phoneForWa}`,
        bookings: sortedBookings.map(toLeadBooking),
      });
    }

    // =========================================================================
    // 7. APPLY SEARCH FILTER
    // =========================================================================

    if (searchQuery) {
      leads = leads.filter(lead => {
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        return (
          fullName.includes(searchQuery) ||
          lead.email.includes(searchQuery) ||
          normalizePhone(lead.phone).includes(searchQuery) ||
          lead.phone.includes(searchQuery)
        );
      });
    }

    // =========================================================================
    // 8. APPLY STATUS FILTER
    // =========================================================================

    if (statusFilter === 'converted') {
      leads = leads.filter(l => l.attended > 0);
    } else if (statusFilter === 'no_show') {
      leads = leads.filter(l => l.noShow > 0 && l.attended === 0);
    } else if (statusFilter === 'has_membership') {
      // Will be filtered after Momence enrichment
    } else if (statusFilter === 'pending') {
      leads = leads.filter(l => l.pending > 0 && l.attended === 0 && l.noShow === 0);
    }

    // =========================================================================
    // 9. SORT BY LAST ACTIVITY (most recent first)
    // =========================================================================

    leads.sort((a, b) => b.lastActivityDate.localeCompare(a.lastActivityDate));

    // =========================================================================
    // 10. PAGINATE
    // =========================================================================

    const totalBeforePagination = leads.length;
    const paginatedLeads = leads.slice(page * pageSize, (page + 1) * pageSize);

    // =========================================================================
    // 11. MOMENCE ENRICHMENT (only paginated subset)
    // =========================================================================

    if (paginatedLeads.length > 0) {
      try {
        await enrichLeadsWithMembership(paginatedLeads);
      } catch (e) {
        console.warn(
          '[admin-leads] Momence enrichment failed:',
          e instanceof Error ? e.message : e
        );
      }
    }

    // Apply membership filter AFTER enrichment
    let finalLeads = paginatedLeads;
    let finalTotal = totalBeforePagination;

    if (statusFilter === 'has_membership') {
      finalLeads = paginatedLeads.filter(l => l.membershipStatus === 'active');
      finalTotal = finalLeads.length;
    }

    // =========================================================================
    // 12. CALCULATE SUMMARY
    // =========================================================================

    const summary: LeadsSummary = {
      totalLeads: totalBeforePagination,
      converted: leads.filter(l => l.attended > 0).length,
      noShowOnly: leads.filter(l => l.noShow > 0 && l.attended === 0).length,
      withMembership: finalLeads.filter(l => l.membershipStatus === 'active').length,
      avgBookingsPerLead:
        totalBeforePagination > 0
          ? Math.round(
              (leads.reduce((sum, l) => sum + l.totalBookings, 0) / totalBeforePagination) * 10
            ) / 10
          : 0,
      conversionRate:
        totalBeforePagination > 0
          ? Math.round((leads.filter(l => l.attended > 0).length / totalBeforePagination) * 100)
          : 0,
      altaRate:
        totalBeforePagination > 0
          ? Math.round(
              (finalLeads.filter(l => l.membershipStatus === 'active').length /
                totalBeforePagination) *
                100
            )
          : 0,
    };

    // =========================================================================
    // 13. RESPOND
    // =========================================================================

    console.log(
      `[admin-leads] ${totalBeforePagination} leads, page ${page}, ` +
        `${finalLeads.length} returned, search="${searchQuery}", status="${statusFilter}"`
    );

    res.status(200).json({
      success: true,
      summary,
      leads: finalLeads,
      total: finalTotal,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('[admin-leads] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
