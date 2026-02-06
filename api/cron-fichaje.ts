/* eslint-disable no-undef */
// Note: Buffer is a Node.js global available in Vercel serverless functions

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSupabaseAdmin,
  getFechaHoyEspana,
  getHoraAhoraEspana,
  type Profesor,
  type ConfiguracionFichaje,
} from './lib/supabase.js';
import {
  sendFichajeEntradaWhatsApp,
  sendFichajeSalidaWhatsApp,
  isWhatsAppConfigured,
} from './lib/whatsapp.js';

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
  additionalTeachers?: MomenceTeacher[]; // Profesores asistentes
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
  turnosStaff: number;
  notificacionesEntrada: number;
  notificacionesSalida: number;
  fichajesCreados: number;
  fichajesCancelados: number;
  errores: string[];
}

// Turno de staff (recepción, etc.)
interface TurnoStaff {
  id: string;
  empleado_id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  nombre_turno: string;
  activo: boolean;
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

  // Use Basic Auth header like clases.ts does (not body params)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(MOMENCE_AUTH_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'password',
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

async function getMomenceSessionsForDate(fecha?: string): Promise<MomenceSession[]> {
  const token = await getMomenceToken();
  const today = fecha || getFechaHoyEspana(); // YYYY-MM-DD en timezone España

  // Convertir fecha de Madrid a UTC correctamente
  // Ejemplo: "2026-02-13" en Madrid (UTC+1) =
  //   startAfter: 2026-02-12T23:00:00.000Z (00:00 Madrid)
  //   startBefore: 2026-02-13T22:59:59.999Z (23:59 Madrid)

  // Crear fecha en timezone Madrid y obtener offset correcto
  const startMadrid = new Date(`${today}T00:00:00`);
  const endMadrid = new Date(`${today}T23:59:59`);

  // Calcular offset de Madrid (puede ser +1 o +2 dependiendo de DST)
  const getMadridOffset = (date: Date): number => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const madridDate = new Date(date.toLocaleString('en-US', { timeZone: SPAIN_TIMEZONE }));
    return (madridDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  };

  const offsetHours = getMadridOffset(startMadrid);

  // Ajustar a UTC restando el offset de Madrid
  const startOfDayUTC = new Date(startMadrid.getTime() - offsetHours * 60 * 60 * 1000);
  const endOfDayUTC = new Date(endMadrid.getTime() - offsetHours * 60 * 60 * 1000);

  // Usar URL con searchParams para codificación correcta (igual que schedule.ts)
  const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
  url.searchParams.set('page', '0');
  url.searchParams.set('pageSize', '200');
  url.searchParams.set('startAfter', startOfDayUTC.toISOString());
  url.searchParams.set('startBefore', endOfDayUTC.toISOString());
  url.searchParams.set('sortBy', 'startsAt');
  url.searchParams.set('sortOrder', 'ASC');

  console.log(
    `[cron-fichaje] Consultando Momence para ${today} Madrid → UTC: ${startOfDayUTC.toISOString()} a ${endOfDayUTC.toISOString()}`
  );

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[cron-fichaje] Momence API error: ${response.status}`, errorText);
    throw new Error(`Momence sessions fetch failed: ${response.status}`);
  }

  const data = await response.json();
  // La respuesta de Momence API v2 usa data.payload (igual que schedule.ts)
  return Array.isArray(data) ? data : data.payload || data.sessions || data.data || [];
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
// SINCRONIZACIÓN DE CLASES CANCELADAS
// ============================================================================

/**
 * Detecta fichajes pendientes cuya clase ya no existe en Momence y los marca como cancelados.
 * Esto ocurre cuando una clase se cancela en Momence después de crear el fichaje.
 *
 * @param supabase - Cliente Supabase
 * @param fecha - Fecha actual (YYYY-MM-DD)
 * @param clasesActivasMomence - Set con IDs de clases activas en Momence
 * @returns Número de fichajes marcados como cancelados
 */
interface FichajePendiente {
  id: string;
  clase_momence_id: number | null;
  clase_nombre: string;
  profesor_id: string;
}

async function sincronizarClasesCanceladas(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  fecha: string,
  clasesActivasMomence: Set<number>
): Promise<number> {
  // Obtener fichajes pendientes de hoy que tienen clase_momence_id
  const { data: fichajesPendientesData } = await supabase
    .from('fichajes')
    .select('id, clase_momence_id, clase_nombre, profesor_id')
    .eq('fecha', fecha)
    .eq('estado', 'pendiente')
    .not('clase_momence_id', 'is', null);

  const fichajesPendientes = fichajesPendientesData as FichajePendiente[] | null;

  if (!fichajesPendientes || fichajesPendientes.length === 0) {
    return 0;
  }

  let cancelados = 0;

  for (const fichaje of fichajesPendientes) {
    // Si la clase ya no existe en Momence, marcar como cancelada
    if (fichaje.clase_momence_id && !clasesActivasMomence.has(fichaje.clase_momence_id)) {
      const { error } = await supabase
        .from('fichajes')
        // @ts-expect-error - Supabase types are dynamic
        .update({
          estado: 'clase_cancelada',
          motivo_edicion: 'Clase cancelada en Momence - sincronización automática',
        })
        .eq('id', fichaje.id);

      if (!error) {
        cancelados++;
        console.log(
          `[cron-fichaje] Fichaje ${fichaje.id} marcado como cancelado (clase ${fichaje.clase_nombre})`
        );
      }
    }
  }

  return cancelados;
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

  // Permitir fecha personalizada para testing (formato: YYYY-MM-DD)
  const fechaParam = req.query['fecha'] as string | undefined;
  const fechaEjecucion =
    fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam) ? fechaParam : getFechaHoyEspana();

  const result: CronResult = {
    fecha: fechaEjecucion,
    hora: getHoraAhoraEspana(),
    profesores: 0,
    clases: 0,
    bloques: 0,
    turnosStaff: 0,
    notificacionesEntrada: 0,
    notificacionesSalida: 0,
    fichajesCreados: 0,
    fichajesCancelados: 0,
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

    // 3. Obtener clases de Momence para la fecha especificada
    const sesiones = await getMomenceSessionsForDate(result.fecha);
    result.clases = sesiones.length;

    // Crear Set de IDs de clases activas en Momence para sincronización
    const clasesActivasMomence = new Set<number>(sesiones.map((s: MomenceSession) => s.id));

    // 3b. Sincronizar clases canceladas - marcar fichajes huérfanos
    const fichajesCancelados = await sincronizarClasesCanceladas(
      supabase,
      result.fecha,
      clasesActivasMomence
    );
    result.fichajesCancelados = fichajesCancelados;

    // Calcular hora actual para verificar ventanas de notificación
    const horaActual = getHoraAhoraEspana();
    const minutosActuales = horaAMinutos(horaActual);

    // 4. Agrupar clases por profesor (solo si hay clases de Momence)
    // INCLUYE profesor principal + additionalTeachers (asistentes)
    if (sesiones.length > 0) {
      const clasesPorProfesor = new Map<string, MomenceSession[]>();

      // Función helper para asignar sesión a un profesor
      const asignarSesionAProfesor = (teacher: MomenceTeacher, sesion: MomenceSession) => {
        const nombreInstructor = `${teacher.firstName} ${teacher.lastName}`.toLowerCase().trim();

        // Buscar profesor por nombre exacto
        let profesor = profesorPorNombre.get(nombreInstructor);

        // Si no encontrado, intentar match parcial
        if (!profesor) {
          for (const [nombre, p] of profesorPorNombre) {
            if (nombreInstructor.includes(nombre) || nombre.includes(nombreInstructor)) {
              profesor = p;
              break;
            }
          }
        }

        if (profesor) {
          const lista = clasesPorProfesor.get(profesor.id) || [];
          // Evitar duplicados (misma sesión ya asignada)
          if (!lista.some(s => s.id === sesion.id)) {
            lista.push(sesion);
            clasesPorProfesor.set(profesor.id, lista);
          }
        }
      };

      for (const sesion of sesiones) {
        // Procesar profesor principal
        if (sesion.teacher) {
          asignarSesionAProfesor(sesion.teacher, sesion);
        }

        // Procesar profesores asistentes (additionalTeachers)
        if (sesion.additionalTeachers && sesion.additionalTeachers.length > 0) {
          for (const asistente of sesion.additionalTeachers) {
            asignarSesionAProfesor(asistente, sesion);
          }
        }
      }

      // 5. Procesar cada profesor
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
    } // Fin del if (sesiones.length > 0)

    // =====================================================================
    // 6. PROCESAR TURNOS DE STAFF (horarios fijos, no clases de Momence)
    // =====================================================================

    // Obtener día de la semana actual en timezone España (0=Domingo, 1=Lunes, etc.)
    const fechaEspanaStr = new Date().toLocaleString('en-US', { timeZone: SPAIN_TIMEZONE });
    const fechaEspana = new Date(fechaEspanaStr);
    const diaSemana = fechaEspana.getDay(); // 0=domingo, 1=lunes, ... 6=sábado

    // Obtener turnos de staff para hoy
    const { data: turnosHoyData } = await supabase
      .from('turnos_staff')
      .select('*, profesores!inner(id, nombre, apellidos, telefono_whatsapp, activo)')
      .eq('dia_semana', diaSemana)
      .eq('activo', true);

    const turnosHoy = turnosHoyData as
      | (TurnoStaff & {
          profesores: {
            id: string;
            nombre: string;
            apellidos: string;
            telefono_whatsapp: string;
            activo: boolean;
          };
        })[]
      | null;

    if (turnosHoy && turnosHoy.length > 0) {
      result.turnosStaff = turnosHoy.length;

      for (const turno of turnosHoy) {
        if (!turno.profesores.activo) continue;

        const horaInicioTurno = turno.hora_inicio.substring(0, 5); // HH:MM
        const horaFinTurno = turno.hora_fin.substring(0, 5);
        const minutoInicioTurno = horaAMinutos(horaInicioTurno);
        const minutoFinTurno = horaAMinutos(horaFinTurno);

        // 6a. Crear fichaje pendiente si no existe
        const { data: fichajeStaffExistente } = await supabase
          .from('fichajes')
          .select('id, estado')
          .eq('profesor_id', turno.empleado_id)
          .eq('fecha', result.fecha)
          .eq('hora_inicio', horaInicioTurno + ':00')
          .single();

        if (!fichajeStaffExistente) {
          const { error: insertError } = await supabase.from('fichajes').insert({
            profesor_id: turno.empleado_id,
            clase_momence_id: null,
            clase_nombre: turno.nombre_turno,
            fecha: result.fecha,
            hora_inicio: horaInicioTurno + ':00',
            hora_fin: horaFinTurno + ':00',
            estado: 'pendiente',
            modalidad: 'presencial',
            tipo_horas: 'ordinarias',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);

          if (!insertError) {
            result.fichajesCreados++;
          } else {
            result.errores.push(
              `Error creando fichaje staff para ${turno.profesores.nombre}: ${insertError.message}`
            );
          }
        }

        // 6b. Enviar WhatsApp de entrada X minutos antes
        const minutosParaEntradaStaff = minutoInicioTurno - configuracion.minutos_antes_clase;

        if (
          minutosActuales >= minutosParaEntradaStaff &&
          minutosActuales < minutosParaEntradaStaff + 5
        ) {
          const { data: fichajeStaffData } = await supabase
            .from('fichajes')
            .select('id, estado, whatsapp_msg_id_entrada')
            .eq('profesor_id', turno.empleado_id)
            .eq('fecha', result.fecha)
            .eq('hora_inicio', horaInicioTurno + ':00')
            .single();

          const fichajeStaff = fichajeStaffData as {
            id: string;
            estado: string;
            whatsapp_msg_id_entrada: string | null;
          } | null;

          if (fichajeStaff && !fichajeStaff.whatsapp_msg_id_entrada && isWhatsAppConfigured()) {
            const waResult = await sendFichajeEntradaWhatsApp({
              to: turno.profesores.telefono_whatsapp,
              nombreProfesor: turno.profesores.nombre,
              clases: [turno.nombre_turno],
              horaInicio: horaInicioTurno,
            });

            if (waResult.success) {
              result.notificacionesEntrada++;
              await supabase
                .from('fichajes')
                // @ts-expect-error - Supabase types are dynamic
                .update({ whatsapp_msg_id_entrada: waResult.messageId || 'sent' })
                .eq('id', fichajeStaff.id);
            } else {
              result.errores.push(
                `Error WhatsApp entrada staff ${turno.profesores.nombre}: ${waResult.error}`
              );
            }
          }
        }

        // 6c. Enviar WhatsApp de salida al terminar turno
        const minutosParaSalidaStaff = minutoFinTurno + configuracion.minutos_despues_clase;

        if (
          minutosActuales >= minutosParaSalidaStaff &&
          minutosActuales < minutosParaSalidaStaff + 5
        ) {
          const { data: fichajeSalidaStaffData } = await supabase
            .from('fichajes')
            .select('id, estado, whatsapp_msg_id_salida')
            .eq('profesor_id', turno.empleado_id)
            .eq('fecha', result.fecha)
            .eq('hora_inicio', horaInicioTurno + ':00')
            .single();

          const fichajeSalidaStaff = fichajeSalidaStaffData as {
            id: string;
            estado: string;
            whatsapp_msg_id_salida: string | null;
          } | null;

          if (
            fichajeSalidaStaff &&
            fichajeSalidaStaff.estado === 'entrada_registrada' &&
            !fichajeSalidaStaff.whatsapp_msg_id_salida &&
            isWhatsAppConfigured()
          ) {
            const waResult = await sendFichajeSalidaWhatsApp({
              to: turno.profesores.telefono_whatsapp,
              nombreProfesor: turno.profesores.nombre,
              clases: [turno.nombre_turno],
              siguienteBloqueHora: undefined,
            });

            if (waResult.success) {
              result.notificacionesSalida++;
              await supabase
                .from('fichajes')
                // @ts-expect-error - Supabase types are dynamic
                .update({ whatsapp_msg_id_salida: waResult.messageId || 'sent' })
                .eq('id', fichajeSalidaStaff.id);
            } else {
              result.errores.push(
                `Error WhatsApp salida staff ${turno.profesores.nombre}: ${waResult.error}`
              );
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
