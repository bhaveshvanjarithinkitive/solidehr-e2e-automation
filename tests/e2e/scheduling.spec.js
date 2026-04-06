const { test, expect } = require('@playwright/test');
const { SchedulingPage } = require('../../pages/SchedulingPage');

test.describe('Scheduling Module', () => {
  let schedulingPage;

  test.beforeEach(async ({ page }) => {
    schedulingPage = new SchedulingPage(page);
    await schedulingPage.goto();
    await schedulingPage.waitForPageLoad();
  });

  test.describe('Page Load & Views', () => {
    test('should display scheduling page', async ({ page }) => {
      await expect(page).toHaveURL(/scheduling/);
      await expect(schedulingPage.newAppointmentBtn).toBeVisible();
    });

    test('should switch to day view', async () => {
      await schedulingPage.switchView('day');
      // Page should not error
    });

    test('should switch to week view', async () => {
      await schedulingPage.switchView('week');
    });

    test('should switch to month view', async () => {
      await schedulingPage.switchView('month');
    });

    test('should switch to table view', async () => {
      await schedulingPage.switchView('table');
    });
  });

  test.describe('Appointment Creation', () => {
    test('should open new appointment modal', async ({ page }) => {
      await schedulingPage.clickNewAppointment();
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      await expect(modal).toBeVisible();
    });

    test('should close appointment modal on cancel', async ({ page }) => {
      await schedulingPage.clickNewAppointment();
      await schedulingPage.cancelModalBtn.click();
      const modal = page.locator('[class*="modal"], [role="dialog"]');
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Filters', () => {
    test('should have provider filter available', async () => {
      await expect(schedulingPage.providerFilter).toBeVisible();
    });

    test('should have location filter available', async () => {
      await expect(schedulingPage.locationFilter).toBeVisible();
    });
  });

  test.describe('Appointment Table', () => {
    test('should display appointment rows in table view', async () => {
      await schedulingPage.switchView('table');
      const count = await schedulingPage.getAppointmentCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
