import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const secret = req.query['secret'] as string;
  if (secret !== process.env['CRON_SECRET']) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];
  if (!url || !token) {
    res.status(500).json({ error: 'Redis not configured' });
    return;
  }

  const redis = new Redis({ url, token });

  const teachers = await redis.get('momence:sync:teachers');
  res.status(200).json({ teachers: JSON.parse(teachers as string) });
}
