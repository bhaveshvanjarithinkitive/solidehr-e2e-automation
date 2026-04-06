/**
 * BasePage - Common methods shared across all page objects
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Layout elements
    this.sidebar = page.locator('nav, [class*="sidebar"]');
    this.topNav = page.locator('header, [class*="topbar"], [class*="navbar"]');
    this.userMenu = page.locator('[class*="user-menu"], [class*="avatar"]').last();
    this.logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    this.loadingSpinner = page.locator('[class*="spinner"], [class*="loading"]');
    this.toastMessage = page.locator('[role="alert"], [class*="toast"]');
  }

  /**
   * Navigate to a path
   * @param {string} path
   */
  async goto(path) {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for page to finish loading
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate using sidebar
   * @param {string} linkText - visible text of the sidebar link
   */
  async navigateTo(linkText) {
    await this.sidebar.getByRole('link', { name: new RegExp(linkText, 'i') }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the current URL path
   * @returns {string}
   */
  getCurrentPath() {
    return new URL(this.page.url()).pathname;
  }

  /**
   * Wait for and return toast text
   * @returns {Promise<string>}
   */
  async getToastMessage() {
    await this.toastMessage.first().waitFor({ state: 'visible', timeout: 10000 });
    return await this.toastMessage.first().textContent();
  }

  /**
   * Logout from the app
   */
  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Search for a patient using the global search bar
   * @param {string} name
   */
  async globalPatientSearch(name) {
    const searchInput = this.page.getByPlaceholder(/search patient/i);
    await searchInput.fill(name);
    await this.page.waitForTimeout(500);
  }
}

module.exports = { BasePage };
