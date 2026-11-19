/**
 * Wildstack newsletter sign-ups -> Google Sheet.
 *
 * Paste this whole file into the Apps Script editor of the "Wildstack newsletter" Google Sheet
 * (Extensions > Apps Script), then deploy it as a web app. Setup steps are in the pull request.
 *
 * The website never calls this directly. It posts to /api/newsletter on Vercel, which forwards here
 * with the secret. The secret lives in Script Properties (NEWSLETTER_SECRET), never in this file.
 *
 * Sheet tab: "Subscribers"
 * Columns:   Signed up (UTC) | Email | Consent | Consent text | Source page | Status
 */

var SHEET_NAME = 'Subscribers';
var HEADERS = ['Signed up (UTC)', 'Email', 'Consent', 'Consent text', 'Source page', 'Status'];
var EMAIL_COLUMN = 2;
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var MAX_EMAIL_LENGTH = 254;
var MAX_CONSENT_TEXT_LENGTH = 500;
var MAX_SOURCE_LENGTH = 300;

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = false;
  try {
    var data = parseBody_(e);
    if (!data) {
      return respond_({ ok: false, error: 'Bad request' });
    }

    // 1. Secret check, before anything else.
    var secret = PropertiesService.getScriptProperties().getProperty('NEWSLETTER_SECRET');
    if (!secret || !safeEqual_(String(data.secret || ''), secret)) {
      return respond_({ ok: false, error: 'Unauthorized' });
    }

    // 2. Email: trim, lowercase, check the format.
    var email = String(data.email || '').trim().toLowerCase();
    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
      return respond_({ ok: false, error: 'Invalid email' });
    }

    // 3. Consent has to be exactly true.
    if (data.consent !== true) {
      return respond_({ ok: false, error: 'Consent is required' });
    }

    // 4. One sign-up at a time, so two people signing up together cannot clash.
    lock.waitLock(10000);
    hasLock = true;

    var sheet = getSheet_();
    if (emailExists_(sheet, email)) {
      return respond_({ ok: true }); // already on the list: success, no duplicate row
    }

    var consentText = String(data.consentText || '').slice(0, MAX_CONSENT_TEXT_LENGTH);
    var source = String(data.source || '').slice(0, MAX_SOURCE_LENGTH);
    appendSubscriber_(sheet, new Date().toISOString(), email, consentText, source);
    return respond_({ ok: true });
  } catch (err) {
    console.error('newsletter doPost failed: ' + err);
    return respond_({ ok: false, error: 'Server error' });
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

/** Reads the JSON body that /api/newsletter sends (as text/plain). Returns null if it is not a JSON object. */
function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return null;
  }
  try {
    var parsed = JSON.parse(e.postData.contents);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
}

/** Finds the "Subscribers" tab (creating it if missing) and adds the header row when the sheet is empty. */
function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function emailExists_(sheet, email) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return false;
  }
  var emails = sheet.getRange(2, EMAIL_COLUMN, lastRow - 1, 1).getValues();
  for (var i = 0; i < emails.length; i++) {
    if (String(emails[i][0]).trim().toLowerCase() === email) {
      return true;
    }
  }
  return false;
}

/**
 * Writes one row. Text columns are set to plain text first, so a value that starts with = + - or @
 * is stored as text and never run as a spreadsheet formula.
 */
function appendSubscriber_(sheet, timestamp, email, consentText, source) {
  var row = sheet.getLastRow() + 1;
  var range = sheet.getRange(row, 1, 1, HEADERS.length);
  range.setNumberFormats([['@', '@', 'General', '@', '@', '@']]);
  range.setValues([[timestamp, email, true, consentText, source, 'subscribed']]);
}

/** Compares two strings without stopping at the first difference. */
function safeEqual_(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  var diff = 0;
  for (var i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function respond_(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}
