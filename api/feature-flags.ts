/**
 * Feature Flags Admin Endpoint
 *
 * GET  /api/feature-flags - Lista todos los flags
 * POST /api/feature-flags - Actualiza un flag
 *
 * IMPORTANTE: Este endpoint debe estar protegido en producción
 * con autenticación de admin.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getAllFlags,
  enableFeature,
  disableFeature,
  snapshotFlags,
  restoreFromSnapshot,
  emergencyDisable,
  emergencyRestore,
  logFlagChange,
  getAuditLog,
  FEATURES,
  type FeatureFlag,
} from './lib/feature-flags';

// Admin token for protection (set in Vercel env)
const ADMIN_TOKEN = process.env['FEATURE_FLAGS_ADMIN_TOKEN'];

function isAuthorized(req: VercelRequest): boolean {
  // En desarrollo, permitir sin token
  if (process.env['NODE_ENV'] === 'development') {
    return true;
  }

  // En producción, requerir token
  const authHeader = req.headers['authorization'];
  if (!authHeader || !ADMIN_TOKEN) {
    return false;
  }

  return authHeader === `Bearer ${ADMIN_TOKEN}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.farrayscenter.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Authorization check
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // GET: List all flags
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      const { action } = req.query;

      // GET /api/feature-flags?action=audit - Get audit log
      if (action === 'audit') {
        const log = await getAuditLog(50);
        res.status(200).json({ auditLog: log });
        return;
      }

      // GET /api/feature-flags - List all flags
      const flags = await getAllFlags();
      res.status(200).json({
        flags,
        available: Object.keys(FEATURES),
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // POST: Update flags
    // ─────────────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body = req.body as {
        action:
          | 'enable'
          | 'disable'
          | 'snapshot'
          | 'restore'
          | 'emergency_disable'
          | 'emergency_restore';
        flag?: FeatureFlag;
        snapshotKey?: string;
        system?: 'booking' | 'fichaje' | 'agent' | 'analytics';
        reason?: string;
        changedBy?: string;
      };

      const { action, flag, snapshotKey, system, reason, changedBy } = body;

      switch (action) {
        case 'enable':
          if (!flag) {
            res.status(400).json({ error: 'flag is required' });
            return;
          }
          await enableFeature(flag);
          if (reason && changedBy) {
            await logFlagChange(flag, true, reason, changedBy);
          }
          res.status(200).json({ success: true, flag, enabled: true });
          return;

        case 'disable':
          if (!flag) {
            res.status(400).json({ error: 'flag is required' });
            return;
          }
          await disableFeature(flag);
          if (reason && changedBy) {
            await logFlagChange(flag, false, reason, changedBy);
          }
          res.status(200).json({ success: true, flag, enabled: false });
          return;

        case 'snapshot': {
          const snapshot = await snapshotFlags();
          res.status(200).json({
            success: true,
            snapshot,
            message: 'Snapshot saved for rollback',
          });
          return;
        }

        case 'restore':
          if (!snapshotKey) {
            res.status(400).json({ error: 'snapshotKey is required' });
            return;
          }
          await restoreFromSnapshot(snapshotKey);
          res.status(200).json({
            success: true,
            message: `Restored from ${snapshotKey}`,
          });
          return;

        case 'emergency_disable':
          if (!system) {
            res.status(400).json({ error: 'system is required (booking|fichaje|agent|analytics)' });
            return;
          }
          await emergencyDisable(system);
          res.status(200).json({
            success: true,
            message: `EMERGENCY: ${system} DISABLED`,
            warning: 'System is now offline!',
          });
          return;

        case 'emergency_restore':
          if (!system) {
            res.status(400).json({ error: 'system is required' });
            return;
          }
          await emergencyRestore(system);
          res.status(200).json({
            success: true,
            message: `${system} restored`,
          });
          return;

        default:
          res.status(400).json({
            error: 'Invalid action',
            validActions: [
              'enable',
              'disable',
              'snapshot',
              'restore',
              'emergency_disable',
              'emergency_restore',
            ],
          });
          return;
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[feature-flags] Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
