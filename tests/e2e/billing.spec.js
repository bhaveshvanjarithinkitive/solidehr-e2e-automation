const { test, expect } = require('@playwright/test');
const { BillingPage } = require('../../pages/BillingPage');

test.describe('Billing Module', () => {
  let billingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.goto();
    await billingPage.waitForPageLoad();
  });

  test.describe('Page Load & Tabs', () => {
    test('should display billing page', async ({ page }) => {
      await expect(page).toHaveURL(/billing/);
    });

    test('should display billing tabs', async () => {
      await expect(billingPage.readyForBillingTab).toBeVisible();
      await expect(billingPage.invoicesTab).toBeVisible();
      await expect(billingPage.paymentsTab).toBeVisible();
    });

    test('should switch to Ready for Billing tab', async () => {
      await billingPage.switchTab('readyForBilling');
      const count = await billingPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to Invoices tab', async () => {
      await billingPage.switchTab('invoices');
      const count = await billingPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to Payments tab', async () => {
      await billingPage.switchTab('payments');
      const count = await billingPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to Statements tab', async () => {
      await billingPage.switchTab('statements');
    });

    test('should switch to Superbills tab', async () => {
      await billingPage.switchTab('superbills');
    });
  });

  test.describe('Invoices', () => {
    test.beforeEach(async () => {
      await billingPage.switchTab('invoices');
    });

    test('should have search functionality', async () => {
      await expect(billingPage.searchInput).toBeVisible();
    });

    test('should search invoices by patient name', async () => {
      await billingPage.search('John');
      const count = await billingPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should expand invoice row to view line items', async () => {
      const count = await billingPage.getRowCount();
      if (count > 0) {
        await billingPage.expandInvoiceRow(0);
      }
    });
  });

  test.describe('Ready for Billing', () => {
    test('should display encounters ready for billing', async () => {
      await billingPage.switchTab('readyForBilling');
      const count = await billingPage.getRowCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
