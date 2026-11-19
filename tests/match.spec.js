// One screenshot per section, per project (desktop/mobile x light/dark).
// Moving parts are masked (bird flock, film, hero word) or hidden (race bar), so only real design changes fail.
const { test: base, expect } = require('@playwright/test');

// theme is a per-project option (see playwright.config.js). It must be declared with extend, not use,
// or the file-level value overrides the project and every run is light.
const test = base.extend({ theme: ['light', { option: true }] });

const SECTIONS = [
  ['01-hero', 'section.hero'], ['03-who', '#who'],
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
  const masks = [page.locator('canvas'), page.locator('video'), page.locator('.swap')];
  for (const [name, sel] of SECTIONS) {
    if (name === '03-who') await page.addStyleTag({ content: 'header.site,.chat-btn,.to-top{visibility:hidden!important}' });
    // The race bar animates. It is hidden rather than masked: it sits on a sub-pixel offset,
    // so a mask's anti-aliased edge changed by a pixel from run to run.
    if (name === '10-proof') await page.addStyleTag({ content: '#race{visibility:hidden!important}' });
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

test('Privacy and Terms pages load cleanly and carry the site header and footer', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(r.status() + ' ' + r.url()); });
  for (const [path, heading] of [['/privacy/', 'Privacy policy'], ['/terms/', 'Terms of service']]) {
    await page.goto(path, { waitUntil: 'load' });
    await expect(page.locator('h1')).toHaveText(heading);
    await expect(page.locator('header.site')).toBeVisible();
    await expect(page.locator('footer .legal a[href="/privacy/"]')).toHaveCount(1);
    await expect(page.locator('footer .legal a[href="/terms/"]')).toHaveCount(1);
    expect(await page.locator('main').innerText()).not.toMatch(/\[[^\]]+\]/); // no leftover [placeholders]
  }
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('newsletter form: consent gate, loading, success and error states, and the request it sends', async ({ page }) => {
  const CONSENT_TEXT = 'I’d like to receive the Wildstack newsletter with design tips and product news. Unsubscribe anytime. See our Privacy Policy.';
  let sent = null, release;
  const gate = new Promise(r => { release = r; });
  await page.route('**/api/newsletter', async route => {
    sent = JSON.parse(route.request().postData());
    await gate;
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });
  await page.goto('/', { waitUntil: 'load' });
  const email = page.locator('#email'), consent = page.locator('#consent'), sub = page.locator('#form-sub');
  const btn = page.locator('#news-form button[type="submit"]'), trap = page.locator('#company');

  await expect(consent).not.toBeChecked();
  await expect(btn).toBeDisabled();
  await email.fill('not-an-email'); await consent.check();
  await expect(btn).toBeDisabled();
  await email.fill('Jane@Example.com');
  await expect(btn).toBeEnabled();
  await consent.uncheck();
  await expect(btn).toBeDisabled();

  await expect(trap).toHaveAttribute('tabindex', '-1');
  expect(await trap.evaluate(el => !!el.closest('[aria-hidden="true"]'))).toBe(true);
  await expect(page.locator('label[for="email"]')).toHaveCount(1);
  await expect(page.locator('label.consent[for="consent"] a[href="/privacy/"]')).toHaveCount(1);

  await consent.check();
  await email.press('Enter');
  await expect(btn).toHaveText('Signing up...');
  await expect(btn).toBeDisabled();
  release();
  await expect(sub).toHaveText('You’re on the list. Thanks!');
  await expect(btn).toHaveText('Sign up');
  await expect(email).toHaveValue('');
  await expect(consent).not.toBeChecked();
  expect(sent).toMatchObject({ email: 'Jane@Example.com', consent: true, company: '', consentText: CONSENT_TEXT });
  expect(sent.source).toBe('http://localhost:4173/');

  await page.unroute('**/api/newsletter');
  await page.route('**/api/newsletter', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'x' }) }));
  await email.fill('jane@example.com'); await consent.check();
  await email.press('Enter');
  await expect(sub).toHaveText('Something went wrong. Try again or email hello@wildstack.studio');
  await expect(btn).toHaveText('Sign up');
});

test('chat is replaced by an email button, and the page loads nothing from other sites', async ({ page }) => {
  const hosts = new Set();
  page.on('request', r => { try { const u = new URL(r.url()); if (u.protocol.startsWith('http')) hosts.add(u.host); } catch (e) {} });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const btn = page.locator('a.chat-btn');
  await expect(btn).toHaveAttribute('href', 'mailto:hello@wildstack.studio?subject=Hi%20Wildstack');
  await expect(btn).toHaveAttribute('aria-label', 'Email us');
  await expect(page.locator('#chat-panel')).toHaveCount(0);
  expect([...hosts].filter(h => h !== 'localhost:4173')).toEqual([]);
});
