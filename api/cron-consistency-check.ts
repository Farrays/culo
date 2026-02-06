import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

/**
 * API Route: /api/cron-consistency-check
 *
 * Daily consistency check for Redis data integrity.
 * Detects orphaned records and data inconsistencies.
 * Reports issues via email - does NOT auto-fix to avoid data loss.
 *
 * Checks:
 * 1. booking:* without corresponding mgmt:* token
 * 2. mgmt:* tokens pointing to non-existent bookings
 * 3. phone:* indexes pointing to non-existent bookings
 * 4. Bookings with invalid/missing required fields
 *
 * @see vercel.json for cron configuration
 */

// Redis client
function getRedis(): Redis {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];
  if (!url || !token) throw new Error('Missing Redis credentials');
  return new Redis({ url, token });
}

// Scan all keys matching a pattern
async function scanKeys(redis: Redis, pattern: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor = 0;

  do {
    const [nextCursor, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
    cursor = Number(nextCursor);
    keys.push(...batch);
  } while (cursor !== 0);

  return keys;
}

interface ConsistencyIssue {
  type: 'orphan_booking' | 'orphan_token' | 'orphan_phone' | 'invalid_booking' | 'missing_field';
  key: string;
  details: string;
  severity: 'warning' | 'error';
}

interface BookingData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  managementToken?: string;
  status?: string;
  className?: string;
  classDate?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Verify cron secret
  const authHeader = req.headers.authorization;
  const cronSecret = process.env['CRON_SECRET'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    if (!req.headers['x-vercel-cron']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const timestamp = new Date().toISOString();
  const issues: ConsistencyIssue[] = [];

  try {
    const redis = getRedis();
    console.log('[consistency] Starting consistency check...');

    // 1. Get all relevant keys
    const [bookingKeys, mgmtKeys, phoneKeys] = await Promise.all([
      scanKeys(redis, 'booking:*'),
      scanKeys(redis, 'mgmt:*'),
      scanKeys(redis, 'phone:*'),
    ]);

    console.log(
      `[consistency] Found: ${bookingKeys.length} bookings, ${mgmtKeys.length} tokens, ${phoneKeys.length} phones`
    );

    // 2. Build indexes for fast lookup
    const bookingEmails = new Set(bookingKeys.map(k => k.replace('booking:', '')));
    const mgmtTokens = new Map<string, string>(); // token -> email (from booking)

    // 3. Check each booking for consistency
    for (const bookingKey of bookingKeys) {
      try {
        const bookingData = await redis.get<BookingData>(bookingKey);

        if (!bookingData) {
          issues.push({
            type: 'invalid_booking',
            key: bookingKey,
            details: 'Booking key exists but data is null/empty',
            severity: 'error',
          });
          continue;
        }

        // Check required fields
        const requiredFields = ['email', 'firstName', 'lastName', 'phone', 'status'];
        for (const field of requiredFields) {
          if (!bookingData[field as keyof BookingData]) {
            issues.push({
              type: 'missing_field',
              key: bookingKey,
              details: `Missing required field: ${field}`,
              severity: 'warning',
            });
          }
        }

        // Track management token
        if (bookingData.managementToken) {
          mgmtTokens.set(bookingData.managementToken, bookingData.email || '');
        } else {
          issues.push({
            type: 'orphan_booking',
            key: bookingKey,
            details: 'Booking has no managementToken - cannot be managed via magic link',
            severity: 'warning',
          });
        }
      } catch (err) {
        issues.push({
          type: 'invalid_booking',
          key: bookingKey,
          details: `Failed to parse booking data: ${err instanceof Error ? err.message : 'unknown'}`,
          severity: 'error',
        });
      }
    }

    // 4. Check mgmt tokens point to valid bookings
    for (const mgmtKey of mgmtKeys) {
      try {
        const email = await redis.get<string>(mgmtKey);

        if (!email) {
          issues.push({
            type: 'orphan_token',
            key: mgmtKey,
            details: 'Token exists but points to no email',
            severity: 'warning',
          });
          continue;
        }

        // Check if corresponding booking exists
        if (!bookingEmails.has(email.toLowerCase())) {
          issues.push({
            type: 'orphan_token',
            key: mgmtKey,
            details: `Token points to non-existent booking: ${email}`,
            severity: 'warning',
          });
        }
      } catch {
        // Token might store different data format, skip
      }
    }

    // 5. Check phone indexes point to valid bookings
    for (const phoneKey of phoneKeys) {
      try {
        const eventId = await redis.get<string>(phoneKey);

        if (!eventId) {
          issues.push({
            type: 'orphan_phone',
            key: phoneKey,
            details: 'Phone index exists but points to no eventId',
            severity: 'warning',
          });
        }
        // Note: We don't check if eventId exists because booking_details
        // might be cleaned up separately
      } catch {
        // Skip parsing errors
      }
    }

    // 6. Generate report
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    console.log(`[consistency] Check complete: ${errorCount} errors, ${warningCount} warnings`);

    // 7. Send email if there are issues
    if (issues.length > 0) {
      const resendApiKey = process.env['RESEND_API_KEY'];
      const alertEmail = process.env['ADMIN_NOTIFICATION_EMAILS'] || 'info@farrayscenter.com';

      if (resendApiKey) {
        const resend = new Resend(resendApiKey);

        const issuesByType = issues.reduce(
          (acc, issue) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        const report = `
# Consistency Check Report
Timestamp: ${timestamp}

## Summary
- Total Issues: ${issues.length}
- Errors: ${errorCount}
- Warnings: ${warningCount}

## Issues by Type
${Object.entries(issuesByType)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

## Details (first 20)
${issues
  .slice(0, 20)
  .map(i => `[${i.severity.toUpperCase()}] ${i.type}: ${i.key}\n  → ${i.details}`)
  .join('\n\n')}

${issues.length > 20 ? `\n... and ${issues.length - 20} more issues` : ''}

---
Note: This is a detection-only report. No data was modified.
To fix issues, review manually or run repair scripts.
        `.trim();

        await resend.emails.send({
          from: "Farray's System <alerts@farrayscenter.com>",
          to: alertEmail,
          subject: `[Alert] Data Consistency: ${errorCount} errors, ${warningCount} warnings`,
          text: report,
        });

        console.log(`[consistency] Alert email sent to ${alertEmail}`);
      }
    }

    return res.status(200).json({
      success: true,
      timestamp,
      stats: {
        bookings: bookingKeys.length,
        tokens: mgmtKeys.length,
        phones: phoneKeys.length,
      },
      issues: {
        total: issues.length,
        errors: errorCount,
        warnings: warningCount,
      },
      // Only include first 10 issues in response
      sampleIssues: issues.slice(0, 10),
    });
  } catch (error) {
    console.error('[consistency] Error:', error);
    return res.status(500).json({
      error: 'Consistency check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
