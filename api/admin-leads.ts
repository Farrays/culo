import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  listLeads,
  getStats,
  type LeadStatus,
  type LeadTierDB,
  type LeadChannel,
} from './lib/lead-repository.js';

/**
 * API Route: /api/admin-leads
 *
 * CRM de leads con Supabase como fuente primaria.
 *
 * Endpoints:
 * - GET /api/admin-leads                          → Todos los leads (paginado)
 * - GET /api/admin-leads?search=jose               → Buscar por nombre/email/phone
 * - GET /api/admin-leads?status=new                → Filtrar por estado del pipeline
 * - GET /api/admin-leads?tier=hot                  → Filtrar por tier de scoring
 * - GET /api/admin-leads?channel=whatsapp          → Filtrar por canal
 * - GET /api/admin-leads?has_followup=true         → Leads con followup pendiente
 * - GET /api/admin-leads?order_by=score&order_dir=desc → Ordenar
 * - GET /api/admin-leads?page=0&pageSize=50        → Paginación
 *
 * Headers: Authorization: Bearer {ADMIN_BOOKINGS_TOKEN}
 */

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
// VALID FILTER VALUES
// ============================================================================

const VALID_STATUSES: LeadStatus[] = [
  'new',
  'engaged',
  'qualified',
  'booked',
  'attended',
  'converted',
  'lost',
  'dormant',
];
const VALID_TIERS: LeadTierDB[] = ['hot', 'warm', 'cold'];
const VALID_CHANNELS: LeadChannel[] = ['whatsapp', 'instagram', 'web', 'voice', 'manual'];
const VALID_ORDER_BY = ['last_contact', 'created_at', 'score', 'next_followup'] as const;
const VALID_ORDER_DIR = ['asc', 'desc'] as const;

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

  try {
    // Parse query params with validation
    const {
      search,
      status,
      tier,
      channel,
      has_followup,
      order_by: orderByParam,
      order_dir: orderDirParam,
      page: pageParam,
      pageSize: pageSizeParam,
    } = req.query;

    const page = Math.max(0, Number(pageParam) || 0);
    const pageSize = Math.min(100, Math.max(1, Number(pageSizeParam) || 50));

    // Validate enum filters (ignore invalid values)
    const statusFilter =
      typeof status === 'string' && VALID_STATUSES.includes(status as LeadStatus)
        ? (status as LeadStatus)
        : undefined;
    const tierFilter =
      typeof tier === 'string' && VALID_TIERS.includes(tier as LeadTierDB)
        ? (tier as LeadTierDB)
        : undefined;
    const channelFilter =
      typeof channel === 'string' && VALID_CHANNELS.includes(channel as LeadChannel)
        ? (channel as LeadChannel)
        : undefined;
    const followupFilter =
      has_followup === 'true' ? true : has_followup === 'false' ? false : undefined;

    const orderBy =
      typeof orderByParam === 'string' &&
      (VALID_ORDER_BY as readonly string[]).includes(orderByParam)
        ? (orderByParam as (typeof VALID_ORDER_BY)[number])
        : 'last_contact';
    const orderDir =
      typeof orderDirParam === 'string' &&
      (VALID_ORDER_DIR as readonly string[]).includes(orderDirParam)
        ? (orderDirParam as (typeof VALID_ORDER_DIR)[number])
        : 'desc';

    const searchQuery =
      typeof search === 'string' && search.trim().length >= 2 ? search.trim() : undefined;

    // Fetch leads + stats in parallel from Supabase
    const [result, stats] = await Promise.all([
      listLeads({
        search: searchQuery,
        status: statusFilter,
        tier: tierFilter,
        channel: channelFilter,
        has_followup: followupFilter,
        limit: pageSize,
        offset: page * pageSize,
        order_by: orderBy,
        order_dir: orderDir,
      }),
      getStats(),
    ]);

    console.log(
      `[admin-leads] ${result.total} leads, page ${page}, ` +
        `${result.data.length} returned, search="${searchQuery || ''}", ` +
        `status="${statusFilter || 'all'}", tier="${tierFilter || 'all'}"`
    );

    res.status(200).json({
      success: true,
      stats,
      leads: result.data,
      total: result.total,
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
