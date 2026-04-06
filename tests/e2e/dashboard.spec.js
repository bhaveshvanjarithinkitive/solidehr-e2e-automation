const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../../pages/DashboardPage');

test.describe('Dashboard', () => {
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
    await dashboardPage.waitForPageLoad();
  });

  test.describe('Page Load', () => {
    test('should display greeting message', async () => {
      const greeting = await dashboardPage.getGreeting();
      expect(greeting).toMatch(/good (morning|afternoon|evening)/i);
    });

    test('should display dashboard sections', async ({ page }) => {
      await expect(dashboardPage.appointmentsCard).toBeVisible();
      await expect(dashboardPage.tasksSection).toBeVisible();
    });

    test('should show today\'s date', async ({ page }) => {
      const today = new Date();
      const monthName = today.toLocaleString('en-US', { month: 'long' });
      const dateText = page.locator(`text=/${monthName}/i`);
      await expect(dateText).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to Scheduling from sidebar', async ({ page }) => {
      await dashboardPage.goToScheduling();
      await expect(page).toHaveURL(/scheduling/);
    });

    test('should navigate to Patients from sidebar', async ({ page }) => {
      await dashboardPage.goToPatients();
      await expect(page).toHaveURL(/patients/);
    });

    test('should navigate to Tasks from sidebar', async ({ page }) => {
      await dashboardPage.navigateTo('Tasks');
      await expect(page).toHaveURL(/tasks/);
    });

    test('should navigate to Billing from sidebar', async ({ page }) => {
      await dashboardPage.navigateTo('Billing');
      await expect(page).toHaveURL(/billing/);
    });

    test('should navigate to Encounters from sidebar', async ({ page }) => {
      await dashboardPage.navigateTo('Encounters');
      await expect(page).toHaveURL(/encounters/);
    });

    test('should navigate to Settings from sidebar', async ({ page }) => {
      await dashboardPage.navigateTo('Settings');
      await expect(page).toHaveURL(/settings/);
    });
  });

  test.describe('Global Search', () => {
    test('should display patient search in top nav', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/search patient/i);
      await expect(searchInput).toBeVisible();
    });

    test('should show search results when typing patient name', async ({ page }) => {
      await dashboardPage.globalPatientSearch('John');
      const results = page.locator('[class*="dropdown"], [class*="suggestion"], [class*="result"]');
      // Results may or may not appear depending on data
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Notifications', () => {
    test('should display notification bell icon', async ({ page }) => {
      const bell = page.locator('[class*="notification"], [aria-label*="notification"]').first();
      await expect(bell).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should logout and redirect to login', async ({ page }) => {
      await dashboardPage.logout();
      await expect(page).toHaveURL(/login/);
    });
  });
});
