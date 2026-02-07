/**
 * WhatsApp Contacts Management via Whapi.cloud
 *
 * Manages WhatsApp contacts:
 * - Get contact info (name, profile picture, status)
 * - Check if number is on WhatsApp
 * - Save contacts to phone book
 * - Block/unblock contacts
 *
 * @see AGENTE.md - Gestión de contactos
 */

import { getWhapiClient, phoneToChatId, formatPhoneForWhapi, type WhapiResponse } from './client';
import type { Redis } from '@upstash/redis';

// ============================================================================
// TYPES
// ============================================================================

export interface ContactInfo {
  phone: string;
  name?: string;
  pushName?: string; // WhatsApp display name
  profilePicture?: string;
  status?: string;
  isOnWhatsApp: boolean;
  isBusiness?: boolean;
  businessName?: string;
}

export interface ContactCheckResult {
  phone: string;
  isOnWhatsApp: boolean;
  chatId?: string;
}

export interface SaveContactOptions {
  phone: string;
  firstName: string;
  lastName?: string;
  company?: string;
}

// ============================================================================
// REDIS KEYS
// ============================================================================

const KEYS = {
  contactCache: (phone: string) => `whapi:contacts:${formatPhoneForWhapi(phone)}`,
  whatsappCheck: (phone: string) => `whapi:wa_check:${formatPhoneForWhapi(phone)}`,
};

const CONTACT_CACHE_TTL = 24 * 60 * 60; // 24 hours
const WA_CHECK_TTL = 7 * 24 * 60 * 60; // 7 days

// ============================================================================
// CONTACTS MANAGER
// ============================================================================

export class ContactsManager {
  private client = getWhapiClient();
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  // --------------------------------------------------------------------------
  // CONTACT INFORMATION
  // --------------------------------------------------------------------------

  /**
   * Get contact information
   */
  async getContactInfo(phone: string): Promise<WhapiResponse<ContactInfo>> {
    const normalizedPhone = formatPhoneForWhapi(phone);

    // Check cache first
    const cached = await this.getCachedContact(normalizedPhone);
    if (cached) {
      return { success: true, data: cached };
    }

    const chatId = phoneToChatId(phone);

    const result = await this.client.get<{
      id: string;
      name?: string;
      pushname?: string;
      profilePicUrl?: string;
      status?: string;
      isBusiness?: boolean;
      businessProfile?: { name?: string };
    }>(`/contacts/${encodeURIComponent(chatId)}`);

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const contactInfo: ContactInfo = {
      phone: normalizedPhone,
      name: result.data.name,
      pushName: result.data.pushname,
      profilePicture: result.data.profilePicUrl,
      status: result.data.status,
      isOnWhatsApp: true,
      isBusiness: result.data.isBusiness,
      businessName: result.data.businessProfile?.name,
    };

    // Cache the result
    await this.cacheContact(normalizedPhone, contactInfo);

    return {
      success: true,
      data: contactInfo,
    };
  }

  /**
   * Get contact profile picture URL
   */
  async getProfilePicture(phone: string): Promise<WhapiResponse<string | null>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.get<{ url?: string }>(
      `/contacts/${encodeURIComponent(chatId)}/profile-picture`
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.data?.url || null,
    };
  }

  // --------------------------------------------------------------------------
  // WHATSAPP VALIDATION
  // --------------------------------------------------------------------------

  /**
   * Check if a phone number is on WhatsApp
   */
  async checkWhatsApp(phone: string): Promise<WhapiResponse<ContactCheckResult>> {
    const normalizedPhone = formatPhoneForWhapi(phone);

    // Check cache first
    const cached = await this.getCachedWhatsAppCheck(normalizedPhone);
    if (cached !== null) {
      return {
        success: true,
        data: {
          phone: normalizedPhone,
          isOnWhatsApp: cached,
          chatId: cached ? phoneToChatId(phone) : undefined,
        },
      };
    }

    const result = await this.client.post<{
      contacts: Array<{ input: string; wa_id?: string }>;
    }>('/contacts/check', {
      contacts: [normalizedPhone],
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const contact = result.data.contacts?.[0];
    const isOnWhatsApp = !!contact?.wa_id;

    // Cache the result
    await this.cacheWhatsAppCheck(normalizedPhone, isOnWhatsApp);

    return {
      success: true,
      data: {
        phone: normalizedPhone,
        isOnWhatsApp,
        chatId: isOnWhatsApp ? `${contact?.wa_id}@s.whatsapp.net` : undefined,
      },
    };
  }

  /**
   * Check multiple phone numbers at once
   */
  async checkMultipleWhatsApp(phones: string[]): Promise<WhapiResponse<ContactCheckResult[]>> {
    const normalizedPhones = phones.map(formatPhoneForWhapi);

    const result = await this.client.post<{
      contacts: Array<{ input: string; wa_id?: string }>;
    }>('/contacts/check', {
      contacts: normalizedPhones,
    });

    if (!result.success || !result.data) {
      return {
        success: false,
        error: result.error,
      };
    }

    const results: ContactCheckResult[] = result.data.contacts.map(contact => {
      const isOnWhatsApp = !!contact.wa_id;

      // Cache each result
      this.cacheWhatsAppCheck(contact.input, isOnWhatsApp);

      return {
        phone: contact.input,
        isOnWhatsApp,
        chatId: isOnWhatsApp ? `${contact.wa_id}@s.whatsapp.net` : undefined,
      };
    });

    return {
      success: true,
      data: results,
    };
  }

  // --------------------------------------------------------------------------
  // CONTACT MANAGEMENT
  // --------------------------------------------------------------------------

  /**
   * Save contact to phone book
   */
  async saveContact(options: SaveContactOptions): Promise<WhapiResponse<void>> {
    const { phone, firstName, lastName, company } = options;

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;

    const result = await this.client.post('/contacts', {
      phone: formatPhoneForWhapi(phone),
      name: fullName,
      company,
    });

    if (result.success) {
      console.log(`[contacts] Saved contact: ${fullName} (${phone.slice(-4)})`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Block a contact
   */
  async blockContact(phone: string): Promise<WhapiResponse<void>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.post(`/contacts/${encodeURIComponent(chatId)}/block`);

    if (result.success) {
      console.log(`[contacts] Blocked: ${phone.slice(-4)}`);
    }

    return result as WhapiResponse<void>;
  }

  /**
   * Unblock a contact
   */
  async unblockContact(phone: string): Promise<WhapiResponse<void>> {
    const chatId = phoneToChatId(phone);

    const result = await this.client.post(`/contacts/${encodeURIComponent(chatId)}/unblock`);

    if (result.success) {
      console.log(`[contacts] Unblocked: ${phone.slice(-4)}`);
    }

    return result as WhapiResponse<void>;
  }

  // --------------------------------------------------------------------------
  // CACHING
  // --------------------------------------------------------------------------

  /**
   * Get cached contact info
   */
  private async getCachedContact(phone: string): Promise<ContactInfo | null> {
    if (!this.redis) return null;

    const cached = await this.redis.get(KEYS.contactCache(phone));
    if (!cached) return null;

    // Handle both string and object returns from Upstash
    if (typeof cached === 'object') {
      return cached as ContactInfo;
    }
    return JSON.parse(String(cached)) as ContactInfo;
  }

  /**
   * Cache contact info
   */
  private async cacheContact(phone: string, info: ContactInfo): Promise<void> {
    if (!this.redis) return;

    await this.redis.setex(KEYS.contactCache(phone), CONTACT_CACHE_TTL, JSON.stringify(info));
  }

  /**
   * Get cached WhatsApp check result
   */
  private async getCachedWhatsAppCheck(phone: string): Promise<boolean | null> {
    if (!this.redis) return null;

    const cached = await this.redis.get(KEYS.whatsappCheck(phone));
    if (cached === null) return null;

    return cached === 'true';
  }

  /**
   * Cache WhatsApp check result
   */
  private async cacheWhatsAppCheck(phone: string, isOnWhatsApp: boolean): Promise<void> {
    if (!this.redis) return;

    await this.redis.setex(KEYS.whatsappCheck(phone), WA_CHECK_TTL, isOnWhatsApp.toString());
  }

  /**
   * Clear contact cache
   */
  async clearCache(phone: string): Promise<void> {
    if (!this.redis) return;

    const normalizedPhone = formatPhoneForWhapi(phone);
    await this.redis.del(KEYS.contactCache(normalizedPhone));
    await this.redis.del(KEYS.whatsappCheck(normalizedPhone));
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let contactsManagerInstance: ContactsManager | null = null;

export function getContactsManager(redis: Redis | null = null): ContactsManager {
  if (!contactsManagerInstance || redis) {
    contactsManagerInstance = new ContactsManager(redis);
  }
  return contactsManagerInstance;
}
