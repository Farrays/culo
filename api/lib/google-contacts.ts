/**
 * Google Contacts REST API Helper (People API v1)
 *
 * Integración con Google Contacts para gestión de leads y clientes.
 * Los contactos aparecen automáticamente en el teléfono de la academia
 * sincronizados via Google Contacts.
 *
 * IMPORTANTE - Por qué usamos OAuth2 y no Service Account:
 * =========================================================
 * Google Contacts son datos PERSONALES del usuario. No se pueden
 * "compartir" con un service account (a diferencia de Calendar).
 * Se necesita OAuth2 con refresh token del dueño de la cuenta.
 *
 * Formato del nombre del contacto:
 * {Estado} ({Sexo}) {MM/AA} {Estilo} {Nombre} {Apellidos}
 * Ejemplo: P (M) 02/26 Salsa Juan García
 *
 * Estados:
 * - P = Prospecto (Lead)
 * - A = Alumno (Cliente activo)
 *
 * @see https://developers.google.com/people/api/rest
 *
 * Variables de entorno requeridas:
 * - GOOGLE_CONTACTS_REFRESH_TOKEN
 * - GOOGLE_CALENDAR_CLIENT_ID (reutilizado)
 * - GOOGLE_CALENDAR_CLIENT_SECRET (reutilizado)
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  style?: string; // Estilo de baile (salsa, bachata, etc.)
}

export interface ContactResult {
  success: boolean;
  resourceName?: string; // e.g. "people/c12345"
  error?: string;
}

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const PEOPLE_API_BASE = 'https://people.googleapis.com/v1';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Campos que leemos/escribimos en la API
const PERSON_FIELDS = 'names,phoneNumbers,emailAddresses,memberships';

// ============================================================================
// TOKEN MANAGEMENT (OAuth2 refresh token flow)
// ============================================================================

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtiene un access token válido usando el refresh token.
 * Reutiliza client_id/secret de Google Calendar.
 */
async function getAccessToken(): Promise<string | null> {
  const clientId =
    process.env['GOOGLE_CONTACTS_CLIENT_ID'] || process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret =
    process.env['GOOGLE_CONTACTS_CLIENT_SECRET'] || process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const refreshToken = process.env['GOOGLE_CONTACTS_REFRESH_TOKEN'];

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  // Return cached token if still valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpiry - 60000) {
    return cachedAccessToken;
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-contacts] Token refresh failed:', error);
      return null;
    }

    const data = await response.json();
    cachedAccessToken = data.access_token;
    tokenExpiry = Date.now() + data.expires_in * 1000;

    return cachedAccessToken;
  } catch (error) {
    console.error('[google-contacts] Token refresh error:', error);
    return null;
  }
}

// ============================================================================
// CONFIGURACIÓN CHECK
// ============================================================================

export function isGoogleContactsConfigured(): boolean {
  const clientId =
    process.env['GOOGLE_CONTACTS_CLIENT_ID'] || process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret =
    process.env['GOOGLE_CONTACTS_CLIENT_SECRET'] || process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  return !!(clientId && clientSecret && process.env['GOOGLE_CONTACTS_REFRESH_TOKEN']);
}

// ============================================================================
// DETECCIÓN DE SEXO POR NOMBRE
// ============================================================================

// Nombres comunes que no siguen la regla -a/-o
const MALE_NAMES = new Set([
  'andrea',
  'josefa',
  'nikita',
  'luca',
  'borja',
  'garcia',
  'josue',
  'isa',
  'jesus',
  'angel',
  'miguel',
  'rafael',
  'gabriel',
  'daniel',
  'samuel',
  'joel',
  'axel',
  'abel',
  'ismael',
  'noel',
  'raul',
  'saul',
]);

const FEMALE_NAMES = new Set([
  'carmen',
  'pilar',
  'mercedes',
  'dolores',
  'rosario',
  'consuelo',
  'montserrat',
  'nuria',
  'miriam',
  'ruth',
  'esther',
  'raquel',
  'isabel',
  'maribel',
  'noemi',
  'naiara',
  'ines',
  'beatriz',
  'luz',
  'mar',
  'flor',
  'nieves',
  'rocio',
  'araceli',
]);

/**
 * Detecta sexo por nombre usando heurísticas de nombres españoles.
 * Retorna 'M', 'F' o 'X' si no puede determinar.
 */
export function detectGender(firstName: string): 'M' | 'F' | 'X' {
  const name = firstName.trim().toLowerCase().split(/\s+/)[0] || '';

  if (!name) return 'X';

  // Primero comprobar diccionarios
  if (MALE_NAMES.has(name)) return 'M';
  if (FEMALE_NAMES.has(name)) return 'F';

  // Heurísticas por terminación
  // Femeninos: -a, -is, -iz
  if (name.endsWith('a') || name.endsWith('is') || name.endsWith('iz')) return 'F';

  // Masculinos: -o, -os, -er, -el, -an, -on, -us, -or
  if (
    name.endsWith('o') ||
    name.endsWith('os') ||
    name.endsWith('er') ||
    name.endsWith('el') ||
    name.endsWith('an') ||
    name.endsWith('on') ||
    name.endsWith('us') ||
    name.endsWith('or')
  )
    return 'M';

  return 'X';
}

// ============================================================================
// FORMATO DE NOMBRE DEL CONTACTO
// ============================================================================

/**
 * Genera el nombre formateado para Google Contacts.
 * Formato: {Estado} ({Sexo}) {MM/AA} {Estilo} {Nombre} {Apellidos}
 * Ejemplo: P (M) 02/26 Salsa Juan García
 */
export function formatContactName(
  status: 'P' | 'A',
  firstName: string,
  lastName: string,
  options?: { style?: string; gender?: 'M' | 'F' | 'X' }
): string {
  const gender = options?.gender || detectGender(firstName);
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(2);
  const dateStr = `${month}/${year}`;

  // Capitalizar estilo
  const style = options?.style
    ? options.style.charAt(0).toUpperCase() + options.style.slice(1).toLowerCase()
    : '';

  const parts = [status, `(${gender})`, dateStr, style, firstName.trim(), lastName.trim()].filter(
    Boolean
  );

  return parts.join(' ');
}

/**
 * Extrae el estilo de baile del nombre de la clase.
 * Retorna el primer estilo detectado o cadena vacía.
 */
export function extractStyleFromClass(className: string): string {
  const text = className.toLowerCase();

  const styles: Array<[string, string]> = [
    ['salsa', 'Salsa'],
    ['bachata', 'Bachata'],
    ['kizomba', 'Kizomba'],
    ['zouk', 'Zouk'],
    ['hip hop', 'Hip Hop'],
    ['hiphop', 'Hip Hop'],
    ['house', 'House'],
    ['breaking', 'Breaking'],
    ['dancehall', 'Dancehall'],
    ['afrobeat', 'Afrobeat'],
    ['twerk', 'Twerk'],
    ['reggaeton', 'Reggaeton'],
    ['sexy style', 'Sexy Style'],
    ['heels', 'Heels'],
    ['femmology', 'Femmology'],
    ['ballet', 'Ballet'],
    ['contempor', 'Contemporáneo'],
    ['jazz', 'Jazz'],
    ['k-pop', 'K-Pop'],
    ['kpop', 'K-Pop'],
    ['timba', 'Timba'],
    ['merengue', 'Merengue'],
    ['rueda', 'Rueda'],
    ['afro', 'Afro'],
    ['stretch', 'Stretch'],
    ['cardio', 'Cardio'],
  ];

  for (const [keyword, label] of styles) {
    if (text.includes(keyword)) return label;
  }

  return '';
}

// ============================================================================
// CONTACT GROUPS (Labels en Google Contacts)
// ============================================================================

// Cache de contact groups para evitar llamadas repetidas
const groupCache = new Map<string, string>();

/**
 * Obtiene o crea un contact group (etiqueta) por nombre.
 * Retorna el resourceName del grupo (e.g. "contactGroups/abc123").
 */
async function getOrCreateContactGroup(name: string): Promise<string | null> {
  // Check cache first
  const cached = groupCache.get(name);
  if (cached) return cached;

  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    // 1. Listar grupos existentes
    const listResponse = await fetch(`${PEOPLE_API_BASE}/contactGroups?groupFields=name`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (listResponse.ok) {
      const data = await listResponse.json();
      const groups = data.contactGroups || [];
      for (const group of groups) {
        if (group.name === name && group.resourceName) {
          groupCache.set(name, group.resourceName);
          return group.resourceName;
        }
      }
    }

    // 2. No existe, crear
    const createResponse = await fetch(`${PEOPLE_API_BASE}/contactGroups`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactGroup: { name },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error('[google-contacts] Create group failed:', error);
      return null;
    }

    const created = await createResponse.json();
    const resourceName = created.resourceName;
    if (resourceName) {
      groupCache.set(name, resourceName);
    }
    return resourceName;
  } catch (error) {
    console.error('[google-contacts] getOrCreateContactGroup error:', error);
    return null;
  }
}

// ============================================================================
// CRUD DE CONTACTOS
// ============================================================================

/**
 * Busca un contacto por número de teléfono.
 * Retorna el resourceName si existe, null si no.
 */
async function findContactByPhone(
  phone: string
): Promise<{ resourceName: string; existingGroups: string[] } | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  // Normalizar teléfono para búsqueda
  const cleanPhone = phone.replace(/[\s\-+()]/g, '');
  const searchVariants = [
    cleanPhone,
    cleanPhone.slice(-9), // últimos 9 dígitos (formato español sin prefijo)
  ];

  try {
    for (const query of searchVariants) {
      if (!query || query.length < 6) continue;

      const response = await fetch(
        `${PEOPLE_API_BASE}/people:searchContacts?query=${encodeURIComponent(query)}&readMask=${PERSON_FIELDS}&pageSize=5`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      const results = data.results || [];

      for (const result of results) {
        const person = result.person;
        if (!person?.phoneNumbers) continue;

        // Verificar que el teléfono coincide
        for (const pn of person.phoneNumbers) {
          const personPhone = (pn.value || '').replace(/[\s\-+()]/g, '');
          if (personPhone.endsWith(cleanPhone.slice(-9))) {
            // Extraer grupos del contacto
            const existingGroups = (person.memberships || [])
              .filter(
                (m: { contactGroupMembership?: { contactGroupResourceName: string } }) =>
                  m.contactGroupMembership
              )
              .map(
                (m: { contactGroupMembership: { contactGroupResourceName: string } }) =>
                  m.contactGroupMembership.contactGroupResourceName
              );

            return {
              resourceName: person.resourceName,
              existingGroups,
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('[google-contacts] findContactByPhone error:', error);
    return null;
  }
}

/**
 * Crea un nuevo contacto en Google Contacts.
 */
async function createContact(displayName: string, data: ContactData): Promise<ContactResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    const response = await fetch(
      `${PEOPLE_API_BASE}/people:createContact?personFields=${PERSON_FIELDS}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          names: [{ givenName: displayName }],
          phoneNumbers: [{ value: data.phone, type: 'mobile' }],
          emailAddresses: [{ value: data.email, type: 'other' }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-contacts] Create contact failed:', error);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    const person = await response.json();
    console.log(`[google-contacts] Contact created: ${person.resourceName}`);
    return { success: true, resourceName: person.resourceName };
  } catch (error) {
    console.error('[google-contacts] Create contact error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Actualiza el nombre de un contacto existente.
 */
async function updateContactName(
  resourceName: string,
  newDisplayName: string
): Promise<ContactResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return { success: false, error: 'Failed to get access token' };
  }

  try {
    // Primero obtener el etag actual
    const getResponse = await fetch(
      `${PEOPLE_API_BASE}/${resourceName}?personFields=names,metadata`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!getResponse.ok) {
      return { success: false, error: `Contact not found: ${resourceName}` };
    }

    const currentPerson = await getResponse.json();
    const etag = currentPerson.etag;

    const response = await fetch(
      `${PEOPLE_API_BASE}/${resourceName}:updateContact?updatePersonFields=names`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          etag,
          names: [{ givenName: newDisplayName }],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-contacts] Update contact failed:', error);
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }

    console.log(`[google-contacts] Contact updated: ${resourceName}`);
    return { success: true, resourceName };
  } catch (error) {
    console.error('[google-contacts] Update contact error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Añade un contacto a un contact group.
 */
async function addToGroup(
  contactResourceName: string,
  groupResourceName: string
): Promise<boolean> {
  const accessToken = await getAccessToken();
  if (!accessToken) return false;

  try {
    const response = await fetch(`${PEOPLE_API_BASE}/${groupResourceName}/members:modify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceNamesToAdd: [contactResourceName],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-contacts] addToGroup failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[google-contacts] addToGroup error:', error);
    return false;
  }
}

/**
 * Elimina un contacto de un contact group.
 */
async function removeFromGroup(
  contactResourceName: string,
  groupResourceName: string
): Promise<boolean> {
  const accessToken = await getAccessToken();
  if (!accessToken) return false;

  try {
    const response = await fetch(`${PEOPLE_API_BASE}/${groupResourceName}/members:modify`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceNamesToRemove: [contactResourceName],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[google-contacts] removeFromGroup failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[google-contacts] removeFromGroup error:', error);
    return false;
  }
}

// ============================================================================
// OPERACIONES DE NEGOCIO
// ============================================================================

/**
 * Guarda un contacto como Lead (Prospecto) en Google Contacts.
 * Si ya existe (por teléfono), actualiza el nombre y el grupo.
 *
 * Formato: P (M) 02/26 Salsa Juan García
 */
export async function saveAsLead(data: ContactData): Promise<ContactResult> {
  try {
    const style = data.style ? extractStyleFromClass(data.style) : '';
    const displayName = formatContactName('P', data.firstName, data.lastName, { style });

    // Buscar si ya existe
    const existing = await findContactByPhone(data.phone);

    if (existing) {
      // Ya existe — actualizar nombre y asegurar que está en grupo Lead
      await updateContactName(existing.resourceName, displayName);

      const leadGroup = await getOrCreateContactGroup('Lead');
      if (leadGroup && !existing.existingGroups.includes(leadGroup)) {
        await addToGroup(existing.resourceName, leadGroup);
      }

      console.log(`[google-contacts] Lead updated: ${existing.resourceName} → ${displayName}`);
      return { success: true, resourceName: existing.resourceName };
    }

    // No existe — crear nuevo
    const result = await createContact(displayName, data);
    if (!result.success || !result.resourceName) return result;

    // Añadir al grupo Lead
    const leadGroup = await getOrCreateContactGroup('Lead');
    if (leadGroup) {
      await addToGroup(result.resourceName, leadGroup);
    }

    console.log(`[google-contacts] Lead created: ${result.resourceName} → ${displayName}`);
    return result;
  } catch (error) {
    console.error('[google-contacts] saveAsLead error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Actualiza un contacto de Lead (P) a Alumno (A).
 * Cambia el prefijo del nombre y mueve del grupo Lead al grupo Cliente.
 *
 * Formato: A (F) 12/25 Bachata María Rodríguez
 */
export async function upgradeToCliente(phone: string): Promise<ContactResult> {
  try {
    const existing = await findContactByPhone(phone);
    if (!existing) {
      return { success: false, error: 'Contact not found' };
    }

    // Obtener el nombre actual para cambiar P → A
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return { success: false, error: 'Failed to get access token' };
    }

    const getResponse = await fetch(
      `${PEOPLE_API_BASE}/${existing.resourceName}?personFields=names`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!getResponse.ok) {
      return { success: false, error: 'Could not fetch contact' };
    }

    const person = await getResponse.json();
    const currentName = person.names?.[0]?.givenName || '';

    // Cambiar P → A en el nombre
    const newName = currentName.startsWith('P ')
      ? 'A ' + currentName.slice(2)
      : currentName.replace(/^P\b/, 'A');

    if (newName !== currentName) {
      await updateContactName(existing.resourceName, newName);
    }

    // Mover de grupo Lead → Cliente
    const leadGroup = await getOrCreateContactGroup('Lead');
    const clienteGroup = await getOrCreateContactGroup('Cliente');

    if (leadGroup && existing.existingGroups.includes(leadGroup)) {
      await removeFromGroup(existing.resourceName, leadGroup);
    }

    if (clienteGroup && !existing.existingGroups.includes(clienteGroup)) {
      await addToGroup(existing.resourceName, clienteGroup);
    }

    console.log(`[google-contacts] Upgraded to Cliente: ${existing.resourceName} → ${newName}`);
    return { success: true, resourceName: existing.resourceName };
  } catch (error) {
    console.error('[google-contacts] upgradeToCliente error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// DEBUG / INFO
// ============================================================================

export function getGoogleContactsConfigInfo(): {
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasRefreshToken: boolean;
  configured: boolean;
} {
  const clientId =
    process.env['GOOGLE_CONTACTS_CLIENT_ID'] || process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const clientSecret =
    process.env['GOOGLE_CONTACTS_CLIENT_SECRET'] || process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  return {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRefreshToken: !!process.env['GOOGLE_CONTACTS_REFRESH_TOKEN'],
    configured: isGoogleContactsConfigured(),
  };
}
