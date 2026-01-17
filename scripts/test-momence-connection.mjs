/**
 * Test de conexion con Momence API
 *
 * Ejecutar con: node scripts/test-momence-connection.mjs
 *
 * Este script verifica:
 * 1. Autenticacion OAuth2 (Password Grant Flow)
 * 2. Listar sessions/clases
 * 3. Listar miembros
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Cargar .env.local manualmente
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '..', '.env.local');

try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  console.log('No se pudo cargar .env.local:', e.message);
}

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60));
}

// ============================================
// 1. AUTENTICACION
// ============================================

async function getAccessToken() {
  logSection('1. AUTENTICACION OAuth2');

  const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } = process.env;

  if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
    log('ERROR: Faltan variables de entorno de Momence', 'red');
    log('Verifica que .env.local contiene:', 'yellow');
    log('  MOMENCE_CLIENT_ID', 'yellow');
    log('  MOMENCE_CLIENT_SECRET', 'yellow');
    log('  MOMENCE_USERNAME', 'yellow');
    log('  MOMENCE_PASSWORD', 'yellow');
    return null;
  }

  log(`Client ID: ${MOMENCE_CLIENT_ID.substring(0, 15)}...`, 'reset');
  log(`Username: ${MOMENCE_USERNAME}`, 'reset');

  // Basic Auth: client_id:client_secret en Base64
  const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(MOMENCE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: MOMENCE_USERNAME,
        password: MOMENCE_PASSWORD,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      log(`ERROR: ${response.status} ${response.statusText}`, 'red');
      log(`Respuesta: ${errorText}`, 'red');
      return null;
    }

    const data = await response.json();

    log('EXITO: Token obtenido!', 'green');
    log(`Token type: ${data.token_type}`, 'reset');
    log(`Expira en: ${data.expires_in} segundos`, 'reset');
    log(`Access token: ${data.access_token.substring(0, 30)}...`, 'reset');

    return data.access_token;
  } catch (error) {
    log(`ERROR de conexion: ${error.message}`, 'red');
    return null;
  }
}

// ============================================
// 2. LISTAR SESSIONS (CLASES) - CON BÚSQUEDA BINARIA
// ============================================

/**
 * Obtiene la fecha mínima de una página de sesiones
 */
async function getPageMinDate(accessToken, page) {
  const response = await fetch(
    `${MOMENCE_API_URL}/api/v2/host/sessions?page=${page}&pageSize=100`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const sessions = data.payload || [];

  if (sessions.length === 0) return null;

  const dates = sessions.map(s => new Date(s.startsAt).getTime());
  return {
    minDate: new Date(Math.min(...dates)),
    maxDate: new Date(Math.max(...dates)),
    totalPages: Math.ceil(data.pagination.totalCount / 100),
    sessions,
  };
}

/**
 * Búsqueda binaria para encontrar la página donde empiezan las sesiones futuras
 */
async function findCurrentPage(accessToken, targetDate) {
  log('Buscando página con sesiones actuales (búsqueda binaria)...', 'cyan');

  // Primero obtener el total de páginas
  const firstPage = await getPageMinDate(accessToken, 0);
  if (!firstPage) return { page: 0, sessions: [] };

  const totalPages = firstPage.totalPages;
  log(`  Total de páginas: ${totalPages}`, 'reset');

  let left = 0;
  let right = totalPages - 1;
  let resultPage = 0;
  let iterations = 0;

  // Búsqueda binaria
  while (left <= right && iterations < 20) {
    iterations++;
    const mid = Math.floor((left + right) / 2);

    const pageData = await getPageMinDate(accessToken, mid);
    if (!pageData) {
      right = mid - 1;
      continue;
    }

    log(`  Página ${mid}: ${pageData.minDate.toISOString().slice(0, 10)} a ${pageData.maxDate.toISOString().slice(0, 10)}`, 'reset');

    // Si la fecha objetivo está en este rango, encontramos la página
    if (pageData.minDate <= targetDate && targetDate <= pageData.maxDate) {
      resultPage = mid;
      break;
    }

    // Si la fecha mínima de la página es mayor que la objetivo, buscar antes
    if (pageData.minDate > targetDate) {
      right = mid - 1;
    } else {
      // Si la fecha máxima es menor que la objetivo, buscar después
      left = mid + 1;
      resultPage = mid; // Guardar como candidato
    }
  }

  log(`  → Página encontrada: ${resultPage} (en ${iterations} iteraciones)`, 'green');
  return { page: resultPage, totalPages };
}

/**
 * Obtiene las próximas sesiones de forma automática
 */
async function listSessions(accessToken) {
  logSection('2. LISTAR CLASES/SESSIONS');

  const now = new Date();
  // Obtener sesiones hasta 7 días en el futuro
  const futureLimit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  log(`Buscando clases desde ${now.toISOString().slice(0, 10)} hasta ${futureLimit.toISOString().slice(0, 10)}...`, 'reset');

  try {
    // 1. Encontrar la página donde empiezan las sesiones de HOY
    const { page: startPage, totalPages } = await findCurrentPage(accessToken, now);

    // 2. Obtener sesiones desde esa página hasta tener suficientes del futuro
    log(`\nObteniendo sesiones desde página ${startPage}...`, 'cyan');

    let allSessions = [];
    let currentPage = startPage;
    const maxPagesToFetch = 10; // Máximo 10 páginas (1000 sesiones)
    let pagesWithFutureSessions = 0;

    while (currentPage < totalPages && pagesWithFutureSessions < maxPagesToFetch) {
      const response = await fetch(
        `${MOMENCE_API_URL}/api/v2/host/sessions?page=${currentPage}&pageSize=100`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      const sessions = data.payload || [];

      if (sessions.length === 0) break;

      // Filtrar solo sesiones futuras
      const futureSessions = sessions.filter(s => new Date(s.startsAt) >= now);

      if (futureSessions.length > 0) {
        allSessions.push(...futureSessions);
        pagesWithFutureSessions++;

        // Si ya pasamos del límite de 7 días, parar
        const lastSession = futureSessions[futureSessions.length - 1];
        if (new Date(lastSession.startsAt) > futureLimit) {
          break;
        }
      }

      currentPage++;
    }

    // Filtrar solo las del rango deseado (próximos 7 días)
    const sessionsInRange = allSessions.filter(s => {
      const d = new Date(s.startsAt);
      return d >= now && d <= futureLimit;
    });

    log(`\nTotal sesiones obtenidas: ${allSessions.length}`, 'reset');
    log(`Sesiones en próximos 7 días: ${sessionsInRange.length}`, 'green');

    // Agrupar por nombre
    const byName = {};
    sessionsInRange.forEach(s => {
      if (!byName[s.name]) byName[s.name] = [];
      byName[s.name].push(s);
    });

    log(`Tipos de clase únicos: ${Object.keys(byName).length}`, 'green');

    // Ordenar cronológicamente
    const sorted = sessionsInRange.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));

    // Mostrar próximas 15 clases
    console.log('\n=== Próximas 15 clases programadas ===');
    sorted.slice(0, 15).forEach((s, i) => {
      const date = new Date(s.startsAt);
      const day = date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
      const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const spots = s.capacity - s.bookingCount;
      const spotsColor = spots === 0 ? '(LLENA)' : `(${spots} plazas)`;
      console.log(`${String(i + 1).padStart(2)}. [${day} ${time}] ${s.name} ${spotsColor}`);
    });

    // Mostrar resumen por día
    console.log('\n=== Sesiones por día ===');
    const byDay = {};
    sorted.forEach(s => {
      const day = new Date(s.startsAt).toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = 0;
      byDay[day]++;
    });

    Object.entries(byDay).slice(0, 7).forEach(([day, count]) => {
      const d = new Date(day);
      const dayName = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
      console.log(`  ${dayName}: ${count} clases`);
    });

    return sorted;
  } catch (error) {
    log(`ERROR: ${error.message}`, 'red');
    console.error(error);
    return null;
  }
}

// ============================================
// 3. LISTAR MIEMBROS
// ============================================

async function listMembers(accessToken) {
  logSection('3. LISTAR MIEMBROS');

  log('Buscando miembros...', 'reset');

  try {
    // Intentar con el endpoint de list
    const response = await fetch(
      `${MOMENCE_API_URL}/api/v2/host/members/list`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 0,
          pageSize: 5,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      log(`ERROR: ${response.status} ${response.statusText}`, 'red');
      log(`Respuesta: ${errorText}`, 'red');
      return null;
    }

    const data = await response.json();

    // Debug: mostrar estructura de respuesta
    log('Estructura de respuesta:', 'cyan');
    console.log('Keys:', Object.keys(data));

    // Momence usa 'payload' para los datos
    const members = data.payload || data.members || data.data || (Array.isArray(data) ? data : []);

    if (members && members.length > 0) {
      log(`EXITO: ${members.length} miembros encontrados!`, 'green');

      console.log('\nPrimeros miembros:');
      console.log('-'.repeat(60));

      members.slice(0, 3).forEach((member, i) => {
        console.log(`${i + 1}. ${member.firstName || member.first_name || ''} ${member.lastName || member.last_name || ''}`);
        console.log(`   ID: ${member.id}`);
        console.log(`   Email: ${member.email || 'N/A'}`);
        console.log('');
      });

      return members;
    } else {
      log('AVISO: No se encontraron miembros', 'yellow');
      log('Respuesta completa:', 'yellow');
      console.log(JSON.stringify(data, null, 2).substring(0, 1000));
      return [];
    }
  } catch (error) {
    log(`ERROR de conexion: ${error.message}`, 'red');
    return null;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('\n');
  log('========================================', 'bold');
  log('   TEST DE CONEXION CON MOMENCE API   ', 'bold');
  log('========================================', 'bold');

  // 1. Autenticacion
  const accessToken = await getAccessToken();

  if (!accessToken) {
    log('\nFALLO: No se pudo autenticar con Momence', 'red');
    log('Verifica las credenciales en .env.local', 'yellow');
    process.exit(1);
  }

  // 2. Listar Sessions
  const sessions = await listSessions(accessToken);

  // 3. Listar Members
  const members = await listMembers(accessToken);

  // Resumen
  logSection('RESUMEN');

  if (accessToken) {
    log('Autenticacion: OK', 'green');
  } else {
    log('Autenticacion: FALLO', 'red');
  }

  if (sessions !== null) {
    log(`Sessions/Clases: ${sessions.length} encontradas`, sessions.length > 0 ? 'green' : 'yellow');
  } else {
    log('Sessions/Clases: ERROR', 'red');
  }

  if (members !== null) {
    log(`Miembros: ${members.length} encontrados`, members.length > 0 ? 'green' : 'yellow');
  } else {
    log('Miembros: ERROR', 'red');
  }

  console.log('\n');

  if (accessToken && sessions !== null) {
    log('La conexion con Momence API funciona correctamente!', 'green');
    log('Puedes proceder con la implementacion del sistema de reservas.', 'green');
  } else {
    log('Hay problemas con la conexion. Revisa los errores arriba.', 'red');
  }

  console.log('\n');
}

main().catch(console.error);
