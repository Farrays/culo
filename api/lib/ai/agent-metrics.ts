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
import type { SupportedLanguage } from './language-detector.js';
import type { LeadTier } from './lead-scorer.js';
import type { ObjectionType } from './objection-handler.js';

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
  // Fase 6: Métricas Avanzadas
  modelUsage?: ModelUsageStats;
  topQueries?: Array<{ query: string; count: number }>;
  escalations?: EscalationStats;
}

// Fase 6: Métricas Avanzadas - Nuevos tipos
export interface ModelUsageStats {
  haiku: number;
  sonnet: number;
  haikuPercent: number;
  sonnetPercent: number;
  avgHaikuTimeMs: number;
  avgSonnetTimeMs: number;
}

export interface EscalationStats {
  total: number;
  byReason: {
    complex_query: number;
    user_request: number;
    sentiment_negative: number;
    repeated_question: number;
    booking_issue: number;
    other: number;
  };
  avgTimeToEscalate: number;
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
  // Fase 6: Métricas Avanzadas
  models: (date: string) => `agent:models:${date}`,
  queries: (date: string) => `agent:queries:${date}`,
  escalations: (date: string) => `agent:escalations:${date}`,
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
  // FASE 6: MÉTRICAS AVANZADAS - INCREMENT METHODS
  // --------------------------------------------------------------------------

  /**
   * Track model usage (Haiku vs Sonnet vs GPT-4.1-mini)
   */
  async trackModelUsage(
    model: 'haiku' | 'sonnet' | 'gpt4mini',
    responseTimeMs: number
  ): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    await Promise.all([
      this.redis.hincrby(KEYS.models(date), `${model}_calls`, 1),
      this.redis.hincrby(KEYS.models(date), `${model}_time_total`, responseTimeMs),
    ]);

    // Set expiry
    await this.redis.expire(KEYS.models(date), 90 * 24 * 60 * 60);
  }

  /**
   * Track user query for frequency analysis
   */
  async trackQuery(queryType: string, rawQuery?: string): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    // Track query type
    await this.redis.hincrby(KEYS.queries(date), queryType, 1);

    // If raw query provided, store for analysis (top 100)
    if (rawQuery) {
      const normalizedQuery = rawQuery.toLowerCase().trim().slice(0, 100);
      await this.redis.zincrby(`${KEYS.queries(date)}:raw`, 1, normalizedQuery);
      await this.redis.zremrangebyrank(`${KEYS.queries(date)}:raw`, 0, -101);
    }

    await this.redis.expire(KEYS.queries(date), 90 * 24 * 60 * 60);
  }

  /**
   * Track escalation event
   */
  async trackEscalation(
    reason:
      | 'complex_query'
      | 'user_request'
      | 'sentiment_negative'
      | 'repeated_question'
      | 'booking_issue'
      | 'other',
    timeToEscalateMs?: number
  ): Promise<void> {
    if (!this.redis) return;

    const date = this.getToday();

    await Promise.all([
      this.redis.hincrby(KEYS.escalations(date), 'total', 1),
      this.redis.hincrby(KEYS.escalations(date), `reason_${reason}`, 1),
    ]);

    if (timeToEscalateMs) {
      await this.redis.rpush(`${KEYS.escalations(date)}:times`, timeToEscalateMs.toString());
      await this.redis.ltrim(`${KEYS.escalations(date)}:times`, -100, -1);
    }

    await this.redis.expire(KEYS.escalations(date), 90 * 24 * 60 * 60);
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

  // --------------------------------------------------------------------------
  // FASE 6: MÉTRICAS AVANZADAS - RETRIEVAL METHODS
  // --------------------------------------------------------------------------

  /**
   * Get model usage stats for a date
   */
  async getModelUsageStats(date: string): Promise<ModelUsageStats> {
    if (!this.redis) {
      return this.emptyModelUsageStats();
    }

    const rawData = await this.redis.hgetall(KEYS.models(date));
    const data = rawData || {};

    const haikuCalls = parseInt(String(data['haiku_calls'] || '0'));
    const sonnetCalls = parseInt(String(data['sonnet_calls'] || '0'));
    const haikuTimeTotal = parseInt(String(data['haiku_time_total'] || '0'));
    const sonnetTimeTotal = parseInt(String(data['sonnet_time_total'] || '0'));
    const totalCalls = haikuCalls + sonnetCalls;

    return {
      haiku: haikuCalls,
      sonnet: sonnetCalls,
      haikuPercent: totalCalls > 0 ? Math.round((haikuCalls / totalCalls) * 100) : 0,
      sonnetPercent: totalCalls > 0 ? Math.round((sonnetCalls / totalCalls) * 100) : 0,
      avgHaikuTimeMs: haikuCalls > 0 ? Math.round(haikuTimeTotal / haikuCalls) : 0,
      avgSonnetTimeMs: sonnetCalls > 0 ? Math.round(sonnetTimeTotal / sonnetCalls) : 0,
    };
  }

  /**
   * Get top queries for a date
   */
  async getTopQueries(
    date: string,
    limit: number = 10
  ): Promise<Array<{ query: string; count: number }>> {
    if (!this.redis) {
      return [];
    }

    // Get query type counts
    const rawData = await this.redis.hgetall(KEYS.queries(date));
    const data = rawData || {};

    const queries = Object.entries(data)
      .map(([query, count]) => ({ query, count: parseInt(String(count)) }))
      .filter(q => q.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return queries;
  }

  /**
   * Get escalation stats for a date
   */
  async getEscalationStats(date: string): Promise<EscalationStats> {
    if (!this.redis) {
      return this.emptyEscalationStats();
    }

    const [rawData, times] = await Promise.all([
      this.redis.hgetall(KEYS.escalations(date)),
      this.redis.lrange(`${KEYS.escalations(date)}:times`, 0, -1),
    ]);

    const data = rawData || {};
    const timesArr = times || [];

    const avgTimeToEscalate =
      timesArr.length > 0
        ? Math.round(timesArr.reduce((sum, t) => sum + parseInt(String(t)), 0) / timesArr.length)
        : 0;

    return {
      total: parseInt(String(data['total'] || '0')),
      byReason: {
        complex_query: parseInt(String(data['reason_complex_query'] || '0')),
        user_request: parseInt(String(data['reason_user_request'] || '0')),
        sentiment_negative: parseInt(String(data['reason_sentiment_negative'] || '0')),
        repeated_question: parseInt(String(data['reason_repeated_question'] || '0')),
        booking_issue: parseInt(String(data['reason_booking_issue'] || '0')),
        other: parseInt(String(data['reason_other'] || '0')),
      },
      avgTimeToEscalate,
    };
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

    // Fase 6: Aggregate model usage
    const modelData = await Promise.all(dates.map(date => this.getModelUsageStats(date)));
    const modelUsage = modelData.reduce(
      (acc, m) => ({
        haiku: acc.haiku + m.haiku,
        sonnet: acc.sonnet + m.sonnet,
        haikuPercent: 0,
        sonnetPercent: 0,
        avgHaikuTimeMs: acc.avgHaikuTimeMs + m.avgHaikuTimeMs,
        avgSonnetTimeMs: acc.avgSonnetTimeMs + m.avgSonnetTimeMs,
      }),
      this.emptyModelUsageStats()
    );
    const totalModelCalls = modelUsage.haiku + modelUsage.sonnet;
    modelUsage.haikuPercent =
      totalModelCalls > 0 ? Math.round((modelUsage.haiku / totalModelCalls) * 100) : 0;
    modelUsage.sonnetPercent =
      totalModelCalls > 0 ? Math.round((modelUsage.sonnet / totalModelCalls) * 100) : 0;
    const daysWithHaiku = modelData.filter(m => m.haiku > 0).length;
    const daysWithSonnet = modelData.filter(m => m.sonnet > 0).length;
    modelUsage.avgHaikuTimeMs =
      daysWithHaiku > 0 ? Math.round(modelUsage.avgHaikuTimeMs / daysWithHaiku) : 0;
    modelUsage.avgSonnetTimeMs =
      daysWithSonnet > 0 ? Math.round(modelUsage.avgSonnetTimeMs / daysWithSonnet) : 0;

    // Fase 6: Aggregate top queries (just get latest day's queries for simplicity)
    const topQueries = await this.getTopQueries(to, 10);

    // Fase 6: Aggregate escalations
    const escalationData = await Promise.all(dates.map(date => this.getEscalationStats(date)));
    const escalations = escalationData.reduce(
      (acc, e) => ({
        total: acc.total + e.total,
        byReason: {
          complex_query: acc.byReason.complex_query + e.byReason.complex_query,
          user_request: acc.byReason.user_request + e.byReason.user_request,
          sentiment_negative: acc.byReason.sentiment_negative + e.byReason.sentiment_negative,
          repeated_question: acc.byReason.repeated_question + e.byReason.repeated_question,
          booking_issue: acc.byReason.booking_issue + e.byReason.booking_issue,
          other: acc.byReason.other + e.byReason.other,
        },
        avgTimeToEscalate: acc.avgTimeToEscalate + e.avgTimeToEscalate,
      }),
      this.emptyEscalationStats()
    );
    const daysWithEscalations = escalationData.filter(e => e.total > 0).length;
    escalations.avgTimeToEscalate =
      daysWithEscalations > 0 ? Math.round(escalations.avgTimeToEscalate / daysWithEscalations) : 0;

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
      // Fase 6: Nuevas métricas
      modelUsage,
      topQueries,
      escalations,
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

  private emptyModelUsageStats(): ModelUsageStats {
    return {
      haiku: 0,
      sonnet: 0,
      haikuPercent: 0,
      sonnetPercent: 0,
      avgHaikuTimeMs: 0,
      avgSonnetTimeMs: 0,
    };
  }

  private emptyEscalationStats(): EscalationStats {
    return {
      total: 0,
      byReason: {
        complex_query: 0,
        user_request: 0,
        sentiment_negative: 0,
        repeated_question: 0,
        booking_issue: 0,
        other: 0,
      },
      avgTimeToEscalate: 0,
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
