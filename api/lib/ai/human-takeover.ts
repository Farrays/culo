/**
 * Human Takeover Service
 *
 * Gestiona el flag de "intervención humana" para pausar/reanudar a Laura.
 * Cuando un humano toma el control de una conversación, Laura deja de responder
 * automáticamente. El takeover expira automáticamente tras 2 horas.
 *
 * Redis keys:
 * - takeover:{phone} → JSON { active, takenBy, since, until }  TTL 2h
 * - conversations:active → Sorted Set (phone → timestamp)
 * - notifications:queue → List de notificaciones pendientes
 * - notifications:unread_count → Contador de no leídos
 */

import type { Redis } from '@upstash/redis';

// ============================================================================
// TYPES
// ============================================================================

export interface TakeoverInfo {
  active: boolean;
  takenBy: string;
  since: number; // Unix timestamp ms
  until: number; // Unix timestamp ms (auto-expire)
}

export interface ConversationNotification {
  id: string;
  phone: string;
  contactName?: string;
  message: string;
  timestamp: number;
  type: 'new_message' | 'escalation';
}

export interface ConversationSummary {
  phone: string;
  lastMessage: string;
  lastMessageAt: number;
  lastMessageRole: 'user' | 'assistant';
  contactName?: string;
  isHumanTakeover: boolean;
  messageCount: number;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TAKEOVER_TTL = 7200; // 2 horas en segundos
const CONVERSATION_TTL = 90 * 24 * 60 * 60; // 90 días
const NOTIFICATION_TTL = 24 * 60 * 60; // 24 horas
const MAX_CONVERSATION_MESSAGES = 20;

// ============================================================================
// HUMAN TAKEOVER
// ============================================================================

/**
 * Comprueba si hay un humano controlando esta conversación
 */
export async function isHumanTakeover(redis: Redis, phone: string): Promise<boolean> {
  try {
    const key = `takeover:${phone}`;
    const data = await redis.get(key);
    if (!data) return false;

    const info = typeof data === 'object' ? (data as TakeoverInfo) : JSON.parse(data as string);
    return info.active === true;
  } catch {
    return false;
  }
}

/**
 * Obtiene la info completa del takeover
 */
export async function getTakeoverInfo(redis: Redis, phone: string): Promise<TakeoverInfo | null> {
  try {
    const key = `takeover:${phone}`;
    const data = await redis.get(key);
    if (!data) return null;

    return typeof data === 'object' ? (data as TakeoverInfo) : JSON.parse(data as string);
  } catch {
    return null;
  }
}

/**
 * Activa el takeover humano (pausa a Laura)
 */
export async function activateTakeover(
  redis: Redis,
  phone: string,
  takenBy: string = 'admin'
): Promise<TakeoverInfo> {
  const now = Date.now();
  const info: TakeoverInfo = {
    active: true,
    takenBy,
    since: now,
    until: now + TAKEOVER_TTL * 1000,
  };

  const key = `takeover:${phone}`;
  await redis.set(key, JSON.stringify(info), { ex: TAKEOVER_TTL });

  console.log(`[human-takeover] Activated for ${phone.slice(-4)} by ${takenBy}`);
  return info;
}

/**
 * Desactiva el takeover (Laura se reactiva)
 */
export async function deactivateTakeover(redis: Redis, phone: string): Promise<void> {
  const key = `takeover:${phone}`;
  await redis.del(key);
  console.log(`[human-takeover] Deactivated for ${phone.slice(-4)}`);
}

// ============================================================================
// CONVERSATION INDEX
// ============================================================================

/**
 * Registra actividad en una conversación (sorted set con timestamp)
 */
export async function trackConversationActivity(
  redis: Redis,
  phone: string,
  timestamp?: number
): Promise<void> {
  try {
    await redis.zadd('conversations:active', {
      score: timestamp || Date.now(),
      member: phone,
    });
  } catch (error) {
    console.error('[human-takeover] Error tracking conversation:', error);
  }
}

/**
 * Obtiene la lista de conversaciones activas ordenadas por última actividad
 */
export async function getActiveConversations(
  redis: Redis,
  limit: number = 50,
  offset: number = 0
): Promise<ConversationSummary[]> {
  // Obtener phones ordenados por última actividad (más reciente primero)
  const results = await redis.zrange('conversations:active', offset, offset + limit - 1, {
    rev: true,
    withScores: true,
  });

  // results es un array plano: [member, score, member, score, ...]
  const entries: { phone: string; score: number }[] = [];
  for (let i = 0; i < results.length; i += 2) {
    entries.push({
      phone: results[i] as string,
      score: results[i + 1] as number,
    });
  }

  // Para cada phone, obtener último mensaje y estado de takeover
  const summaries: ConversationSummary[] = [];

  for (const entry of entries) {
    try {
      const [historyRaw, takeoverActive] = await Promise.all([
        redis.get(`conv:${entry.phone}`),
        isHumanTakeover(redis, entry.phone),
      ]);

      let messages: ConversationMessage[] = [];
      if (historyRaw) {
        messages =
          typeof historyRaw === 'object'
            ? (historyRaw as ConversationMessage[])
            : JSON.parse(historyRaw as string);
      }

      const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;

      summaries.push({
        phone: entry.phone,
        lastMessage: lastMsg?.content.slice(0, 100) || '',
        lastMessageAt: entry.score,
        lastMessageRole: lastMsg?.role || 'user',
        isHumanTakeover: takeoverActive,
        messageCount: messages.length,
      });
    } catch {
      summaries.push({
        phone: entry.phone,
        lastMessage: '',
        lastMessageAt: entry.score,
        lastMessageRole: 'user',
        isHumanTakeover: false,
        messageCount: 0,
      });
    }
  }

  return summaries;
}

/**
 * Cuenta total de conversaciones activas
 */
export async function getConversationCount(redis: Redis): Promise<number> {
  return await redis.zcard('conversations:active');
}

// ============================================================================
// CONVERSATION HISTORY (durante takeover)
// ============================================================================

/**
 * Guarda un mensaje de usuario durante human takeover (sin respuesta de Laura)
 */
export async function saveUserMessageDuringTakeover(
  redis: Redis,
  phone: string,
  text: string
): Promise<void> {
  try {
    const key = `conv:${phone}`;
    const data = await redis.get(key);
    let messages: ConversationMessage[] = [];

    if (data) {
      messages =
        typeof data === 'object' ? (data as ConversationMessage[]) : JSON.parse(data as string);
    }

    messages.push({ role: 'user', content: text });

    // Mantener últimos N mensajes
    const recent = messages.slice(-MAX_CONVERSATION_MESSAGES);
    await redis.set(key, JSON.stringify(recent), { ex: CONVERSATION_TTL });
  } catch (error) {
    console.error('[human-takeover] Error saving message during takeover:', error);
  }
}

/**
 * Guarda una respuesta humana en el historial (como assistant para mantener compatibilidad)
 */
export async function saveHumanReply(redis: Redis, phone: string, text: string): Promise<void> {
  try {
    const key = `conv:${phone}`;
    const data = await redis.get(key);
    let messages: ConversationMessage[] = [];

    if (data) {
      messages =
        typeof data === 'object' ? (data as ConversationMessage[]) : JSON.parse(data as string);
    }

    messages.push({ role: 'assistant', content: text });

    const recent = messages.slice(-MAX_CONVERSATION_MESSAGES);
    await redis.set(key, JSON.stringify(recent), { ex: CONVERSATION_TTL });
  } catch (error) {
    console.error('[human-takeover] Error saving human reply:', error);
  }
}

/**
 * Obtiene el historial completo de una conversación
 */
export async function getConversationHistory(
  redis: Redis,
  phone: string
): Promise<ConversationMessage[]> {
  try {
    const key = `conv:${phone}`;
    const data = await redis.get(key);
    if (!data) return [];

    return typeof data === 'object' ? (data as ConversationMessage[]) : JSON.parse(data as string);
  } catch {
    return [];
  }
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

/**
 * Añade una notificación a la cola
 */
export async function addNotification(
  redis: Redis,
  phone: string,
  message: string,
  contactName?: string,
  type: 'new_message' | 'escalation' = 'new_message'
): Promise<void> {
  try {
    const notification: ConversationNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      phone,
      contactName,
      message: message.slice(0, 200),
      timestamp: Date.now(),
      type,
    };

    // Guardar en sorted set (score = timestamp) para queries eficientes
    await redis.zadd('notifications:queue', {
      score: notification.timestamp,
      member: JSON.stringify(notification),
    });

    // Incrementar contador de no leídos
    await redis.incr('notifications:unread_count');

    // TTL en el sorted set: limpiar notificaciones antiguas (>24h)
    const cutoff = Date.now() - NOTIFICATION_TTL * 1000;
    await redis.zremrangebyscore('notifications:queue', 0, cutoff);
  } catch (error) {
    console.error('[human-takeover] Error adding notification:', error);
  }
}

/**
 * Obtiene notificaciones desde un timestamp
 */
export async function getNotifications(
  redis: Redis,
  since: number = 0,
  limit: number = 50
): Promise<{ notifications: ConversationNotification[]; unreadCount: number }> {
  try {
    // Obtener notificaciones más recientes que 'since'
    const raw = await redis.zrange('notifications:queue', since + 1, '+inf', {
      byScore: true,
      count: limit,
      offset: 0,
    });

    const notifications: ConversationNotification[] = (raw as string[]).map(item => {
      return typeof item === 'object' ? (item as ConversationNotification) : JSON.parse(item);
    });

    // Obtener contador de no leídos
    const unreadRaw = await redis.get('notifications:unread_count');
    const unreadCount = unreadRaw ? Number(unreadRaw) : 0;

    return { notifications, unreadCount };
  } catch (error) {
    console.error('[human-takeover] Error getting notifications:', error);
    return { notifications: [], unreadCount: 0 };
  }
}

/**
 * Resetea el contador de no leídos (cuando el admin abre el dashboard)
 */
export async function resetUnreadCount(redis: Redis): Promise<void> {
  await redis.set('notifications:unread_count', '0');
}
