const { BasePage } = require('./BasePage');

/**
 * PatientProfilePage - Patient profile view with sidebar navigation
 * Selectors matched to actual SolidEHR PatientProfilePage.tsx
 */
class PatientProfilePage extends BasePage {
  constructor(page) {
    super(page);

    // Patient header
    this.patientName = page.locator('.text-xl.font-bold');
    this.patientMRN = page.locator('text=/ID:/i');
    this.patientDOB = page.locator('text=/DOB:/i');
    this.patientGender = page.locator('.rounded-full.bg-gray-100').filter({ has: page.locator('svg') }).nth(1);
    this.statusBadge = page.locator('.rounded-full').filter({ hasText: /active|inactive/i });
    this.phoneInfo = page.locator('text=/\\(\\d{3}\\)/');
    this.emailInfo = page.locator('[class*="text-text-secondary"]').filter({ hasText: /@/ });

    // Avatar
    this.avatarImage = page.locator('img.rounded-full');
    this.avatarFallback = page.locator('.bg-gradient-to-br.from-blue-500');
    this.uploadPhotoBtn = page.locator('.group-hover\\:opacity-100').locator('button').first();
    this.deletePhotoBtn = page.locator('.group-hover\\:opacity-100').locator('button').last();

    // Sidebar navigation items
    this.sidebarItems = {
      facesheet: page.getByText('Face Sheet'),
      timeline: page.getByText('Timeline'),
      intakeForms: page.getByText('Intake Forms'),
      appointments: page.getByText('Appointments', { exact: true }),
      documents: page.getByText('Documents'),
      lab: page.getByText('Lab', { exact: true }),
      imaging: page.getByText('Imaging'),
      assessment: page.getByText('Assessment'),
      history: page.getByText('History', { exact: true }),
      vitals: page.getByText('Vitals', { exact: true }),
      medications: page.getByText('Medications'),
      diagnoses: page.getByText('Diagnoses'),
      allergies: page.getByText('Allergies'),
      vaccine: page.getByText('Vaccine'),
      visitDetails: page.getByText('Visit Details'),
      referrals: page.getByText('Referrals'),
      billing: page.getByText('Billing', { exact: true }),
      nonClinicalNote: page.getByText('Non Clinical Note'),
      advanceDirectives: page.getByText('Advance Directives'),
    };

    // Facesheet sections
    this.diagnosesSection = page.locator('text=/diagnoses/i').first().locator('..');
    this.medicationsSection = page.locator('text=/medications/i').first().locator('..');
    this.allergiesSection = page.locator('text=/allergies/i').first().locator('..');
    this.vitalsSection = page.locator('text=/vitals/i').first().locator('..');
    this.vaccinesSection = page.locator('text=/vaccines/i').first().locator('..');

    // Section edit/add buttons
    this.addDiagnosisBtn = this.diagnosesSection.locator('button').filter({ has: page.locator('svg') });
    this.addMedicationBtn = this.medicationsSection.locator('button').filter({ has: page.locator('svg') });
    this.addAllergyBtn = this.allergiesSection.locator('button').filter({ has: page.locator('svg') });

    // Empty states
    this.emptyDiagnoses = page.locator('text=/no diagnoses on file/i');
    this.emptyMedications = page.locator('text=/no medications on file/i');
    this.emptyAllergies = page.locator('text=/no allergies on file/i');

    // Modals (overlay)
    this.modal = page.locator('.fixed.inset-0.z-50');
    this.modalSaveBtn = this.modal.getByRole('button', { name: /^save$/i });
    this.modalCancelBtn = this.modal.getByRole('button', { name: /cancel/i });

    // Error/loading
    this.loadingSpinner = page.locator('.animate-pulse');
    this.errorAlert = page.locator('.bg-red-50.text-red-700');
  }

  async goto(patientId) {
    await super.goto(`/patients/${patientId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Navigate to a sidebar section */
  async navigateToSection(section) {
    await this.sidebarItems[section].click();
    await this.page.waitForTimeout(500);
  }

  /** Get the patient's full name */
  async getPatientFullName() {
    return (await this.patientName.textContent()).trim();
  }

  /** Get the MRN text */
  async getMRN() {
    return (await this.patientMRN.textContent()).trim();
  }

  /** Check if a sidebar section is active */
  async isSectionActive(section) {
    const item = this.sidebarItems[section];
    const classList = await item.getAttribute('class');
    return classList?.includes('blue') || false;
  }

  /** Check if profile loaded successfully */
  async isProfileLoaded() {
    return await this.patientName.isVisible().catch(() => false);
  }

  /** Check if profile shows error (404) */
  async hasError() {
    return await this.errorAlert.isVisible().catch(() => false);
  }
}

module.exports = { PatientProfilePage };
