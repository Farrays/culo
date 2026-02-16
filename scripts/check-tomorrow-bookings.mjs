/**
 * Script para consultar reservas de clases de prueba de mañana
 *
 * Uso: node scripts/check-tomorrow-bookings.mjs
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { Redis } from '@upstash/redis';

// Cargar .env.local manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');

try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  }
} catch (e) {
  console.error('Error loading .env.local:', e.message);
}

const SPAIN_TIMEZONE = 'Europe/Madrid';

// Obtener fecha de mañana en España
function getTomorrowDateSpain() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return tomorrow.toLocaleDateString('sv-SE', { timeZone: SPAIN_TIMEZONE });
}

// Obtener hoy en España
function getTodayDateSpain() {
  const now = new Date();
  return now.toLocaleDateString('sv-SE', { timeZone: SPAIN_TIMEZONE });
}

// Función principal
async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error('❌ Error: Credenciales de Upstash Redis no configuradas');
    console.log('Variables necesarias: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN');
    process.exit(1);
  }

  const redis = new Redis({ url, token });

  try {
    console.log('🔍 Buscando reservas de clases de prueba para mañana...\n');

    const tomorrowDate = getTomorrowDateSpain();
    const todayDate = getTodayDateSpain();
    console.log(`📅 Hoy (España): ${todayDate}`);
    console.log(`📅 Mañana (España): ${tomorrowDate}\n`);

    // Método 1: Usar el set de recordatorios por fecha (más eficiente)
    const emailsFromSet = await redis.smembers(`reminders:${tomorrowDate}`);

    // Método 2: Escanear todas las reservas si el set está vacío
    let bookingKeys = [];
    if (emailsFromSet.length === 0) {
      // Usar SCAN para obtener todas las claves booking:*
      let cursor = 0;
      do {
        const result = await redis.scan(cursor, { match: 'booking:*', count: 100 });
        cursor = result[0];
        bookingKeys.push(...result[1]);
      } while (cursor !== 0);
    }

    console.log(`📊 Emails en set reminders:${tomorrowDate}: ${emailsFromSet.length}`);
    console.log(`📊 Total booking keys escaneadas: ${bookingKeys.length}\n`);

    const tomorrowBookings = [];

    // Procesar emails del set de recordatorios
    for (const email of emailsFromSet) {
      try {
        const data = await redis.get(`booking:${email}`);
        if (!data) continue;

        const booking = typeof data === 'string' ? JSON.parse(data) : data;

        tomorrowBookings.push({
          nombre: `${booking.firstName} ${booking.lastName}`,
          email: booking.email,
          telefono: booking.phone || 'No registrado',
          clase: booking.className,
          fecha: booking.classDate,
          hora: booking.classTime,
          reservadoEl: booking.bookedAt || booking.timestamp,
          estado: booking.status || 'confirmed',
        });
      } catch (err) {
        console.log(`⚠️ Error procesando ${email}:`, err.message);
      }
    }

    // Si no hay en el set, buscar en todas las reservas
    if (tomorrowBookings.length === 0 && bookingKeys.length > 0) {
      for (const key of bookingKeys) {
        try {
          const data = await redis.get(key);
          if (!data) continue;

          const booking = typeof data === 'string' ? JSON.parse(data) : data;

          // Verificar si la clase es mañana
          let classDateStr = null;

          if (booking.classDateRaw) {
            classDateStr = booking.classDateRaw.split('T')[0];
          } else if (booking.classDate) {
            // Formato YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}/.test(booking.classDate)) {
              classDateStr = booking.classDate.split('T')[0];
            }
          }

          if (classDateStr === tomorrowDate) {
            tomorrowBookings.push({
              nombre: `${booking.firstName} ${booking.lastName}`,
              email: booking.email,
              telefono: booking.phone || 'No registrado',
              clase: booking.className,
              fecha: booking.classDate,
              hora: booking.classTime,
              reservadoEl: booking.bookedAt || booking.timestamp,
              estado: booking.status || 'confirmed',
            });
          }
        } catch (err) {
          // Ignorar errores de parseo
        }
      }
    }

    // Filtrar solo confirmadas
    const confirmedBookings = tomorrowBookings.filter(b => b.estado !== 'cancelled');

    // Mostrar resultados
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🎯 RESERVAS PARA MAÑANA (${tomorrowDate}): ${confirmedBookings.length} personas`);
    console.log('═══════════════════════════════════════════════════════════\n');

    if (confirmedBookings.length === 0) {
      console.log('✅ No hay clases de prueba reservadas para mañana.');
    } else {
      confirmedBookings.forEach((b, i) => {
        console.log(`${i + 1}. ${b.nombre}`);
        console.log(`   📧 Email: ${b.email}`);
        console.log(`   📱 Teléfono: ${b.telefono}`);
        console.log(`   💃 Clase: ${b.clase}`);
        console.log(`   🕐 Hora: ${b.hora}`);
        console.log(`   📝 Reservado: ${new Date(b.reservadoEl).toLocaleString('es-ES', { timeZone: SPAIN_TIMEZONE })}`);
        console.log('');
      });

      // Resumen por clase
      console.log('📊 RESUMEN POR CLASE:');
      console.log('───────────────────────');
      const byClass = {};
      for (const b of confirmedBookings) {
        const key = `${b.clase} (${b.hora})`;
        byClass[key] = (byClass[key] || 0) + 1;
      }
      for (const [clase, count] of Object.entries(byClass)) {
        console.log(`   ${clase}: ${count} persona(s)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
