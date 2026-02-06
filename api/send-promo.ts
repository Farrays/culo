/**
 * Send Promotional Messages API
 *
 * POST /api/send-promo
 *
 * Sends promotional WhatsApp messages to targeted audiences using
 * pre-approved Meta templates.
 *
 * Features:
 * - Target audiences: all, active, inactive, custom list
 * - Rate limiting via Redis queue
 * - Scheduled sending support
 * - Marketing consent filtering
 * - Delivery tracking
 *
 * Requirements:
 * - Templates must be pre-approved in Meta Business Suite
 * - Only contacts with marketing consent = true
 *
 * @see AGENTE.md - Envíos Masivos de Promociones
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { sendCustomTemplate } from './lib/whatsapp.js';
import { normalizePhone } from './lib/phone-utils.js';
import { getConsentManager } from './lib/ai/consent-flow.js';

// ============================================================================
// TYPES
// ============================================================================

type TargetAudience = 'all' | 'active' | 'inactive' | 'hot_leads' | 'custom';

interface PromoRequest {
  templateName: string;
  targetAudience: TargetAudience;
  customPhones?: string[];
  templateParams?: Record<string, string>; // Parameters to fill in template
  scheduledAt?: string; // ISO timestamp for scheduled sending
  testMode?: boolean; // If true, only send to first 5 contacts
}

interface PromoResult {
  jobId: string;
  targetCount: number;
  status: 'queued' | 'processing' | 'completed' | 'scheduled';
  scheduledAt?: string;
  estimatedCompletionTime?: string;
}

interface PromoJobStatus {
  jobId: string;
  templateName: string;
  targetAudience: TargetAudience;
  totalTargets: number;
  sent: number;
  failed: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  errors: Array<{ phone: string; error: string }>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const RATE_LIMIT_PER_SECOND = 80; // WhatsApp Cloud API limit
const BATCH_SIZE = 50; // Process in batches
const MAX_TARGETS_PER_JOB = 10000; // Safety limit

// Redis keys
const KEYS = {
  promoJob: (jobId: string) => `promo:job:${jobId}`,
  promoQueue: 'promo:queue',
  marketingConsents: 'consent:marketing:phones',
  activeMembers: 'members:active',
  inactiveMembers: 'members:inactive',
  hotLeads: 'agent:leads:hot:*',
};

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check authorization
  const authHeader = req.headers.authorization;
  const apiKey = process.env['PROMO_API_KEY'];

  if (apiKey && authHeader !== `Bearer ${apiKey}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const body = req.body as PromoRequest;

    // Validate request
    const validationError = validateRequest(body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    // Check if scheduled
    if (body.scheduledAt) {
      const result = await schedulePromo(body);
      res.status(200).json(result);
      return;
    }

    // Execute immediately
    const result = await executePromo(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[send-promo] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateRequest(body: PromoRequest): string | null {
  if (!body.templateName) {
    return 'templateName is required';
  }

  if (!body.targetAudience) {
    return 'targetAudience is required';
  }

  const validAudiences: TargetAudience[] = ['all', 'active', 'inactive', 'hot_leads', 'custom'];
  if (!validAudiences.includes(body.targetAudience)) {
    return `Invalid targetAudience. Must be one of: ${validAudiences.join(', ')}`;
  }

  if (body.targetAudience === 'custom' && (!body.customPhones || body.customPhones.length === 0)) {
    return 'customPhones required when targetAudience is "custom"';
  }

  if (body.scheduledAt) {
    const scheduledDate = new Date(body.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return 'Invalid scheduledAt date format';
    }
    if (scheduledDate < new Date()) {
      return 'scheduledAt must be in the future';
    }
  }

  return null;
}

// ============================================================================
// PROMO EXECUTION
// ============================================================================

async function executePromo(request: PromoRequest): Promise<PromoResult> {
  const redis = getRedisClient();
  const jobId = generateJobId();

  // Get target phones
  const targetPhones = await getTargetPhones(request, redis);

  if (targetPhones.length === 0) {
    return {
      jobId,
      targetCount: 0,
      status: 'completed',
    };
  }

  // Apply test mode limit
  const finalTargets = request.testMode ? targetPhones.slice(0, 5) : targetPhones;

  // Check limit
  if (finalTargets.length > MAX_TARGETS_PER_JOB) {
    throw new Error(`Target count ${finalTargets.length} exceeds maximum ${MAX_TARGETS_PER_JOB}`);
  }

  // Create job status
  const jobStatus: PromoJobStatus = {
    jobId,
    templateName: request.templateName,
    targetAudience: request.targetAudience,
    totalTargets: finalTargets.length,
    sent: 0,
    failed: 0,
    status: 'processing',
    startedAt: new Date().toISOString(),
    errors: [],
  };

  // Save initial job status
  if (redis) {
    await redis.setex(KEYS.promoJob(jobId), 24 * 60 * 60, JSON.stringify(jobStatus));
  }

  // Process in background (for Vercel, we process synchronously but could use QStash)
  await processPromoJob(jobId, finalTargets, request, redis);

  // Calculate estimated completion time
  const estimatedSeconds = Math.ceil(finalTargets.length / RATE_LIMIT_PER_SECOND);

  return {
    jobId,
    targetCount: finalTargets.length,
    status: 'processing',
    estimatedCompletionTime: new Date(Date.now() + estimatedSeconds * 1000).toISOString(),
  };
}

async function schedulePromo(request: PromoRequest): Promise<PromoResult> {
  const redis = getRedisClient();
  const jobId = generateJobId();

  // Get target count (for preview)
  const targetPhones = await getTargetPhones(request, redis);

  // Save scheduled job
  const scheduledJob = {
    jobId,
    request,
    targetCount: targetPhones.length,
    scheduledAt: request.scheduledAt,
    status: 'scheduled',
  };

  if (redis && request.scheduledAt) {
    await redis.setex(
      KEYS.promoJob(jobId),
      7 * 24 * 60 * 60, // 7 days
      JSON.stringify(scheduledJob)
    );

    // Add to scheduled queue (would be processed by a cron job)
    await redis.zadd('promo:scheduled', {
      score: new Date(request.scheduledAt).getTime(),
      member: jobId,
    });
  }

  console.log(`[send-promo] Scheduled job ${jobId} for ${request.scheduledAt}`);

  return {
    jobId,
    targetCount: targetPhones.length,
    status: 'scheduled',
    scheduledAt: request.scheduledAt,
  };
}

// ============================================================================
// TARGET SELECTION
// ============================================================================

async function getTargetPhones(
  request: PromoRequest,
  redis: ReturnType<typeof getRedisClient>
): Promise<string[]> {
  let phones: string[] = [];

  switch (request.targetAudience) {
    case 'custom':
      phones = request.customPhones || [];
      break;

    case 'all':
      phones = await getAllMarketingConsentPhones(redis);
      break;

    case 'active':
      phones = await getActiveMembers(redis);
      break;

    case 'inactive':
      phones = await getInactiveMembers(redis);
      break;

    case 'hot_leads':
      phones = await getHotLeads(redis);
      break;
  }

  // Filter by marketing consent
  const consentManager = getConsentManager(redis);
  const consentedPhones: string[] = [];

  for (const phone of phones) {
    const consent = await consentManager.getConsent(phone);
    if (consent?.marketing) {
      consentedPhones.push(phone);
    }
  }

  console.log(
    `[send-promo] Target ${request.targetAudience}: ${phones.length} total, ${consentedPhones.length} with consent`
  );

  return consentedPhones;
}

async function getAllMarketingConsentPhones(
  redis: ReturnType<typeof getRedisClient>
): Promise<string[]> {
  if (!redis) return [];

  // Get all consent keys and filter by marketing = true
  const keys = await redis.keys('consent:*');
  const phones: string[] = [];

  for (const key of keys) {
    if (key.startsWith('consent:+') || key.startsWith('consent:34')) {
      const data = await redis.get(key);
      if (data) {
        try {
          // Handle both string and object returns from Upstash
          const consent = typeof data === 'object' ? data : JSON.parse(String(data));
          if (consent.marketing && consent.phone) {
            phones.push(consent.phone);
          }
        } catch {
          // Skip invalid entries
        }
      }
    }
  }

  return phones;
}

async function getActiveMembers(redis: ReturnType<typeof getRedisClient>): Promise<string[]> {
  if (!redis) return [];
  return redis.smembers(KEYS.activeMembers);
}

async function getInactiveMembers(redis: ReturnType<typeof getRedisClient>): Promise<string[]> {
  if (!redis) return [];
  return redis.smembers(KEYS.inactiveMembers);
}

async function getHotLeads(redis: ReturnType<typeof getRedisClient>): Promise<string[]> {
  if (!redis) return [];

  // Get hot leads from all dates
  const keys = await redis.keys(KEYS.hotLeads);
  const allPhones = new Set<string>();

  for (const key of keys) {
    const phones = await redis.smembers(key);
    phones.forEach(p => allPhones.add(p));
  }

  return Array.from(allPhones);
}

// ============================================================================
// MESSAGE SENDING
// ============================================================================

async function processPromoJob(
  jobId: string,
  phones: string[],
  request: PromoRequest,
  redis: ReturnType<typeof getRedisClient>
): Promise<void> {
  const jobStatus: PromoJobStatus = {
    jobId,
    templateName: request.templateName,
    targetAudience: request.targetAudience,
    totalTargets: phones.length,
    sent: 0,
    failed: 0,
    status: 'processing',
    startedAt: new Date().toISOString(),
    errors: [],
  };

  // Process in batches
  for (let i = 0; i < phones.length; i += BATCH_SIZE) {
    const batch = phones.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async phone => {
        try {
          // Build template parameters with phone-specific data
          const params = await buildTemplateParams(phone, request.templateParams, redis);

          // Send template message (templateName, to, languageCode, parameters)
          await sendCustomTemplate(request.templateName, normalizePhone(phone), 'es', params);

          jobStatus.sent++;
        } catch (error) {
          jobStatus.failed++;
          jobStatus.errors.push({
            phone: phone.slice(-4),
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      })
    );

    // Update job status in Redis
    if (redis) {
      await redis.setex(KEYS.promoJob(jobId), 24 * 60 * 60, JSON.stringify(jobStatus));
    }

    // Rate limiting delay between batches
    if (i + BATCH_SIZE < phones.length) {
      await sleep(1000); // 1 second between batches
    }
  }

  // Mark as completed
  jobStatus.status = 'completed';
  jobStatus.completedAt = new Date().toISOString();

  if (redis) {
    await redis.setex(KEYS.promoJob(jobId), 24 * 60 * 60, JSON.stringify(jobStatus));
  }

  console.log(
    `[send-promo] Job ${jobId} completed: ${jobStatus.sent} sent, ${jobStatus.failed} failed`
  );

  // Track metrics
  await trackPromoMetrics(jobId, jobStatus, redis);
}

async function buildTemplateParams(
  phone: string,
  baseParams: Record<string, string> | undefined,
  redis: ReturnType<typeof getRedisClient>
): Promise<string[]> {
  // Get member info if available
  let memberName = '';

  if (redis) {
    const memberData = await redis.hgetall(`member:${normalizePhone(phone)}`);
    memberName = String(memberData?.['name'] || '');
  }

  // Default first name if not found (consent data doesn't include name)
  const firstName = memberName.split(' ')[0] || 'Hola';

  // Build params array (WhatsApp templates use positional params)
  const params: string[] = [];

  // First param is usually the name
  params.push(baseParams?.['1'] || firstName);

  // Add any additional params
  if (baseParams) {
    for (let i = 2; i <= 10; i++) {
      const key = i.toString();
      if (baseParams[key]) {
        params.push(baseParams[key]);
      }
    }
  }

  return params;
}

// ============================================================================
// METRICS
// ============================================================================

async function trackPromoMetrics(
  _jobId: string,
  status: PromoJobStatus,
  redis: ReturnType<typeof getRedisClient>
): Promise<void> {
  if (!redis) return;

  const date = new Date().toISOString().split('T')[0];
  const metricsKey = `promo:metrics:${date}`;

  await redis.hincrby(metricsKey, 'jobs_completed', 1);
  await redis.hincrby(metricsKey, 'messages_sent', status.sent);
  await redis.hincrby(metricsKey, 'messages_failed', status.failed);
  await redis.expire(metricsKey, 90 * 24 * 60 * 60); // 90 days
}

// ============================================================================
// UTILITIES
// ============================================================================

function generateJobId(): string {
  return `promo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// JOB STATUS ENDPOINT (GET)
// ============================================================================

export async function getJobStatus(jobId: string): Promise<PromoJobStatus | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  const data = await redis.get(KEYS.promoJob(jobId));
  if (!data) return null;

  // Handle both string and object returns from Upstash
  if (typeof data === 'object') {
    return data as PromoJobStatus;
  }
  return JSON.parse(String(data)) as PromoJobStatus;
}
