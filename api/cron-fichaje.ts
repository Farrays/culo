import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSupabaseAdmin,
  getFechaHoyEspana,
  getHoraAhoraEspana,
  type Profesor,
  type ConfiguracionFichaje,
} from './lib/supabase';
import {
  sendFichajeEntradaWhatsApp,
  sendFichajeSalidaWhatsApp,
  isWhatsAppConfigured,
} from './lib/whatsapp';

/**
 * API Route: /api/cron-fichaje
 *
 * Cron job para el sistema de fichaje de profesores.
 * Ejecutar cada 5 minutos vía Vercel Cron.
 *
 * Funcionalidad:
 * 1. Obtiene clases del día de Momence
 * 2. Detecta bloques de clases por profesor (umbral 15 min)
 * 3. Crea fichajes pendientes para cada bloque
 * 4. Envía WhatsApp X minutos antes de cada bloque (entrada)
 * 5. Envía WhatsApp al terminar cada bloque (salida)
 *
 * Variables de entorno:
 * - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD
 * - WHATSAPP_TOKEN, WHATSAPP_PHONE_ID
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const MOMENCE_BUSINESS_SLUG = "Farray's-International-Dance-Center";
const SPAIN_TIMEZONE = 'Europe/Madrid';

// ============================================================================
// TIPOS
// ============================================================================

interface MomenceTeacher {
  id: number;
  firstName: string;
  lastName: string;
}

interface MomenceSession {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  teacher?: MomenceTeacher;
}

interface BloqueClases {
  profesor: Profesor;
  clases: MomenceSession[];
  horaInicio: string; // HH:MM de la primera clase
  horaFin: string; // HH:MM de la última clase
  minutoInicio: number; // Minutos desde medianoche
  minutoFin: number;
}

interface CronResult {
  fecha: string;
  hora: string;
  profesores: number;
  clases: number;
  bloques: number;
  notificacionesEntrada: number;
  notificacionesSalida: number;
  fichajesCreados: number;
  errores: string[];
}

// ============================================================================
// MOMENCE AUTH
// ============================================================================

let cachedToken: { token: string; expires: number } | null = null;

async function getMomenceToken(): Promise<string> {
  // Usar token cacheado si no ha expirado
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env['MOMENCE_CLIENT_ID'];
  const clientSecret = process.env['MOMENCE_CLIENT_SECRET'];
  const username = process.env['MOMENCE_USERNAME'];
  const password = process.env['MOMENCE_PASSWORD'];

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error('Missing Momence credentials');
  }

  const response = await fetch(MOMENCE_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Momence auth failed: ${response.status}`);
  }

  const data = await response.json();
  const token = data.access_token;
  const expiresIn = data.expires_in || 3600;

  cachedToken = {
    token,
    expires: Date.now() + (expiresIn - 60) * 1000, // 1 min buffer
  };

  return token;
}

// ============================================================================
// MOMENCE SESSIONS
// ============================================================================

async function getMomenceSessionsToday(): Promise<MomenceSession[]> {
  const token = await getMomenceToken();
  const today = getFechaHoyEspana();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const url = `${MOMENCE_API_URL}/api/v2/host/sessions?businessSlug=${MOMENCE_BUSINESS_SLUG}&startDate=${today}&endDate=${tomorrowStr}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Momence sessions fetch failed: ${response.status}`);
  }

  const data = await response.json();
  return data.sessions || [];
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convierte hora HH:MM a minutos desde medianoche
 */
function horaAMinutos(hora: string): number {
  const [h = 0, m = 0] = hora.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Extrae la hora HH:MM de un timestamp ISO en timezone España
 */
function extraerHora(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SPAIN_TIMEZONE,
    hour12: false,
  });
}

/**
 * Agrupa clases por profesor en bloques
 * Un nuevo bloque se crea si hay más de `umbralPausa` minutos entre clases
 */
function agruparEnBloques(
  clases: MomenceSession[],
  profesor: Profesor,
  umbralPausa: number
): BloqueClases[] {
  if (clases.length === 0) return [];

  // Ordenar por hora de inicio
  const ordenadas = [...clases].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  const bloques: BloqueClases[] = [];
  const primeraClase = ordenadas[0];
  if (!primeraClase) return [];

  let bloqueActual: MomenceSession[] = [primeraClase];

  for (let i = 1; i < ordenadas.length; i++) {
    const claseAnterior = ordenadas[i - 1];
    const claseActual = ordenadas[i];
    if (!claseAnterior || !claseActual) continue;

    // Calcular hueco entre FIN de clase anterior e INICIO de clase actual
    const finAnterior = new Date(claseAnterior.endsAt).getTime();
    const inicioActual = new Date(claseActual.startsAt).getTime();
    const huecoMinutos = (inicioActual - finAnterior) / (1000 * 60);

    if (huecoMinutos > umbralPausa) {
      // Nuevo bloque
      bloques.push(crearBloque(bloqueActual, profesor));
      bloqueActual = [claseActual];
    } else {
      // Mismo bloque
      bloqueActual.push(claseActual);
    }
  }

  // Añadir último bloque
  if (bloqueActual.length > 0) {
    bloques.push(crearBloque(bloqueActual, profesor));
  }

  return bloques;
}

function crearBloque(clases: MomenceSession[], profesor: Profesor): BloqueClases {
  // Safe to access - caller ensures clases is non-empty
  const primera = clases[0] as MomenceSession;
  const ultima = clases[clases.length - 1] as MomenceSession;
  const horaInicio = extraerHora(primera.startsAt);
  const horaFin = extraerHora(ultima.endsAt);

  return {
    profesor,
    clases,
    horaInicio,
    horaFin,
    minutoInicio: horaAMinutos(horaInicio),
    minutoFin: horaAMinutos(horaFin),
  };
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Solo permitir GET (para cron de Vercel)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result: CronResult = {
    fecha: getFechaHoyEspana(),
    hora: getHoraAhoraEspana(),
    profesores: 0,
    clases: 0,
    bloques: 0,
    notificacionesEntrada: 0,
    notificacionesSalida: 0,
    fichajesCreados: 0,
    errores: [],
  };

  try {
    const supabase = getSupabaseAdmin();

    // 1. Obtener configuración
    const { data: config } = await supabase
      .from('configuracion_fichaje')
      .select('*')
      .eq('id', 1)
      .single();

    const configuracion: ConfiguracionFichaje = config || {
      id: 1,
      minutos_antes_clase: 10,
      minutos_despues_clase: 5,
      umbral_pausa_minutos: 15,
      timezone: 'Europe/Madrid',
      notificar_no_fichados: true,
      email_admin: null,
    };

    // 2. Obtener profesores activos
    const { data: profesoresData } = await supabase
      .from('profesores')
      .select('*')
      .eq('activo', true);
    const profesores = profesoresData as Profesor[] | null;

    if (!profesores || profesores.length === 0) {
      res.status(200).json({ ...result, message: 'No hay profesores activos' });
      return;
    }

    result.profesores = profesores.length;

    // Crear mapa de nombre_momence -> profesor
    const profesorPorNombre = new Map<string, Profesor>();
    for (const p of profesores) {
      // Normalizar nombre para matching
      const nombreNormalizado = p.nombre_momence.toLowerCase().trim();
      profesorPorNombre.set(nombreNormalizado, p);
    }

    // 3. Obtener clases de hoy de Momence
    const sesiones = await getMomenceSessionsToday();
    result.clases = sesiones.length;

    if (sesiones.length === 0) {
      res.status(200).json({ ...result, message: 'No hay clases hoy' });
      return;
    }

    // 4. Agrupar clases por profesor
    const clasesPorProfesor = new Map<string, MomenceSession[]>();

    for (const sesion of sesiones) {
      if (!sesion.teacher) continue;

      const nombreInstructor = `${sesion.teacher.firstName} ${sesion.teacher.lastName}`
        .toLowerCase()
        .trim();

      // Buscar profesor por nombre
      const profesor = profesorPorNombre.get(nombreInstructor);
      if (!profesor) {
        // Intentar match parcial
        let found = false;
        for (const [nombre, p] of profesorPorNombre) {
          if (nombreInstructor.includes(nombre) || nombre.includes(nombreInstructor)) {
            const lista = clasesPorProfesor.get(p.id) || [];
            lista.push(sesion);
            clasesPorProfesor.set(p.id, lista);
            found = true;
            break;
          }
        }
        if (!found) {
          // Profesor no registrado en el sistema
          continue;
        }
      } else {
        const lista = clasesPorProfesor.get(profesor.id) || [];
        lista.push(sesion);
        clasesPorProfesor.set(profesor.id, lista);
      }
    }

    // 5. Procesar cada profesor
    const horaActual = getHoraAhoraEspana();
    const minutosActuales = horaAMinutos(horaActual);

    for (const [profesorId, clases] of clasesPorProfesor) {
      const profesor = profesores.find(p => p.id === profesorId);
      if (!profesor) continue;

      // Agrupar en bloques
      const bloques = agruparEnBloques(clases, profesor, configuracion.umbral_pausa_minutos);

      result.bloques += bloques.length;

      for (const bloque of bloques) {
        const nombreClases = bloque.clases.map(c => c.name);

        // 5a. Crear fichaje pendiente si no existe
        const { data: fichajeExistente } = await supabase
          .from('fichajes')
          .select('id, estado')
          .eq('profesor_id', profesor.id)
          .eq('fecha', result.fecha)
          .eq('hora_inicio', bloque.horaInicio + ':00')
          .single();

        if (!fichajeExistente) {
          // Crear fichaje pendiente
          const primeraClase = bloque.clases[0];

          const { error: insertError } = await supabase.from('fichajes').insert({
            profesor_id: profesor.id,
            clase_momence_id: primeraClase?.id ?? null,
            clase_nombre: nombreClases.join(' + '),
            fecha: result.fecha,
            hora_inicio: bloque.horaInicio + ':00',
            hora_fin: bloque.horaFin + ':00',
            estado: 'pendiente',
            modalidad: 'presencial',
            tipo_horas: 'ordinarias',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);

          if (!insertError) {
            result.fichajesCreados++;
          } else {
            result.errores.push(
              `Error creando fichaje para ${profesor.nombre}: ${insertError.message}`
            );
          }
        }

        // 5b. Enviar WhatsApp de entrada X minutos antes
        const minutosParaEntrada = bloque.minutoInicio - configuracion.minutos_antes_clase;
        const ventanaEntrada = 5; // Enviar si estamos en ventana de 5 min

        if (
          minutosActuales >= minutosParaEntrada &&
          minutosActuales < minutosParaEntrada + ventanaEntrada
        ) {
          // Verificar si ya se envió (usando estado del fichaje o campo específico)
          const { data: fichajeData } = await supabase
            .from('fichajes')
            .select('id, estado, whatsapp_msg_id_entrada')
            .eq('profesor_id', profesor.id)
            .eq('fecha', result.fecha)
            .eq('hora_inicio', bloque.horaInicio + ':00')
            .single();
          const fichaje = fichajeData as {
            id: string;
            estado: string;
            whatsapp_msg_id_entrada: string | null;
          } | null;

          if (fichaje && !fichaje.whatsapp_msg_id_entrada && isWhatsAppConfigured()) {
            const waResult = await sendFichajeEntradaWhatsApp({
              to: profesor.telefono_whatsapp,
              nombreProfesor: profesor.nombre,
              clases: nombreClases,
              horaInicio: bloque.horaInicio,
            });

            if (waResult.success) {
              result.notificacionesEntrada++;
              // Marcar que se envió
              await supabase
                .from('fichajes')
                // @ts-expect-error - Supabase types are dynamic
                .update({ whatsapp_msg_id_entrada: waResult.messageId || 'sent' })
                .eq('id', fichaje.id);
            } else {
              result.errores.push(`Error WhatsApp entrada ${profesor.nombre}: ${waResult.error}`);
            }
          }
        }

        // 5c. Enviar WhatsApp de salida al terminar el bloque
        const minutosParaSalida = bloque.minutoFin + configuracion.minutos_despues_clase;
        const ventanaSalida = 5;

        if (
          minutosActuales >= minutosParaSalida &&
          minutosActuales < minutosParaSalida + ventanaSalida
        ) {
          const { data: fichajeSalidaData } = await supabase
            .from('fichajes')
            .select('id, estado, whatsapp_msg_id_salida')
            .eq('profesor_id', profesor.id)
            .eq('fecha', result.fecha)
            .eq('hora_inicio', bloque.horaInicio + ':00')
            .single();
          const fichajeSalida = fichajeSalidaData as {
            id: string;
            estado: string;
            whatsapp_msg_id_salida: string | null;
          } | null;

          if (
            fichajeSalida &&
            fichajeSalida.estado === 'entrada_registrada' &&
            !fichajeSalida.whatsapp_msg_id_salida &&
            isWhatsAppConfigured()
          ) {
            // Buscar si hay siguiente bloque
            const bloquesProfesor = bloques;
            const idxActual = bloquesProfesor.findIndex(b => b.horaInicio === bloque.horaInicio);
            const siguienteBloque = bloquesProfesor[idxActual + 1];

            const waResult = await sendFichajeSalidaWhatsApp({
              to: profesor.telefono_whatsapp,
              nombreProfesor: profesor.nombre,
              clases: nombreClases,
              siguienteBloqueHora: siguienteBloque?.horaInicio,
            });

            if (waResult.success) {
              result.notificacionesSalida++;
              await supabase
                .from('fichajes')
                // @ts-expect-error - Supabase types are dynamic
                .update({ whatsapp_msg_id_salida: waResult.messageId || 'sent' })
                .eq('id', fichajeSalida.id);
            } else {
              result.errores.push(`Error WhatsApp salida ${profesor.nombre}: ${waResult.error}`);
            }
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[cron-fichaje] Error:', error);
    result.errores.push(error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      ...result,
    });
  }
}
