/**
 * API: Resumen Mensual de Fichajes
 *
 * Genera y obtiene resúmenes mensuales de horas trabajadas por profesor.
 * Obligatorio por ley para trabajadores a tiempo parcial (Art. 12.4.c ET).
 *
 * GET /api/fichaje-resumen-mensual?profesor_id=X&mes=2026-01
 * POST /api/fichaje-resumen-mensual - Genera resumen para un mes
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getSupabaseAdmin } from './lib/supabase.js';
import { sendTextMessage, isWhatsAppConfigured } from './lib/whatsapp.js';

// Dynamic imports for email to avoid Vercel bundler issues
async function getEmailFunctions() {
  const emailModule = await import('./lib/email.js');
  return {
    sendEmail: emailModule.sendEmail,
    isEmailConfigured: emailModule.isEmailConfigured,
  };
}

// Tipos
interface Profesor {
  id: string;
  nombre: string;
  apellidos: string | null;
  email: string | null;
  telefono_whatsapp: string;
  tipo_contrato: string;
  coeficiente_parcialidad: number | null;
}

interface Fichaje {
  id: string;
  profesor_id: string;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  minutos_trabajados: number | null;
  estado: string;
  tipo_horas: string;
  clase_nombre: string;
}

interface ResumenMensual {
  id: string;
  profesor_id: string;
  mes: string;
  total_horas: number;
  total_clases: number;
  horas_ordinarias: number;
  horas_complementarias: number;
  dias_trabajados: number;
  token_firma: string | null;
  firmado: boolean;
  fecha_firma: string | null;
}

/**
 * Genera un token único para firma
 */
function generarTokenFirma(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calcula el hash SHA-256 del contenido del resumen
 */
function calcularHashResumen(data: {
  profesor_id: string;
  mes: string;
  total_horas: number;
  total_clases: number;
}): string {
  const contenido = JSON.stringify(data);
  return crypto.createHash('sha256').update(contenido).digest('hex');
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error('[resumen-mensual] Supabase not configured:', error);
    res.status(500).json({ success: false, error: 'Database not configured' });
    return;
  }

  try {
    // GET: Obtener resumen existente
    if (req.method === 'GET') {
      const { profesor_id, mes, token } = req.query;

      // Si hay token, buscar por token (para página de firma)
      if (token && typeof token === 'string') {
        const { data: resumenRaw, error } = await supabase
          .from('resumen_mensual')
          .select(
            `
            *,
            profesor:profesores(id, nombre, apellidos, email, telefono_whatsapp, tipo_contrato)
          `
          )
          .eq('token_firma', token)
          .single();

        if (error || !resumenRaw) {
          res.status(404).json({ success: false, error: 'Resumen no encontrado' });
          return;
        }

        // Type assertion for dynamic Supabase data
        const resumenData = resumenRaw as unknown as ResumenMensual & { profesor: Profesor };

        // Obtener fichajes del mes para mostrar detalle
        const mesDate = new Date(resumenData.mes);
        const primerDia = mesDate.toISOString().split('T')[0] as string;
        const ultimoDia = new Date(mesDate.getFullYear(), mesDate.getMonth() + 1, 0)
          .toISOString()
          .split('T')[0] as string;

        const { data: fichajes } = await supabase
          .from('fichajes')
          .select('*')
          .eq('profesor_id', resumenData.profesor_id)
          .gte('fecha', primerDia)
          .lte('fecha', ultimoDia)
          .in('estado', ['completado', 'editado_admin'])
          .order('fecha', { ascending: true });

        res.status(200).json({
          success: true,
          resumen: resumenData,
          fichajes: fichajes || [],
        });
        return;
      }

      // Buscar por profesor_id y mes
      if (!profesor_id || !mes) {
        res.status(400).json({ success: false, error: 'profesor_id y mes son requeridos' });
        return;
      }

      const mesFormateado = `${mes}-01`; // Convertir 2026-01 a 2026-01-01

      const { data: resumen, error } = await supabase
        .from('resumen_mensual')
        .select('*')
        .eq('profesor_id', profesor_id)
        .eq('mes', mesFormateado)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      res.status(200).json({
        success: true,
        resumen: resumen || null,
      });
      return;
    }

    // POST: Generar resumen mensual
    if (req.method === 'POST') {
      const { profesor_id, mes, enviar_notificacion } = req.body;

      if (!mes) {
        res.status(400).json({ success: false, error: 'mes es requerido (formato: 2026-01)' });
        return;
      }

      const mesFormateado = `${mes}-01`;
      const mesDate = new Date(mesFormateado);
      const primerDia = mesDate.toISOString().split('T')[0];
      const ultimoDia = new Date(mesDate.getFullYear(), mesDate.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];

      // Si no se especifica profesor, generar para todos
      let profesoresIds: string[] = [];

      if (profesor_id) {
        profesoresIds = [profesor_id];
      } else {
        // Obtener todos los profesores activos
        const { data: profesoresData } = await supabase
          .from('profesores')
          .select('id')
          .eq('activo', true);

        profesoresIds = (profesoresData || []).map((p: { id: string }) => p.id);
      }

      const resultados: Array<{
        profesor_id: string;
        success: boolean;
        resumen?: ResumenMensual;
        error?: string;
      }> = [];

      for (const profId of profesoresIds) {
        try {
          // Obtener datos del profesor
          const { data: profesorData } = await supabase
            .from('profesores')
            .select('*')
            .eq('id', profId)
            .single();

          const profesor = profesorData as Profesor | null;
          if (!profesor) {
            resultados.push({
              profesor_id: profId,
              success: false,
              error: 'Profesor no encontrado',
            });
            continue;
          }

          // Obtener fichajes completados del mes
          const { data: fichajesData } = await supabase
            .from('fichajes')
            .select('*')
            .eq('profesor_id', profId)
            .gte('fecha', primerDia)
            .lte('fecha', ultimoDia)
            .in('estado', ['completado', 'editado_admin']);

          const fichajes = (fichajesData || []) as Fichaje[];

          // Calcular totales
          let totalMinutos = 0;
          let minutosOrdinarios = 0;
          let minutosComplementarios = 0;
          const diasTrabajados = new Set<string>();

          for (const f of fichajes) {
            const mins = f.minutos_trabajados || 0;
            totalMinutos += mins;
            diasTrabajados.add(f.fecha);

            if (f.tipo_horas === 'complementarias') {
              minutosComplementarios += mins;
            } else {
              minutosOrdinarios += mins;
            }
          }

          const totalHoras = Math.round((totalMinutos / 60) * 100) / 100;
          const horasOrdinarias = Math.round((minutosOrdinarios / 60) * 100) / 100;
          const horasComplementarias = Math.round((minutosComplementarios / 60) * 100) / 100;

          // Generar token y hash
          const tokenFirma = generarTokenFirma();
          const hashDocumento = calcularHashResumen({
            profesor_id: profId,
            mes: mesFormateado,
            total_horas: totalHoras,
            total_clases: fichajes.length,
          });

          // Verificar si ya existe
          const { data: existenteData } = await supabase
            .from('resumen_mensual')
            .select('id, firmado')
            .eq('profesor_id', profId)
            .eq('mes', mesFormateado)
            .single();

          const existente = existenteData as { id: string; firmado: boolean } | null;
          let resumen: ResumenMensual;

          if (existente) {
            // No sobrescribir si ya está firmado
            if (existente.firmado) {
              resultados.push({
                profesor_id: profId,
                success: false,
                error: 'El resumen ya está firmado y no puede modificarse',
              });
              continue;
            }

            // Actualizar existente
            const { data: updated, error: updateError } = await supabase
              .from('resumen_mensual')
              // @ts-expect-error - Supabase types are dynamic
              .update({
                total_horas: totalHoras,
                total_clases: fichajes.length,
                horas_ordinarias: horasOrdinarias,
                horas_complementarias: horasComplementarias,
                dias_trabajados: diasTrabajados.size,
                token_firma: tokenFirma,
                hash_documento: hashDocumento,
              })
              .eq('id', existente.id)
              .select()
              .single();

            if (updateError) throw updateError;
            resumen = updated as ResumenMensual;
          } else {
            // Crear nuevo
            const { data: created, error: createError } = await supabase
              .from('resumen_mensual')
              .insert({
                profesor_id: profId,
                mes: mesFormateado,
                total_horas: totalHoras,
                total_clases: fichajes.length,
                horas_ordinarias: horasOrdinarias,
                horas_complementarias: horasComplementarias,
                dias_trabajados: diasTrabajados.size,
                token_firma: tokenFirma,
                hash_documento: hashDocumento,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any)
              .select()
              .single();

            if (createError) throw createError;
            resumen = created as ResumenMensual;
          }

          // Enviar notificación si se solicita
          if (enviar_notificacion && resumen) {
            const nombreMes = mesDate.toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric',
            });
            const urlFirma = `https://farrayscenter.com/es/fichaje/resumen?token=${tokenFirma}`;

            // Enviar WhatsApp
            if (isWhatsAppConfigured() && profesor.telefono_whatsapp) {
              try {
                await sendTextMessage(
                  profesor.telefono_whatsapp,
                  `Hola ${profesor.nombre},\n\nTu resumen de horas de ${nombreMes} está listo para revisar y firmar:\n\n` +
                    `Total horas: ${totalHoras}h\n` +
                    `Clases: ${fichajes.length}\n` +
                    `Días trabajados: ${diasTrabajados.size}\n\n` +
                    `Revisa y firma aquí:\n${urlFirma}\n\n` +
                    `Este documento es obligatorio según el Art. 12.4.c del Estatuto de los Trabajadores.`
                );

                await supabase
                  .from('resumen_mensual')
                  // @ts-expect-error - Supabase types are dynamic
                  .update({
                    enviado_whatsapp: true,
                    fecha_envio_whatsapp: new Date().toISOString(),
                  })
                  .eq('id', resumen.id);
              } catch (waError) {
                console.error('[resumen-mensual] Error enviando WhatsApp:', waError);
              }
            }

            // Enviar Email (dynamic import)
            if (profesor.email) {
              try {
                const { sendEmail, isEmailConfigured } = await getEmailFunctions();
                if (isEmailConfigured()) {
                  await sendEmail({
                    to: profesor.email,
                    subject: `Resumen de horas ${nombreMes} - Farray's Center`,
                    html: `
                      <h2>Resumen de horas - ${nombreMes}</h2>
                      <p>Hola ${profesor.nombre},</p>
                      <p>Tu resumen mensual de horas trabajadas está disponible:</p>
                      <ul>
                        <li><strong>Total horas:</strong> ${totalHoras}h</li>
                        <li><strong>Horas ordinarias:</strong> ${horasOrdinarias}h</li>
                        <li><strong>Horas complementarias:</strong> ${horasComplementarias}h</li>
                        <li><strong>Clases impartidas:</strong> ${fichajes.length}</li>
                        <li><strong>Días trabajados:</strong> ${diasTrabajados.size}</li>
                      </ul>
                      <p><a href="${urlFirma}" style="background: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Revisar y Firmar</a></p>
                      <p style="color: #666; font-size: 12px;">Este documento es obligatorio según el Art. 12.4.c del Estatuto de los Trabajadores para contratos a tiempo parcial.</p>
                    `,
                  });

                  await supabase
                    .from('resumen_mensual')
                    // @ts-expect-error - Supabase types are dynamic
                    .update({
                      enviado_email: true,
                      fecha_envio_email: new Date().toISOString(),
                    })
                    .eq('id', resumen.id);
                }
              } catch (emailError) {
                console.error('[resumen-mensual] Error enviando email:', emailError);
              }
            }
          }

          resultados.push({ profesor_id: profId, success: true, resumen });
        } catch (err) {
          const errorDetails =
            err instanceof Error
              ? err.message
              : typeof err === 'object' && err !== null
                ? JSON.stringify(err)
                : 'Error desconocido';
          console.error(`[resumen-mensual] Error procesando profesor ${profId}:`, errorDetails);
          resultados.push({
            profesor_id: profId,
            success: false,
            error: errorDetails,
          });
        }
      }

      res.status(200).json({
        success: true,
        mes,
        profesores_procesados: profesoresIds.length,
        resultados,
      });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[resumen-mensual] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
