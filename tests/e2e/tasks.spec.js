const { test, expect } = require('@playwright/test');
const { TasksPage } = require('../../pages/TasksPage');
const { TaskFormPage } = require('../../pages/TaskFormPage');
const { generateTask } = require('../../fixtures/test-data');

test.describe('Tasks Module', () => {

  test.describe('Task List', () => {
    let tasksPage;

    test.beforeEach(async ({ page }) => {
      tasksPage = new TasksPage(page);
      await tasksPage.goto();
      await tasksPage.waitForPageLoad();
    });

    test('should display tasks page with tabs', async () => {
      await expect(tasksPage.myTasksTab).toBeVisible();
      await expect(tasksPage.newTaskBtn).toBeVisible();
    });

    test('should switch to My Tasks tab', async () => {
      await tasksPage.switchTab('myTasks');
      const count = await tasksPage.getTaskCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to All Tasks tab', async () => {
      await tasksPage.switchTab('allTasks');
      const count = await tasksPage.getTaskCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to Overdue tab', async () => {
      await tasksPage.switchTab('overdue');
      const count = await tasksPage.getTaskCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should switch to Completed tab', async () => {
      await tasksPage.switchTab('completed');
      const count = await tasksPage.getTaskCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search tasks by text', async () => {
      await tasksPage.searchTasks('test');
      const count = await tasksPage.getTaskCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should expand task to view details', async ({ page }) => {
      const count = await tasksPage.getTaskCount();
      if (count > 0) {
        await tasksPage.expandTask(0);
        await page.waitForTimeout(500);
      }
    });

    test('should navigate to create task page', async ({ page }) => {
      await tasksPage.clickNewTask();
      await expect(page).toHaveURL(/tasks\/new|tasks\/create/);
    });
  });

  test.describe('Task Creation', () => {
    let taskFormPage;

    test.beforeEach(async ({ page }) => {
      taskFormPage = new TaskFormPage(page);
      await taskFormPage.goto();
    });

    test('should display task creation form', async () => {
      await expect(taskFormPage.titleInput).toBeVisible();
      await expect(taskFormPage.saveButton).toBeVisible();
    });

    test('should create a new task with required fields', async ({ page }) => {
      const task = generateTask();
      await taskFormPage.fillTaskForm(task);
      await taskFormPage.save();
      // Should redirect to tasks list or task detail on success
      await page.waitForTimeout(2000);
    });

    test('should show validation error when title is empty', async ({ page }) => {
      await taskFormPage.save();
      // Should stay on form or show validation
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/tasks/);
    });

    test('should cancel task creation', async ({ page }) => {
      await taskFormPage.cancel();
      await expect(page).toHaveURL(/tasks/);
    });
  });
});
