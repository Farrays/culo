/**
 * Cron: Generación de Resúmenes Mensuales
 *
 * Se ejecuta el día 1 de cada mes a las 09:00 para generar
 * los resúmenes del mes anterior y enviar notificaciones.
 *
 * @see vercel.json - cron: "0 9 1 * *"
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
  activo: boolean;
}

interface Fichaje {
  id: string;
  profesor_id: string;
  minutos_trabajados: number | null;
  tipo_horas: string;
  fecha: string;
}

interface CronResult {
  mes: string;
  profesores_procesados: number;
  resumenes_generados: number;
  notificaciones_enviadas: number;
  errores: string[];
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
  // Solo permitir GET (cron) o POST (manual)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const result: CronResult = {
    mes: '',
    profesores_procesados: 0,
    resumenes_generados: 0,
    notificaciones_enviadas: 0,
    errores: [],
  };

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error('[cron-resumen-mensual] Supabase not configured:', error);
    res.status(500).json({ success: false, error: 'Database not configured' });
    return;
  }

  try {
    // Calcular el mes anterior
    const hoy = new Date();
    const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const mesFormateado = mesAnterior.toISOString().split('T')[0] as string; // 2026-01-01
    const primerDia = mesFormateado;
    const ultimoDiaStr = new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0] as string;
    const ultimoDia = ultimoDiaStr;

    result.mes = mesFormateado.substring(0, 7); // 2026-01

    const nombreMes = mesAnterior.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    console.log(`[cron-resumen-mensual] Generando resúmenes para ${nombreMes}`);

    // Obtener todos los profesores activos
    const { data: profesoresData } = await supabase
      .from('profesores')
      .select('*')
      .eq('activo', true);

    const profesores = (profesoresData || []) as Profesor[];
    result.profesores_procesados = profesores.length;

    for (const profesor of profesores) {
      try {
        // Verificar si ya existe un resumen firmado
        const { data: existenteData } = await supabase
          .from('resumen_mensual')
          .select('id, firmado')
          .eq('profesor_id', profesor.id)
          .eq('mes', mesFormateado)
          .single();

        const existente = existenteData as { id: string; firmado: boolean } | null;

        if (existente?.firmado) {
          console.log(
            `[cron-resumen-mensual] Resumen ya firmado para ${profesor.nombre}, saltando`
          );
          continue;
        }

        // Obtener fichajes completados del mes
        const { data: fichajesData } = await supabase
          .from('fichajes')
          .select('*')
          .eq('profesor_id', profesor.id)
          .gte('fecha', primerDia)
          .lte('fecha', ultimoDia)
          .in('estado', ['completado', 'editado_admin']);

        const fichajes = (fichajesData || []) as Fichaje[];

        // Si no hay fichajes, saltar
        if (fichajes.length === 0) {
          console.log(`[cron-resumen-mensual] Sin fichajes para ${profesor.nombre}, saltando`);
          continue;
        }

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
          profesor_id: profesor.id,
          mes: mesFormateado,
          total_horas: totalHoras,
          total_clases: fichajes.length,
        });

        // Crear o actualizar resumen
        if (existente) {
          await supabase
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
            .eq('id', existente.id);
        } else {
          await supabase.from('resumen_mensual').insert({
            profesor_id: profesor.id,
            mes: mesFormateado,
            total_horas: totalHoras,
            total_clases: fichajes.length,
            horas_ordinarias: horasOrdinarias,
            horas_complementarias: horasComplementarias,
            dias_trabajados: diasTrabajados.size,
            token_firma: tokenFirma,
            hash_documento: hashDocumento,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        }

        result.resumenes_generados++;

        // Enviar notificaciones
        const urlFirma = `https://farrayscenter.com/es/fichaje/resumen?token=${tokenFirma}`;

        // WhatsApp
        if (isWhatsAppConfigured() && profesor.telefono_whatsapp) {
          try {
            await sendTextMessage(
              profesor.telefono_whatsapp,
              `Hola ${profesor.nombre},\n\n` +
                `Tu resumen de horas de ${nombreMes} está listo:\n\n` +
                `Total: ${totalHoras}h\n` +
                `Clases: ${fichajes.length}\n\n` +
                `Revisa y firma aquí:\n${urlFirma}\n\n` +
                `Debes firmarlo para cumplir con el Art. 12.4.c ET.`
            );

            await supabase
              .from('resumen_mensual')
              // @ts-expect-error - Supabase types are dynamic
              .update({
                enviado_whatsapp: true,
                fecha_envio_whatsapp: new Date().toISOString(),
              })
              .eq('profesor_id', profesor.id)
              .eq('mes', mesFormateado);

            result.notificaciones_enviadas++;
          } catch (waError) {
            result.errores.push(`WhatsApp ${profesor.nombre}: ${waError}`);
          }
        }

        // Email (dynamic import)
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
                  <p>Tu resumen mensual está disponible:</p>
                  <ul>
                    <li><strong>Total horas:</strong> ${totalHoras}h</li>
                    <li><strong>Clases impartidas:</strong> ${fichajes.length}</li>
                    <li><strong>Días trabajados:</strong> ${diasTrabajados.size}</li>
                  </ul>
                  <p><a href="${urlFirma}" style="background: #E91E63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Revisar y Firmar</a></p>
                  <p style="color: #666; font-size: 12px;">Obligatorio según Art. 12.4.c ET para contratos a tiempo parcial.</p>
                `,
              });

              await supabase
                .from('resumen_mensual')
                // @ts-expect-error - Supabase types are dynamic
                .update({
                  enviado_email: true,
                  fecha_envio_email: new Date().toISOString(),
                })
                .eq('profesor_id', profesor.id)
                .eq('mes', mesFormateado);
            }
          } catch (emailError) {
            result.errores.push(`Email ${profesor.nombre}: ${emailError}`);
          }
        }

        console.log(
          `[cron-resumen-mensual] Resumen generado para ${profesor.nombre}: ${totalHoras}h`
        );
      } catch (profError) {
        result.errores.push(`${profesor.nombre}: ${profError}`);
      }
    }

    console.log(
      `[cron-resumen-mensual] Completado: ${result.resumenes_generados} resúmenes, ${result.notificaciones_enviadas} notificaciones`
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[cron-resumen-mensual] Error:', error);
    result.errores.push(error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      ...result,
    });
  }
}
