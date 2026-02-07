/**
 * Cron Alertas Fichaje
 *
 * Ejecuta cada 10 minutos para detectar profesores que no han fichado.
 *
 * Flujo:
 * 1. Detectar fichajes pendientes cuya clase empezó hace >15 minutos
 * 2. Enviar WhatsApp recordatorio al profesor
 * 3. Si pasan >30 minutos sin fichaje, alertar al admin
 * 4. Si pasan >45 minutos, marcar como "no_fichado"
 *
 * @see vercel.json - cron: "0/10 * * * *"
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, getFechaHoyEspana, getHoraAhoraEspana } from './lib/supabase.js';
import { sendTextMessage, isWhatsAppConfigured } from './lib/whatsapp.js';
import { sendSystemAlert, isEmailConfigured } from './lib/email.js';

// Configuración de alertas (minutos)
const ALERTA_PROFESOR_MINUTOS = 15; // Recordatorio al profesor
const ALERTA_ADMIN_MINUTOS = 30; // Alerta al admin
const MARCAR_NO_FICHADO_MINUTOS = 45; // Marcar como no fichado

interface FichajePendiente {
  id: string;
  profesor_id: string;
  clase_nombre: string;
  fecha: string;
  hora_inicio: string;
  estado: string;
  alerta_enviada: boolean | null;
  alerta_admin_enviada: boolean | null;
  profesor: {
    id: string;
    nombre: string;
    apellidos: string | null;
    telefono_whatsapp: string;
  };
}

interface AlertaResult {
  fecha: string;
  hora: string;
  fichajesPendientes: number;
  alertasProfesor: number;
  alertasAdmin: number;
  marcadosNoFichado: number;
  errores: string[];
}

/**
 * Convierte hora HH:MM a minutos desde medianoche
 */
function horaAMinutos(hora: string): number {
  const [h = 0, m = 0] = hora.split(':').map(Number);
  return h * 60 + m;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Solo permitir GET (cron) o POST (manual)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result: AlertaResult = {
    fecha: getFechaHoyEspana(),
    hora: getHoraAhoraEspana(),
    fichajesPendientes: 0,
    alertasProfesor: 0,
    alertasAdmin: 0,
    marcadosNoFichado: 0,
    errores: [],
  };

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error('[cron-alertas] Supabase not configured:', error);
    res.status(500).json({
      success: false,
      error: 'Supabase not configured',
    });
    return;
  }

  try {
    // Obtener hora actual en minutos
    const horaActual = getHoraAhoraEspana();
    const minutosActuales = horaAMinutos(horaActual);

    // Obtener fichajes pendientes de hoy
    const { data: fichajesData, error: fichajesError } = await supabase
      .from('fichajes')
      .select(
        `
        id,
        profesor_id,
        clase_nombre,
        fecha,
        hora_inicio,
        estado,
        alerta_enviada,
        alerta_admin_enviada,
        profesor:profesores(id, nombre, apellidos, telefono_whatsapp)
      `
      )
      .eq('fecha', result.fecha)
      .eq('estado', 'pendiente');

    if (fichajesError) {
      throw new Error(`Error fetching fichajes: ${fichajesError.message}`);
    }

    const fichajes = fichajesData as unknown as FichajePendiente[];
    result.fichajesPendientes = fichajes?.length || 0;

    if (!fichajes || fichajes.length === 0) {
      res.status(200).json({
        success: true,
        message: 'No hay fichajes pendientes para alertar',
        ...result,
      });
      return;
    }

    // Obtener configuración (para futuro uso)
    // const { data: configData } = await supabase
    //   .from('configuracion_fichaje')
    //   .select('*')
    //   .single();

    // Procesar cada fichaje pendiente
    for (const fichaje of fichajes) {
      if (!fichaje.profesor || !fichaje.hora_inicio) continue;

      // Calcular minutos desde que debió empezar
      const horaInicioStr = fichaje.hora_inicio.substring(0, 5); // HH:MM
      const minutosInicio = horaAMinutos(horaInicioStr);
      const minutosTranscurridos = minutosActuales - minutosInicio;

      // Si aún no ha pasado la hora de inicio, ignorar
      if (minutosTranscurridos < 0) continue;

      const nombreCompleto =
        `${fichaje.profesor.nombre} ${fichaje.profesor.apellidos || ''}`.trim();

      // 1. Alerta al profesor (>15 min sin fichar)
      if (
        minutosTranscurridos >= ALERTA_PROFESOR_MINUTOS &&
        !fichaje.alerta_enviada &&
        isWhatsAppConfigured()
      ) {
        try {
          await sendTextMessage(
            fichaje.profesor.telefono_whatsapp,
            `⚠️ Recordatorio de fichaje\n\n${nombreCompleto}, tu clase "${fichaje.clase_nombre}" empezó hace ${minutosTranscurridos} minutos y no hemos recibido tu fichaje de entrada.\n\nSi ya estás en clase, responde "ya llegué" o usa la app de fichaje.`
          );

          // Marcar alerta enviada
          await supabase
            .from('fichajes')
            // @ts-expect-error - Supabase types are dynamic
            .update({ alerta_enviada: true })
            .eq('id', fichaje.id);

          result.alertasProfesor++;
          console.log(`[cron-alertas] Alerta enviada a ${nombreCompleto}`);
        } catch (err) {
          result.errores.push(`Error alerta profesor ${nombreCompleto}: ${err}`);
        }
      }

      // 2. Alerta al admin (>30 min sin fichar)
      if (
        minutosTranscurridos >= ALERTA_ADMIN_MINUTOS &&
        !fichaje.alerta_admin_enviada &&
        isEmailConfigured()
      ) {
        try {
          await sendSystemAlert({
            type: `FICHAJE_NO_REGISTRADO_${nombreCompleto.replace(/\s+/g, '_').toUpperCase()}`,
            message: `El profesor ${nombreCompleto} no ha registrado su entrada para la clase "${fichaje.clase_nombre}" (prevista a las ${horaInicioStr}). Han pasado ${minutosTranscurridos} minutos. Dashboard: https://farrayscenter.com/es/admin/fichajes`,
            severity: 'warning',
            details: {
              profesor: nombreCompleto,
              clase: fichaje.clase_nombre,
              hora_prevista: horaInicioStr,
              minutos_transcurridos: minutosTranscurridos,
            },
          });

          // Marcar alerta admin enviada
          await supabase
            .from('fichajes')
            // @ts-expect-error - Supabase types are dynamic
            .update({ alerta_admin_enviada: true })
            .eq('id', fichaje.id);

          result.alertasAdmin++;
          console.log(`[cron-alertas] Alerta admin enviada para ${nombreCompleto}`);
        } catch (err) {
          result.errores.push(`Error alerta admin ${nombreCompleto}: ${err}`);
        }
      }

      // 3. Marcar como no fichado (>45 min sin fichar)
      if (minutosTranscurridos >= MARCAR_NO_FICHADO_MINUTOS) {
        try {
          const timestampActual = new Date().toISOString();

          await supabase
            .from('fichajes')
            // @ts-expect-error - Supabase types are dynamic
            .update({
              estado: 'no_fichado',
              updated_at: timestampActual,
              motivo_edicion: `Marcado automáticamente como no fichado tras ${MARCAR_NO_FICHADO_MINUTOS} minutos`,
            })
            .eq('id', fichaje.id);

          result.marcadosNoFichado++;
          console.log(`[cron-alertas] Marcado como no_fichado: ${nombreCompleto}`);

          // Notificar al profesor
          if (isWhatsAppConfigured()) {
            await sendTextMessage(
              fichaje.profesor.telefono_whatsapp,
              `❌ Fichaje no registrado\n\n${nombreCompleto}, tu clase "${fichaje.clase_nombre}" ha sido marcada como "no fichado" porque no recibimos tu entrada.\n\nSi esto es un error, contacta con administración para corregirlo.`
            );
          }
        } catch (err) {
          result.errores.push(`Error marcando no_fichado ${nombreCompleto}: ${err}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[cron-alertas] Error:', error);
    result.errores.push(error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      ...result,
    });
  }
}
