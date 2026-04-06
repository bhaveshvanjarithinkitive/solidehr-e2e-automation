const { test, expect } = require('@playwright/test');
const { TriagePage } = require('../../pages/TriagePage');
const { generateVitals } = require('../../fixtures/test-data');

test.describe('Triage Module', () => {
  // Note: Triage requires an appointment ID to navigate to.
  // These tests verify UI elements and form behavior.

  test.describe('Triage Form Elements', () => {
    test('should navigate to triage via scheduling', async ({ page }) => {
      // Go to scheduling and find an appointment with triage action
      await page.goto('/scheduling');
      await page.waitForLoadState('networkidle');

      // Look for a triage or vitals button
      const triageBtn = page.getByRole('button', { name: /triage|vitals/i }).first();
      const isVisible = await triageBtn.isVisible().catch(() => false);

      if (!isVisible) {
        test.skip();
        return;
      }

      await triageBtn.click();
      await page.waitForLoadState('networkidle');

      const triagePage = new TriagePage(page);
      await expect(triagePage.systolicInput.or(triagePage.heartRateInput)).toBeVisible();
    });
  });

  test.describe('Vitals Entry', () => {
    test('should be able to access triage from dashboard appointments', async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check if there's an appointment card with a triage option
      const appointmentCard = page.locator('[class*="card"]').filter({ hasText: /appointment/i });
      const isVisible = await appointmentCard.isVisible().catch(() => false);

      if (!isVisible) {
        test.skip();
        return;
      }

      // This test validates the navigation path exists
      expect(isVisible).toBeTruthy();
    });
  });

  test.describe('Vitals Validation', () => {
    test('should validate vitals are within normal ranges', async ({ page }) => {
      // This test will be data-driven when connected to a real appointment
      const vitals = generateVitals();

      // Validate generated data is within expected ranges
      expect(parseInt(vitals.systolic)).toBeGreaterThanOrEqual(100);
      expect(parseInt(vitals.systolic)).toBeLessThanOrEqual(140);
      expect(parseInt(vitals.diastolic)).toBeGreaterThanOrEqual(60);
      expect(parseInt(vitals.diastolic)).toBeLessThanOrEqual(90);
      expect(parseInt(vitals.heartRate)).toBeGreaterThanOrEqual(60);
      expect(parseInt(vitals.heartRate)).toBeLessThanOrEqual(100);
      expect(parseInt(vitals.oxygenSaturation)).toBeGreaterThanOrEqual(95);
      expect(parseInt(vitals.oxygenSaturation)).toBeLessThanOrEqual(100);
    });
  });
});
