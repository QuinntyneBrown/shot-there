import { defineConfig, devices } from '@playwright/test';

const appPort = 4317;
const harnessPort = 4318;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'list',
  use: {
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'app',
      testDir: './e2e',
      testIgnore: 'library/**',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${appPort}` },
    },
    {
      name: 'library',
      testDir: './e2e/library',
      use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${harnessPort}` },
    },
  ],
  // Web servers start one after another, so the first builds the library both servers compile against.
  webServer: [
    {
      command: `npx ng build components && npx ng serve shot-there --configuration e2e --port ${appPort}`,
      url: `http://localhost:${appPort}`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
    {
      command: `npx ng serve components-harness --port ${harnessPort}`,
      url: `http://localhost:${harnessPort}`,
      reuseExistingServer: false,
      timeout: 300_000,
    },
  ],
});
