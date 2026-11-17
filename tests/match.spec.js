// One screenshot per section, per project (desktop/mobile x light/dark).
// Moving parts (bird flock, film, race bar) are masked, so only real design changes fail.
const { test: base, expect } = require('@playwright/test');

// theme is a per-project option (see playwright.config.js). It must be declared with extend, not use,
// or the file-level value overrides the project and every run is light.
const test = base.extend({ theme: ['light', { option: true }] });

const SECTIONS = [
  ['01-hero', 'section.hero'], ['02-logos', '#customers'], ['03-who', '#who'],
  ['04-how', '#how'], ['05-team', '#team'], ['06-print', '#print'],
  ['07-enterprise', '#enterprise'], ['08-compare', '#compare'], ['09-pricing', '#pricing'],
  ['10-proof', '#proof'], ['11-about', '#about'], ['12-faq', '#faq'],
  ['13-closing', '#demo'], ['14-footer', 'footer'],
];

test('page matches the approved design', async ({ page, theme }) => {
  await page.addInitScript(t => { try { localStorage.setItem('ws-theme', t); } catch (e) {} }, theme);
  await page.goto('/', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500); // images switch to eager loading 200 ms after load
  const masks = [page.locator('canvas'), page.locator('video'), page.locator('#race'), page.locator('.swap')];
  for (const [name, sel] of SECTIONS) {
    if (name === '02-logos') await page.addStyleTag({ content: 'header.site,.chat-btn,.to-top{visibility:hidden!important}' });
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await expect.soft(el).toHaveScreenshot(name + '.png', { mask: masks });
  }
});

test('no console errors and no broken files', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  expect(errors).toEqual([]);
});

test('every "Book a call" button opens Calendly', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const hrefs = await page.locator('[data-cta]').evaluateAll(a => a.map(x => x.href));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const h of hrefs) expect(h).toContain('calendly.com/');
});
