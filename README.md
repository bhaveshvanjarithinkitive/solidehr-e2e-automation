# SolidEHR E2E Automation

Playwright-based E2E test automation for the SolidEHR Provider Portal.

## Test Coverage

| Module | Tests | Source TCs | Coverage |
|--------|-------|------------|----------|
| CPT Codes | 56 | 73 | 76.7% |
| Patients | 93 | 95 | 97.9% |
| Login | 12 | — | — |
| Dashboard | 11 | — | — |
| Scheduling | 8 | — | — |
| Encounters | 6 | — | — |
| Tasks | 12 | — | — |
| Billing | 10 | — | — |
| Triage | 3 | — | — |
| Settings | 7 | — | — |
| **Total** | **218** | | |

## Setup

```bash
npm ci
npx playwright install chromium
cp .env.example .env  # Edit with your credentials
```

## Run Tests

```bash
npm test                    # All tests
npm run test:patients       # Patients module (93 tests)
npm run test:cpt-codes      # CPT Codes module (56 tests)
npm run test:headed         # With browser visible
npm run test:ui             # Interactive UI mode
npm run report              # View HTML report
```

## GitHub Actions

Tests run automatically on push/PR to `main`. You can also trigger manually via `workflow_dispatch` and select a specific module to run.

### Required Secrets

| Secret | Description |
|--------|-------------|
| `BASE_URL` | Application URL (e.g., `https://solid-ai.customemr.ai`) |
| `TEST_USER_EMAIL` | Test user email |
| `TEST_USER_PASSWORD` | Test user password |

## Architecture

- **Design Pattern:** Page Object Model (POM)
- **Framework:** Playwright
- **Language:** JavaScript (ES6+, CommonJS)
- **Test Data:** Faker.js for dynamic data
- **Auth:** Shared auth state via `storageState`
