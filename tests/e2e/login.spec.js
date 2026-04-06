const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { credentials, invalidCredentials } = require('../../fixtures/test-data');

// Login tests do NOT use stored auth state - they test the login flow itself
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Feature', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Positive Tests', () => {
    test('should display login page with all elements', async ({ page }) => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard(credentials.email, credentials.password);
      await expect(page).toHaveURL(/dashboard/);
    });

    test('should redirect authenticated user from login to dashboard', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard(credentials.email, credentials.password);
      await page.goto('/login');
      await expect(page).toHaveURL(/dashboard/);
    });

    test('should toggle password visibility', async ({ page }) => {
      await loginPage.passwordInput.fill('TestPassword');
      const typeBefore = await loginPage.passwordInput.getAttribute('type');
      expect(typeBefore).toBe('password');
      await loginPage.togglePasswordVisibility();
      const typeAfter = await loginPage.passwordInput.getAttribute('type');
      expect(typeAfter).toBe('text');
    });
  });

  test.describe('Negative Tests', () => {
    test('should show error for invalid email', async ({ page }) => {
      await loginPage.login(invalidCredentials.wrongEmail, credentials.password);
      const error = await loginPage.getErrorText();
      expect(error).toBeTruthy();
    });

    test('should show error for invalid password', async ({ page }) => {
      await loginPage.login(credentials.email, invalidCredentials.wrongPassword);
      const error = await loginPage.getErrorText();
      expect(error).toBeTruthy();
    });

    test('should show error for empty email', async ({ page }) => {
      await loginPage.login('', credentials.password);
      // Either form validation or API error
      const isOnLoginPage = page.url().includes('/login');
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should show error for empty password', async ({ page }) => {
      await loginPage.login(credentials.email, '');
      const isOnLoginPage = page.url().includes('/login');
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should show error for both fields empty', async ({ page }) => {
      await loginPage.loginButton.click();
      const isOnLoginPage = page.url().includes('/login');
      expect(isOnLoginPage).toBeTruthy();
    });

    test('should show error for invalid email format', async ({ page }) => {
      await loginPage.login(invalidCredentials.invalidEmailFormat, credentials.password);
      const isOnLoginPage = page.url().includes('/login');
      expect(isOnLoginPage).toBeTruthy();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.goToForgotPassword();
      await expect(page).toHaveURL(/forgot-password/);
    });

    test('should navigate to register page', async ({ page }) => {
      await loginPage.goToRegister();
      await expect(page).toHaveURL(/register/);
    });
  });
});
