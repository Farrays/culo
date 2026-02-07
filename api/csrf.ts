/**
 * CSRF Token Endpoint
 *
 * GET /api/csrf - Genera un nuevo token CSRF
 *
 * El token se vincula a la sesión del cliente (IP + User-Agent)
 * y expira después de 15 minutos.
 *
 * Response:
 * {
 *   "token": "abc123...",
 *   "expiresIn": 900
 * }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generateCsrfToken, getSessionFromRequest } from './lib/csrf.js';
import { isFeatureEnabled, FEATURES } from './lib/feature-flags.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS headers - solo permitir desde nuestro dominio
  const allowedOrigins = ['https://www.farrayscenter.com', 'https://farrayscenter.com'];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only GET allowed
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Check if CSRF protection is enabled
    const csrfEnabled = await isFeatureEnabled(FEATURES.CSRF_PROTECTION);

    if (!csrfEnabled) {
      // Feature disabled - return dummy token that will be ignored
      // This allows frontend to work without errors while feature is off
      res.status(200).json({
        token: 'csrf_disabled_' + Date.now(),
        expiresIn: 900,
        enabled: false,
      });
      return;
    }

    // Get session info
    const { sessionId, ip } = getSessionFromRequest(req);

    // Generate token
    const token = await generateCsrfToken(sessionId);

    // Log for debugging (redact sensitive info)
    console.log(
      `[CSRF] Token generated for session ${sessionId.substring(0, 8)}... from IP ${ip.substring(0, 8)}...`
    );

    res.status(200).json({
      token,
      expiresIn: 900, // 15 minutes in seconds
      enabled: true,
    });
  } catch (error) {
    console.error('[CSRF] Error generating token:', error);

    // Return a valid response even on error (fail open for UX)
    // The validation will still work because feature flag check happens there too
    res.status(200).json({
      token: 'csrf_error_' + Date.now(),
      expiresIn: 900,
      enabled: false,
      error: 'Token generation failed, CSRF protection disabled for this request',
    });
  }
}
