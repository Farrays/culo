import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import { Resend } from 'resend';

/**
 * API Route: GET /api/feedback
 *
 * Recibe feedback de usuarios después de una clase.
 * Se invoca cuando el usuario hace clic en una carita del email.
 *
 * Query params:
 * - token: managementToken de la reserva
 * - rating: 1-5 (puntuación)
 *
 * Flujo:
 * 1. Valida token y obtiene booking de Redis
 * 2. Guarda feedback en Redis
 * 3. Envía email a info@farrayscenter.com
 * 4. Redirige según rating:
 *    - rating = 5 → Google Review
 *    - rating < 5 → /es/feedback-gracias
 */

const GOOGLE_REVIEW_URL = 'https://g.page/r/Ca9MFoK1mqdHEBM/review';
const FEEDBACK_NOTIFY_EMAIL = 'info@farrayscenter.com';
const BASE_URL = process.env['VITE_BASE_URL'] || 'https://www.farrayscenter.com';

// Emojis para cada rating
const RATING_EMOJIS: Record<number, string> = {
  1: '😡',
  2: '😟',
  3: '😐',
  4: '🙂',
  5: '🤩',
};

const RATING_LABELS: Record<number, string> = {
  1: 'Muy insatisfecho',
  2: 'Insatisfecho',
  3: 'Neutral',
  4: 'Satisfecho',
  5: 'Muy satisfecho',
};

// Lazy Redis
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// Lazy Resend
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

interface BookingDetails {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  sessionId: string | null;
  momenceBookingId: number | null;
  category: string;
  managementToken: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
  feedbackSent?: boolean;
  feedbackReceived?: boolean;
  feedbackRating?: number;
  feedbackReceivedAt?: string;
}

interface FeedbackData {
  eventId: string;
  rating: number;
  firstName: string;
  lastName: string;
  email: string;
  className: string;
  classDate: string;
  classTime: string;
  receivedAt: string;
  comment?: string;
  commentReceivedAt?: string;
}

/**
 * Envía email de notificación de feedback al equipo
 */
async function sendFeedbackNotification(feedback: FeedbackData): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.error('[feedback] Resend not configured');
    return false;
  }

  const emoji = RATING_EMOJIS[feedback.rating] || '❓';
  const label = RATING_LABELS[feedback.rating] || 'Desconocido';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #B01E3C 0%, #800020 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .rating-box { text-align: center; padding: 20px; background: white; border-radius: 10px; margin: 15px 0; }
    .rating-emoji { font-size: 48px; }
    .rating-number { font-size: 24px; font-weight: bold; color: #B01E3C; }
    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
    .label { font-weight: bold; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;">📊 Nuevo Feedback Recibido</h2>
    </div>
    <div class="content">
      <div class="rating-box">
        <div class="rating-emoji">${emoji}</div>
        <div class="rating-number">${feedback.rating}/5 - ${label}</div>
      </div>

      <div class="info-row">
        <span class="label">Alumno:</span> ${feedback.firstName} ${feedback.lastName}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${feedback.email}
      </div>
      <div class="info-row">
        <span class="label">Clase:</span> ${feedback.className}
      </div>
      <div class="info-row">
        <span class="label">Fecha clase:</span> ${feedback.classDate} a las ${feedback.classTime}
      </div>
      <div class="info-row">
        <span class="label">Feedback recibido:</span> ${new Date(feedback.receivedAt).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
      </div>

      ${
        feedback.rating === 5
          ? `
      <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 10px; text-align: center;">
        <strong>🌟 ¡Excelente!</strong> El alumno fue redirigido a dejar una reseña en Google.
      </div>
      `
          : `
      <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 10px; text-align: center;">
        <strong>💡 Oportunidad de mejora</strong> - Considera contactar al alumno para conocer más detalles.
      </div>
      `
      }
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: "Farray's Center <reservas@farrayscenter.com>",
      to: FEEDBACK_NOTIFY_EMAIL,
      subject: `${emoji} Feedback ${feedback.rating}/5 - ${feedback.firstName} ${feedback.lastName} (${feedback.className})`,
      html,
    });

    console.log('[feedback] Notification sent:', result);
    return true;
  } catch (error) {
    console.error('[feedback] Failed to send notification:', error);
    return false;
  }
}

/**
 * Envía email de notificación de comentario al equipo
 */
async function sendCommentNotification(
  feedback: FeedbackData,
  _booking: BookingDetails
): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.error('[feedback] Resend not configured');
    return false;
  }

  const emoji = RATING_EMOJIS[feedback.rating] || '❓';
  const label = RATING_LABELS[feedback.rating] || 'Desconocido';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #B01E3C 0%, #800020 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .rating-box { text-align: center; padding: 15px; background: white; border-radius: 10px; margin: 15px 0; }
    .rating-emoji { font-size: 36px; }
    .rating-number { font-size: 18px; font-weight: bold; color: #B01E3C; }
    .comment-box { background: white; border-left: 4px solid #B01E3C; padding: 15px 20px; margin: 15px 0; border-radius: 0 10px 10px 0; }
    .comment-text { font-style: italic; color: #333; font-size: 16px; }
    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; }
    .label { font-weight: bold; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin:0;">💬 Nuevo Comentario de Feedback</h2>
    </div>
    <div class="content">
      <div class="rating-box">
        <div class="rating-emoji">${emoji}</div>
        <div class="rating-number">${feedback.rating}/5 - ${label}</div>
      </div>

      <div class="comment-box">
        <p style="margin:0 0 5px 0; font-weight: bold; color: #666;">Comentario del alumno:</p>
        <p class="comment-text">"${feedback.comment}"</p>
      </div>

      <div class="info-row">
        <span class="label">Alumno:</span> ${feedback.firstName} ${feedback.lastName}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> ${feedback.email}
      </div>
      <div class="info-row">
        <span class="label">Clase:</span> ${feedback.className}
      </div>
      <div class="info-row">
        <span class="label">Fecha clase:</span> ${feedback.classDate} a las ${feedback.classTime}
      </div>
      <div class="info-row">
        <span class="label">Comentario enviado:</span> ${new Date(feedback.commentReceivedAt || '').toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}
      </div>

      <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 10px; text-align: center;">
        <strong>📧 Considera responder al alumno</strong> para cerrar el feedback loop.
      </div>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const result = await resend.emails.send({
      from: "Farray's Center <reservas@farrayscenter.com>",
      to: FEEDBACK_NOTIFY_EMAIL,
      subject: `💬 Comentario - ${feedback.firstName} ${feedback.lastName} (${feedback.rating}/5 ${emoji})`,
      html,
    });

    console.log('[feedback] Comment notification sent:', result);
    return true;
  } catch (error) {
    console.error('[feedback] Failed to send comment notification:', error);
    return false;
  }
}

/**
 * Maneja la submisión de comentarios vía POST
 */
async function handleCommentSubmission(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  const { token, comment } = req.body as { token?: string; comment?: string };

  // Validar parámetros
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing or invalid token' });
  }

  if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Comment is required' });
  }

  // Limit comment length for security
  const sanitizedComment = comment.trim().slice(0, 2000);

  const redis = getRedisClient();
  if (!redis) {
    console.error('[feedback] Redis not configured');
    return res.status(500).json({ success: false, error: 'Service unavailable' });
  }

  try {
    // Buscar booking por managementToken
    const eventId = await redis.get(`mgmt:${token}`);

    if (!eventId) {
      console.warn('[feedback] Token not found:', token);
      return res.status(404).json({ success: false, error: 'Token not found or expired' });
    }

    // Obtener booking
    const bookingData = await redis.get(`booking_details:${eventId}`);
    if (!bookingData) {
      console.warn('[feedback] Booking not found for eventId:', eventId);
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const booking: BookingDetails = JSON.parse(bookingData);

    // Obtener feedback existente (si hay)
    const existingFeedbackData = await redis.get(`feedback:${eventId}`);
    let feedbackData: FeedbackData;

    if (existingFeedbackData) {
      // Actualizar feedback existente con el comentario
      feedbackData = JSON.parse(existingFeedbackData);
      feedbackData.comment = sanitizedComment;
      feedbackData.commentReceivedAt = new Date().toISOString();
    } else {
      // Crear nuevo feedback con comentario (sin rating aún)
      feedbackData = {
        eventId,
        rating: 0, // No rating yet
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        className: booking.className,
        classDate: booking.classDate,
        classTime: booking.classTime,
        receivedAt: new Date().toISOString(),
        comment: sanitizedComment,
        commentReceivedAt: new Date().toISOString(),
      };
    }

    // Guardar en Redis
    await redis.set(`feedback:${eventId}`, JSON.stringify(feedbackData));

    console.log(`[feedback] Saved comment for ${eventId}: ${sanitizedComment.substring(0, 50)}...`);

    // Enviar notificación por email (solo si hay rating)
    if (feedbackData.rating > 0) {
      await sendCommentNotification(feedbackData, booking);
    }

    return res.status(200).json({
      success: true,
      message: 'Comment saved successfully',
    });
  } catch (error) {
    console.error('[feedback] Error saving comment:', error);
    return res.status(500).json({ success: false, error: 'Error saving comment' });
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // CORS headers for POST requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST - Comment submission
  if (req.method === 'POST') {
    return handleCommentSubmission(req, res);
  }

  // Handle GET - Rating submission (original flow)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, rating: ratingStr } = req.query;

  // Validar parámetros
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid token' });
  }

  const rating = parseInt(ratingStr as string, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[feedback] Redis not configured');
    return res.status(500).json({ error: 'Service unavailable' });
  }

  try {
    // Buscar booking por managementToken
    // Usa el mismo índice que mi-reserva.ts: mgmt:token -> eventId
    const eventId = await redis.get(`mgmt:${token}`);

    if (!eventId) {
      console.warn('[feedback] Token not found:', token);
      // Redirigir a página genérica de gracias aunque no encontremos el token
      return res.redirect(302, `${BASE_URL}/es/feedback-gracias`);
    }

    // Obtener booking
    const bookingData = await redis.get(`booking_details:${eventId}`);
    if (!bookingData) {
      console.warn('[feedback] Booking not found for eventId:', eventId);
      return res.redirect(302, `${BASE_URL}/es/feedback-gracias`);
    }

    const booking: BookingDetails = JSON.parse(bookingData);

    // Verificar si ya recibimos feedback
    if (booking.feedbackReceived) {
      console.log('[feedback] Feedback already received for:', eventId);
      // Aún así redirigir según el rating original o el nuevo
      if (rating === 5) {
        return res.redirect(302, GOOGLE_REVIEW_URL);
      }
      return res.redirect(302, `${BASE_URL}/es/feedback-gracias`);
    }

    // Guardar feedback
    const feedbackData: FeedbackData = {
      eventId,
      rating,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      className: booking.className,
      classDate: booking.classDate,
      classTime: booking.classTime,
      receivedAt: new Date().toISOString(),
    };

    // Guardar en Redis
    await redis.set(`feedback:${eventId}`, JSON.stringify(feedbackData));

    // Actualizar booking
    booking.feedbackReceived = true;
    booking.feedbackRating = rating;
    booking.feedbackReceivedAt = feedbackData.receivedAt;
    await redis.set(`booking_details:${eventId}`, JSON.stringify(booking));

    console.log(`[feedback] Saved feedback for ${eventId}: ${rating}/5`);

    // Enviar notificación por email
    await sendFeedbackNotification(feedbackData);

    // Redirigir según rating
    if (rating === 5) {
      console.log('[feedback] Redirecting to Google Review');
      return res.redirect(302, GOOGLE_REVIEW_URL);
    } else {
      console.log('[feedback] Redirecting to thank you page');
      return res.redirect(302, `${BASE_URL}/es/feedback-gracias`);
    }
  } catch (error) {
    console.error('[feedback] Error:', error);
    // En caso de error, aún redirigir a página de gracias
    return res.redirect(302, `${BASE_URL}/es/feedback-gracias`);
  }
}
