/**
 * Newsletter sign-up: website form -> this route -> Google Apps Script web app -> Google Sheet.
 * The browser never talks to Google, so the script URL and the secret stay private.
 *
 * Vercel env vars:
 *   NEWSLETTER_SHEET_URL  the Apps Script web app URL (ends in /exec)
 *   NEWSLETTER_SECRET     the same long random string as the NEWSLETTER_SECRET script property
 * Script to paste into Google: scripts/newsletter-apps-script.gs
 *
 * Privacy: IP addresses are not read, stored or forwarded. Email addresses are never logged.
 */
'use strict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const MAX_EMAIL = 254;
const MAX_CONSENT_TEXT = 500;
const MAX_SOURCE = 300;
const UPSTREAM_TIMEOUT_MS = 10000;

const DEFAULT_CONSENT_TEXT =
  'I’d like to receive the Wildstack newsletter with design tips and product news. Unsubscribe anytime. See our Privacy Policy.';
const GENERIC_ERROR = 'Something went wrong. Try again or email hello@wildstack.studio';

/** Collapse whitespace, drop control characters and cap the length. Non-strings become ''. */
function clean(value, max) {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid request.' });
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ ok: false, error: 'Invalid request.' });
  }

  // Honeypot: real visitors never see this field. A bot that fills it gets a fake success and nothing is saved.
  if (typeof body.company === 'string' && body.company.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > MAX_EMAIL || CONTROL_CHARS.test(email) || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
  }
  if (body.consent !== true) {
    return res.status(400).json({ ok: false, error: 'Please tick the box to confirm you want the newsletter.' });
  }

  const sheetUrl = process.env.NEWSLETTER_SHEET_URL;
  const secret = process.env.NEWSLETTER_SECRET;
  if (!sheetUrl || !secret) {
    console.error('Newsletter: NEWSLETTER_SHEET_URL or NEWSLETTER_SECRET is not set');
    return res.status(503).json({ ok: false, error: GENERIC_ERROR });
  }

  const payload = {
    secret,
    email,
    consent: true,
    // The exact text the visitor saw next to the checkbox. Falls back to the default if the form did not send it.
    consentText: clean(body.consentText, MAX_CONSENT_TEXT) || DEFAULT_CONSENT_TEXT,
    source: clean(body.source, MAX_SOURCE),
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    // text/plain keeps this a "simple" request. Apps Script answers a POST with a redirect that fetch follows.
    const upstream = await fetch(sheetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: controller.signal,
    });

    let result = null;
    try {
      result = JSON.parse(await upstream.text());
    } catch {
      result = null;
    }

    if (!upstream.ok || !result || result.ok !== true) {
      const reason = result && typeof result.error === 'string' ? result.error.slice(0, 80) : 'no JSON in reply';
      console.error('Newsletter: Apps Script did not accept the sign-up (HTTP ' + upstream.status + '): ' + reason);
      return res.status(502).json({ ok: false, error: GENERIC_ERROR });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Newsletter: request to Apps Script failed (' + (err && err.name ? err.name : 'error') + ')');
    return res.status(502).json({ ok: false, error: GENERIC_ERROR });
  } finally {
    clearTimeout(timer);
  }
};
