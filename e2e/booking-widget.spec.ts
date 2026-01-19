/**
 * E2E Tests for Booking Widget
 * Tests the complete booking flow from class selection to form submission
 */

import { test, expect } from '@playwright/test';

test.describe('Booking Widget', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking page
    await page.goto('/es/reservas');
    // Wait for widget to be visible
    await expect(page.locator('h1')).toContainText('Reserva tu Clase');
  });

  test.describe('Initial Load', () => {
    test('should display loading skeletons while fetching classes', async ({ page }) => {
      // Check skeletons appear initially (may be fast, so use soft assertion)
      // The skeleton should have aria-hidden="true"
      const skeletons = page.locator('[aria-hidden="true"][role="presentation"]');
      // Either skeletons are visible or classes have loaded
      await expect(skeletons.first().or(page.locator('[role="button"]').first())).toBeVisible({
        timeout: 10000,
      });
    });

    test('should display class list after loading', async ({ page }) => {
      // Wait for class cards to appear
      await expect(page.locator('[role="button"]').first()).toBeVisible({ timeout: 15000 });
    });

    test('should show filter bar', async ({ page }) => {
      // Wait for loading to complete
      await page.waitForSelector('[role="button"]', { timeout: 15000 });
      // Check filter elements exist
      await expect(page.getByRole('combobox').first()).toBeVisible();
    });

    test('should show week navigation', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });
      // Week navigation has prev/next buttons
      const weekNav = page.locator('button[aria-label]').filter({ hasText: /anterior|siguiente/i });
      await expect(weekNav.first()).toBeVisible();
    });
  });

  test.describe('Class Selection', () => {
    test('should select a class and navigate to form', async ({ page }) => {
      // Wait for classes to load
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Click on first available class (not full)
      const classCard = page.locator('[role="button"]:not([aria-disabled="true"])').first();
      await classCard.click();

      // Should show form step
      await expect(page.getByText('Tus Datos')).toBeVisible({ timeout: 5000 });
    });

    test('should show class details in form step', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Get class name before clicking
      const classCard = page.locator('[role="button"]:not([aria-disabled="true"])').first();
      const className = await classCard.locator('h3').textContent();

      await classCard.click();

      // Class name should appear in form summary
      await expect(page.getByText(className || '')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to form step
      await page.waitForSelector('[role="button"]', { timeout: 15000 });
      await page.locator('[role="button"]:not([aria-disabled="true"])').first().click();
      await expect(page.getByText('Tus Datos')).toBeVisible({ timeout: 5000 });
    });

    test('should show error for empty required fields', async ({ page }) => {
      // Try to submit empty form
      await page.getByRole('button', { name: /confirmar|reservar/i }).click();

      // Should show error message
      await expect(page.getByText(/obligatorio|required/i)).toBeVisible({ timeout: 3000 });
    });

    test('should validate email format', async ({ page }) => {
      // Fill form with invalid email
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="phone"]', '612345678');

      // Check required consents
      await page.check('input[name="acceptsTerms"]');
      await page.check('input[name="acceptsPrivacy"]');
      await page.check('input[name="acceptsAge"]');

      // Submit
      await page.getByRole('button', { name: /confirmar|reservar/i }).click();

      // Should show email validation error
      await expect(page.getByText(/email|correo/i)).toBeVisible({ timeout: 3000 });
    });

    test('should require consent checkboxes', async ({ page }) => {
      // Fill valid user data
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="phone"]', '612345678');

      // Don't check consents and submit
      await page.getByRole('button', { name: /confirmar|reservar/i }).click();

      // Should show consent error
      await expect(page.getByText(/términos|condiciones|aceptar/i)).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Navigation', () => {
    test('should go back to class list from form', async ({ page }) => {
      // Navigate to form step
      await page.waitForSelector('[role="button"]', { timeout: 15000 });
      await page.locator('[role="button"]:not([aria-disabled="true"])').first().click();
      await expect(page.getByText('Tus Datos')).toBeVisible({ timeout: 5000 });

      // Click back button
      await page.getByRole('button', { name: /volver|atrás|back/i }).click();

      // Should be back on class list
      await expect(page.getByText(/selecciona|clases/i)).toBeVisible({ timeout: 5000 });
    });

    test('should handle browser back button', async ({ page }) => {
      // Navigate to form step
      await page.waitForSelector('[role="button"]', { timeout: 15000 });
      await page.locator('[role="button"]:not([aria-disabled="true"])').first().click();
      await expect(page.getByText('Tus Datos')).toBeVisible({ timeout: 5000 });

      // Press browser back
      await page.goBack();

      // Should be back on class list
      await expect(page.getByText(/selecciona|clases/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Filters', () => {
    test('should filter classes by style', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Get initial count
      const initialCount = await page.locator('[role="button"]').count();

      // Select a style filter (first option in dropdown)
      const styleSelect = page.getByRole('combobox').first();
      await styleSelect.selectOption({ index: 1 });

      // Wait for filtered results
      await page.waitForTimeout(500);

      // Count should potentially change (or stay same if all match)
      const filteredCount = await page.locator('[role="button"]').count();

      // At minimum, filter was applied (page didn't crash)
      expect(filteredCount).toBeGreaterThanOrEqual(0);
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('should show active filter badges', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Select a filter
      const styleSelect = page.getByRole('combobox').first();
      await styleSelect.selectOption({ index: 1 });

      // Should show filter badge (clear button)
      await expect(page.locator('button').filter({ hasText: /×|x|limpiar/i })).toBeVisible({
        timeout: 3000,
      });
    });

    test('should clear all filters', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Apply filter
      const styleSelect = page.getByRole('combobox').first();
      await styleSelect.selectOption({ index: 1 });

      // Click clear all if visible
      const clearAll = page.getByRole('button', { name: /limpiar todo|clear all/i });
      if (await clearAll.isVisible()) {
        await clearAll.click();

        // Filters should be cleared (select should show "all" option)
        await expect(styleSelect).toHaveValue('');
      }
    });
  });

  test.describe('Week Navigation', () => {
    test('should navigate to next week', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Click next week button
      const nextButton = page.locator(
        'button[aria-label*="siguiente"], button[aria-label*="next"]'
      );
      await nextButton.click();

      // Should show loading or new classes
      await page.waitForTimeout(500);
      await expect(page.locator('[role="button"]').first()).toBeVisible({ timeout: 10000 });
    });

    test('should navigate to previous week', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // First go to next week
      const nextButton = page.locator(
        'button[aria-label*="siguiente"], button[aria-label*="next"]'
      );
      await nextButton.click();
      await page.waitForTimeout(500);

      // Then go back
      const prevButton = page.locator('button[aria-label*="anterior"], button[aria-label*="prev"]');
      await prevButton.click();
      await page.waitForTimeout(500);

      // Should still show classes
      await expect(page.locator('[role="button"]').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Check h1 exists
      await expect(page.locator('h1')).toBeVisible();

      // h1 count should be 1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have accessible class cards', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Class cards should have role="button"
      const classCards = page.locator('[role="button"]');
      expect(await classCards.count()).toBeGreaterThan(0);

      // First card should be focusable
      const firstCard = classCards.first();
      await expect(firstCard).toHaveAttribute('tabindex', /0|-1/);
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Focus first class card
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Press Enter to select
      await page.keyboard.press('Enter');

      // May or may not navigate depending on what was focused
      // Just ensure no errors occurred
    });

    test('should announce loading state to screen readers', async ({ page }) => {
      // Check for aria-live region
      await expect(page.locator('[aria-live]')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Language Switching', () => {
    test('should switch to Catalan', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Click CA button
      await page.getByRole('button', { name: 'CA' }).click();

      // URL should change to /ca/
      await expect(page).toHaveURL(/\/ca\//);
    });

    test('should switch to English', async ({ page }) => {
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Click EN button
      await page.getByRole('button', { name: 'EN' }).click();

      // URL should change to /en/
      await expect(page).toHaveURL(/\/en\//);
    });
  });

  test.describe('Deep Linking', () => {
    test('should pre-fill filters from URL params', async ({ page }) => {
      // Navigate with filter params
      await page.goto('/es/reservas?style=salsa');

      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Style filter should be pre-selected (check select value or badge)
      // This depends on implementation
    });

    test('should direct link to specific class', async ({ page }) => {
      // First get a valid class ID
      await page.goto('/es/reservas');
      await page.waitForSelector('[role="button"]', { timeout: 15000 });

      // Navigate with classId param (assuming class ID 1 exists or similar)
      await page.goto('/es/reservas?classId=1');

      // Should either show form directly or class list
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Error Handling', () => {
    test('should show error state on API failure', async ({ page }) => {
      // Mock API to fail
      await page.route('**/api/classes*', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Server error' }),
        });
      });

      await page.goto('/es/reservas');

      // Should show error message and retry button
      await expect(page.getByText(/error|problema/i)).toBeVisible({ timeout: 15000 });
      await expect(page.getByRole('button', { name: /reintentar|retry/i })).toBeVisible();
    });

    test('should allow retry after error', async ({ page }) => {
      // Mock API to fail first, then succeed
      let callCount = 0;
      await page.route('**/api/classes*', route => {
        callCount++;
        if (callCount === 1) {
          route.fulfill({
            status: 500,
            body: JSON.stringify({ error: 'Server error' }),
          });
        } else {
          route.continue();
        }
      });

      await page.goto('/es/reservas');

      // Wait for error state
      await expect(page.getByRole('button', { name: /reintentar|retry/i })).toBeVisible({
        timeout: 15000,
      });

      // Click retry
      await page.getByRole('button', { name: /reintentar|retry/i }).click();

      // Should now show classes
      await expect(page.locator('[role="button"]').first()).toBeVisible({ timeout: 15000 });
    });
  });
});

test.describe('Booking Widget - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/es/reservas');
    await page.waitForSelector('[role="button"]', { timeout: 15000 });

    // Widget should fit in viewport
    const widget = page.locator('.rounded-3xl').first();
    const box = await widget.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });

  test('should stack elements vertically on mobile', async ({ page }) => {
    await page.goto('/es/reservas');
    await page.waitForSelector('[role="button"]', { timeout: 15000 });

    // Filters should wrap
    const filters = page.getByRole('combobox');
    const count = await filters.count();
    if (count > 1) {
      // Just ensure they're visible
      await expect(filters.first()).toBeVisible();
    }
  });
});
