const { BasePage } = require('./BasePage');

/**
 * TriagePage - Pre-visit vitals and triage assessment
 */
class TriagePage extends BasePage {
  constructor(page) {
    super(page);
    // Vitals
    this.systolicInput = page.getByLabel(/systolic/i).or(page.locator('[name*="systolic"]'));
    this.diastolicInput = page.getByLabel(/diastolic/i).or(page.locator('[name*="diastolic"]'));
    this.heartRateInput = page.getByLabel(/heart rate/i).or(page.locator('[name*="heartRate"]'));
    this.temperatureInput = page.getByLabel(/temperature/i).or(page.locator('[name*="temperature"]'));
    this.weightInput = page.getByLabel(/weight/i).or(page.locator('[name*="weight"]'));
    this.heightInput = page.getByLabel(/height/i).or(page.locator('[name*="height"]'));
    this.respiratoryRateInput = page.getByLabel(/respiratory rate/i).or(page.locator('[name*="respiratoryRate"]'));
    this.oxygenSatInput = page.getByLabel(/oxygen saturation|spo2/i).or(page.locator('[name*="oxygenSat"]'));
    this.painLevelInput = page.getByLabel(/pain/i).or(page.locator('[name*="painLevel"], input[type="range"]'));

    // BMI
    this.bmiDisplay = page.locator('[class*="bmi"]').or(page.locator('text=/bmi/i'));

    // Assessment
    this.chiefComplaintInput = page.getByLabel(/chief complaint/i).or(page.locator('[name*="chiefComplaint"]'));
    this.assessmentNotesInput = page.getByLabel(/assessment notes/i).or(page.locator('[name*="assessmentNotes"]'));
    this.providerNotesInput = page.getByLabel(/provider notes/i).or(page.locator('[name*="providerNotes"]'));
    this.medicationsReviewedCheckbox = page.getByLabel(/medications reviewed/i);

    // Actions
    this.saveDraftBtn = page.getByRole('button', { name: /save draft/i });
    this.completeTriageBtn = page.getByRole('button', { name: /complete triage|complete/i });

    // History
    this.historySection = page.locator('[class*="history"]');
  }

  /**
   * Navigate to triage for a specific appointment
   * @param {string} appointmentId
   */
  async goto(appointmentId) {
    await super.goto(`/triage/${appointmentId}`);
  }

  /**
   * Fill all vitals
   * @param {object} vitals
   */
  async fillVitals(vitals) {
    if (vitals.systolic) await this.systolicInput.fill(vitals.systolic);
    if (vitals.diastolic) await this.diastolicInput.fill(vitals.diastolic);
    if (vitals.heartRate) await this.heartRateInput.fill(vitals.heartRate);
    if (vitals.temperature) await this.temperatureInput.fill(vitals.temperature);
    if (vitals.weight) await this.weightInput.fill(vitals.weight);
    if (vitals.height) await this.heightInput.fill(vitals.height);
    if (vitals.respiratoryRate) await this.respiratoryRateInput.fill(vitals.respiratoryRate);
    if (vitals.oxygenSaturation) await this.oxygenSatInput.fill(vitals.oxygenSaturation);
    if (vitals.painLevel) await this.painLevelInput.fill(vitals.painLevel);
    if (vitals.chiefComplaint) await this.chiefComplaintInput.fill(vitals.chiefComplaint);
  }

  /**
   * Save vitals as draft
   */
  async saveDraft() {
    await this.saveDraftBtn.click();
  }

  /**
   * Complete triage
   */
  async completeTriage() {
    await this.completeTriageBtn.click();
  }

  /**
   * Check if BMI is displayed
   * @returns {Promise<boolean>}
   */
  async isBmiVisible() {
    return await this.bmiDisplay.isVisible();
  }
}

module.exports = { TriagePage };
