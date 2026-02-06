import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin, type Profesor } from './lib/supabase.js';

/**
 * API Route: /api/fichaje-profesores
 *
 * CRUD completo para gestión de profesores del sistema de fichaje.
 *
 * Endpoints:
 * - GET    /api/fichaje/profesores         → Lista todos los profesores
 * - GET    /api/fichaje/profesores?id=xxx  → Obtiene un profesor por ID
 * - POST   /api/fichaje/profesores         → Crea un nuevo profesor
 * - PUT    /api/fichaje/profesores         → Actualiza un profesor existente
 * - DELETE /api/fichaje/profesores?id=xxx  → Desactiva un profesor (soft delete)
 *
 * Variables de entorno requeridas:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

// Tipos para request body
interface CreateProfesorBody {
  nombre: string;
  apellidos?: string;
  dni?: string;
  email?: string;
  telefono_whatsapp: string;
  nombre_momence: string;
  tipo_contrato?: 'parcial' | 'completo';
  coeficiente_parcialidad?: number;
  horas_semanales_contrato?: number;
  fecha_alta?: string;
}

interface UpdateProfesorBody extends Partial<CreateProfesorBody> {
  id: string;
  activo?: boolean;
  fecha_baja?: string;
}

// Respuesta estándar
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
    console.error('[API/fichaje/profesores] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    } as ApiResponse);
  }
}

/**
 * GET - Lista profesores o obtiene uno por ID
 */
async function handleGet(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { id, activo, nombre_momence } = req.query;

  // Si hay ID, obtener profesor específico
  if (id && typeof id === 'string') {
    const { data, error } = await supabase.from('profesores').select('*').eq('id', id).single();

    if (error) {
      res.status(404).json({
        success: false,
        error: 'Profesor no encontrado',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data,
    } as ApiResponse<Profesor>);
    return;
  }

  // Buscar por nombre_momence (para mapeo con clases)
  if (nombre_momence && typeof nombre_momence === 'string') {
    const { data, error } = await supabase
      .from('profesores')
      .select('*')
      .ilike('nombre_momence', `%${nombre_momence}%`)
      .eq('activo', true);

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
    } as ApiResponse<Profesor[]>);
    return;
  }

  // Listar todos (con filtro opcional por activo)
  let query = supabase.from('profesores').select('*').order('nombre', { ascending: true });

  // Filtrar por activo si se especifica
  if (activo === 'true') {
    query = query.eq('activo', true);
  } else if (activo === 'false') {
    query = query.eq('activo', false);
  }

  const { data, error } = await query;

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
    message: `${data.length} profesores encontrados`,
  } as ApiResponse<Profesor[]>);
}

/**
 * POST - Crea un nuevo profesor
 */
async function handlePost(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = req.body as CreateProfesorBody;

  // Validaciones
  if (!body.nombre?.trim()) {
    res.status(400).json({
      success: false,
      error: 'El nombre es obligatorio',
    } as ApiResponse);
    return;
  }

  if (!body.telefono_whatsapp?.trim()) {
    res.status(400).json({
      success: false,
      error: 'El teléfono de WhatsApp es obligatorio',
    } as ApiResponse);
    return;
  }

  if (!body.nombre_momence?.trim()) {
    res.status(400).json({
      success: false,
      error: 'El nombre en Momence es obligatorio para el mapeo de clases',
    } as ApiResponse);
    return;
  }

  // Formatear teléfono a E.164 si no lo está
  let telefono = body.telefono_whatsapp.trim();
  if (!telefono.startsWith('+')) {
    // Asumir España si no tiene prefijo
    telefono = telefono.replace(/\D/g, '');
    if (telefono.startsWith('34')) {
      telefono = '+' + telefono;
    } else {
      telefono = '+34' + telefono;
    }
  }

  // Verificar si ya existe con ese teléfono
  const { data: existing } = await supabase
    .from('profesores')
    .select('id')
    .eq('telefono_whatsapp', telefono)
    .single();

  if (existing) {
    res.status(409).json({
      success: false,
      error: 'Ya existe un profesor con ese número de WhatsApp',
    } as ApiResponse);
    return;
  }

  // Crear profesor
  const { data, error } = await supabase
    .from('profesores')
    .insert({
      nombre: body.nombre.trim(),
      apellidos: body.apellidos?.trim() || null,
      dni: body.dni?.trim() || null,
      email: body.email?.trim()?.toLowerCase() || null,
      telefono_whatsapp: telefono,
      nombre_momence: body.nombre_momence.trim(),
      tipo_contrato: body.tipo_contrato || 'parcial',
      coeficiente_parcialidad: body.coeficiente_parcialidad || null,
      horas_semanales_contrato: body.horas_semanales_contrato || null,
      fecha_alta: body.fecha_alta || new Date().toISOString().split('T')[0],
      activo: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .select()
    .single();

  if (error) {
    console.error('[API/fichaje/profesores] Error creating:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(201).json({
    success: true,
    data,
    message: `Profesor ${body.nombre} creado correctamente`,
  } as ApiResponse<Profesor>);
}

/**
 * PUT - Actualiza un profesor existente
 */
async function handlePut(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const body = req.body as UpdateProfesorBody;

  if (!body.id) {
    res.status(400).json({
      success: false,
      error: 'El ID del profesor es obligatorio',
    } as ApiResponse);
    return;
  }

  // Verificar que existe
  const { data: existing } = await supabase
    .from('profesores')
    .select('id')
    .eq('id', body.id)
    .single();

  if (!existing) {
    res.status(404).json({
      success: false,
      error: 'Profesor no encontrado',
    } as ApiResponse);
    return;
  }

  // Preparar datos de actualización
  const updateData: Record<string, unknown> = {};

  if (body.nombre !== undefined) updateData['nombre'] = body.nombre.trim();
  if (body.apellidos !== undefined) updateData['apellidos'] = body.apellidos?.trim() || null;
  if (body.dni !== undefined) updateData['dni'] = body.dni?.trim() || null;
  if (body.email !== undefined) updateData['email'] = body.email?.trim()?.toLowerCase() || null;
  if (body.nombre_momence !== undefined) updateData['nombre_momence'] = body.nombre_momence.trim();
  if (body.tipo_contrato !== undefined) updateData['tipo_contrato'] = body.tipo_contrato;
  if (body.coeficiente_parcialidad !== undefined)
    updateData['coeficiente_parcialidad'] = body.coeficiente_parcialidad;
  if (body.horas_semanales_contrato !== undefined)
    updateData['horas_semanales_contrato'] = body.horas_semanales_contrato;
  if (body.activo !== undefined) updateData['activo'] = body.activo;
  if (body.fecha_baja !== undefined) updateData['fecha_baja'] = body.fecha_baja;

  // Formatear teléfono si se actualiza
  if (body.telefono_whatsapp !== undefined) {
    let telefono = body.telefono_whatsapp.trim();
    if (!telefono.startsWith('+')) {
      telefono = telefono.replace(/\D/g, '');
      if (telefono.startsWith('34')) {
        telefono = '+' + telefono;
      } else {
        telefono = '+34' + telefono;
      }
    }
    updateData['telefono_whatsapp'] = telefono;
  }

  // Actualizar
  const { data, error } = await supabase
    .from('profesores')
    // @ts-expect-error - Supabase types are dynamic
    .update(updateData)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    console.error('[API/fichaje/profesores] Error updating:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    data,
    message: 'Profesor actualizado correctamente',
  } as ApiResponse<Profesor>);
}

/**
 * DELETE - Desactiva un profesor (soft delete)
 * No elimina realmente para mantener histórico de fichajes
 */
async function handleDelete(req: VercelRequest, res: VercelResponse): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    res.status(400).json({
      success: false,
      error: 'El ID del profesor es obligatorio',
    } as ApiResponse);
    return;
  }

  // Verificar que existe
  const { data: existingData } = await supabase
    .from('profesores')
    .select('id, nombre')
    .eq('id', id)
    .single();
  const existing = existingData as { id: string; nombre: string } | null;

  if (!existing) {
    res.status(404).json({
      success: false,
      error: 'Profesor no encontrado',
    } as ApiResponse);
    return;
  }

  // Soft delete: marcar como inactivo con fecha de baja
  const { error } = await supabase
    .from('profesores')
    // @ts-expect-error - Supabase types are dynamic
    .update({
      activo: false,
      fecha_baja: new Date().toISOString().split('T')[0],
    })
    .eq('id', id);

  if (error) {
    console.error('[API/fichaje/profesores] Error deleting:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: `Profesor ${existing.nombre} dado de baja correctamente`,
  } as ApiResponse);
}
