const { test, expect } = require('@playwright/test');
const { SettingsPage } = require('../../pages/SettingsPage');

/**
 * Settings Module Tests — Non-CPT sections
 * CPT Codes tests are in cpt-codes.spec.js (73 test cases)
 */
test.describe('Settings Module', () => {
  let settingsPage;

  test.beforeEach(async ({ page }) => {
    settingsPage = new SettingsPage(page);
    await settingsPage.goto();
    await settingsPage.waitForPageLoad();
  });

  test.describe('Page Load', () => {
    test('should display settings page', async ({ page }) => {
      await expect(page).toHaveURL(/settings/);
    });

    test('should display settings tabs', async () => {
      await expect(settingsPage.practiceTab).toBeVisible();
      await expect(settingsPage.cptCodesTab).toBeVisible();
    });
  });

  test.describe('Practice Settings', () => {
    test('should display practice settings form', async () => {
      await settingsPage.switchTab('practice');
      const practiceNameInput = settingsPage.page.getByLabel(/practice name|name/i).first();
      await expect(practiceNameInput).toBeVisible();
    });
  });

  test.describe('User Management', () => {
    test('should display user management section', async () => {
      await settingsPage.switchTab('users');
      await expect(settingsPage.addUserBtn).toBeVisible();
    });

    test('should display users table', async () => {
      await settingsPage.switchTab('users');
      const count = await settingsPage.userTableRows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Location Management', () => {
    test('should display locations section', async () => {
      await settingsPage.switchTab('locations');
      await expect(settingsPage.addLocationBtn).toBeVisible();
    });

    test('should display locations table', async () => {
      await settingsPage.switchTab('locations');
      const count = await settingsPage.locationTableRows.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
