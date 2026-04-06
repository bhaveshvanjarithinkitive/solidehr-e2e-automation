/**
 * Utility helpers for SolidEHR E2E tests
 */

/**
 * Formats a date string to MM/DD/YY format
 * @param {Date} date
 * @returns {string}
 */
function formatDateMMDDYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

/**
 * Formats a phone number to (XXX) XXX-XXXX
 * @param {string} digits - 10 digit phone number
 * @returns {string}
 */
function formatPhone(digits) {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/**
 * Waits for network idle after an action
 * @param {import('@playwright/test').Page} page
 */
async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Waits for a toast/notification message
 * @param {import('@playwright/test').Page} page
 * @param {string} text - expected toast text
 */
async function waitForToast(page, text) {
  const toast = page.locator('[role="alert"], [class*="toast"], [class*="notification"]').filter({ hasText: text });
  await toast.waitFor({ state: 'visible', timeout: 10000 });
  return toast;
}

/**
 * Dismisses any visible modal/dialog
 * @param {import('@playwright/test').Page} page
 */
async function dismissModal(page) {
  const closeBtn = page.locator('[class*="modal"] button:has-text("Close"), [class*="modal"] button:has-text("Cancel"), [role="dialog"] button[aria-label="Close"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.first().click();
  }
}

/**
 * Generates a unique identifier for test data
 * @param {string} prefix
 * @returns {string}
 */
let _counter = 0;
function uniqueId(prefix = 'test') {
  _counter++;
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}${_counter}${rand}`;
}

module.exports = {
  formatDateMMDDYY,
  formatPhone,
  waitForNetworkIdle,
  waitForToast,
  dismissModal,
  uniqueId,
};
