import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getById,
  getByPhone,
  getInteractions,
  updateStatus,
  scheduleFollowup,
  updateConsent,
  addSignals,
  type LeadStatus,
  type Lead,
} from './lib/lead-repository.js';
import type { InteractionChannel } from './lib/supabase.js';

/**
 * API Route: /api/admin-leads-detail
 *
 * Perfil individual de un lead con timeline de interacciones.
 *
 * Endpoints:
 * - GET  ?id={uuid}                              → Lead profile + interactions
 * - GET  ?phone={phone}                           → Lookup by phone
 * - GET  ?id={uuid}&interactions_limit=100         → Custom interaction limit
 * - GET  ?id={uuid}&interactions_channel=whatsapp  → Filter interactions by channel
 * - PATCH ?id={uuid}  body: { status, next_followup, consent, signals }
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
// VALID VALUES
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

const VALID_INTERACTION_CHANNELS: InteractionChannel[] = [
  'whatsapp',
  'instagram',
  'web',
  'voice',
  'email',
  'manual',
];

// ============================================================================
// HANDLER
// ============================================================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
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

  if (!validateAuth(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    return handleGet(req, res);
  }

  if (req.method === 'PATCH') {
    return handlePatch(req, res);
  }

  res.status(405).json({ error: 'Method not allowed' });
}

// ============================================================================
// GET: Lead profile + interactions
// ============================================================================

async function handleGet(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { id, phone, interactions_limit, interactions_channel, interactions_offset } = req.query;

    // Resolve lead by id or phone
    let lead: Lead | null = null;
    if (typeof id === 'string' && id.length > 0) {
      lead = await getById(id);
    } else if (typeof phone === 'string' && phone.length > 0) {
      lead = await getByPhone(phone);
    } else {
      res.status(400).json({ error: 'Missing required parameter: id or phone' });
      return;
    }

    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    // Parse interaction params
    const limit = Math.min(200, Math.max(1, Number(interactions_limit) || 50));
    const offset = Math.max(0, Number(interactions_offset) || 0);
    const channel =
      typeof interactions_channel === 'string' &&
      VALID_INTERACTION_CHANNELS.includes(interactions_channel as InteractionChannel)
        ? (interactions_channel as InteractionChannel)
        : undefined;

    // Fetch interactions
    const interactions = await getInteractions(lead.id, { limit, offset, channel });

    res.status(200).json({
      success: true,
      lead,
      interactions: interactions.data,
      interactions_total: interactions.total,
    });
  } catch (error) {
    console.error('[admin-leads-detail] GET error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// ============================================================================
// PATCH: Update lead fields
// ============================================================================

async function handlePatch(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { id } = req.query;
    if (typeof id !== 'string' || id.length === 0) {
      res.status(400).json({ error: 'Missing required parameter: id' });
      return;
    }

    const lead = await getById(id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }

    const body = req.body || {};
    const updates: string[] = [];

    // Update status
    if (body.status && VALID_STATUSES.includes(body.status)) {
      await updateStatus(id, body.status);
      updates.push(`status → ${body.status}`);
    }

    // Schedule followup
    if (body.next_followup) {
      const date = new Date(body.next_followup);
      if (!isNaN(date.getTime())) {
        await scheduleFollowup(id, date);
        updates.push(`next_followup → ${date.toISOString()}`);
      }
    }

    // Update consent
    if (body.consent && typeof body.consent === 'object') {
      const consent: { marketing?: boolean; calls?: boolean } = {};
      if (typeof body.consent.marketing === 'boolean') consent.marketing = body.consent.marketing;
      if (typeof body.consent.calls === 'boolean') consent.calls = body.consent.calls;
      if (Object.keys(consent).length > 0) {
        await updateConsent(id, consent);
        updates.push(`consent updated`);
      }
    }

    // Add signals
    if (Array.isArray(body.signals) && body.signals.length > 0) {
      const validSignals = body.signals.filter((s: unknown) => typeof s === 'string');
      if (validSignals.length > 0) {
        await addSignals(id, validSignals);
        updates.push(`signals: +${validSignals.join(', ')}`);
      }
    }

    if (updates.length === 0) {
      res.status(400).json({ error: 'No valid fields to update' });
      return;
    }

    // Fetch updated lead
    const updated = await getById(id);

    console.log(`[admin-leads-detail] PATCH ${id}: ${updates.join(', ')}`);

    res.status(200).json({
      success: true,
      lead: updated,
      updates,
    });
  } catch (error) {
    console.error('[admin-leads-detail] PATCH error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
