const { test, expect } = require('@playwright/test');
const { EncounterPage } = require('../../pages/EncounterPage');
const { generateEncounterNotes } = require('../../fixtures/test-data');

test.describe('Encounters Module', () => {

  test.describe('Encounters List', () => {
    test('should display encounters list page', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');
      // Should see unsigned/signed tabs
      const unsignedTab = page.locator('button, [role="tab"]').filter({ hasText: /unsigned/i });
      const signedTab = page.locator('button, [role="tab"]').filter({ hasText: /signed/i });
      await expect(unsignedTab).toBeVisible();
      await expect(signedTab).toBeVisible();
    });

    test('should switch between unsigned and signed tabs', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');
      const signedTab = page.locator('button, [role="tab"]').filter({ hasText: /signed/i });
      await signedTab.click();
      await page.waitForTimeout(500);
      const unsignedTab = page.locator('button, [role="tab"]').filter({ hasText: /unsigned/i });
      await unsignedTab.click();
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');
      const search = page.getByPlaceholder(/search/i);
      await expect(search).toBeVisible();
    });
  });

  test.describe('Encounter Detail - SOAP Notes', () => {
    // These tests require an existing encounter ID
    // They will be skipped if no encounter is available
    test('should display SOAP note sections for an encounter', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');

      // Try to click first encounter to open it
      const firstEncounter = page.locator('table tbody tr, [class*="encounter-row"]').first();
      const isVisible = await firstEncounter.isVisible();
      if (!isVisible) {
        test.skip();
        return;
      }

      await firstEncounter.click();
      await page.waitForLoadState('networkidle');

      const encounterPage = new EncounterPage(page);
      // SOAP textareas should be visible
      await expect(encounterPage.subjectiveTextarea.or(page.locator('text=/subjective/i'))).toBeVisible();
    });

    test('should save encounter as draft', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');

      const firstEncounter = page.locator('table tbody tr, [class*="encounter-row"]').first();
      if (!(await firstEncounter.isVisible())) {
        test.skip();
        return;
      }

      await firstEncounter.click();
      await page.waitForLoadState('networkidle');

      const encounterPage = new EncounterPage(page);
      const notes = generateEncounterNotes();

      // Fill some notes
      if (await encounterPage.reasonForVisitInput.isVisible()) {
        await encounterPage.reasonForVisitInput.fill(notes.reasonForVisit);
      }
      if (await encounterPage.subjectiveTextarea.isVisible()) {
        await encounterPage.subjectiveTextarea.fill(notes.subjective);
      }

      // Save draft
      if (await encounterPage.saveDraftBtn.isVisible()) {
        await encounterPage.saveDraft();
        await page.waitForTimeout(1000);
      }
    });
  });

  test.describe('Encounter - Diagnoses', () => {
    test('should display add diagnosis button on encounter', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');

      const firstEncounter = page.locator('table tbody tr, [class*="encounter-row"]').first();
      if (!(await firstEncounter.isVisible())) {
        test.skip();
        return;
      }
      await firstEncounter.click();
      await page.waitForLoadState('networkidle');

      const encounterPage = new EncounterPage(page);
      await expect(encounterPage.addDiagnosisBtn).toBeVisible();
    });
  });

  test.describe('Encounter - CPT Codes', () => {
    test('should display add CPT code button on encounter', async ({ page }) => {
      await page.goto('/encounters');
      await page.waitForLoadState('networkidle');

      const firstEncounter = page.locator('table tbody tr, [class*="encounter-row"]').first();
      if (!(await firstEncounter.isVisible())) {
        test.skip();
        return;
      }
      await firstEncounter.click();
      await page.waitForLoadState('networkidle');

      const encounterPage = new EncounterPage(page);
      await expect(encounterPage.addCptBtn).toBeVisible();
    });
  });
});
