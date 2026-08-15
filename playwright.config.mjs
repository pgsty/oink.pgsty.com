import { existsSync } from 'node:fs';
import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const moduleWorkspace =
  process.env.HUGO_MODULE_WORKSPACE ||
  (existsSync('go.work') ? 'go.work' : undefined);

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tmp/playwright-report', open: 'never' }],
  ],
  outputDir: 'tmp/playwright-results',
  use: {
    baseURL,
    launchOptions: executablePath ? { executablePath } : undefined,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          'npm run _serve -- --config hugo.yml,tests/fixtures/browser.yml --bind 127.0.0.1 --port 4173 --noBuildLock --disableLiveReload --watch=false',
        env: moduleWorkspace
          ? { HUGO_MODULE_WORKSPACE: moduleWorkspace }
          : undefined,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
