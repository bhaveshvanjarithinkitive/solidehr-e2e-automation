const { BasePage } = require('./BasePage');

/**
 * SettingsPage - Practice settings, users, locations, CPT/ICD code management
 * Selectors matched to actual SolidEHR SettingsPage.tsx implementation
 */
class SettingsPage extends BasePage {
  constructor(page) {
    super(page);
    // Setting sections/tabs
    this.practiceTab = page.locator('button, a').filter({ hasText: /practice|general/i });
    this.usersTab = page.locator('button, a').filter({ hasText: /user/i });
    this.locationsTab = page.locator('button, a').filter({ hasText: /location/i });
    this.cptCodesTab = page.locator('button, a').filter({ hasText: /cpt/i });
    this.icdCodesTab = page.locator('button, a').filter({ hasText: /icd/i });
    this.formTemplatesTab = page.locator('button, a').filter({ hasText: /form template/i });
    this.notificationsTab = page.locator('button, a').filter({ hasText: /notification/i });

    // CPT Codes tab elements
    this.cptTitle = page.locator('h1, h2, h3').filter({ hasText: /cpt codes/i });
    this.cptSubtitle = page.locator('text=/manage cpt/i');
    this.addCptBtn = page.getByRole('button', { name: /add cpt code/i });
    this.cptSearchInput = page.getByPlaceholder('Search codes...');
    this.cptTableRows = page.locator('table tbody tr');
    this.cptEmptyState = page.locator('text=/no cpt codes found/i');

    // CPT Code table
    this.cptTable = page.locator('table');
    this.cptTableHeaders = page.locator('table thead th');

    // CPT Add/Edit Modal — uses a fixed overlay div, NOT role="dialog"
    // The overlay is the unique anchor — scope all modal elements inside it
    this.cptModal = page.locator('.fixed.inset-0.z-50');
    this.cptModalContent = this.cptModal.locator('.bg-white.rounded-lg.shadow-xl');
    this.cptCodeInput = page.getByPlaceholder('e.g. 99213');
    this.cptDescriptionInput = page.getByPlaceholder('Office visit - established patient');
    this.cptCategorySelect = this.cptModal.locator('select');
    this.cptAmountInput = page.getByPlaceholder('0.00');
    this.cptActiveCheckbox = page.locator('#cpt-active');
    this.saveCptBtn = this.cptModal.getByRole('button', { name: /^save$|^saving/i });
    this.cancelCptBtn = this.cptModal.getByRole('button', { name: /cancel/i });
    this.closeCptModalBtn = this.cptModal.locator('button').filter({ has: page.locator('svg') }).first();

    // Toast messages
    this.successToast = page.locator('.fixed.top-6.right-6').filter({ has: page.locator('svg') });
    this.errorToast = page.locator('.bg-red-50.border-red-200');

    // User management
    this.addUserBtn = page.getByRole('button', { name: /add user|new user/i });
    this.userTableRows = page.locator('table tbody tr');

    // Location management
    this.addLocationBtn = page.getByRole('button', { name: /add location|new location/i });
    this.locationTableRows = page.locator('table tbody tr');
  }

  async goto() {
    await super.goto('/settings');
  }

  /**
   * Navigate directly to CPT Codes tab via URL
   */
  async gotoCptCodes() {
    await super.goto('/settings?tab=cpt-codes');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to a settings tab/section
   * @param {'practice' | 'users' | 'locations' | 'cptCodes' | 'icdCodes' | 'formTemplates' | 'notifications'} tab
   */
  async switchTab(tab) {
    const tabMap = {
      practice: this.practiceTab,
      users: this.usersTab,
      locations: this.locationsTab,
      cptCodes: this.cptCodesTab,
      icdCodes: this.icdCodesTab,
      formTemplates: this.formTemplatesTab,
      notifications: this.notificationsTab,
    };
    await tabMap[tab].click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Open the Add CPT Code modal
   */
  async openAddCptModal() {
    await this.addCptBtn.click();
    await this.cptModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Add a new CPT code via the modal
   * @param {object} data - { code, description, category?, amount?, active? }
   */
  async addCptCode(data) {
    await this.openAddCptModal();
    await this.cptCodeInput.fill(data.code);
    await this.cptDescriptionInput.fill(data.description);
    if (data.category) {
      await this.cptCategorySelect.selectOption(data.category);
    }
    if (data.amount !== undefined) {
      await this.cptAmountInput.fill(String(data.amount));
    }
    if (data.active === false) {
      const isChecked = await this.cptActiveCheckbox.isChecked();
      if (isChecked) await this.cptActiveCheckbox.uncheck();
    }
    await this.saveCptBtn.click();
    // Wait for the overlay to disappear (means modal fully closed)
    // If save fails (validation/server error), modal stays open — dismiss it
    const closed = await this.cptModal.waitFor({ state: 'hidden', timeout: 5000 }).then(() => true).catch(() => false);
    if (!closed) {
      // Modal stayed open — close it so subsequent actions aren't blocked
      await this.cancelCptBtn.click().catch(() => {});
      await this.cptModal.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
    }
  }

  /**
   * Fill CPT modal fields without clicking save
   * @param {object} data
   */
  async fillCptForm(data) {
    if (data.code !== undefined) await this.cptCodeInput.fill(data.code);
    if (data.description !== undefined) await this.cptDescriptionInput.fill(data.description);
    if (data.category) await this.cptCategorySelect.selectOption({ label: data.category });
    if (data.amount !== undefined) await this.cptAmountInput.fill(String(data.amount));
  }

  /**
   * Click save on the CPT modal
   */
  async saveCpt() {
    await this.saveCptBtn.click();
  }

  /**
   * Cancel the CPT modal
   */
  async cancelCptModal() {
    await this.cancelCptBtn.click();
  }

  /**
   * Close CPT modal via X button
   */
  async closeCptModal() {
    await this.closeCptModalBtn.click();
  }

  /**
   * Search CPT codes in the list
   * @param {string} term
   */
  async searchCptCodes(term) {
    await this.cptSearchInput.fill(term);
    await this.page.waitForTimeout(500);
  }

  /**
   * Clear the CPT search input
   */
  async clearCptSearch() {
    await this.cptSearchInput.clear();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get CPT table row count
   * @returns {Promise<number>}
   */
  async getCptRowCount() {
    await this.page.waitForTimeout(300);
    return await this.cptTableRows.count();
  }

  /**
   * Get text content of a CPT table cell
   * @param {number} rowIndex
   * @param {number} colIndex
   * @returns {Promise<string>}
   */
  async getCptCellText(rowIndex, colIndex) {
    const cell = this.cptTableRows.nth(rowIndex).locator('td').nth(colIndex);
    return (await cell.textContent()).trim();
  }

  /**
   * Get the code value from a row (column 0)
   * @param {number} rowIndex
   * @returns {Promise<string>}
   */
  async getCptCodeFromRow(rowIndex) {
    return await this.getCptCellText(rowIndex, 0);
  }

  /**
   * Get the description from a row (column 1)
   * @param {number} rowIndex
   * @returns {Promise<string>}
   */
  async getCptDescriptionFromRow(rowIndex) {
    return await this.getCptCellText(rowIndex, 1);
  }

  /**
   * Edit a CPT code by row index (clicks the edit/pencil button)
   * @param {number} rowIndex
   */
  async editCptCode(rowIndex = 0) {
    const row = this.cptTableRows.nth(rowIndex);
    // Edit button is the first button in the actions column
    const editBtn = row.locator('td').last().locator('button').first();
    await editBtn.click();
    await this.cptModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Delete a CPT code by row index (clicks the trash icon button)
   * This opens a custom confirmation modal (not window.confirm)
   * @param {number} rowIndex
   */
  async deleteCptCode(rowIndex = 0) {
    const row = this.cptTableRows.nth(rowIndex);
    // Delete button is the second button (trash icon) in the actions column
    const deleteBtn = row.locator('td').last().locator('button').nth(1);
    await deleteBtn.click();
    // Wait for confirmation modal to appear
    await this.cptModal.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Delete a CPT code with confirmation handling
   * Uses the custom confirmation modal with Cancel/Delete buttons
   * @param {number} rowIndex
   * @param {boolean} confirm - true clicks "Delete", false clicks "Cancel"
   */
  async deleteCptCodeWithConfirm(rowIndex = 0, confirm = true) {
    await this.deleteCptCode(rowIndex);

    if (confirm) {
      // Click the red "Delete" button in the confirmation modal
      const deleteConfirmBtn = this.cptModal.getByRole('button', { name: 'Delete' });
      await deleteConfirmBtn.click();
    } else {
      // Click "Cancel" in the confirmation modal
      const cancelConfirmBtn = this.cptModal.getByRole('button', { name: 'Cancel' });
      await cancelConfirmBtn.click();
    }

    // Wait for confirmation modal to close
    await this.cptModal.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if CPT modal is visible
   * @returns {Promise<boolean>}
   */
  async isCptModalVisible() {
    return await this.cptModal.isVisible().catch(() => false);
  }

  /**
   * Check if empty state message is visible
   * @returns {Promise<boolean>}
   */
  async isEmptyStateVisible() {
    return await this.cptEmptyState.isVisible().catch(() => false);
  }

  /**
   * Check if save button is disabled
   * @returns {Promise<boolean>}
   */
  async isSaveCptDisabled() {
    return await this.saveCptBtn.isDisabled();
  }

  /**
   * Get save button text
   * @returns {Promise<string>}
   */
  async getSaveCptButtonText() {
    return (await this.saveCptBtn.textContent()).trim();
  }

  /**
   * Check if success toast is visible
   * @returns {Promise<boolean>}
   */
  async hasSuccessToast() {
    try {
      await this.successToast.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if error toast is visible
   * @returns {Promise<boolean>}
   */
  async hasErrorToast() {
    try {
      await this.errorToast.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find CPT row by code text
   * @param {string} code
   * @returns {import('@playwright/test').Locator}
   */
  findCptRowByCode(code) {
    return this.cptTableRows.filter({ hasText: code });
  }

  /**
   * Check if a CPT code exists in the table
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  async cptCodeExistsInList(code) {
    const row = this.findCptRowByCode(code);
    return (await row.count()) > 0;
  }
}

module.exports = { SettingsPage };
