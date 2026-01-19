/**
 * Modal History Manager
 * Enterprise-grade solution for coordinating modal history state
 * Uses reference counting instead of a boolean flag to handle
 * edge cases where multiple modals might be open simultaneously.
 */

// Reference count of open modals
let openModalCount = 0;

// For backward compatibility with existing code
declare global {
  interface Window {
    __bookingModalOpen?: boolean;
  }
}

/**
 * Register a modal as open
 * Call this when a modal opens
 */
export function registerModalOpen(): void {
  openModalCount++;
  window.__bookingModalOpen = true;
}

/**
 * Register a modal as closed
 * Call this when a modal closes
 */
export function registerModalClose(): void {
  openModalCount = Math.max(0, openModalCount - 1);
  window.__bookingModalOpen = openModalCount > 0;
}

/**
 * Check if any modal is currently open
 * @returns true if at least one modal is open
 */
export function isAnyModalOpen(): boolean {
  return openModalCount > 0;
}

/**
 * Reset the modal state (useful for cleanup in tests or error recovery)
 */
export function resetModalState(): void {
  openModalCount = 0;
  window.__bookingModalOpen = false;
}

/**
 * Get the current open modal count (for debugging)
 * @returns number of currently open modals
 */
export function getOpenModalCount(): number {
  return openModalCount;
}
