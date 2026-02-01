import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API Route: GET /api/preview-email
 *
 * Preview email templates without sending them.
 * ONLY for development/testing - should be disabled in production.
 *
 * Query params:
 * - type: 'confirmation' | 'reminder' | 'cancellation' | 'feedback'
 *
 * Example: /api/preview-email?type=confirmation
 */

// Import email generation functions
import {
  generateConfirmationEmailHtml,
  generateReminderEmailHtml,
  generateCancellationEmailHtml,
  generateFeedbackEmailHtml,
} from './lib/email';

// Sample data for previews
const SAMPLE_BOOKING = {
  firstName: 'María',
  lastName: 'García',
  email: 'maria.garcia@example.com',
  phone: '+34612345678',
  className: 'Bachata Principiantes',
  classDate: 'Viernes, 7 de febrero de 2026',
  classTime: '19:00',
  category: 'bailes-sociales',
  eventId: 'sample-event-123',
  managementToken: 'sample-token-abc123def456',
};

const BASE_URL = process.env['VITE_BASE_URL'] || 'https://www.farrayscenter.com';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Allow access - this endpoint only shows sample emails, no sensitive data

  const { type } = req.query;

  if (!type || typeof type !== 'string') {
    // Show index of available previews
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Preview</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    h1 { color: #B01E3C; }
    ul { list-style: none; padding: 0; }
    li { margin: 10px 0; }
    a { display: block; padding: 15px 20px; background: #f5f5f5; border-radius: 8px; text-decoration: none; color: #333; }
    a:hover { background: #e0e0e0; }
    .emoji { margin-right: 10px; }
  </style>
</head>
<body>
  <h1>📧 Email Preview</h1>
  <p>Selecciona un email para previsualizar:</p>
  <ul>
    <li><a href="?type=confirmation"><span class="emoji">✅</span> Confirmación de Reserva</a></li>
    <li><a href="?type=reminder"><span class="emoji">⏰</span> Recordatorio 24h</a></li>
    <li><a href="?type=cancellation"><span class="emoji">❌</span> Cancelación</a></li>
    <li><a href="?type=feedback"><span class="emoji">⭐</span> Feedback (caritas)</a></li>
  </ul>
</body>
</html>
    `;
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }

  // Generate calendar URLs for sample data
  const classDateTime = new Date('2026-02-07T19:00:00+01:00');
  const classEndTime = new Date('2026-02-07T20:00:00+01:00');

  const calendarParams = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Clase de ${SAMPLE_BOOKING.className} - Farray's Center`,
    dates: `${classDateTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${classEndTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    details: `Tu clase de prueba de ${SAMPLE_BOOKING.className} en Farray's Center Barcelona.`,
    location: "Farray's Center, C/ Entença 100, Barcelona",
  });

  const managementUrl = `${BASE_URL}/es/mi-reserva?token=${SAMPLE_BOOKING.managementToken}`;
  const calendarUrl = `https://calendar.google.com/calendar/render?${calendarParams.toString()}`;
  const icsUrl = `${BASE_URL}/api/calendar-ics?eventId=${SAMPLE_BOOKING.eventId}`;

  let html = '';

  try {
    switch (type) {
      case 'confirmation':
        html = generateConfirmationEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
          managementUrl,
          calendarUrl,
          icsUrl,
        });
        break;

      case 'reminder':
        html = generateReminderEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
          timeframe: 'mañana',
          managementUrl,
          calendarUrl,
          icsUrl,
        });
        break;

      case 'cancellation':
        html = generateCancellationEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          classTime: SAMPLE_BOOKING.classTime,
        });
        break;

      case 'feedback':
        html = generateFeedbackEmailHtml({
          firstName: SAMPLE_BOOKING.firstName,
          className: SAMPLE_BOOKING.className,
          classDate: SAMPLE_BOOKING.classDate,
          feedbackToken: SAMPLE_BOOKING.managementToken,
        });
        break;

      default:
        return res.status(400).json({
          error: 'Invalid type. Use: confirmation, reminder, cancellation, or feedback',
        });
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  } catch (error) {
    console.error('[preview-email] Error generating preview:', error);
    return res.status(500).json({
      error: 'Error generating email preview',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
