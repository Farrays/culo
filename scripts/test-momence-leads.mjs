/**
 * Test del endpoint Customer Leads de Momence
 *
 * Ejecutar con: node scripts/test-momence-leads.mjs
 */

const LEADS_URL = 'https://api.momence.com/integrations/customer-leads/36148/collect';
const LEADS_TOKEN = '2nj96Dm7R9';

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testLeadsEndpoint() {
  console.log('\n========================================');
  log('TEST: Customer Leads Endpoint', 'cyan');
  console.log('========================================\n');

  log(`URL: ${LEADS_URL}`, 'reset');
  log(`Token: ${LEADS_TOKEN.substring(0, 5)}...`, 'reset');

  // Datos de prueba (email ficticio para no crear lead real)
  const testData = {
    email: 'test-api-' + Date.now() + '@example.com',
    firstName: 'Test',
    lastName: 'API',
    phone: '+34600000000',
  };

  log('\nDatos de prueba:', 'cyan');
  console.log(JSON.stringify(testData, null, 2));

  // Probar diferentes métodos de autenticación
  const authMethods = [
    {
      name: 'Bearer Token en Header',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEADS_TOKEN}`,
      },
      body: testData,
    },
    {
      name: 'Token en Header X-API-Key',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': LEADS_TOKEN,
      },
      body: testData,
    },
    {
      name: 'Token en Body',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { ...testData, token: LEADS_TOKEN },
    },
    {
      name: 'Token como query param',
      url: `${LEADS_URL}?token=${LEADS_TOKEN}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: testData,
    },
  ];

  for (const method of authMethods) {
    log(`\n--- Probando: ${method.name} ---`, 'yellow');

    try {
      const response = await fetch(method.url || LEADS_URL, {
        method: 'POST',
        headers: method.headers,
        body: JSON.stringify(method.body),
      });

      const status = response.status;
      const statusText = response.statusText;

      log(`Status: ${status} ${statusText}`, status < 400 ? 'green' : 'red');

      // Intentar leer respuesta
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
        console.log('Respuesta:', JSON.stringify(data, null, 2));
      } catch {
        console.log('Respuesta (texto):', text.substring(0, 500));
      }

      if (response.ok) {
        log('\n¡ÉXITO! Este método funciona.', 'green');
        log(`Método: ${method.name}`, 'green');
        return { success: true, method: method.name, data };
      }
    } catch (error) {
      log(`Error: ${error.message}`, 'red');
    }
  }

  // Probar GET para ver la estructura esperada
  log('\n--- Probando GET para ver estructura ---', 'yellow');
  try {
    const response = await fetch(LEADS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LEADS_TOKEN}`,
      },
    });

    log(`Status: ${response.status} ${response.statusText}`, response.status < 400 ? 'green' : 'yellow');
    const text = await response.text();
    console.log('Respuesta:', text.substring(0, 1000));
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
  }

  // Probar OPTIONS para ver métodos permitidos
  log('\n--- Probando OPTIONS ---', 'yellow');
  try {
    const response = await fetch(LEADS_URL, {
      method: 'OPTIONS',
    });

    log(`Status: ${response.status}`, 'cyan');
    log('Headers permitidos:', 'cyan');
    console.log('  Allow:', response.headers.get('allow'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('access-control-allow-methods'));
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
  }

  return { success: false };
}

// También probar el endpoint de bookings para ver estructura
async function testBookingsInfo() {
  console.log('\n\n========================================');
  log('INFO: Estructura de Booking en Momence', 'cyan');
  console.log('========================================\n');

  log('Según la documentación de Momence:', 'yellow');
  console.log(`
  Cuando creas un booking con:
  POST /api/v2/host/sessions/{sessionId}/bookings/free

  Momence automáticamente:
  1. ✅ Añade al cliente a la sesión
  2. ✅ Envía email de confirmación (si está configurado en Sequences)
  3. ✅ Activa Sequences asociadas al evento "Booking Created"

  Para emails automáticos, necesitas:
  1. Ir a Momence → Marketing → Sequences
  2. Crear/editar Sequence con trigger "Booking Created"
  3. Añadir acción "Send Email"
  `);

  log('\nEndpoint Customer Leads (el que tienes):', 'yellow');
  console.log(`
  URL: https://api.momence.com/integrations/customer-leads/36148/collect

  Este endpoint es para:
  - Capturar leads desde formularios externos
  - Integrar con otras plataformas
  - Los leads entran en el CRM de Momence
  - Pueden activar Sequences de "New Lead"
  `);
}

async function main() {
  const result = await testLeadsEndpoint();
  await testBookingsInfo();

  console.log('\n\n========================================');
  log('RESUMEN', 'cyan');
  console.log('========================================\n');

  if (result.success) {
    log('✅ Endpoint de Leads funciona', 'green');
    log(`   Método: ${result.method}`, 'green');
  } else {
    log('⚠️ Endpoint de Leads requiere más investigación', 'yellow');
    log('   Pero podemos usar el flujo de Bookings que ya funciona', 'yellow');
  }

  console.log(`
OPCIONES PARA EMAILS:

1. VÍA MOMENCE (Recomendado):
   - Crear booking → Momence envía email automático
   - Configurar Sequences en Momence Dashboard
   - Cero código extra necesario

2. VÍA CUSTOMER LEADS:
   - Enviar lead a ${LEADS_URL}
   - Momence lo añade al CRM
   - Puede activar Sequences de leads

3. VÍA EXTERNA (Resend/SendGrid):
   - Más control sobre diseño
   - Requiere configuración adicional
   - Coste extra potencial
  `);
}

main().catch(console.error);
