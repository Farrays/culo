import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSupabaseAdmin,
  calcularMinutosTrabajados,
  getFechaHoyEspana,
  getHoraAhoraEspana,
  type Fichaje,
} from '../lib/supabase';

/**
 * API Route: /api/fichaje/fichajes
 *
 * CRUD y operaciones de fichaje para el sistema de control de jornada.
 * Cumple con legislación española: RD-ley 8/2019, Art. 34.9 ET
 *
 * Endpoints:
 * - GET    /api/fichaje/fichajes              → Lista fichajes (con filtros)
 * - GET    /api/fichaje/fichajes?id=xxx       → Obtiene un fichaje por ID
 * - POST   /api/fichaje/fichajes              → Crea un fichaje o registra entrada/salida
 * - PUT    /api/fichaje/fichajes              → Actualiza un fichaje (admin)
 * - DELETE /api/fichaje/fichajes?id=xxx       → Elimina un fichaje (admin)
 *
 * Query params (GET):
 * - profesor_id: Filtrar por profesor
 * - fecha: Filtrar por fecha (YYYY-MM-DD)
 * - fecha_desde / fecha_hasta: Rango de fechas
 * - estado: Filtrar por estado
 * - mes: Filtrar por mes (YYYY-MM)
 *
 * Variables de entorno requeridas:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

// Tipos para request body
interface CreateFichajeBody {
  profesor_id: string;
  clase_momence_id?: number;
  clase_nombre: string;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  modalidad?: 'presencial' | 'remoto';
  tipo_horas?: 'ordinarias' | 'extraordinarias' | 'complementarias';
  metodo_entrada?: 'whatsapp' | 'manual' | 'qr' | 'auto_momence';
}

interface UpdateFichajeBody extends Partial<CreateFichajeBody> {
  id: string;
  estado?: Fichaje['estado'];
  hora_fin?: string;
  metodo_salida?: 'whatsapp' | 'manual' | 'qr' | 'auto_momence';
  motivo_edicion?: string;
  editado_por?: string;
}

// Para fichar entrada/salida desde PWA/WhatsApp
interface RegistrarFichajeBody {
  action: 'entrada' | 'salida';
  profesor_id: string;
  clase_nombre?: string;
  clase_momence_id?: number;
  metodo: 'whatsapp' | 'manual' | 'qr';
  whatsapp_msg_id?: string;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    totalHoras?: number;
    totalMinutos?: number;
  };
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).json({ ok: true });
    return;
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'PUT':
        await handlePut(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`,
        } as ApiResponse);
    }
  } catch (error) {
    console.error('[API/fichaje/fichajes] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    } as ApiResponse);
  }
}

/**
 * GET - Lista fichajes con filtros
 */
async function handleGet(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const {
    id,
    profesor_id,
    fecha,
    fecha_desde,
    fecha_hasta,
    estado,
    mes,
    limit = '100',
  } = req.query;

  // Si hay ID, obtener fichaje específico
  if (id && typeof id === 'string') {
    const { data, error } = await supabase
      .from('fichajes')
      .select(
        `
        *,
        profesor:profesores(id, nombre, apellidos, telefono_whatsapp)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({
        success: false,
        error: 'Fichaje no encontrado',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data,
    } as ApiResponse<Fichaje>);
    return;
  }

  // Construir query con filtros
  let query = supabase
    .from('fichajes')
    .select(
      `
      *,
      profesor:profesores(id, nombre, apellidos, telefono_whatsapp)
    `
    )
    .order('fecha', { ascending: false })
    .order('hora_inicio', { ascending: true })
    .limit(parseInt(limit as string, 10));

  // Filtrar por profesor
  if (profesor_id && typeof profesor_id === 'string') {
    query = query.eq('profesor_id', profesor_id);
  }

  // Filtrar por fecha exacta
  if (fecha && typeof fecha === 'string') {
    query = query.eq('fecha', fecha);
  }

  // Filtrar por rango de fechas
  if (fecha_desde && typeof fecha_desde === 'string') {
    query = query.gte('fecha', fecha_desde);
  }
  if (fecha_hasta && typeof fecha_hasta === 'string') {
    query = query.lte('fecha', fecha_hasta);
  }

  // Filtrar por mes (YYYY-MM)
  if (mes && typeof mes === 'string') {
    const [year, month] = mes.split('-');
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
    query = query.gte('fecha', firstDay).lte('fecha', lastDay);
  }

  // Filtrar por estado
  if (estado && typeof estado === 'string') {
    query = query.eq('estado', estado);
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  // Calcular totales
  const totalMinutos = data.reduce((sum, f) => sum + (f.minutos_trabajados || 0), 0);

  res.status(200).json({
    success: true,
    data,
    meta: {
      total: data.length,
      totalMinutos,
      totalHoras: Math.round((totalMinutos / 60) * 100) / 100,
    },
  } as ApiResponse<Fichaje[]>);
}

/**
 * POST - Crea un fichaje o registra entrada/salida
 */
async function handlePost(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = req.body;

  // Detectar si es registro de entrada/salida (PWA/WhatsApp)
  if ('action' in body) {
    await handleRegistrarFichaje(req, res, body as RegistrarFichajeBody);
    return;
  }

  // Crear fichaje completo (admin/cron)
  const createBody = body as CreateFichajeBody;

  if (!createBody.profesor_id) {
    res.status(400).json({
      success: false,
      error: 'profesor_id es obligatorio',
    } as ApiResponse);
    return;
  }

  if (!createBody.clase_nombre) {
    res.status(400).json({
      success: false,
      error: 'clase_nombre es obligatorio',
    } as ApiResponse);
    return;
  }

  const fecha = createBody.fecha || getFechaHoyEspana();

  // Calcular minutos si hay hora inicio y fin
  let minutosTrabajados: number | null = null;
  if (createBody.hora_inicio && createBody.hora_fin) {
    minutosTrabajados = calcularMinutosTrabajados(createBody.hora_inicio, createBody.hora_fin);
  }

  // Determinar estado inicial
  let estado: Fichaje['estado'] = 'pendiente';
  if (createBody.hora_inicio && createBody.hora_fin) {
    estado = 'completado';
  } else if (createBody.hora_inicio) {
    estado = 'entrada_registrada';
  }

  const { data, error } = await supabase
    .from('fichajes')
    .insert({
      profesor_id: createBody.profesor_id,
      clase_momence_id: createBody.clase_momence_id || null,
      clase_nombre: createBody.clase_nombre,
      fecha,
      hora_inicio: createBody.hora_inicio || null,
      hora_fin: createBody.hora_fin || null,
      modalidad: createBody.modalidad || 'presencial',
      tipo_horas: createBody.tipo_horas || 'ordinarias',
      minutos_trabajados: minutosTrabajados,
      estado,
      metodo_entrada: createBody.metodo_entrada || null,
      timestamp_entrada: createBody.hora_inicio ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    // Manejar error de duplicado
    if (error.code === '23505') {
      res.status(409).json({
        success: false,
        error: 'Ya existe un fichaje para este profesor en esta fecha y hora',
      } as ApiResponse);
      return;
    }

    console.error('[API/fichaje/fichajes] Error creating:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(201).json({
    success: true,
    data,
    message: 'Fichaje creado correctamente',
  } as ApiResponse<Fichaje>);
}

/**
 * Registrar entrada o salida (desde PWA/WhatsApp)
 */
async function handleRegistrarFichaje(
  req: VercelRequest,
  res: VercelResponse,
  body: RegistrarFichajeBody
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const horaActual = getHoraAhoraEspana();
  const fechaActual = getFechaHoyEspana();

  if (body.action === 'entrada') {
    // Buscar si ya tiene un fichaje pendiente para hoy
    const { data: existing } = await supabase
      .from('fichajes')
      .select('*')
      .eq('profesor_id', body.profesor_id)
      .eq('fecha', fechaActual)
      .in('estado', ['pendiente', 'entrada_registrada'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existing && existing.estado === 'entrada_registrada') {
      res.status(409).json({
        success: false,
        error: 'Ya tienes una entrada registrada sin salida. Registra primero la salida.',
        data: existing,
      } as ApiResponse);
      return;
    }

    // Si hay fichaje pendiente, actualizar con la entrada
    if (existing && existing.estado === 'pendiente') {
      const { data, error } = await supabase
        .from('fichajes')
        .update({
          hora_inicio: horaActual,
          estado: 'entrada_registrada',
          metodo_entrada: body.metodo,
          whatsapp_msg_id_entrada: body.whatsapp_msg_id || null,
          timestamp_entrada: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        res.status(500).json({
          success: false,
          error: error.message,
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data,
        message: `Entrada registrada a las ${horaActual}`,
      } as ApiResponse<Fichaje>);
      return;
    }

    // Crear nuevo fichaje con entrada
    const { data, error } = await supabase
      .from('fichajes')
      .insert({
        profesor_id: body.profesor_id,
        clase_momence_id: body.clase_momence_id || null,
        clase_nombre: body.clase_nombre || 'Fichaje manual',
        fecha: fechaActual,
        hora_inicio: horaActual,
        estado: 'entrada_registrada',
        metodo_entrada: body.metodo,
        whatsapp_msg_id_entrada: body.whatsapp_msg_id || null,
        timestamp_entrada: new Date().toISOString(),
        modalidad: 'presencial',
        tipo_horas: 'ordinarias',
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
      return;
    }

    res.status(201).json({
      success: true,
      data,
      message: `Entrada registrada a las ${horaActual}`,
    } as ApiResponse<Fichaje>);
    return;
  }

  if (body.action === 'salida') {
    // Buscar fichaje con entrada sin salida
    const { data: fichajePendiente } = await supabase
      .from('fichajes')
      .select('*')
      .eq('profesor_id', body.profesor_id)
      .eq('fecha', fechaActual)
      .eq('estado', 'entrada_registrada')
      .order('hora_inicio', { ascending: false })
      .limit(1)
      .single();

    if (!fichajePendiente) {
      res.status(404).json({
        success: false,
        error: 'No hay ninguna entrada registrada para hoy. Registra primero la entrada.',
      } as ApiResponse);
      return;
    }

    // Calcular minutos trabajados
    const minutosTrabajados = calcularMinutosTrabajados(
      fichajePendiente.hora_inicio ?? '00:00',
      horaActual
    );

    // Actualizar con salida
    const { data, error } = await supabase
      .from('fichajes')
      .update({
        hora_fin: horaActual,
        estado: 'completado',
        metodo_salida: body.metodo,
        whatsapp_msg_id_salida: body.whatsapp_msg_id || null,
        timestamp_salida: new Date().toISOString(),
        minutos_trabajados: minutosTrabajados,
      })
      .eq('id', fichajePendiente.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      } as ApiResponse);
      return;
    }

    const horas = Math.floor(minutosTrabajados / 60);
    const mins = minutosTrabajados % 60;

    res.status(200).json({
      success: true,
      data,
      message: `Salida registrada a las ${horaActual}. Tiempo trabajado: ${horas}h ${mins}min`,
    } as ApiResponse<Fichaje>);
    return;
  }

  res.status(400).json({
    success: false,
    error: 'Action debe ser "entrada" o "salida"',
  } as ApiResponse);
}

/**
 * PUT - Actualiza un fichaje (admin)
 */
async function handlePut(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = req.body as UpdateFichajeBody;

  if (!body.id) {
    res.status(400).json({
      success: false,
      error: 'El ID del fichaje es obligatorio',
    } as ApiResponse);
    return;
  }

  // Verificar que existe
  const { data: existing } = await supabase.from('fichajes').select('*').eq('id', body.id).single();

  if (!existing) {
    res.status(404).json({
      success: false,
      error: 'Fichaje no encontrado',
    } as ApiResponse);
    return;
  }

  // Preparar datos de actualización
  const updateData: Record<string, unknown> = {};

  if (body.clase_nombre !== undefined) updateData.clase_nombre = body.clase_nombre;
  if (body.clase_momence_id !== undefined) updateData.clase_momence_id = body.clase_momence_id;
  if (body.hora_inicio !== undefined) updateData.hora_inicio = body.hora_inicio;
  if (body.hora_fin !== undefined) updateData.hora_fin = body.hora_fin;
  if (body.modalidad !== undefined) updateData.modalidad = body.modalidad;
  if (body.tipo_horas !== undefined) updateData.tipo_horas = body.tipo_horas;
  if (body.estado !== undefined) updateData.estado = body.estado;
  if (body.metodo_salida !== undefined) updateData.metodo_salida = body.metodo_salida;
  if (body.motivo_edicion !== undefined) updateData.motivo_edicion = body.motivo_edicion;
  if (body.editado_por !== undefined) updateData.editado_por = body.editado_por;

  // Recalcular minutos si cambian horas
  const horaInicio = body.hora_inicio ?? existing.hora_inicio;
  const horaFin = body.hora_fin ?? existing.hora_fin;
  if (horaInicio && horaFin) {
    updateData.minutos_trabajados = calcularMinutosTrabajados(horaInicio, horaFin);
  }

  // Si es edición manual, marcar como editado_admin
  if (body.motivo_edicion || body.editado_por) {
    updateData.estado = 'editado_admin';
  }

  const { data, error } = await supabase
    .from('fichajes')
    .update(updateData)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    console.error('[API/fichaje/fichajes] Error updating:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    data,
    message: 'Fichaje actualizado correctamente',
  } as ApiResponse<Fichaje>);
}

/**
 * DELETE - Elimina un fichaje (admin)
 * PRECAUCIÓN: Esto elimina permanentemente, usar solo en casos justificados
 */
async function handleDelete(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { id, motivo } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({
      success: false,
      error: 'El ID del fichaje es obligatorio',
    } as ApiResponse);
    return;
  }

  // Verificar que existe
  const { data: existing } = await supabase.from('fichajes').select('*').eq('id', id).single();

  if (!existing) {
    res.status(404).json({
      success: false,
      error: 'Fichaje no encontrado',
    } as ApiResponse);
    return;
  }

  // Eliminar (el audit log se crea automáticamente por el trigger)
  const { error } = await supabase.from('fichajes').delete().eq('id', id);

  if (error) {
    console.error('[API/fichaje/fichajes] Error deleting:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: `Fichaje eliminado. ${motivo ? `Motivo: ${motivo}` : ''}`,
  } as ApiResponse);
}
