const { BasePage } = require('./BasePage');

/**
 * TasksPage - Task management, filtering, and CRUD operations
 */
class TasksPage extends BasePage {
  constructor(page) {
    super(page);
    // View tabs
    this.myTasksTab = page.getByRole('tab', { name: /my tasks/i }).or(page.locator('button').filter({ hasText: /my tasks/i }));
    this.assignedByMeTab = page.getByRole('tab', { name: /assigned by me/i }).or(page.locator('button').filter({ hasText: /assigned by me/i }));
    this.overdueTab = page.getByRole('tab', { name: /overdue/i }).or(page.locator('button').filter({ hasText: /overdue/i }));
    this.completedTab = page.getByRole('tab', { name: /completed/i }).or(page.locator('button').filter({ hasText: /completed/i }));
    this.allTasksTab = page.getByRole('tab', { name: /all tasks/i }).or(page.locator('button').filter({ hasText: /all tasks/i }));

    // Filters
    this.searchInput = page.getByPlaceholder(/search/i);
    this.statusFilter = page.getByLabel(/status/i).or(page.locator('select').filter({ hasText: /status/i }));
    this.priorityFilter = page.getByLabel(/priority/i).or(page.locator('select').filter({ hasText: /priority/i }));
    this.typeFilter = page.getByLabel(/type/i).or(page.locator('select').filter({ hasText: /type/i }));

    // Task list
    this.taskRows = page.locator('[class*="task-item"], [class*="task-row"], tr').filter({ has: page.locator('[class*="title"], td') });
    this.newTaskBtn = page.getByRole('button', { name: /new task|add task|create task/i });

    // Task detail (expanded)
    this.taskDetailPanel = page.locator('[class*="detail"], [class*="expanded"]');
    this.statusDropdown = page.locator('[class*="detail"]').getByLabel(/status/i);
    this.editTaskBtn = page.getByRole('button', { name: /edit/i });
    this.deleteTaskBtn = page.getByRole('button', { name: /delete/i });
  }

  async goto() {
    await super.goto('/tasks');
  }

  /**
   * Switch to a task view tab
   * @param {'myTasks' | 'assignedByMe' | 'overdue' | 'completed' | 'allTasks'} tab
   */
  async switchTab(tab) {
    const tabMap = {
      myTasks: this.myTasksTab,
      assignedByMe: this.assignedByMeTab,
      overdue: this.overdueTab,
      completed: this.completedTab,
      allTasks: this.allTasksTab,
    };
    await tabMap[tab].click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Search tasks
   * @param {string} text
   */
  async searchTasks(text) {
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get visible task count
   * @returns {Promise<number>}
   */
  async getTaskCount() {
    await this.page.waitForTimeout(300);
    return await this.taskRows.count();
  }

  /**
   * Click create new task
   */
  async clickNewTask() {
    await this.newTaskBtn.click();
  }

  /**
   * Click on a task to expand details
   * @param {number} index
   */
  async expandTask(index = 0) {
    await this.taskRows.nth(index).click();
  }

  /**
   * Get task title at index
   * @param {number} index
   * @returns {Promise<string>}
   */
  async getTaskTitle(index = 0) {
    return await this.taskRows.nth(index).locator('[class*="title"], td').first().textContent();
  }
}

module.exports = { TasksPage };
