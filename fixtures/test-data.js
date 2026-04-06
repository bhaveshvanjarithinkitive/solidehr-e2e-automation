/**
 * Static and dynamic test data for SolidEHR E2E tests
 */
const { faker } = require('@faker-js/faker');

/** Valid provider login credentials (from .env or defaults) */
const credentials = {
  email: process.env.TEST_USER_EMAIL || 'provider@solidehr.com',
  password: process.env.TEST_USER_PASSWORD || 'Password123!',
};

/** Invalid credentials for negative tests */
const invalidCredentials = {
  wrongEmail: 'nonexistent@solidehr.com',
  wrongPassword: 'WrongPassword!',
  emptyEmail: '',
  emptyPassword: '',
  invalidEmailFormat: 'not-an-email',
};

/**
 * Generates a new patient record with random data
 * @returns {object}
 */
function generatePatient() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const dob = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });
  const mm = String(dob.getMonth() + 1).padStart(2, '0');
  const dd = String(dob.getDate()).padStart(2, '0');
  const yyyy = String(dob.getFullYear());

  return {
    firstName,
    lastName,
    middleName: faker.person.middleName(),
    dateOfBirth: `${mm}/${dd}/${yyyy}`,
    gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
    sexAtBirth: faker.helpers.arrayElement(['Male', 'Female']),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    mobile: faker.string.numeric(10),
    addressLine1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.helpers.arrayElement(['NY', 'CA', 'TX', 'FL', 'IL']),
    zipCode: faker.location.zipCode('#####'),
    race: faker.helpers.arrayElement(['White', 'Black or African American', 'Asian']),
    ethnicity: faker.helpers.arrayElement(['Hispanic or Latino', 'Not Hispanic or Latino']),
    maritalStatus: faker.helpers.arrayElement(['Single', 'Married', 'Divorced']),
  };
}

/**
 * Generates appointment data
 * @returns {object}
 */
function generateAppointment() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
    date: tomorrow.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    reason: faker.lorem.sentence(),
    mode: faker.helpers.arrayElement(['IN_PERSON', 'TELEHEALTH']),
  };
}

/**
 * Generates task data
 * @returns {object}
 */
function generateTask() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);
  return {
    title: `Test Task - ${faker.lorem.words(3)}`,
    description: faker.lorem.paragraph(),
    priority: faker.helpers.arrayElement(['URGENT', 'HIGH', 'MEDIUM', 'LOW']),
    taskType: faker.helpers.arrayElement(['CLINICAL', 'ADMINISTRATIVE', 'BILLING', 'FOLLOW_UP']),
    dueDate: dueDate.toISOString().split('T')[0],
  };
}

/**
 * Generates triage/vitals data
 * @returns {object}
 */
function generateVitals() {
  return {
    systolic: faker.number.int({ min: 100, max: 140 }).toString(),
    diastolic: faker.number.int({ min: 60, max: 90 }).toString(),
    heartRate: faker.number.int({ min: 60, max: 100 }).toString(),
    temperature: faker.number.float({ min: 97.0, max: 99.5, fractionDigits: 1 }).toString(),
    weight: faker.number.int({ min: 50, max: 120 }).toString(),
    height: faker.number.int({ min: 150, max: 190 }).toString(),
    respiratoryRate: faker.number.int({ min: 12, max: 20 }).toString(),
    oxygenSaturation: faker.number.int({ min: 95, max: 100 }).toString(),
    painLevel: faker.number.int({ min: 0, max: 5 }).toString(),
    chiefComplaint: faker.lorem.sentence(),
  };
}

/**
 * Generates SOAP encounter notes
 * @returns {object}
 */
function generateEncounterNotes() {
  return {
    reasonForVisit: faker.lorem.sentence(),
    subjective: `Patient presents with ${faker.lorem.sentence()}. Reports symptoms for ${faker.number.int({ min: 1, max: 14 })} days.`,
    objective: `Vitals stable. Physical exam: ${faker.lorem.sentence()}.`,
    assessment: `Assessment: ${faker.lorem.sentence()}. Differential includes ${faker.lorem.words(3)}.`,
    plan: `Plan: ${faker.lorem.sentence()}. Follow up in ${faker.number.int({ min: 1, max: 4 })} weeks.`,
  };
}

module.exports = {
  credentials,
  invalidCredentials,
  generatePatient,
  generateAppointment,
  generateTask,
  generateVitals,
  generateEncounterNotes,
};
