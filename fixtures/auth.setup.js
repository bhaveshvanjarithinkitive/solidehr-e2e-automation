const { test: setup } = require('@playwright/test');
const { credentials } = require('./test-data');

const authFile = './fixtures/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill(credentials.email);
  await page.getByPlaceholder(/password/i).fill(credentials.password);
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
