import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Disable parallel tests as we have a shared server and DB state.
  fullyParallel: false,
  workers: 1,

  // Reporter to use
  reporter: 'list',

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://0.0.0.0:3000',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
  },
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'ALLOW_RESET_DATABASE=true npm run start',
    url: 'http://0.0.0.0:3000',
    reuseExistingServer: !process.env.CI,
  },
});