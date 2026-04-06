const { BasePage } = require('./BasePage');

/**
 * TaskFormPage - Create / edit a task
 */
class TaskFormPage extends BasePage {
  constructor(page) {
    super(page);
    this.titleInput = page.getByLabel(/title/i).or(page.locator('[name="title"]'));
    this.descriptionInput = page.getByLabel(/description/i).or(page.locator('[name="description"], textarea'));
    this.categorySelect = page.getByLabel(/category/i);
    this.taskTypeSelect = page.getByLabel(/task type|type/i);
    this.assignedToSelect = page.getByLabel(/assigned to/i);
    this.prioritySelect = page.getByLabel(/priority/i);
    this.dueDateInput = page.getByLabel(/due date/i);
    this.patientSearch = page.getByLabel(/patient/i);
    this.encounterSearch = page.getByLabel(/encounter/i);
    this.notesInput = page.getByLabel(/notes/i);
    this.saveButton = page.getByRole('button', { name: /save|create|submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
  }

  async goto() {
    await super.goto('/tasks/new');
  }

  /**
   * Fill task form with provided data
   * @param {object} data
   */
  async fillTaskForm(data) {
    await this.titleInput.fill(data.title);
    if (data.description) await this.descriptionInput.fill(data.description);
    if (data.priority) await this.prioritySelect.selectOption({ label: data.priority });
    if (data.taskType) await this.taskTypeSelect.selectOption({ label: data.taskType });
    if (data.dueDate) await this.dueDateInput.fill(data.dueDate);
  }

  /**
   * Submit the task form
   */
  async save() {
    await this.saveButton.click();
  }

  /**
   * Cancel and go back
   */
  async cancel() {
    await this.cancelButton.click();
  }
}

module.exports = { TaskFormPage };
