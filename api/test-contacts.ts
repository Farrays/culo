import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isGoogleContactsConfigured,
  getGoogleContactsConfigInfo,
  saveAsLead,
  upgradeToCliente,
  formatContactName,
  detectGender,
  extractStyleFromClass,
} from './lib/google-contacts.js';

/**
 * Test endpoint para verificar Google Contacts (People API)
 *
 * GET /api/test-contacts?action=check                    -> Verifica configuración
 * GET /api/test-contacts?action=test                     -> Crea contacto de prueba como Lead
 * GET /api/test-contacts?action=search&phone=34612345678 -> Busca contacto por teléfono
 * GET /api/test-contacts?action=upgrade&phone=34612345678 -> Upgrade Lead → Cliente
 * GET /api/test-contacts?action=format&name=Juan&style=Bachata Sensual -> Preview del nombre
 */

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const action = req.query['action'] as string;

  // --------------------------------------------------------------------------
  // CHECK: Verifica configuración
  // --------------------------------------------------------------------------
  if (action === 'check') {
    return res.status(200).json({
      configured: isGoogleContactsConfigured(),
      config: getGoogleContactsConfigInfo(),
      note: 'Google Contacts usa OAuth2 refresh token (no Service Account)',
    });
  }

  // --------------------------------------------------------------------------
  // FORMAT: Preview del nombre del contacto (sin crear nada)
  // --------------------------------------------------------------------------
  if (action === 'format') {
    const name = (req.query['name'] as string) || 'María';
    const lastName = (req.query['lastName'] as string) || 'García';
    const style = (req.query['style'] as string) || 'Bachata Sensual';

    const gender = detectGender(name);
    const extractedStyle = extractStyleFromClass(style);

    return res.status(200).json({
      input: { name, lastName, style },
      detected: { gender, extractedStyle },
      leadName: formatContactName('P', name, lastName, { style, gender }),
      clienteName: formatContactName('A', name, lastName, { style, gender }),
    });
  }

  // --------------------------------------------------------------------------
  // TEST: Crea contacto de prueba como Lead
  // --------------------------------------------------------------------------
  if (action === 'test') {
    if (!isGoogleContactsConfigured()) {
      return res.status(400).json({
        error: 'Google Contacts not configured',
        config: getGoogleContactsConfigInfo(),
      });
    }

    const result = await saveAsLead({
      firstName: 'Test',
      lastName: 'Contacto',
      phone: '+34600000000',
      email: 'test@example.com',
      style: 'Bachata Sensual',
    });

    return res.status(200).json({
      testResult: result,
      message: result.success
        ? 'Google Contacts funciona! Revisa tus contactos.'
        : 'Error al crear contacto',
      expectedName: formatContactName('P', 'Test', 'Contacto', { style: 'Bachata Sensual' }),
    });
  }

  // --------------------------------------------------------------------------
  // SEARCH: Busca contacto por teléfono
  // --------------------------------------------------------------------------
  if (action === 'search') {
    if (!isGoogleContactsConfigured()) {
      return res.status(400).json({ error: 'Google Contacts not configured' });
    }

    const phone = req.query['phone'] as string;
    if (!phone) {
      return res.status(400).json({ error: 'Missing phone parameter' });
    }

    // Usar la API directamente para buscar
    const clientId =
      process.env['GOOGLE_CONTACTS_CLIENT_ID'] || process.env['GOOGLE_CALENDAR_CLIENT_ID'];
    const clientSecret =
      process.env['GOOGLE_CONTACTS_CLIENT_SECRET'] || process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
    const refreshToken = process.env['GOOGLE_CONTACTS_REFRESH_TOKEN'];

    if (!clientId || !clientSecret || !refreshToken) {
      return res.status(500).json({ error: 'Missing credentials' });
    }

    try {
      // Get token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (!tokenRes.ok) {
        return res
          .status(500)
          .json({ error: 'Token refresh failed', details: await tokenRes.text() });
      }

      const tokenData = await tokenRes.json();

      // Search contacts
      const searchRes = await fetch(
        `https://people.googleapis.com/v1/people:searchContacts?query=${encodeURIComponent(phone)}&readMask=names,phoneNumbers,emailAddresses,memberships&pageSize=5`,
        {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }
      );

      if (!searchRes.ok) {
        return res.status(searchRes.status).json({ error: await searchRes.text() });
      }

      const searchData = await searchRes.json();
      return res.status(200).json({
        query: phone,
        resultCount: searchData.results?.length || 0,
        results: searchData.results?.map(
          (r: {
            person: {
              resourceName: string;
              names?: Array<{ displayName: string }>;
              phoneNumbers?: Array<{ value: string }>;
              emailAddresses?: Array<{ value: string }>;
            };
          }) => ({
            resourceName: r.person.resourceName,
            name: r.person.names?.[0]?.displayName,
            phones: r.person.phoneNumbers?.map((p: { value: string }) => p.value),
            emails: r.person.emailAddresses?.map((e: { value: string }) => e.value),
          })
        ),
      });
    } catch (error) {
      return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown' });
    }
  }

  // --------------------------------------------------------------------------
  // UPGRADE: Lead → Cliente
  // --------------------------------------------------------------------------
  if (action === 'upgrade') {
    if (!isGoogleContactsConfigured()) {
      return res.status(400).json({ error: 'Google Contacts not configured' });
    }

    const phone = req.query['phone'] as string;
    if (!phone) {
      return res.status(400).json({ error: 'Missing phone parameter' });
    }

    const result = await upgradeToCliente(phone);
    return res.status(200).json({
      upgradeResult: result,
      message: result.success ? 'Contacto actualizado a Cliente' : 'Error al actualizar contacto',
    });
  }

  // --------------------------------------------------------------------------
  // Default: mostrar acciones disponibles
  // --------------------------------------------------------------------------
  return res.status(200).json({
    availableActions: {
      check: 'GET /api/test-contacts?action=check',
      format:
        'GET /api/test-contacts?action=format&name=María&lastName=García&style=Bachata Sensual',
      test: 'GET /api/test-contacts?action=test',
      search: 'GET /api/test-contacts?action=search&phone=34612345678',
      upgrade: 'GET /api/test-contacts?action=upgrade&phone=34612345678',
    },
  });
}
