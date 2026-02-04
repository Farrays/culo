/**
 * Sync Profesores from Momence
 *
 * Endpoint para sincronizar profesores desde Momence a Supabase.
 * Extrae todos los instructores únicos de las clases y los añade a la tabla profesores.
 *
 * GET /api/sync-profesores - Lista instructores de Momence (sin insertar)
 * POST /api/sync-profesores - Inserta instructores faltantes en Supabase
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './lib/supabase';

// Momence API types
interface MomenceTeacher {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
}

interface MomenceSession {
  id: number;
  name: string;
  teacher?: MomenceTeacher;
  additionalTeachers?: MomenceTeacher[];
}

// Auth token cache
let cachedToken: { token: string; expires: number } | null = null;

async function getMomenceToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const clientId = process.env['MOMENCE_CLIENT_ID'];
  const clientSecret = process.env['MOMENCE_CLIENT_SECRET'];

  if (!clientId || !clientSecret) {
    throw new Error('Missing MOMENCE_CLIENT_ID or MOMENCE_CLIENT_SECRET');
  }

  const res = await fetch('https://api.momence.com/v2/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Momence auth failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

async function getMomenceInstructors(): Promise<Map<string, MomenceTeacher>> {
  const token = await getMomenceToken();

  // Get sessions for the next 30 days to capture all active instructors
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  const url = new URL('https://api.momence.com/v2/host/sessions');
  url.searchParams.set('startsAtFrom', startDate.toISOString());
  url.searchParams.set('startsAtTo', endDate.toISOString());
  url.searchParams.set('limit', '500');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Momence sessions fetch failed: ${res.status}`);
  }

  const data = await res.json();
  const sessions: MomenceSession[] = data.data || [];

  // Extract unique instructors
  const instructors = new Map<string, MomenceTeacher>();

  for (const session of sessions) {
    if (session.teacher) {
      const fullName = `${session.teacher.firstName} ${session.teacher.lastName}`.trim();
      if (fullName && !instructors.has(fullName.toLowerCase())) {
        instructors.set(fullName.toLowerCase(), session.teacher);
      }
    }

    if (session.additionalTeachers) {
      for (const teacher of session.additionalTeachers) {
        const fullName = `${teacher.firstName} ${teacher.lastName}`.trim();
        if (fullName && !instructors.has(fullName.toLowerCase())) {
          instructors.set(fullName.toLowerCase(), teacher);
        }
      }
    }
  }

  return instructors;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    // Get instructors from Momence
    const momenceInstructors = await getMomenceInstructors();

    // Get existing professors from Supabase
    const supabase = getSupabaseAdmin();
    const { data: existingProfesores } = await supabase
      .from('profesores')
      .select('id, nombre, apellidos, nombre_momence, telefono_whatsapp');

    const existingNames = new Set(
      (existingProfesores || []).map(p => p.nombre_momence.toLowerCase().trim())
    );

    // Find instructors not in database
    const newInstructors: Array<{
      nombre: string;
      apellidos: string;
      nombre_momence: string;
      momence_id: number;
    }> = [];

    for (const [key, teacher] of momenceInstructors) {
      if (!existingNames.has(key)) {
        newInstructors.push({
          nombre: teacher.firstName,
          apellidos: teacher.lastName,
          nombre_momence: `${teacher.firstName} ${teacher.lastName}`.trim(),
          momence_id: teacher.id,
        });
      }
    }

    // GET: Just list instructors
    if (req.method === 'GET') {
      res.status(200).json({
        success: true,
        message: 'Instructores encontrados en Momence',
        total_momence: momenceInstructors.size,
        total_existentes: existingNames.size,
        nuevos_para_añadir: newInstructors.length,
        instructores_momence: Array.from(momenceInstructors.values()).map(t => ({
          id: t.id,
          nombre: t.firstName,
          apellidos: t.lastName,
          nombre_completo: `${t.firstName} ${t.lastName}`.trim(),
          existe_en_db: existingNames.has(`${t.firstName} ${t.lastName}`.toLowerCase().trim()),
        })),
        profesores_existentes: existingProfesores?.map(p => ({
          id: p.id,
          nombre: p.nombre,
          apellidos: p.apellidos,
          nombre_momence: p.nombre_momence,
          telefono: p.telefono_whatsapp,
        })),
      });
      return;
    }

    // POST: Insert new instructors
    if (req.method === 'POST') {
      if (newInstructors.length === 0) {
        res.status(200).json({
          success: true,
          message: 'Todos los instructores ya están en la base de datos',
          insertados: 0,
        });
        return;
      }

      // Insert new instructors with placeholder phone (must be unique)
      const insertData = newInstructors.map((instructor, index) => ({
        nombre: instructor.nombre,
        apellidos: instructor.apellidos,
        nombre_momence: instructor.nombre_momence,
        telefono_whatsapp: `+34000000${String(Date.now()).slice(-4)}${index}`, // Placeholder único
        tipo_contrato: 'parcial' as const,
        activo: true,
        fecha_alta: new Date().toISOString().split('T')[0],
      }));

      const { data: inserted, error } = await supabase
        .from('profesores')
        .insert(insertData)
        .select();

      if (error) {
        res.status(500).json({
          success: false,
          error: error.message,
          details: error,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${inserted?.length || 0} profesores insertados`,
        insertados: inserted?.length || 0,
        profesores: inserted,
        nota: 'IMPORTANTE: Actualiza los teléfonos reales en Supabase Table Editor',
      });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[sync-profesores] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
