const { BasePage } = require('./BasePage');

/**
 * BillingPage - Billing module with invoices, payments, statements, superbills
 */
class BillingPage extends BasePage {
  constructor(page) {
    super(page);
    // Tabs
    this.readyForBillingTab = page.getByRole('tab', { name: /ready for billing/i }).or(page.locator('button').filter({ hasText: /ready for billing/i }));
    this.invoicesTab = page.getByRole('tab', { name: /invoices/i }).or(page.locator('button').filter({ hasText: /invoices/i }));
    this.paymentsTab = page.getByRole('tab', { name: /payments/i }).or(page.locator('button').filter({ hasText: /payments/i }));
    this.statementsTab = page.getByRole('tab', { name: /statements/i }).or(page.locator('button').filter({ hasText: /statements/i }));
    this.superbillsTab = page.getByRole('tab', { name: /superbill/i }).or(page.locator('button').filter({ hasText: /superbill/i }));

    // Invoice filters
    this.searchInput = page.getByPlaceholder(/search/i);
    this.statusFilter = page.getByLabel(/status/i).or(page.locator('select').filter({ hasText: /status/i }));

    // Summary stats
    this.totalOutstanding = page.locator('text=/outstanding/i').locator('..');
    this.totalOverdue = page.locator('text=/overdue/i').locator('..');
    this.totalPaid = page.locator('text=/total paid/i').locator('..');

    // Tables
    this.tableRows = page.locator('table tbody tr');

    // Actions
    this.createInvoiceBtn = page.getByRole('button', { name: /create invoice/i });
    this.recordPaymentBtn = page.getByRole('button', { name: /record payment/i });
    this.generateSuperbillBtn = page.getByRole('button', { name: /generate superbill/i });
    this.generateStatementBtn = page.getByRole('button', { name: /generate statement/i });

    // Payment modal
    this.paymentAmountInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/amount/i);
    this.paymentMethodSelect = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/method/i);
    this.paymentReferenceInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/reference/i);
    this.submitPaymentBtn = page.locator('[class*="modal"], [role="dialog"]').getByRole('button', { name: /submit|save|record/i });
  }

  async goto() {
    await super.goto('/billing');
  }

  /**
   * Switch to a billing tab
   * @param {'readyForBilling' | 'invoices' | 'payments' | 'statements' | 'superbills'} tab
   */
  async switchTab(tab) {
    const tabMap = {
      readyForBilling: this.readyForBillingTab,
      invoices: this.invoicesTab,
      payments: this.paymentsTab,
      statements: this.statementsTab,
      superbills: this.superbillsTab,
    };
    await tabMap[tab].click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Search within the active billing tab
   * @param {string} text
   */
  async search(text) {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get row count in current table
   * @returns {Promise<number>}
   */
  async getRowCount() {
    return await this.tableRows.count();
  }

  /**
   * Record a payment for an invoice
   * @param {number} rowIndex
   * @param {object} paymentData - { amount, method, reference }
   */
  async recordPayment(rowIndex, paymentData) {
    const row = this.tableRows.nth(rowIndex);
    await row.getByRole('button', { name: /payment/i }).click();
    await this.paymentAmountInput.fill(paymentData.amount);
    if (paymentData.method) await this.paymentMethodSelect.selectOption({ label: paymentData.method });
    if (paymentData.reference) await this.paymentReferenceInput.fill(paymentData.reference);
    await this.submitPaymentBtn.click();
  }

  /**
   * Expand an invoice row to see line items
   * @param {number} rowIndex
   */
  async expandInvoiceRow(rowIndex = 0) {
    await this.tableRows.nth(rowIndex).click();
  }
}

module.exports = { BillingPage };
