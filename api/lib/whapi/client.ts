/**
 * Whapi.cloud API Client
 *
 * Unified client for Whapi.cloud API interactions:
 * - Groups management (create, add members, send messages)
 * - Contacts management (get info, save contacts)
 * - Labels management (create, assign to chats)
 * - Stories (view, post)
 *
 * Whapi.cloud is used alongside WhatsApp Cloud API to provide
 * features not available in the official API (groups, labels, etc.)
 *
 * @see https://whapi.cloud/docs
 * @see AGENTE.md - Integración Whapi.cloud
 */

// ============================================================================
// TYPES
// ============================================================================

export interface WhapiConfig {
  apiKey: string;
  baseUrl: string;
}

export interface WhapiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface WhapiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

// ============================================================================
// WHAPI CLIENT
// ============================================================================

export class WhapiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config?: Partial<WhapiConfig>) {
    this.apiKey = config?.apiKey || process.env['WHAPI_API_KEY'] || '';
    this.baseUrl = config?.baseUrl || process.env['WHAPI_BASE_URL'] || 'https://gate.whapi.cloud';

    if (!this.apiKey) {
      console.warn('[whapi] WHAPI_API_KEY not configured');
    }
  }

  /**
   * Check if client is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Make API request to Whapi.cloud
   */
  async request<T = unknown>(options: WhapiRequestOptions): Promise<WhapiResponse<T>> {
    if (!this.apiKey) {
      return {
        success: false,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'WHAPI_API_KEY not configured',
        },
      };
    }

    const { method, endpoint, body, params } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('[whapi] API error:', responseData);
        return {
          success: false,
          error: {
            code: responseData.error?.code || 'API_ERROR',
            message: responseData.error?.message || `HTTP ${response.status}`,
          },
        };
      }

      return {
        success: true,
        data: responseData as T,
      };
    } catch (error) {
      console.error('[whapi] Request error:', error);
      return {
        success: false,
        error: {
          code: 'REQUEST_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // --------------------------------------------------------------------------
  // CONVENIENCE METHODS
  // --------------------------------------------------------------------------

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<WhapiResponse<T>> {
    return this.request<T>({ method: 'GET', endpoint, params });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<WhapiResponse<T>> {
    return this.request<T>({ method: 'POST', endpoint, body });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<WhapiResponse<T>> {
    return this.request<T>({ method: 'PUT', endpoint, body });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    body?: Record<string, unknown>
  ): Promise<WhapiResponse<T>> {
    return this.request<T>({ method: 'PATCH', endpoint, body });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(endpoint: string): Promise<WhapiResponse<T>> {
    return this.request<T>({ method: 'DELETE', endpoint });
  }

  // --------------------------------------------------------------------------
  // HEALTH CHECK
  // --------------------------------------------------------------------------

  /**
   * Check API connection and get account info
   */
  async healthCheck(): Promise<WhapiResponse<{ connected: boolean; phone?: string }>> {
    const result = await this.get<{ phone: string }>('/settings');

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          connected: true,
          phone: result.data.phone,
        },
      };
    }

    return {
      success: false,
      data: { connected: false },
      error: result.error,
    };
  }
}

// ============================================================================
// SINGLETON
// ============================================================================

let clientInstance: WhapiClient | null = null;

/**
 * Get singleton Whapi client
 */
export function getWhapiClient(config?: Partial<WhapiConfig>): WhapiClient {
  if (!clientInstance || config) {
    clientInstance = new WhapiClient(config);
  }
  return clientInstance;
}

// ============================================================================
// PHONE UTILITIES
// ============================================================================

/**
 * Format phone number for WhatsApp (remove + and spaces)
 */
export function formatPhoneForWhapi(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

/**
 * Convert phone to WhatsApp chat ID format
 */
export function phoneToChatId(phone: string): string {
  const cleaned = formatPhoneForWhapi(phone);
  return `${cleaned}@s.whatsapp.net`;
}

/**
 * Convert group ID to Whapi format
 */
export function groupToChatId(groupId: string): string {
  if (groupId.includes('@g.us')) {
    return groupId;
  }
  return `${groupId}@g.us`;
}
