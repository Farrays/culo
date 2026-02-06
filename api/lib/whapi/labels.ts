/**
 * WhatsApp Labels Management via Whapi.cloud
 *
 * Manages WhatsApp Business labels for chat organization:
 * - Create/delete labels
 * - Assign labels to chats
 * - Filter chats by label
 *
 * Use cases:
 * - "Lead Caliente" - Hot leads ready to convert
 * - "Miembro Activo" - Current active members
 * - "Inactivo 30d" - Members inactive for 30+ days
 * - "VIP" - High-value customers
 *
 * @see AGENTE.md - Gestión de labels
 */

import { getWhapiClient, phoneToChatId, type WhapiResponse } from './client';
import type { Redis } from '@upstash/redis';
import type { LeadTier } from '../ai/lead-scorer';

// ============================================================================
// TYPES
// ============================================================================

export interface Label {
  id: string;
  name: string;
  color: LabelColor;
  chatCount?: number;
}

export type LabelColor =
  | 'gray'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'pink';

export interface LabelAssignment {
  chatId: string;
  labelId: string;
  assignedAt: string;
}

// Predefined labels for the dance center
export interface PredefinedLabels {
  leadHot: string;
  leadWarm: string;
  leadCold: string;
  memberActive: string;
  memberInactive: string;
  vip: string;
  needsFollowUp: string;
  converted: string;
}

// ============================================================================
// REDIS KEYS
// ============================================================================

const KEYS = {
  labels: 'whapi:labels',
  predefined: 'whapi:labels:predefined',
  chatLabels: (chatId: string) => `whapi:chat_labels:${chatId}`,
  labelChats: (labelId: string) => `whapi:label_chats:${labelId}`,
};

// ============================================================================
// DEFAULT LABELS
// ============================================================================

const DEFAULT_LABELS: Array<{ name: string; color: LabelColor; key: keyof PredefinedLabels }> = [
  { name: '🔥 Lead Caliente', color: 'red', key: 'leadHot' },
  { name: '🌡️ Lead Templado', color: 'orange', key: 'leadWarm' },
  { name: '❄️ Lead Frío', color: 'blue', key: 'leadCold' },
  { name: '✅ Miembro Activo', color: 'green', key: 'memberActive' },
  { name: '😴 Inactivo 30d', color: 'gray', key: 'memberInactive' },
  { name: '⭐ VIP', color: 'purple', key: 'vip' },
  { name: '📞 Pendiente Seguimiento', color: 'yellow', key: 'needsFollowUp' },
  { name: '🎉 Convertido', color: 'cyan', key: 'converted' },
];

// ============================================================================
// LABELS MANAGER
// ============================================================================

export class LabelsManager {
  private client = getWhapiClient();
  private redis: Redis | null;
  private predefinedLabels: PredefinedLabels | null = null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  // --------------------------------------------------------------------------
  // LABEL OPERATIONS
  // --------------------------------------------------------------------------

  /**
   * Get all labels
   */
  async getLabels(): Promise<WhapiResponse<Label[]>> {
    const result = await this.client.get<{ labels: Label[] }>('/labels');

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data.labels || [],
    };
  }

  /**
   * Create a new label
   */
  async createLabel(name: string, color: LabelColor = 'gray'): Promise<WhapiResponse<Label>> {
    const result = await this.client.post<Label>('/labels', {
      name,
      color,
    });

    if (result.success && result.data) {
      // Cache in Redis
      await this.cacheLabel(result.data);
      console.log(`[labels] Created label: ${name}`);
    }

    return result;
  }

  /**
   * Delete a label
   */
  async deleteLabel(labelId: string): Promise<WhapiResponse<void>> {
    const result = await this.client.delete(`/labels/${labelId}`);

    if (result.success) {
      await this.removeCachedLabel(labelId);
      console.log(`[labels] Deleted label: ${labelId}`);
    }

    return result as WhapiResponse<void>;
  }

  // --------------------------------------------------------------------------
  // LABEL ASSIGNMENTS
  // --------------------------------------------------------------------------

  /**
   * Assign label to a chat
   */
  async assignLabel(phone: string, labelId: string): Promise<WhapiResponse<void>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.post(`/labels/${labelId}/chats`, {
      chatId,
    });

    if (result.success) {
      await this.trackAssignment(chatId, labelId, 'add');
      console.log(`[labels] Assigned label ${labelId} to ${phone.slice(-4)}`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Remove label from a chat
   */
  async removeLabel(phone: string, labelId: string): Promise<WhapiResponse<void>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.delete(
      `/labels/${labelId}/chats/${encodeURIComponent(chatId)}`
    );

    if (result.success) {
      await this.trackAssignment(chatId, labelId, 'remove');
      console.log(`[labels] Removed label ${labelId} from ${phone.slice(-4)}`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Get labels for a chat
   */
  async getChatLabels(phone: string): Promise<WhapiResponse<Label[]>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.get<{ labels: Label[] }>(
      `/chats/${encodeURIComponent(chatId)}/labels`
    );

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data.labels || [],
    };
  }

  /**
   * Get all chats with a specific label
   */
  async getChatsWithLabel(labelId: string): Promise<WhapiResponse<string[]>> {
    const result = await this.client.get<{ chats: Array<{ id: string }> }>(
      `/labels/${labelId}/chats`
    );

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const chatIds = result.data.chats?.map(c => c.id) || [];

    return {
      success: true,
      data: chatIds,
    };
  }

  // --------------------------------------------------------------------------
  // PREDEFINED LABELS
  // --------------------------------------------------------------------------

  /**
   * Initialize predefined labels for the dance center
   */
  async initializePredefinedLabels(): Promise<WhapiResponse<PredefinedLabels>> {
    // Check if already cached
    if (this.predefinedLabels) {
      return { success: true, data: this.predefinedLabels };
    }

    // Check Redis cache
    const cached = await this.getCachedPredefinedLabels();
    if (cached) {
      this.predefinedLabels = cached;
      return { success: true, data: cached };
    }

    // Get existing labels
    const existingResult = await this.getLabels();
    const existingLabels = existingResult.data || [];

    const predefined: Partial<PredefinedLabels> = {};

    // Create or find each default label
    for (const defaultLabel of DEFAULT_LABELS) {
      const existing = existingLabels.find(l => l.name === defaultLabel.name);

      if (existing) {
        predefined[defaultLabel.key] = existing.id;
      } else {
        const createResult = await this.createLabel(defaultLabel.name, defaultLabel.color);
        if (createResult.success && createResult.data) {
          predefined[defaultLabel.key] = createResult.data.id;
        }
      }
    }

    // Cache the result
    this.predefinedLabels = predefined as PredefinedLabels;
    await this.cachePredefinedLabels(this.predefinedLabels);

    return {
      success: true,
      data: this.predefinedLabels,
    };
  }

  /**
   * Get predefined labels (initialize if needed)
   */
  async getPredefinedLabels(): Promise<PredefinedLabels | null> {
    if (this.predefinedLabels) {
      return this.predefinedLabels;
    }

    const result = await this.initializePredefinedLabels();
    return result.data || null;
  }

  // --------------------------------------------------------------------------
  // CONVENIENCE METHODS
  // --------------------------------------------------------------------------

  /**
   * Set lead tier label (removes other tier labels first)
   */
  async setLeadTierLabel(phone: string, tier: LeadTier): Promise<WhapiResponse<void>> {
    const labels = await this.getPredefinedLabels();
    if (!labels) {
      return {
        success: false,
        error: { code: 'NO_LABELS', message: 'Predefined labels not initialized' },
      };
    }

    const chatId = phoneToChatId(phone);

    // Remove existing tier labels
    const tierLabels = [labels.leadHot, labels.leadWarm, labels.leadCold];
    for (const labelId of tierLabels) {
      if (labelId) {
        await this.trackAssignment(chatId, labelId, 'remove');
        await this.client.delete(`/labels/${labelId}/chats/${encodeURIComponent(chatId)}`);
      }
    }

    // Add new tier label
    const newLabelId =
      tier === 'hot' ? labels.leadHot : tier === 'warm' ? labels.leadWarm : labels.leadCold;

    if (newLabelId) {
      return this.assignLabel(phone, newLabelId);
    }

    return { success: true };
  }

  /**
   * Mark chat as converted
   */
  async markConverted(phone: string): Promise<WhapiResponse<void>> {
    const labels = await this.getPredefinedLabels();
    if (!labels?.converted) {
      return {
        success: false,
        error: { code: 'NO_LABELS', message: 'Converted label not found' },
      };
    }

    return this.assignLabel(phone, labels.converted);
  }

  /**
   * Mark chat as needing follow-up
   */
  async markNeedsFollowUp(phone: string): Promise<WhapiResponse<void>> {
    const labels = await this.getPredefinedLabels();
    if (!labels?.needsFollowUp) {
      return {
        success: false,
        error: { code: 'NO_LABELS', message: 'Follow-up label not found' },
      };
    }

    return this.assignLabel(phone, labels.needsFollowUp);
  }

  /**
   * Mark as active member
   */
  async markActiveMember(phone: string): Promise<WhapiResponse<void>> {
    const labels = await this.getPredefinedLabels();
    if (!labels?.memberActive) {
      return {
        success: false,
        error: { code: 'NO_LABELS', message: 'Active member label not found' },
      };
    }

    // Remove inactive label if present
    if (labels.memberInactive) {
      await this.removeLabel(phone, labels.memberInactive);
    }

    return this.assignLabel(phone, labels.memberActive);
  }

  /**
   * Mark as inactive member
   */
  async markInactiveMember(phone: string): Promise<WhapiResponse<void>> {
    const labels = await this.getPredefinedLabels();
    if (!labels?.memberInactive) {
      return {
        success: false,
        error: { code: 'NO_LABELS', message: 'Inactive member label not found' },
      };
    }

    // Remove active label if present
    if (labels.memberActive) {
      await this.removeLabel(phone, labels.memberActive);
    }

    return this.assignLabel(phone, labels.memberInactive);
  }

  // --------------------------------------------------------------------------
  // CACHING
  // --------------------------------------------------------------------------

  private async cacheLabel(label: Label): Promise<void> {
    if (!this.redis) return;
    await this.redis.hset(KEYS.labels, { [label.id]: JSON.stringify(label) });
  }

  private async removeCachedLabel(labelId: string): Promise<void> {
    if (!this.redis) return;
    await this.redis.hdel(KEYS.labels, labelId);
  }

  private async getCachedPredefinedLabels(): Promise<PredefinedLabels | null> {
    if (!this.redis) return null;
    const data = await this.redis.get(KEYS.predefined);
    if (!data) return null;
    // Handle both string and object returns from Upstash
    if (typeof data === 'object') {
      return data as PredefinedLabels;
    }
    return JSON.parse(String(data)) as PredefinedLabels;
  }

  private async cachePredefinedLabels(labels: PredefinedLabels): Promise<void> {
    if (!this.redis) return;
    await this.redis.set(KEYS.predefined, JSON.stringify(labels));
  }

  private async trackAssignment(
    chatId: string,
    labelId: string,
    action: 'add' | 'remove'
  ): Promise<void> {
    if (!this.redis) return;

    if (action === 'add') {
      await this.redis.sadd(KEYS.chatLabels(chatId), labelId);
      await this.redis.sadd(KEYS.labelChats(labelId), chatId);
    } else {
      await this.redis.srem(KEYS.chatLabels(chatId), labelId);
      await this.redis.srem(KEYS.labelChats(labelId), chatId);
    }
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let labelsManagerInstance: LabelsManager | null = null;

export function getLabelsManager(redis: Redis | null = null): LabelsManager {
  if (!labelsManagerInstance || redis) {
    labelsManagerInstance = new LabelsManager(redis);
  }
  return labelsManagerInstance;
}
