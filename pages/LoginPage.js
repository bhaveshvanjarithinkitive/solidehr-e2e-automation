const { BasePage } = require('./BasePage');

/**
 * LoginPage - Handles authentication-related interactions
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByPlaceholder(/email/i);
    this.passwordInput = page.getByPlaceholder(/password/i);
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
    this.rememberMeCheckbox = page.getByLabel(/remember me/i);
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    this.registerLink = page.getByRole('link', { name: /register|sign up/i });
    this.errorMessage = page.locator('[class*="error"], [role="alert"]');
    this.passwordToggle = page.locator('button:near(:text("Password"))').first();
  }

  async goto() {
    await super.goto('/login');
  }

  /**
   * Login with given credentials
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Login and wait for dashboard
   * @param {string} email
   * @param {string} password
   */
  async loginAndWaitForDashboard(email, password) {
    await this.login(email, password);
    await this.page.waitForURL('**/dashboard', { timeout: 15000 });
  }

  /**
   * Get the error message text
   * @returns {Promise<string>}
   */
  async getErrorText() {
    await this.errorMessage.first().waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.first().textContent();
  }

  /**
   * Check if login button is enabled
   * @returns {Promise<boolean>}
   */
  async isLoginButtonEnabled() {
    return await this.loginButton.isEnabled();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  /**
   * Navigate to forgot password page
   */
  async goToForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL('**/forgot-password');
  }

  /**
   * Navigate to register page
   */
  async goToRegister() {
    await this.registerLink.click();
    await this.page.waitForURL('**/register');
  }
}

module.exports = { LoginPage };
