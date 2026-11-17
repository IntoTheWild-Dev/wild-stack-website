// Visual match test. It compares every section of the page with screenshots
// taken from the approved design. See CLAUDE.md, "Match test".
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  snapshotDir: 'tests/baseline',
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{arg}{ext}',
  timeout: 120000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: 'disabled', caret: 'hide' } },
  use: { baseURL: 'http://localhost:4173', reducedMotion: 'reduce' },
  webServer: { command: 'npx serve . -l 4173', url: 'http://localhost:4173', reuseExistingServer: true },
  projects: [
    { name: 'desktop-light', use: { viewport: { width: 1440, height: 900 }, theme: 'light' } },
    { name: 'desktop-dark',  use: { viewport: { width: 1440, height: 900 }, theme: 'dark' } },
    { name: 'mobile-light',  use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', theme: 'light' } },
    { name: 'mobile-dark',   use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', theme: 'dark' } },
  ],
});
