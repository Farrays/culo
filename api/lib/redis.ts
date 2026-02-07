/**
 * Upstash Redis Client
 *
 * Cliente configurado para el sistema de reservas.
 * Usa REST API, ideal para Vercel Serverless Functions.
 *
 * @see https://upstash.com/docs/redis/sdks/ts/overview
 */

import { Redis } from '@upstash/redis';

// Export Redis type for use in other modules
export type RedisClient = Redis | null;

// Singleton para reutilizar conexión entre invocaciones
let redisInstance: Redis | null = null;

/**
 * Obtiene la instancia de Redis (singleton)
 * Lanza error si las variables de entorno no están configuradas
 */
export function getRedis(): Redis {
  if (redisInstance) {
    return redisInstance;
  }

  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

  if (!url || !token) {
    throw new Error(
      'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.'
    );
  }

  redisInstance = new Redis({
    url,
    token,
  });

  return redisInstance;
}

// ============================================================================
// BOOKING HELPERS
// ============================================================================

/**
 * Estructura de datos de una reserva
 */
export interface BookingData {
  // Identificación
  email: string;

  // Datos personales
  firstName: string;
  lastName: string;
  phone: string; // E.164: +34666555444

  // Datos de la clase
  sessionId: number; // ID sesión Momence
  bookingId?: number; // ID booking Momence (para cancelar)
  className: string; // "Bachata Sensual - Principiantes"
  classDate: string; // "2026-01-28" (ISO)
  classTime: string; // "19:00"
  instructor?: string; // "Mathias & Eugenia"

  // Magic Link
  managementToken: string; // crypto.randomBytes(16).toString('hex')

  // Estado
  status: 'confirmed' | 'cancelled';
  reminderSent: boolean; // 24h enviado
  reminder2hSent: boolean; // 2h enviado
  feedbackSent: boolean; // Post-clase enviado

  // Tracking
  eventId: string; // Deduplicación Meta CAPI
  timestamp: number; // Date.now()
  sourceUrl?: string;

  // Consents RGPD
  acceptsTerms: boolean;
  acceptsPrivacy: boolean;
  acceptsMarketing: boolean;
}

// Keys con prefijos para organización
const KEYS = {
  booking: (email: string) => `booking:${email.toLowerCase()}`,
  managementToken: (token: string) => `mgmt:${token}`,
  reminders: (date: string) => `reminders:${date}`, // SET de emails
} as const;

// TTLs en segundos
const TTL = {
  booking: 30 * 24 * 60 * 60, // 30 días
  managementToken: 30 * 24 * 60 * 60, // 30 días
  reminders: 7 * 24 * 60 * 60, // 7 días
} as const;

/**
 * Guarda una reserva con todos sus índices
 */
export async function saveBooking(data: BookingData): Promise<void> {
  const redis = getRedis();
  const email = data.email.toLowerCase();

  // Ejecutar todo en una transacción (pipeline)
  const pipeline = redis.pipeline();

  // 1. Guardar datos completos de la reserva
  pipeline.setex(KEYS.booking(email), TTL.booking, JSON.stringify(data));

  // 2. Índice inverso: token → email (para buscar por magic link)
  pipeline.setex(KEYS.managementToken(data.managementToken), TTL.managementToken, email);

  // 3. Añadir a set de recordatorios para esa fecha
  pipeline.sadd(KEYS.reminders(data.classDate), email);
  pipeline.expire(KEYS.reminders(data.classDate), TTL.reminders);

  await pipeline.exec();
}

/**
 * Obtiene una reserva por email
 */
export async function getBookingByEmail(email: string): Promise<BookingData | null> {
  const redis = getRedis();
  const data = await redis.get<string>(KEYS.booking(email.toLowerCase()));

  if (!data) return null;

  // Si ya es objeto, devolverlo directamente
  if (typeof data === 'object') return data as unknown as BookingData;

  // Si es string, parsearlo
  return JSON.parse(data) as BookingData;
}

/**
 * Obtiene una reserva por magic link token
 */
export async function getBookingByToken(token: string): Promise<BookingData | null> {
  const redis = getRedis();

  // 1. Buscar email asociado al token
  const email = await redis.get<string>(KEYS.managementToken(token));
  if (!email) return null;

  // 2. Obtener datos de la reserva
  return getBookingByEmail(email);
}

/**
 * Actualiza campos específicos de una reserva
 */
export async function updateBooking(
  email: string,
  updates: Partial<BookingData>
): Promise<boolean> {
  const existing = await getBookingByEmail(email);
  if (!existing) return false;

  const updated = { ...existing, ...updates };
  const redis = getRedis();

  await redis.setex(KEYS.booking(email.toLowerCase()), TTL.booking, JSON.stringify(updated));

  return true;
}

/**
 * Cancela una reserva (limpia todos los índices)
 */
export async function cancelBooking(email: string): Promise<boolean> {
  const redis = getRedis();
  const normalizedEmail = email.toLowerCase();

  const booking = await getBookingByEmail(normalizedEmail);
  if (!booking) return false;

  const pipeline = redis.pipeline();

  // Eliminar reserva
  pipeline.del(KEYS.booking(normalizedEmail));

  // Eliminar índice de token
  pipeline.del(KEYS.managementToken(booking.managementToken));

  // Quitar de set de recordatorios
  pipeline.srem(KEYS.reminders(booking.classDate), normalizedEmail);

  await pipeline.exec();

  return true;
}

/**
 * Obtiene todos los emails con reservas para una fecha (para cron)
 */
export async function getBookingsForDate(date: string): Promise<string[]> {
  const redis = getRedis();
  return (await redis.smembers(KEYS.reminders(date))) as string[];
}

/**
 * Verifica si un email ya tiene una reserva activa
 */
export async function hasActiveBooking(email: string): Promise<boolean> {
  const booking = await getBookingByEmail(email);
  return booking !== null && booking.status === 'confirmed';
}

// Export keys for testing/debugging
export { KEYS, TTL };

// Alias for compatibility with agent code
export const getRedisClient = getRedis;
