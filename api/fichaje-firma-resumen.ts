/**
 * API: Firma Digital de Resumen Mensual
 *
 * Permite al profesor firmar digitalmente su resumen mensual.
 * Registra timestamp, IP y user-agent como prueba de firma.
 *
 * POST /api/fichaje-firma-resumen
 * Body: { token, confirmacion: true }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './lib/supabase.js';
import { sendTextMessage, isWhatsAppConfigured } from './lib/whatsapp.js';

// Dynamic imports for email to avoid Vercel bundler issues
async function getEmailFunctions() {
  const emailModule = await import('./lib/email-fichaje.js');
  return {
    sendEmail: emailModule.sendEmail,
    isEmailConfigured: emailModule.isEmailConfigured,
  };
}

interface ResumenConProfesor {
  id: string;
  profesor_id: string;
  mes: string;
  total_horas: number;
  total_clases: number;
  horas_ordinarias: number;
  horas_complementarias: number;
  dias_trabajados: number;
  firmado: boolean;
  fecha_firma: string | null;
  hash_documento: string;
  profesor: {
    id: string;
    nombre: string;
    apellidos: string | null;
    email: string | null;
    telefono_whatsapp: string;
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch (error) {
    console.error('[firma-resumen] Supabase not configured:', error);
    res.status(500).json({ success: false, error: 'Database not configured' });
    return;
  }

  try {
    const { token, confirmacion } = req.body;

    if (!token) {
      res.status(400).json({ success: false, error: 'Token requerido' });
      return;
    }

    if (!confirmacion) {
      res
        .status(400)
        .json({ success: false, error: 'Debe confirmar la firma (confirmacion: true)' });
      return;
    }

    // Obtener resumen por token
    const { data: resumenData, error: fetchError } = await supabase
      .from('resumenes_mensuales')
      .select(
        `
        *,
        profesor:profesores(id, nombre, apellidos, email, telefono_whatsapp)
      `
      )
      .eq('token_firma', token)
      .single();

    if (fetchError || !resumenData) {
      res.status(404).json({ success: false, error: 'Resumen no encontrado o token inválido' });
      return;
    }

    const resumen = resumenData as ResumenConProfesor;

    // Verificar si ya está firmado
    if (resumen.firmado) {
      res.status(400).json({
        success: false,
        error: 'Este resumen ya fue firmado',
        fecha_firma: resumen.fecha_firma,
      });
      return;
    }

    // Obtener IP del cliente
    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      typeof forwarded === 'string'
        ? forwarded.split(',')[0]?.trim()
        : req.headers['x-real-ip'] || 'unknown';
    const timestampFirma = new Date().toISOString();

    // Registrar firma (solo campos que existen en la tabla)
    const { error: updateError } = await supabase
      .from('resumenes_mensuales')
      // @ts-expect-error - Supabase types are dynamic
      .update({
        firmado: true,
        fecha_firma: timestampFirma,
      })
      .eq('id', resumen.id);

    if (updateError) {
      console.error('[firma-resumen] Update error:', JSON.stringify(updateError));
      throw updateError;
    }

    // Formatear mes para notificaciones
    const mesDate = new Date(resumen.mes);
    const nombreMes = mesDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    const nombreProfesor = `${resumen.profesor.nombre} ${resumen.profesor.apellidos || ''}`.trim();

    // Enviar confirmación al profesor
    if (isWhatsAppConfigured() && resumen.profesor.telefono_whatsapp) {
      try {
        await sendTextMessage(
          resumen.profesor.telefono_whatsapp,
          `Firma registrada correctamente\n\n` +
            `${nombreProfesor}, tu resumen de ${nombreMes} ha sido firmado.\n\n` +
            `Total horas: ${resumen.total_horas}h\n` +
            `Fecha firma: ${new Date(timestampFirma).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}\n\n` +
            `Conserva este mensaje como comprobante.`
        );
      } catch (waError) {
        console.error('[firma-resumen] Error enviando WhatsApp confirmación:', waError);
      }
    }

    // Enviar copia por email al profesor y admin (dynamic import)
    try {
      const { sendEmail, isEmailConfigured } = await getEmailFunctions();
      if (isEmailConfigured()) {
        const emailHtml = `
          <h2>Resumen Mensual Firmado</h2>
          <p><strong>Profesor:</strong> ${nombreProfesor}</p>
          <p><strong>Período:</strong> ${nombreMes}</p>

          <h3>Datos del Resumen</h3>
          <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
            <tr style="background: #f5f5f5;">
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total horas</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${resumen.total_horas}h</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Horas ordinarias</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${resumen.horas_ordinarias}h</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Horas complementarias</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${resumen.horas_complementarias}h</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Clases impartidas</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${resumen.total_clases}</td>
            </tr>
            <tr style="background: #f5f5f5;">
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Días trabajados</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${resumen.dias_trabajados}</td>
            </tr>
          </table>

          <h3>Datos de la Firma Digital</h3>
          <p><strong>Fecha y hora:</strong> ${new Date(timestampFirma).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
          <p><strong>IP:</strong> ${ip}</p>
          <p><strong>Hash documento:</strong> <code style="font-size: 10px;">${resumen.hash_documento}</code></p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 11px;">
            Este documento cumple con el Art. 12.4.c del Estatuto de los Trabajadores.<br>
            Conservar durante 4 años según normativa vigente.
          </p>
        `;

        // Email al profesor
        if (resumen.profesor.email) {
          try {
            await sendEmail({
              to: resumen.profesor.email,
              subject: `Confirmación de firma - Resumen ${nombreMes}`,
              html: emailHtml,
            });
          } catch (emailError) {
            console.error('[firma-resumen] Error enviando email profesor:', emailError);
          }
        }

        // Email al admin
        const adminEmail = process.env['ADMIN_EMAIL'] || process.env['RESEND_FROM_EMAIL'];
        if (adminEmail) {
          try {
            await sendEmail({
              to: adminEmail,
              subject: `[Fichaje] Resumen firmado: ${nombreProfesor} - ${nombreMes}`,
              html: emailHtml,
            });
          } catch (emailError) {
            console.error('[firma-resumen] Error enviando email admin:', emailError);
          }
        }
      }
    } catch (emailImportError) {
      console.error('[firma-resumen] Error importing email module:', emailImportError);
    }

    console.log(`[firma-resumen] Resumen firmado: ${nombreProfesor}, mes=${nombreMes}, ip=${ip}`);

    res.status(200).json({
      success: true,
      message: 'Resumen firmado correctamente',
      firma: {
        fecha: timestampFirma,
        ip: ip,
        hash: resumen.hash_documento,
      },
    });
  } catch (error) {
    console.error('[firma-resumen] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
