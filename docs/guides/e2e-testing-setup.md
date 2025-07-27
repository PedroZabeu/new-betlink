# E2E Testing with Playwright - Setup Guide

## Overview
This guide explains how to set up and write E2E tests for BetLink using Playwright.

## Installation

```bash
npm install -D @playwright/test
npx playwright install
```

## Configuration

Create `playwright.config.ts` in the root:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Structure

### Basic Test Example
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page).toHaveTitle(/Login - BetLink/);
    await expect(page.locator('h1')).toContainText('Entrar');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', 'cliente@betlink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/cliente/dashboard');
  });
});
```

### Role-Based Access Test
```typescript
// tests/e2e/access-control.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Access Control', () => {
  test('client cannot access admin area', async ({ page }) => {
    // Login as client
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'cliente@betlink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access admin
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/access-denied');
  });
});
```

### Test Helpers
```typescript
// tests/e2e/helpers/auth.ts
import { Page } from '@playwright/test';

export async function loginAs(page: Page, role: 'master' | 'admin' | 'tipster' | 'cliente') {
  const credentials = {
    master: { email: 'master@betlink.com', password: 'password123' },
    admin: { email: 'admin@betlink.com', password: 'password123' },
    tipster: { email: 'tipster@betlink.com', password: 'password123' },
    cliente: { email: 'cliente@betlink.com', password: 'password123' },
  };

  await page.goto('/auth/login');
  await page.fill('input[type="email"]', credentials[role].email);
  await page.fill('input[type="password"]', credentials[role].password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}
```

## Priority Tests for BetLink

### 1. Authentication Flow
```typescript
test.describe('Authentication Flow', () => {
  test('complete signup flow', async ({ page }) => {
    await page.goto('/auth/sign-up');
    // Test signup
  });

  test('password reset flow', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    // Test password reset
  });

  test('logout functionality', async ({ page }) => {
    await loginAs(page, 'cliente');
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Sair');
    await expect(page).toHaveURL('/');
  });
});
```

### 2. Role-Based Navigation
```typescript
test.describe('Navigation by Role', () => {
  const roles = ['master', 'admin', 'tipster', 'cliente'] as const;

  for (const role of roles) {
    test(`${role} sees correct menu items`, async ({ page }) => {
      await loginAs(page, role);
      // Verify menu items based on role
    });
  }
});
```

### 3. Mobile Responsiveness
```typescript
test.describe('Mobile Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile menu works', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-testid="mobile-menu-trigger"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });
});
```

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run in UI mode (recommended for development)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run in debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Package.json Scripts

Add these scripts:
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

## CI/CD Integration

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use data-testid attributes**:
```tsx
<button data-testid="submit-button">Submit</button>
```

2. **Wait for navigation**:
```typescript
await Promise.all([
  page.waitForNavigation(),
  page.click('button[type="submit"]')
]);
```

3. **Use page objects**:
```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}
```

4. **Test critical paths first**:
- Authentication
- Payment flows
- Core business logic
- Access control

## Next Steps

1. Install Playwright
2. Create test directory structure
3. Write tests for EPIC 1 features
4. Set up CI/CD pipeline
5. Add visual regression tests