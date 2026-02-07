/**
 * Whapi.cloud Integration Module
 *
 * Unified exports for Whapi.cloud functionality:
 * - Client: Base API client
 * - Groups: WhatsApp group management
 * - Contacts: Contact info and validation
 * - Labels: Chat organization labels
 *
 * @see AGENTE.md - Fase 5: Grupos WhatsApp
 */

// Client
export {
  WhapiClient,
  getWhapiClient,
  formatPhoneForWhapi,
  phoneToChatId,
  groupToChatId,
  type WhapiConfig,
  type WhapiResponse,
  type WhapiRequestOptions,
} from './client';

// Groups
export {
  GroupsManager,
  getGroupsManager,
  type GroupInfo,
  type GroupParticipant,
  type CreateGroupOptions,
  type GroupMessageOptions,
  type ClassGroupMapping,
} from './groups';

// Contacts
export {
  ContactsManager,
  getContactsManager,
  type ContactInfo,
  type ContactCheckResult,
  type SaveContactOptions,
} from './contacts';

// Labels
export {
  LabelsManager,
  getLabelsManager,
  type Label,
  type LabelColor,
  type LabelAssignment,
  type PredefinedLabels,
} from './labels';
