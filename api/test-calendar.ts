import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createBookingEvent, deleteBookingEvent } from './google-calendar';

/**
 * Test endpoint to verify Google Calendar configuration
 * GET /api/test-calendar
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables (without exposing values)
  const hasClientId = !!process.env['GOOGLE_CALENDAR_CLIENT_ID'];
  const hasClientSecret = !!process.env['GOOGLE_CALENDAR_CLIENT_SECRET'];
  const hasRefreshToken = !!process.env['GOOGLE_CALENDAR_REFRESH_TOKEN'];
  const calendarId = process.env['GOOGLE_CALENDAR_ID'] || 'primary (default)';

  const isConfigured = hasClientId && hasClientSecret && hasRefreshToken;

  const result = {
    configured: isConfigured,
    variables: {
      GOOGLE_CALENDAR_CLIENT_ID: hasClientId ? '✅ Set' : '❌ Missing',
      GOOGLE_CALENDAR_CLIENT_SECRET: hasClientSecret ? '✅ Set' : '❌ Missing',
      GOOGLE_CALENDAR_REFRESH_TOKEN: hasRefreshToken ? '✅ Set' : '❌ Missing',
      GOOGLE_CALENDAR_ID: calendarId,
    },
    message: isConfigured
      ? 'Google Calendar is configured. Testing connection...'
      : 'Google Calendar is NOT configured. Missing required environment variables.',
  };

  // If configured, try to actually connect and list events
  if (isConfigured) {
    try {
      // Test creating an event (dry run)
      const testResult = await createBookingEvent({
        firstName: 'Test',
        lastName: 'Connection',
        email: 'test@example.com',
        phone: '+34600000000',
        className: 'Test Connection',
        classDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        classTime: '23:59', // Late night to avoid real slots
        category: 'test',
        eventId: `test-${Date.now()}`,
      });

      if (testResult.success && testResult.calendarEventId) {
        // Delete the test event immediately
        try {
          await deleteBookingEvent(testResult.calendarEventId);
          return res.status(200).json({
            ...result,
            connectionTest: {
              success: true,
              message:
                'Successfully connected to Google Calendar API and created/deleted a test event.',
            },
          });
        } catch {
          // Event created but couldn't delete - still a success
          return res.status(200).json({
            ...result,
            connectionTest: {
              success: true,
              message:
                'Successfully connected to Google Calendar API. Test event created (cleanup pending).',
              calendarEventId: testResult.calendarEventId,
            },
          });
        }
      } else {
        return res.status(200).json({
          ...result,
          connectionTest: {
            success: false,
            error: testResult.error || 'Unknown error creating test event',
          },
        });
      }
    } catch (error) {
      return res.status(200).json({
        ...result,
        connectionTest: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  return res.status(200).json(result);
}
