/**
 * Agent Metrics - Analytics Tracking in Redis
 *
 * Tracks and stores agent performance metrics:
 * - Conversation counts
 * - Booking conversions
 * - Response times
 * - Lead tier distribution
 * - Objection frequency
 * - Language breakdown
 *
 * All data stored in Redis with daily aggregation.
 *
 * @see AGENTE.md - Métricas en Redis
 */

import type { Redis } from '@upstash/redis';
import type { SupportedLanguage } from './language-detector';
import type { LeadTier } from './lead-scorer';
import type { ObjectionType } from './objection-handler';

// ============================================================================
// TYPES
// ============================================================================

export interface DailyMetrics {
  date: string;
  conversationsStarted: number;
  conversationsCompleted: number;
  bookingsCreated: number;
  conversionRate: number;
  avgMessagesPerConv: number;
  avgResponseTimeMs: number;
  leadsHot: number;
  leadsWarm: number;
  leadsCold: number;
  totalMessages: number;
}

export interface FunnelMetrics {
  started: number;
  intentDetected: number;
  classSelected: number;
  dataCollected: number;
  consentsGiven: number;
  bookingCompleted: number;
}

export interface LanguageBreakdown {
  es: { conversations: number; bookings: number };
  ca: { conversations: number; bookings: number };
  en: { conversations: number; bookings: number };
  fr: { conversations: number; bookings: number };
}

export interface ObjectionStats {
  price: number;
  time: number;
  experience: number;
  location: number;
  commitment: number;
  indecision: number;
  competition: number;
}

export interface AnalyticsSummary {
  period: { from: string; to: string };
  summary: {
    totalConversations: number;
    totalBookings: number;
    conversionRate: number;
    revenueAttributed: number;
  };
  funnel: FunnelMetrics;
  leadsByTier: { hot: number; warm: number; cold: number };
  topObjections: Array<{ objection: string; count: number }>;
  byLanguage: LanguageBreakdown;
  daily: DailyMetrics[];
}

// ============================================================================
// REDIS KEY PATTERNS
// ============================================================================

const KEYS = {
  metrics: (date: string) => `agent:metrics:${date}`,
  funnel: (date: string) => `agent:funnel:${date}`,
  leads: (tier: LeadTier, date: string) => `agent:leads:${tier}:${date}`,
  objections: (date: string) => `agent:objections:${date}`,
  language: (date: string) => `agent:language:${date}`,
  responseTimes: (date: string) => `agent:response_times:${date}`,
};

// ============================================================================
// METRICS MANAGER CLASS
// ============================================================================

export class AgentMetrics {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getToday(): string {
    return new Date().toISOString().split('T')[0] ?? '';
  }

  // --------------------------------------------------------------------------
  // INCREMENT METHODS
  // --------------------------------------------------------------------------

  /**
   * Track conversation started
   */
  async trackConversationStarted(_phone: string, lang: SupportedLanguage = 'es'): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    await Promise.all([
      this.redis.hincrby(KEYS.metrics(date), 'conversations_started', 1),
      this.redis.hincrby(KEYS.funnel(date), 'started', 1),
      this.redis.hincrby(KEYS.language(date), `${lang}_conversations`, 1),
    ]);
  }

  /**
   * Track conversation completed
   */
  async trackConversationCompleted(messageCount: number): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    await Promise.all([
      this.redis.hincrby(KEYS.metrics(date), 'conversations_completed', 1),
      this.redis.hincrby(KEYS.metrics(date), 'total_messages', messageCount),
    ]);
  }

  /**
   * Track booking intent detected
   */
  async trackIntentDetected(): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();
    await this.redis.hincrby(KEYS.funnel(date), 'intent_detected', 1);
  }

  /**
   * Track class selected in booking flow
   */
  async trackClassSelected(): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();
    await this.redis.hincrby(KEYS.funnel(date), 'class_selected', 1);
  }

  /**
   * Track user data collected
   */
  async trackDataCollected(): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();
    await this.redis.hincrby(KEYS.funnel(date), 'data_collected', 1);
  }

  /**
   * Track consents given
   */
  async trackConsentsGiven(): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();
    await this.redis.hincrby(KEYS.funnel(date), 'consents_given', 1);
  }

  /**
   * Track booking completed
   */
  async trackBookingCompleted(lang: SupportedLanguage = 'es'): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    await Promise.all([
      this.redis.hincrby(KEYS.metrics(date), 'bookings_created', 1),
      this.redis.hincrby(KEYS.funnel(date), 'booking_completed', 1),
      this.redis.hincrby(KEYS.language(date), `${lang}_bookings`, 1),
    ]);
  }

  /**
   * Track response time
   */
  async trackResponseTime(responseTimeMs: number): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    // Store in a list for averaging
    await this.redis.rpush(KEYS.responseTimes(date), responseTimeMs.toString());

    // Keep only last 1000 entries
    await this.redis.ltrim(KEYS.responseTimes(date), -1000, -1);
  }

  /**
   * Track lead tier
   */
  async trackLeadTier(phone: string, tier: LeadTier): Promise<void> {
    if (!this.redis) return;

    const redis = this.redis;
    const date = this.getToday();

    // Remove from other tiers first
    const tiers: LeadTier[] = ['hot', 'warm', 'cold'];
    await Promise.all(tiers.map(t => redis.srem(KEYS.leads(t, date), phone)));

    // Add to new tier
    await redis.sadd(KEYS.leads(tier, date), phone);
    await this.redis.expire(KEYS.leads(tier, date), 90 * 24 * 60 * 60); // 90 days
  }

  /**
   * Track objection detected
   */
  async trackObjection(objectionType: ObjectionType): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();
    await this.redis.hincrby(KEYS.objections(date), objectionType, 1);
  }

  // --------------------------------------------------------------------------
  // RETRIEVAL METHODS
  // --------------------------------------------------------------------------

  /**
   * Get metrics for a specific date
   */
  async getDailyMetrics(date: string): Promise<DailyMetrics> {
    if (!this.redis) {
      return this.emptyDailyMetrics(date);
    }

    const [metricsData, responseTimes, leadsHot, leadsWarm, leadsCold] = await Promise.all([
      this.redis.hgetall(KEYS.metrics(date)),
      this.redis.lrange(KEYS.responseTimes(date), 0, -1),
      this.redis.scard(KEYS.leads('hot', date)),
      this.redis.scard(KEYS.leads('warm', date)),
      this.redis.scard(KEYS.leads('cold', date)),
    ]);

    // Handle null case from Upstash hgetall
    const metrics = metricsData || {};
    const conversationsStarted = parseInt(String(metrics['conversations_started'] || '0'));
    const conversationsCompleted = parseInt(String(metrics['conversations_completed'] || '0'));
    const bookingsCreated = parseInt(String(metrics['bookings_created'] || '0'));
    const totalMessages = parseInt(String(metrics['total_messages'] || '0'));

    // Calculate average response time
    const times = responseTimes || [];
    const avgResponseTimeMs =
      times.length > 0 ? times.reduce((sum, t) => sum + parseInt(String(t)), 0) / times.length : 0;

    // Calculate conversion rate
    const conversionRate =
      conversationsCompleted > 0 ? bookingsCreated / conversationsCompleted : 0;

    // Calculate average messages per conversation
    const avgMessagesPerConv =
      conversationsCompleted > 0 ? totalMessages / conversationsCompleted : 0;

    return {
      date,
      conversationsStarted,
      conversationsCompleted,
      bookingsCreated,
      conversionRate: Math.round(conversionRate * 1000) / 1000,
      avgMessagesPerConv: Math.round(avgMessagesPerConv * 10) / 10,
      avgResponseTimeMs: Math.round(avgResponseTimeMs),
      leadsHot,
      leadsWarm,
      leadsCold,
      totalMessages,
    };
  }

  /**
   * Get funnel metrics for a date
   */
  async getFunnelMetrics(date: string): Promise<FunnelMetrics> {
    if (!this.redis) {
      return this.emptyFunnelMetrics();
    }

    const rawData = await this.redis.hgetall(KEYS.funnel(date));
    const data = rawData || {};

    return {
      started: parseInt(String(data['started'] || '0')),
      intentDetected: parseInt(String(data['intent_detected'] || '0')),
      classSelected: parseInt(String(data['class_selected'] || '0')),
      dataCollected: parseInt(String(data['data_collected'] || '0')),
      consentsGiven: parseInt(String(data['consents_given'] || '0')),
      bookingCompleted: parseInt(String(data['booking_completed'] || '0')),
    };
  }

  /**
   * Get objection stats for a date
   */
  async getObjectionStats(date: string): Promise<ObjectionStats> {
    if (!this.redis) {
      return this.emptyObjectionStats();
    }

    const rawData = await this.redis.hgetall(KEYS.objections(date));
    const data = rawData || {};

    return {
      price: parseInt(String(data['price'] || '0')),
      time: parseInt(String(data['time'] || '0')),
      experience: parseInt(String(data['experience'] || '0')),
      location: parseInt(String(data['location'] || '0')),
      commitment: parseInt(String(data['commitment'] || '0')),
      indecision: parseInt(String(data['indecision'] || '0')),
      competition: parseInt(String(data['competition'] || '0')),
    };
  }

  /**
   * Get language breakdown for a date
   */
  async getLanguageBreakdown(date: string): Promise<LanguageBreakdown> {
    if (!this.redis) {
      return this.emptyLanguageBreakdown();
    }

    const rawData = await this.redis.hgetall(KEYS.language(date));
    const data = rawData || {};

    const langs: SupportedLanguage[] = ['es', 'ca', 'en', 'fr'];
    const breakdown: LanguageBreakdown = {} as LanguageBreakdown;

    for (const lang of langs) {
      breakdown[lang] = {
        conversations: parseInt(String(data[`${lang}_conversations`] || '0')),
        bookings: parseInt(String(data[`${lang}_bookings`] || '0')),
      };
    }

    return breakdown;
  }

  /**
   * Get analytics summary for a date range
   */
  async getAnalyticsSummary(from: string, to: string): Promise<AnalyticsSummary> {
    const dates = this.getDateRange(from, to);

    // Fetch all daily metrics in parallel
    const dailyMetrics = await Promise.all(dates.map(date => this.getDailyMetrics(date)));

    // Aggregate totals
    const totals = dailyMetrics.reduce(
      (acc, day) => ({
        conversations: acc.conversations + day.conversationsStarted,
        bookings: acc.bookings + day.bookingsCreated,
        hot: acc.hot + day.leadsHot,
        warm: acc.warm + day.leadsWarm,
        cold: acc.cold + day.leadsCold,
      }),
      { conversations: 0, bookings: 0, hot: 0, warm: 0, cold: 0 }
    );

    // Aggregate funnel
    const funnelData = await Promise.all(dates.map(date => this.getFunnelMetrics(date)));
    const funnel = funnelData.reduce(
      (acc, f) => ({
        started: acc.started + f.started,
        intentDetected: acc.intentDetected + f.intentDetected,
        classSelected: acc.classSelected + f.classSelected,
        dataCollected: acc.dataCollected + f.dataCollected,
        consentsGiven: acc.consentsGiven + f.consentsGiven,
        bookingCompleted: acc.bookingCompleted + f.bookingCompleted,
      }),
      this.emptyFunnelMetrics()
    );

    // Aggregate objections
    const objectionData = await Promise.all(dates.map(date => this.getObjectionStats(date)));
    const objections = objectionData.reduce(
      (acc, o) => ({
        price: acc.price + o.price,
        time: acc.time + o.time,
        experience: acc.experience + o.experience,
        location: acc.location + o.location,
        commitment: acc.commitment + o.commitment,
        indecision: acc.indecision + o.indecision,
        competition: acc.competition + o.competition,
      }),
      this.emptyObjectionStats()
    );

    // Aggregate language breakdown
    const langData = await Promise.all(dates.map(date => this.getLanguageBreakdown(date)));
    const byLanguage = langData.reduce((acc, l) => {
      for (const lang of ['es', 'ca', 'en', 'fr'] as SupportedLanguage[]) {
        acc[lang].conversations += l[lang].conversations;
        acc[lang].bookings += l[lang].bookings;
      }
      return acc;
    }, this.emptyLanguageBreakdown());

    // Top objections
    const topObjections = Object.entries(objections)
      .map(([objection, count]) => ({ objection, count }))
      .filter(o => o.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      period: { from, to },
      summary: {
        totalConversations: totals.conversations,
        totalBookings: totals.bookings,
        conversionRate:
          totals.conversations > 0
            ? Math.round((totals.bookings / totals.conversations) * 1000) / 1000
            : 0,
        revenueAttributed: totals.bookings * 78, // Average membership price
      },
      funnel,
      leadsByTier: {
        hot: totals.hot,
        warm: totals.warm,
        cold: totals.cold,
      },
      topObjections,
      byLanguage,
      daily: dailyMetrics,
    };
  }

  // --------------------------------------------------------------------------
  // HELPER METHODS
  // --------------------------------------------------------------------------

  private getDateRange(from: string, to: string): string[] {
    const dates: string[] = [];
    const current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      if (dateStr) dates.push(dateStr);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private emptyDailyMetrics(date: string): DailyMetrics {
    return {
      date,
      conversationsStarted: 0,
      conversationsCompleted: 0,
      bookingsCreated: 0,
      conversionRate: 0,
      avgMessagesPerConv: 0,
      avgResponseTimeMs: 0,
      leadsHot: 0,
      leadsWarm: 0,
      leadsCold: 0,
      totalMessages: 0,
    };
  }

  private emptyFunnelMetrics(): FunnelMetrics {
    return {
      started: 0,
      intentDetected: 0,
      classSelected: 0,
      dataCollected: 0,
      consentsGiven: 0,
      bookingCompleted: 0,
    };
  }

  private emptyObjectionStats(): ObjectionStats {
    return {
      price: 0,
      time: 0,
      experience: 0,
      location: 0,
      commitment: 0,
      indecision: 0,
      competition: 0,
    };
  }

  private emptyLanguageBreakdown(): LanguageBreakdown {
    return {
      es: { conversations: 0, bookings: 0 },
      ca: { conversations: 0, bookings: 0 },
      en: { conversations: 0, bookings: 0 },
      fr: { conversations: 0, bookings: 0 },
    };
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let metricsInstance: AgentMetrics | null = null;

export function getAgentMetrics(redis: Redis | null = null): AgentMetrics {
  if (!metricsInstance || redis) {
    metricsInstance = new AgentMetrics(redis);
  }
  return metricsInstance;
}
