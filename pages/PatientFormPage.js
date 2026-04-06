const { BasePage } = require('./BasePage');

/**
 * PatientFormPage - Create and edit patient form
 * Selectors matched to actual SolidEHR PatientFormPage.tsx
 */
class PatientFormPage extends BasePage {
  constructor(page) {
    super(page);

    // Page header
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /add patient|edit patient/i });
    this.backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    this.saveButton = page.getByRole('button', { name: /^save$|^saving/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.mandatoryToggle = page.getByText('Show mandatory fields only');

    // Toast & errors
    this.errorToast = page.locator('.fixed.top-4.right-4.z-50.bg-red-600');
    this.serverError = page.locator('.bg-red-50.text-red-700');
    this.validationErrors = page.locator('.text-xs.text-red-500');

    // Duplicate detection
    this.duplicateWarning = page.locator('.bg-amber-50.border-amber-200');
    this.duplicateText = page.locator('text=/potential duplicate/i');

    // === SECTION 1: Patient Basic Details ===
    this.firstNameInput = page.getByPlaceholder('First Name').first();
    this.middleNameInput = page.getByPlaceholder('Middle Name');
    this.lastNameInput = page.getByPlaceholder('Last Name').first();
    this.preferredNameInput = page.getByPlaceholder('Preferred Name');
    this.userNameInput = page.getByPlaceholder('User Name');
    // DOB has a visible text input (MM/DD/YY) and a hidden date picker overlay
    this.dobInput = page.getByPlaceholder('MM/DD/YYYY').or(page.getByPlaceholder('MM/DD/YY')).first();
    this.sexAtBirthSelect = page.getByLabel('Sex at Birth').or(page.locator('select').filter({ has: page.locator('option[value="Male"]') }).first());
    this.addressLine1Input = page.getByPlaceholder('Address Line 1').first();
    this.addressLine2Input = page.getByPlaceholder('Address Line 2').first();
    this.cityInput = page.getByPlaceholder('City').first();
    // State is a custom dropdown button, not a native <select>
    this.stateDropdownBtn = page.locator('label').filter({ hasText: /^State/ }).first().locator('..').locator('button');
    this.zipCodeInput = page.getByPlaceholder('Zip Code').first();
    this.mobileInput = page.getByPlaceholder('Mobile Number');
    this.emailInput = page.getByPlaceholder('Email ID').first();
    this.noEmailCheckbox = page.getByText("Patient doesn't have the Email ID").or(page.getByText("No Email"));
    this.timezoneSelect = page.locator('select').filter({ has: page.locator('option:text("America/New_York")') });
    this.commHome = page.getByLabel('Home');
    this.commMobile = page.getByLabel('Mobile');
    this.commEmail = page.getByLabel('Email');

    // === SECTION 2: Additional Details ===
    this.portalAccessCheckbox = page.getByText('Access to Patient Portal');
    this.languageSelect = page.getByLabel('Preferred Language').or(page.locator('select').filter({ has: page.locator('option:text("English")') })).first();
    this.raceSelect = page.getByLabel('Race').first();
    this.ethnicitySelect = page.getByLabel('Ethnicity').first();
    this.genderSelect = page.getByLabel('Gender').first();
    this.pronounSelect = page.getByPlaceholder('Pronoun').or(page.locator('select').filter({ has: page.locator('option:text("He/Him")') }));
    this.maritalStatusSelect = page.getByPlaceholder('Marital Status').or(page.locator('select').filter({ has: page.locator('option:text("Single")') }));
    this.ssnInput = page.getByPlaceholder('SSN');
    this.tagSelect = page.getByPlaceholder('Tag').or(page.locator('select').filter({ has: page.locator('option:text("New Patient")') }));
    this.uploadImageBtn = page.getByText('Upload Image');

    // === SECTION 3: Emergency Contact Details ===
    this.emergencySection = page.locator('text=/emergency contact details/i').locator('..');
    this.addEmergencyBtn = page.getByRole('button', { name: /add more/i });
    this.removeEmergencyBtns = page.locator('button').filter({ has: page.locator('svg[class*="trash"], [class*="Trash"]') });

    // === SECTION 4: Guarantor ===
    this.guarantorSection = page.locator('text=/guarantor/i').locator('..');
    this.guarantorYes = page.getByLabel('Yes').first();
    this.guarantorNo = page.getByLabel('No').first();
    this.addGuarantorBtn = page.getByRole('button', { name: /add guarantor/i });
    this.guarantorSameAddress = page.getByText("Address Same as Patient's Address");

    // === SECTION 5: Insurance Details ===
    this.insuranceSection = page.locator('text=/insurance details/i').locator('..');
    // Insurance radio buttons — use input[name="hasInsurance"]
    this.hasInsuranceYes = page.locator('input[name="hasInsurance"][value="true"]').or(
      page.locator('text=/have insurance/i').locator('..').locator('..').locator('label').filter({ hasText: /^Yes$/ }).first()
    );
    this.hasInsuranceNo = page.locator('input[name="hasInsurance"][value="false"]').or(
      page.locator('text=/have insurance/i').locator('..').locator('..').locator('label').filter({ hasText: /^No$/ }).first()
    );
    this.insuranceNameSelect = page.getByPlaceholder('Insurance Name').first();
    this.memberIdInput = page.getByPlaceholder('Member ID');
    this.groupNumberInput = page.getByPlaceholder('Group Number');
    this.insurancePlanInput = page.getByPlaceholder('Insurance Plan');
    this.subscriberPatient = page.getByLabel('Patient', { exact: true });
    this.subscriberGuarantor = page.getByLabel('Guarantor', { exact: true });
    this.insuranceStartDate = page.getByPlaceholder('MM/DD/YY').first();
    this.insuranceEndDate = page.getByPlaceholder('MM/DD/YY').nth(1);
    this.insuranceCardFront = page.locator('text=/drop front side/i').locator('..');
    this.insuranceCardBack = page.locator('text=/drop back side/i').locator('..');
    this.secondaryInsuranceName = page.locator('text=/secondary insurance/i').locator('..').getByPlaceholder('Insurance Name');
    this.secondaryPolicyNumber = page.getByPlaceholder('Policy Number').first();
    this.tertiaryInsuranceName = page.locator('text=/tertiary insurance/i').locator('..').getByPlaceholder('Insurance Name');

    // === SECTION 6: Provider Details ===
    this.providerSelect = page.locator('select').filter({ has: page.locator('option:text("Select Provider")') });
  }

  async goto() {
    await super.goto('/patients/new');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoEdit(patientId) {
    await super.goto(`/patients/${patientId}/edit`);
    await this.page.waitForLoadState('networkidle');
  }

  /** Fill mandatory demographics fields */
  async fillDemographics(data) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.middleName) await this.middleNameInput.fill(data.middleName);
    if (data.dateOfBirth) await this.dobInput.fill(data.dateOfBirth);
    if (data.sexAtBirth) {
      await this.sexAtBirthSelect.selectOption(data.sexAtBirth);
    }
  }

  /** Fill contact information */
  async fillContact(data) {
    if (data.email) await this.emailInput.fill(data.email);
    if (data.mobile) await this.mobileInput.fill(data.mobile);
  }

  /** Fill address information */
  async fillAddress(data) {
    if (data.addressLine1) await this.addressLine1Input.fill(data.addressLine1);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.state) {
      await this.stateDropdownBtn.click();
      await this.page.waitForTimeout(300);
      // Click the state option from the custom dropdown (uses abbreviations: NY, CA, etc.)
      await this.page.locator('.absolute.z-50').getByText(data.state, { exact: true }).first().click();
      await this.page.waitForTimeout(200);
    }
    if (data.zipCode) await this.zipCodeInput.fill(data.zipCode);
  }

  /** Fill all mandatory fields for patient creation */
  async fillMandatoryFields(data) {
    await this.fillDemographics(data);
    await this.fillContact(data);
    await this.fillAddress(data);
  }

  /** Fill additional details (optional) — many are custom dropdowns */
  async fillAdditionalDetails(data) {
    // These fields may be custom dropdowns or native selects — try both patterns
    for (const [label, value] of Object.entries(data)) {
      if (!value) continue;
      const labelEl = this.page.locator('label').filter({ hasText: new RegExp(`^${label}`, 'i') }).first();
      if (!(await labelEl.isVisible().catch(() => false))) continue;
      const parent = labelEl.locator('..');
      const nativeSelect = parent.locator('select');
      if (await nativeSelect.isVisible().catch(() => false)) {
        await nativeSelect.selectOption(value);
      } else {
        // Custom dropdown button
        const btn = parent.locator('button');
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await this.page.waitForTimeout(300);
          await this.page.locator('.absolute.z-50').getByText(value, { exact: true }).first().click();
          await this.page.waitForTimeout(200);
        }
      }
    }
  }

  /** Fill an emergency contact at given index (0-based) */
  async fillEmergencyContact(index, data) {
    const section = this.page.locator('text=/emergency contact details/i').locator('..').locator('..').locator('..');
    const contactBlock = section.locator('.grid, .space-y-4').nth(index);
    if (data.relationship) await contactBlock.getByPlaceholder('Relationship with Patient').selectOption(data.relationship);
    if (data.firstName) await contactBlock.getByPlaceholder('First Name').fill(data.firstName);
    if (data.lastName) await contactBlock.getByPlaceholder('Last Name').fill(data.lastName);
    if (data.phone) await contactBlock.getByPlaceholder('Phone Number').fill(data.phone);
    if (data.email) await contactBlock.getByPlaceholder('Email ID').fill(data.email);
  }

  /** Fill insurance details */
  async fillInsurance(data) {
    await this.hasInsuranceYes.click();
    await this.page.waitForTimeout(300);
    if (data.insuranceName) await this.insuranceNameSelect.selectOption(data.insuranceName);
    if (data.memberId) await this.memberIdInput.fill(data.memberId);
    if (data.groupNumber) await this.groupNumberInput.fill(data.groupNumber);
  }

  /** Submit the form */
  async save() {
    await this.saveButton.click();
  }

  /** Cancel the form */
  async cancel() {
    await this.cancelButton.click();
  }

  /** Check if validation errors are visible */
  async hasValidationErrors() {
    await this.page.waitForTimeout(500);
    const errorCount = await this.validationErrors.count();
    const toastVisible = await this.errorToast.isVisible().catch(() => false);
    return errorCount > 0 || toastVisible;
  }

  /** Get count of validation errors */
  async getValidationErrorCount() {
    return await this.validationErrors.count();
  }

  /** Check if duplicate warning is shown */
  async hasDuplicateWarning() {
    return await this.duplicateWarning.isVisible().catch(() => false);
  }

  /** Check if the form is in edit mode (pre-populated) */
  async isEditMode() {
    const title = await this.pageTitle.textContent();
    return /edit/i.test(title);
  }

  /** Get the value of a specific input */
  async getFieldValue(placeholder) {
    return await this.page.getByPlaceholder(placeholder).first().inputValue();
  }

  /** Get current URL path */
  getCurrentPath() {
    return new URL(this.page.url()).pathname;
  }

  /** Check if email field is disabled (no email checked) */
  async isEmailDisabled() {
    return await this.emailInput.isDisabled();
  }

  /** Toggle mandatory fields only */
  async toggleMandatoryOnly() {
    await this.mandatoryToggle.click();
    await this.page.waitForTimeout(300);
  }

  /** Check if SSN field auto-formats */
  async getFormattedSSN() {
    return await this.ssnInput.inputValue();
  }

  /** Check if phone field auto-formats */
  async getFormattedMobile() {
    return await this.mobileInput.inputValue();
  }
}

module.exports = { PatientFormPage };
