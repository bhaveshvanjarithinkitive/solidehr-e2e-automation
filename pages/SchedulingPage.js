const { BasePage } = require('./BasePage');

/**
 * SchedulingPage - Appointment scheduling, calendar views, and management
 */
class SchedulingPage extends BasePage {
  constructor(page) {
    super(page);
    // View controls
    this.tableViewBtn = page.getByRole('button', { name: /table|list/i });
    this.dayViewBtn = page.getByRole('button', { name: /day/i });
    this.weekViewBtn = page.getByRole('button', { name: /week/i });
    this.monthViewBtn = page.getByRole('button', { name: /month/i });

    // Filters
    this.providerFilter = page.getByLabel(/provider/i).or(page.locator('select').filter({ hasText: /provider/i }));
    this.locationFilter = page.getByLabel(/location/i).or(page.locator('select').filter({ hasText: /location/i }));
    this.statusFilter = page.locator('[class*="filter"]').filter({ hasText: /status/i });

    // New appointment
    this.newAppointmentBtn = page.getByRole('button', { name: /new appointment|add appointment/i });

    // Appointment table
    this.appointmentRows = page.locator('table tbody tr');

    // Appointment modal/form fields
    this.patientSearch = page.getByPlaceholder(/search patient/i).or(page.getByLabel(/patient/i));
    this.appointmentProviderSelect = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/provider/i);
    this.appointmentLocationSelect = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/location/i);
    this.appointmentTypeSelect = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/type/i);
    this.dateInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/date/i);
    this.startTimeInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/start time/i);
    this.endTimeInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/end time/i);
    this.modeSelect = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/mode/i);
    this.reasonInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/reason|notes/i);
    this.saveAppointmentBtn = page.locator('[class*="modal"], [role="dialog"]').getByRole('button', { name: /save|create|schedule/i });
    this.cancelModalBtn = page.locator('[class*="modal"], [role="dialog"]').getByRole('button', { name: /cancel/i });
  }

  async goto() {
    await super.goto('/scheduling');
  }

  /**
   * Switch calendar view
   * @param {'table' | 'day' | 'week' | 'month'} view
   */
  async switchView(view) {
    const btnMap = { table: this.tableViewBtn, day: this.dayViewBtn, week: this.weekViewBtn, month: this.monthViewBtn };
    await btnMap[view].click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Open new appointment form
   */
  async clickNewAppointment() {
    await this.newAppointmentBtn.click();
  }

  /**
   * Search and select a patient in the appointment modal
   * @param {string} patientName
   */
  async selectPatient(patientName) {
    await this.patientSearch.fill(patientName);
    await this.page.waitForTimeout(500);
    await this.page.locator('[class*="dropdown"], [class*="suggestion"], [role="option"]').filter({ hasText: patientName }).first().click();
  }

  /**
   * Fill appointment form and save
   * @param {object} data - appointment data
   */
  async createAppointment(data) {
    await this.clickNewAppointment();
    if (data.patient) await this.selectPatient(data.patient);
    if (data.reason) await this.reasonInput.fill(data.reason);
    await this.saveAppointmentBtn.click();
  }

  /**
   * Get appointment count from table view
   * @returns {Promise<number>}
   */
  async getAppointmentCount() {
    return await this.appointmentRows.count();
  }

  /**
   * Cancel an appointment by row index
   * @param {number} rowIndex
   */
  async cancelAppointment(rowIndex = 0) {
    const row = this.appointmentRows.nth(rowIndex);
    const actionsBtn = row.getByRole('button', { name: /cancel/i }).or(row.locator('[class*="dropdown"]'));
    await actionsBtn.click();
    const confirmBtn = this.page.getByRole('button', { name: /confirm|yes/i });
    if (await confirmBtn.isVisible()) await confirmBtn.click();
  }

  /**
   * Change appointment status
   * @param {number} rowIndex
   * @param {string} status
   */
  async changeAppointmentStatus(rowIndex, status) {
    const row = this.appointmentRows.nth(rowIndex);
    const statusDropdown = row.locator('select, [class*="status"]');
    await statusDropdown.click();
    await this.page.getByRole('option', { name: new RegExp(status, 'i') }).click();
  }
}

module.exports = { SchedulingPage };
