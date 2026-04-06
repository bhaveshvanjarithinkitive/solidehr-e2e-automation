const { BasePage } = require('./BasePage');

/**
 * EncounterPage - Clinical encounter with SOAP notes, diagnoses, CPT codes, and signing
 */
class EncounterPage extends BasePage {
  constructor(page) {
    super(page);
    // Patient info
    this.patientName = page.locator('[class*="patient-name"], [class*="header"]').filter({ hasText: /\w+ \w+/ }).first();

    // Reason for visit
    this.reasonForVisitInput = page.getByLabel(/reason for visit/i).or(page.locator('[name*="reason"]'));

    // SOAP sections
    this.subjectiveTextarea = page.getByLabel(/subjective/i).or(page.locator('textarea[name*="subjective"]'));
    this.objectiveTextarea = page.getByLabel(/objective/i).or(page.locator('textarea[name*="objective"]'));
    this.assessmentTextarea = page.getByLabel(/assessment/i).or(page.locator('textarea[name*="assessment"]'));
    this.planTextarea = page.getByLabel(/plan/i).or(page.locator('textarea[name*="plan"]'));

    // Diagnoses
    this.addDiagnosisBtn = page.getByRole('button', { name: /add diagnosis/i });
    this.diagnosisSearchInput = page.locator('[class*="modal"], [role="dialog"]').getByPlaceholder(/search/i);
    this.diagnosisTable = page.locator('table, [class*="table"]').filter({ hasText: /icd/i });

    // CPT Codes
    this.addCptBtn = page.getByRole('button', { name: /add cpt/i });
    this.cptSearchInput = page.locator('[class*="modal"], [role="dialog"]').getByPlaceholder(/search/i);
    this.cptTable = page.locator('table, [class*="table"]').filter({ hasText: /cpt/i });

    // Clinical sidebar
    this.allergiesSection = page.locator('[class*="sidebar"], aside').filter({ hasText: /allerg/i });
    this.medicationsSection = page.locator('[class*="sidebar"], aside').filter({ hasText: /medication/i });
    this.vitalsSection = page.locator('[class*="sidebar"], aside').filter({ hasText: /vital/i });

    // Actions
    this.saveDraftBtn = page.getByRole('button', { name: /save draft/i });
    this.signLockBtn = page.getByRole('button', { name: /sign.*lock|sign encounter/i });
    this.downloadPdfBtn = page.getByRole('button', { name: /download|pdf/i });

    // Sign modal
    this.signModal = page.locator('[class*="modal"], [role="dialog"]');
    this.signatureInput = page.locator('[class*="modal"], [role="dialog"]').getByLabel(/signature/i).or(page.locator('[class*="modal"] input[name*="signature"]'));
    this.confirmSignBtn = page.locator('[class*="modal"], [role="dialog"]').getByRole('button', { name: /sign|confirm/i });
    this.nextStepBtn = page.locator('[class*="modal"], [role="dialog"]').getByRole('button', { name: /next|continue/i });
  }

  /**
   * Navigate to a specific encounter
   * @param {string} encounterId
   */
  async goto(encounterId) {
    await super.goto(`/encounters/${encounterId}`);
  }

  /**
   * Fill SOAP notes
   * @param {object} notes - { reasonForVisit, subjective, objective, assessment, plan }
   */
  async fillSoapNotes(notes) {
    if (notes.reasonForVisit) await this.reasonForVisitInput.fill(notes.reasonForVisit);
    if (notes.subjective) await this.subjectiveTextarea.fill(notes.subjective);
    if (notes.objective) await this.objectiveTextarea.fill(notes.objective);
    if (notes.assessment) await this.assessmentTextarea.fill(notes.assessment);
    if (notes.plan) await this.planTextarea.fill(notes.plan);
  }

  /**
   * Add a diagnosis by ICD code search
   * @param {string} searchTerm
   */
  async addDiagnosis(searchTerm) {
    await this.addDiagnosisBtn.click();
    await this.diagnosisSearchInput.fill(searchTerm);
    await this.page.waitForTimeout(500);
    await this.page.locator('[class*="result"], [role="option"], [class*="suggestion"]').first().click();
  }

  /**
   * Add a CPT code by search
   * @param {string} searchTerm
   */
  async addCptCode(searchTerm) {
    await this.addCptBtn.click();
    await this.cptSearchInput.fill(searchTerm);
    await this.page.waitForTimeout(500);
    await this.page.locator('[class*="result"], [role="option"], [class*="suggestion"]').first().click();
  }

  /**
   * Save as draft
   */
  async saveDraft() {
    await this.saveDraftBtn.click();
  }

  /**
   * Sign and lock encounter (3-step process)
   * @param {string} signatureText
   */
  async signAndLock(signatureText) {
    await this.signLockBtn.click();
    // Step 1: Validation - click next
    await this.nextStepBtn.click();
    // Step 2: Summary - click next
    await this.nextStepBtn.click();
    // Step 3: Signature
    await this.signatureInput.fill(signatureText);
    await this.confirmSignBtn.click();
  }

  /**
   * Check if encounter is in signed/locked state
   * @returns {Promise<boolean>}
   */
  async isSigned() {
    const signedIndicator = this.page.locator('text=/signed|locked/i');
    return await signedIndicator.isVisible();
  }

  /**
   * Get diagnosis count
   * @returns {Promise<number>}
   */
  async getDiagnosisCount() {
    const rows = this.diagnosisTable.locator('tbody tr, [class*="row"]');
    return await rows.count();
  }

  /**
   * Get CPT code count
   * @returns {Promise<number>}
   */
  async getCptCodeCount() {
    const rows = this.cptTable.locator('tbody tr, [class*="row"]');
    return await rows.count();
  }
}

module.exports = { EncounterPage };
