/**
 * WhatsApp Groups Management via Whapi.cloud
 *
 * Manages WhatsApp groups for dance classes:
 * - Create groups for recurring classes
 * - Add/remove members based on bookings
 * - Send announcements and reminders
 * - Track group membership
 *
 * Use case: When a student books a recurring class (e.g., Bachata Mondays),
 * they get automatically added to the corresponding WhatsApp group.
 *
 * @see AGENTE.md - Grupos WhatsApp
 */

import {
  getWhapiClient,
  phoneToChatId,
  groupToChatId,
  formatPhoneForWhapi,
  type WhapiResponse,
} from './client';
import type { Redis } from '@upstash/redis';

// ============================================================================
// TYPES
// ============================================================================

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
  participantsCount: number;
  admins: string[];
  createdAt?: string;
}

export interface GroupParticipant {
  phone: string;
  isAdmin: boolean;
  joinedAt?: string;
}

export interface CreateGroupOptions {
  name: string;
  description?: string;
  participants?: string[]; // Phone numbers
}

export interface GroupMessageOptions {
  groupId: string;
  text: string;
  mentionAll?: boolean;
}

// Mapping: class style/day -> group ID
export interface ClassGroupMapping {
  classStyle: string; // e.g., "bachata"
  dayOfWeek: string; // e.g., "monday"
  groupId: string;
  groupName: string;
}

// ============================================================================
// REDIS KEYS
// ============================================================================

const KEYS = {
  groupMapping: 'whapi:groups:mapping',
  groupMembers: (groupId: string) => `whapi:groups:${groupId}:members`,
  memberGroups: (phone: string) => `whapi:members:${formatPhoneForWhapi(phone)}:groups`,
};

// ============================================================================
// GROUPS MANAGER
// ============================================================================

export class GroupsManager {
  private client = getWhapiClient();
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  // --------------------------------------------------------------------------
  // GROUP OPERATIONS
  // --------------------------------------------------------------------------

  /**
   * Create a new WhatsApp group
   */
  async createGroup(options: CreateGroupOptions): Promise<WhapiResponse<GroupInfo>> {
    const { name, description, participants = [] } = options;

    // Format phone numbers
    const formattedParticipants = participants.map(phoneToChatId);

    const result = await this.client.post<{ id: string }>('/groups', {
      subject: name,
      description,
      participants: formattedParticipants,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const groupInfo: GroupInfo = {
      id: result.data.id,
      name,
      description,
      participantsCount: participants.length,
      admins: [],
      createdAt: new Date().toISOString(),
    };

    console.log(`[groups] Created group: ${name} (${result.data.id})`);

    return {
      success: true,
      data: groupInfo,
    };
  }

  /**
   * Get group info
   */
  async getGroupInfo(groupId: string): Promise<WhapiResponse<GroupInfo>> {
    const chatId = groupToChatId(groupId);
    const result = await this.client.get<{
      id: string;
      name: string;
      description: string;
      participants: Array<{ id: string; admin: boolean }>;
    }>(`/groups/${encodeURIComponent(chatId)}`);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const data = result.data;
    return {
      success: true,
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        participantsCount: data.participants?.length || 0,
        admins: data.participants?.filter(p => p.admin).map(p => p.id) || [],
      },
    };
  }

  /**
   * Add participant to group
   */
  async addParticipant(groupId: string, phone: string): Promise<WhapiResponse<void>> {
    const chatId = groupToChatId(groupId);
    const participantId = phoneToChatId(phone);

    const result = await this.client.post(`/groups/${encodeURIComponent(chatId)}/participants`, {
      participants: [participantId],
    });

    if (result.success) {
      // Track in Redis
      await this.trackMembership(groupId, phone, 'add');
      console.log(`[groups] Added ${phone.slice(-4)} to group ${groupId}`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Remove participant from group
   */
  async removeParticipant(groupId: string, phone: string): Promise<WhapiResponse<void>> {
    const chatId = groupToChatId(groupId);
    const participantId = phoneToChatId(phone);

    const result = await this.client.delete(
      `/groups/${encodeURIComponent(chatId)}/participants/${encodeURIComponent(participantId)}`
    );

    if (result.success) {
      // Track in Redis
      await this.trackMembership(groupId, phone, 'remove');
      console.log(`[groups] Removed ${phone.slice(-4)} from group ${groupId}`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Send message to group
   */
  async sendMessage(options: GroupMessageOptions): Promise<WhapiResponse<{ messageId: string }>> {
    const { groupId, text, mentionAll = false } = options;
    const chatId = groupToChatId(groupId);

    const body: Record<string, unknown> = {
      to: chatId,
      body: text,
    };

    if (mentionAll) {
      body['mentions'] = ['all'];
    }

    return this.client.post<{ messageId: string }>('/messages/text', body);
  }

  /**
   * Update group description
   */
  async updateDescription(groupId: string, description: string): Promise<WhapiResponse<void>> {
    const chatId = groupToChatId(groupId);

    return this.client.patch(`/groups/${encodeURIComponent(chatId)}`, {
      description,
    }) as Promise<WhapiResponse<void>>;
  }

  /**
   * Get group participants
   */
  async getParticipants(groupId: string): Promise<WhapiResponse<GroupParticipant[]>> {
    const chatId = groupToChatId(groupId);

    const result = await this.client.get<{
      participants: Array<{ id: string; admin: boolean }>;
    }>(`/groups/${encodeURIComponent(chatId)}`);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const participants: GroupParticipant[] =
      result.data.participants?.map(p => ({
        phone: p.id.replace('@s.whatsapp.net', ''),
        isAdmin: p.admin,
      })) || [];

    return {
      success: true,
      data: participants,
    };
  }

  // --------------------------------------------------------------------------
  // CLASS-GROUP MAPPING
  // --------------------------------------------------------------------------

  /**
   * Map a class to a WhatsApp group
   */
  async mapClassToGroup(mapping: ClassGroupMapping): Promise<void> {
    if (!this.redis) return;

    const key = `${mapping.classStyle}:${mapping.dayOfWeek}`.toLowerCase();
    await this.redis.hset(KEYS.groupMapping, { [key]: JSON.stringify(mapping) });

    console.log(`[groups] Mapped ${key} to group ${mapping.groupId}`);
  }

  /**
   * Get group for a class
   */
  async getGroupForClass(classStyle: string, dayOfWeek: string): Promise<ClassGroupMapping | null> {
    if (!this.redis) return null;

    const key = `${classStyle}:${dayOfWeek}`.toLowerCase();
    const data = await this.redis.hget(KEYS.groupMapping, key);

    if (!data) return null;

    // Handle both string and object returns from Upstash
    if (typeof data === 'object') {
      return data as ClassGroupMapping;
    }
    return JSON.parse(String(data)) as ClassGroupMapping;
  }

  /**
   * Get all class-group mappings
   */
  async getAllClassMappings(): Promise<ClassGroupMapping[]> {
    if (!this.redis) return [];

    const data = await this.redis.hgetall(KEYS.groupMapping);
    if (!data) return [];

    return Object.values(data).map(v => {
      if (typeof v === 'object') return v as ClassGroupMapping;
      return JSON.parse(String(v)) as ClassGroupMapping;
    });
  }

  // --------------------------------------------------------------------------
  // MEMBERSHIP TRACKING
  // --------------------------------------------------------------------------

  /**
   * Track group membership changes in Redis
   */
  private async trackMembership(
    groupId: string,
    phone: string,
    action: 'add' | 'remove'
  ): Promise<void> {
    if (!this.redis) return;

    const normalizedPhone = formatPhoneForWhapi(phone);

    if (action === 'add') {
      await this.redis.sadd(KEYS.groupMembers(groupId), normalizedPhone);
      await this.redis.sadd(KEYS.memberGroups(phone), groupId);
    } else {
      await this.redis.srem(KEYS.groupMembers(groupId), normalizedPhone);
      await this.redis.srem(KEYS.memberGroups(phone), groupId);
    }
  }

  /**
   * Check if member is in group
   */
  async isMemberInGroup(groupId: string, phone: string): Promise<boolean> {
    if (!this.redis) return false;

    const normalizedPhone = formatPhoneForWhapi(phone);
    const isMember = await this.redis.sismember(KEYS.groupMembers(groupId), normalizedPhone);

    return isMember === 1;
  }

  /**
   * Get all groups for a member
   */
  async getMemberGroups(phone: string): Promise<string[]> {
    if (!this.redis) return [];

    return this.redis.smembers(KEYS.memberGroups(phone));
  }

  // --------------------------------------------------------------------------
  // BOOKING INTEGRATION
  // --------------------------------------------------------------------------

  /**
   * Add member to appropriate group based on their booking
   * Called when a recurring booking is made
   */
  async addMemberForBooking(
    phone: string,
    classStyle: string,
    dayOfWeek: string
  ): Promise<WhapiResponse<void>> {
    // Find the group for this class
    const mapping = await this.getGroupForClass(classStyle, dayOfWeek);

    if (!mapping) {
      console.log(`[groups] No group mapped for ${classStyle}/${dayOfWeek}`);
      return {
        success: false,
        error: {
          code: 'NO_GROUP_MAPPING',
          message: `No group configured for ${classStyle} on ${dayOfWeek}`,
        },
      };
    }

    // Check if already a member
    const alreadyMember = await this.isMemberInGroup(mapping.groupId, phone);
    if (alreadyMember) {
      console.log(`[groups] ${phone.slice(-4)} already in group ${mapping.groupName}`);
      return { success: true };
    }

    // Add to group
    return this.addParticipant(mapping.groupId, phone);
  }

  /**
   * Remove member from appropriate group
   * Called when a recurring booking is cancelled
   */
  async removeMemberForBooking(
    phone: string,
    classStyle: string,
    dayOfWeek: string
  ): Promise<WhapiResponse<void>> {
    const mapping = await this.getGroupForClass(classStyle, dayOfWeek);

    if (!mapping) {
      return { success: true }; // No group, nothing to remove from
    }

    return this.removeParticipant(mapping.groupId, phone);
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let groupsManagerInstance: GroupsManager | null = null;

export function getGroupsManager(redis: Redis | null = null): GroupsManager {
  if (!groupsManagerInstance || redis) {
    groupsManagerInstance = new GroupsManager(redis);
  }
  return groupsManagerInstance;
}
