/**
 * Email Helper para Sistema de Fichaje
 *
 * Helper ligero que solo incluye las funciones necesarias para fichaje.
 * NO depende de google-calendar para evitar errores de bundling en Vercel.
 */

import { Resend } from 'resend';

// Configuración
const FROM_EMAIL = "Farray's Center <reservas@farrayscenter.com>";
const REPLY_TO = 'info@farrayscenter.com';
const EMAIL_HEADERS = {
  'X-Entity-Ref-ID': 'farrayscenter-fichaje-system',
};

// Singleton Resend
let resendInstance: Resend | null = null;

function getResend(): Resend {
  if (resendInstance) {
    return resendInstance;
  }

  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }

  resendInstance = new Resend(apiKey);
  return resendInstance;
}

/**
 * Verifica si el email está configurado
 */
export function isEmailConfigured(): boolean {
  return !!process.env['RESEND_API_KEY'];
}

export interface GenericEmailData {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un email genérico usando Resend
 */
export async function sendEmail(
  data: GenericEmailData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const resend = getResend();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      replyTo: REPLY_TO,
      headers: EMAIL_HEADERS,
      subject: data.subject,
      html: data.html,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('[email-fichaje] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Envía alerta de sistema al admin
 */
export async function sendSystemAlert(
  subject: string,
  htmlBody: string
): Promise<{ success: boolean; error?: string }> {
  const adminEmail = process.env['ADMIN_EMAIL'] || process.env['RESEND_FROM_EMAIL'];

  if (!adminEmail) {
    console.warn('[email-fichaje] No admin email configured');
    return { success: false, error: 'No admin email configured' };
  }

  return sendEmail({
    to: adminEmail,
    subject: `[Fichaje Alert] ${subject}`,
    html: htmlBody,
  });
}
