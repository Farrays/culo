/**
 * Momence API Authentication Middleware
 *
 * Protects the /api/momence/* endpoints with API key authentication.
 * Internal requests (same origin) are allowed without API key.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export function validateApiKey(req: VercelRequest, res: VercelResponse): boolean {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env['MOMENCE_API_KEY'];

  // If no API key is configured, allow all requests (development mode)
  if (!expectedKey) {
    console.warn('[momence-auth] No MOMENCE_API_KEY configured, allowing request');
    return true;
  }

  // Check API key
  if (apiKey === expectedKey) {
    return true;
  }

  // Check if internal request (from same Vercel deployment)
  const referer = req.headers.referer || '';
  const host = req.headers.host || '';
  if (referer.includes(host) || referer.includes('localhost')) {
    return true;
  }

  // Unauthorized
  res.status(401).json({ error: 'Unauthorized - Invalid or missing API key' });
  return false;
}

export function corsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
}

export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  corsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}
