const { BasePage } = require('./BasePage');

/**
 * PatientsListPage - Patient list view, search, filter, sort, pagination, and actions
 * Selectors matched to actual SolidEHR PatientsListPage.tsx
 */
class PatientsListPage extends BasePage {
  constructor(page) {
    super(page);

    // Search
    this.searchInput = page.getByPlaceholder('Search by name, MRN, phone...');
    this.clearSearchBtn = page.locator('button').filter({ has: page.locator('svg') }).locator('near(:text("Search"))');

    // Filter tabs
    this.statusTabs = {
      all: page.getByRole('button', { name: 'All', exact: true }),
      active: page.getByRole('button', { name: 'Active', exact: true }),
      inactive: page.getByRole('button', { name: 'Inactive', exact: true }),
    };

    // Add Patient button
    this.addPatientButton = page.getByRole('button', { name: /add patient/i });

    // Patient count
    this.patientCount = page.locator('text=/\\d+ patient/i');

    // Table
    this.patientTable = page.locator('table');
    this.patientRows = page.locator('table tbody tr');
    this.tableHeaders = page.locator('table thead th');

    // Sortable column headers — use nth since text matching can be unreliable
    this.sortByName = page.locator('table thead th').first();
    this.sortByDOB = page.locator('th').filter({ hasText: /dob/i });
    this.sortByCreated = page.locator('th').filter({ hasText: /created/i });
    this.sortByUpdated = page.locator('th').filter({ hasText: /updated/i });

    // Pagination
    this.paginationInfo = page.locator('text=/showing \\d+/i');
    this.firstPageBtn = page.getByRole('button', { name: 'First' });
    this.prevPageBtn = page.getByRole('button', { name: /previous/i }).or(page.locator('button[aria-label="Previous"]'));
    this.nextPageBtn = page.getByRole('button', { name: /next/i }).or(page.locator('button[aria-label="Next"]'));
    this.lastPageBtn = page.getByRole('button', { name: 'Last' });

    // Empty state
    this.emptyState = page.locator('text=/no patients found/i');

    // Error state
    this.errorAlert = page.locator('.bg-red-50.text-red-700');
    this.retryLink = page.getByText('Retry');

    // Row actions dropdown
    this.actionMenuBtns = page.locator('table tbody tr button').filter({ has: page.locator('svg') });
  }

  async goto() {
    await super.goto('/patients');
    await this.page.waitForLoadState('networkidle');
  }

  /** Search for a patient by name/MRN/phone */
  async searchPatient(text) {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(600); // 400ms debounce + buffer
  }

  /** Clear search input */
  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(600);
  }

  /** Click a status filter tab */
  async filterByStatus(status) {
    await this.statusTabs[status].click();
    await this.page.waitForTimeout(500);
  }

  /** Get the number of patient rows visible */
  async getPatientRowCount() {
    await this.page.waitForTimeout(500);
    return await this.patientRows.count();
  }

  /** Click "Add Patient" button */
  async clickAddPatient() {
    await this.addPatientButton.click();
    await this.page.waitForURL('**/patients/new**');
  }

  /** Get patient name from a row */
  async getPatientName(rowIndex = 0) {
    const nameCell = this.patientRows.nth(rowIndex).locator('td').first();
    return (await nameCell.textContent()).trim();
  }

  /** Get MRN from a row */
  async getPatientMRN(rowIndex = 0) {
    const mrnCell = this.patientRows.nth(rowIndex).locator('td').nth(1);
    return (await mrnCell.textContent()).trim();
  }

  /** Click the status toggle on a row */
  async togglePatientStatus(rowIndex = 0) {
    const row = this.patientRows.nth(rowIndex);
    const toggle = row.locator('.relative.inline-flex.h-6.w-11, [role="switch"]');
    await toggle.click();
    await this.page.waitForTimeout(500);
  }

  /** Click an action button on a row by its title attribute */
  async clickRowAction(rowIndex, actionName) {
    const row = this.patientRows.nth(rowIndex);
    const btn = row.getByRole('button', { name: actionName });
    await btn.click();
    await this.page.waitForTimeout(500);
  }

  /** Check which action buttons are visible on a row */
  async getRowActions(rowIndex = 0) {
    const row = this.patientRows.nth(rowIndex);
    const buttons = row.locator('td').last().locator('button');
    const titles = [];
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const title = await buttons.nth(i).getAttribute('title');
      if (title) titles.push(title);
    }
    return titles;
  }

  /** Sort by clicking a column header */
  async sortBy(column) {
    const headerMap = {
      name: this.sortByName,
      dob: this.sortByDOB,
      created: this.sortByCreated,
      updated: this.sortByUpdated,
    };
    await headerMap[column].click();
    await this.page.waitForTimeout(500);
  }

  /** Navigate to next page */
  async goToNextPage() {
    await this.nextPageBtn.click();
    await this.page.waitForTimeout(500);
  }

  /** Navigate to previous page */
  async goToPrevPage() {
    await this.prevPageBtn.click();
    await this.page.waitForTimeout(500);
  }

  /** Check if empty state is visible */
  async isEmptyStateVisible() {
    return await this.emptyState.isVisible().catch(() => false);
  }

  /** Get the total patient count text */
  async getPatientCountText() {
    return await this.patientCount.textContent().catch(() => '');
  }
}

module.exports = { PatientsListPage };
