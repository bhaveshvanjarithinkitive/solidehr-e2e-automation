const { BasePage } = require('./BasePage');

/**
 * DashboardPage - Provider dashboard interactions
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.greetingText = page.locator('h1, h2').filter({ hasText: /good (morning|afternoon|evening)/i });
    this.todayDateText = page.locator('text=/\\w+ \\d{1,2}, \\d{4}/');
    this.appointmentsCard = page.locator('[class*="card"]').filter({ hasText: /appointment/i });
    this.tasksSection = page.locator('[class*="card"], section').filter({ hasText: /task/i });
    this.encountersSection = page.locator('[class*="card"], section').filter({ hasText: /unsigned encounter/i });
    this.messagesSection = page.locator('[class*="card"], section').filter({ hasText: /message/i });
    this.notificationBar = page.locator('[class*="notification"], [class*="summary"]').first();
  }

  async goto() {
    await super.goto('/dashboard');
  }

  /**
   * Get the greeting text
   * @returns {Promise<string>}
   */
  async getGreeting() {
    return await this.greetingText.textContent();
  }

  /**
   * Get count of today's appointments displayed
   * @returns {Promise<number>}
   */
  async getAppointmentCount() {
    const items = this.appointmentsCard.locator('[class*="item"], tr, [class*="appointment"]');
    return await items.count();
  }

  /**
   * Click "Start Encounter" on a specific appointment
   * @param {number} index - 0-based index
   */
  async startEncounterFromAppointment(index = 0) {
    const startBtn = this.appointmentsCard
      .getByRole('button', { name: /start encounter/i })
      .nth(index);
    await startBtn.click();
  }

  /**
   * Check if dashboard sections are loaded
   * @returns {Promise<boolean>}
   */
  async isDashboardLoaded() {
    await this.page.waitForLoadState('networkidle');
    return await this.greetingText.isVisible();
  }

  /**
   * Navigate to scheduling from dashboard
   */
  async goToScheduling() {
    await this.navigateTo('Scheduling');
  }

  /**
   * Navigate to patients from dashboard
   */
  async goToPatients() {
    await this.navigateTo('Patients');
  }
}

module.exports = { DashboardPage };
