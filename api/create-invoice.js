/**
 * Xendit Invoice API — create a hosted checkout URL.
 * Deploy with Vercel (or adapt for your Node host). Set env vars — see .env.example.
 * https://developers.xendit.co/api-reference/#create-invoice
 */

const UNIT_PRICES_IDR = {
  'super-localise': 450_000,
  cmyk: 350_000,
};

function resolveBaseUrl(req) {
  const explicit = process.env.PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  if (!host) return '';
  return `${proto}://${host}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.XENDIT_SECRET_KEY;
  if (!secret || typeof secret !== 'string') {
    console.error('Xendit: XENDIT_SECRET_KEY is not set');
    return res.status(503).json({
      error: 'Payment server is not configured. Set XENDIT_SECRET_KEY on your deployment.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { payer_email: payerEmail, lines } = body || {};

  if (!payerEmail || typeof payerEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payerEmail.trim())) {
    return res.status(400).json({ error: 'A valid payer_email is required' });
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return res.status(400).json({ error: 'At least one line item is required' });
  }

  let amount = 0;
  const items = [];

  for (const line of lines) {
    const id = line && line.id;
    const qty = Number(line && line.quantity);
    if (!id || typeof id !== 'string' || !(id in UNIT_PRICES_IDR)) {
      return res.status(400).json({ error: `Unknown product: ${id}` });
    }
    if (!Number.isFinite(qty) || qty < 1 || qty > 99 || !Number.isInteger(qty)) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    const unit = UNIT_PRICES_IDR[id];
    const lineTotal = unit * qty;
    amount += lineTotal;
    items.push({
      name: id === 'super-localise' ? 'Super Localise' : 'CMYK Print Ready',
      quantity: qty,
      price: unit,
      category: 'Subscription',
    });
  }

  if (amount <= 0 || amount > 1_000_000_000) {
    return res.status(400).json({ error: 'Invalid order amount' });
  }

  const base = resolveBaseUrl(req);
  const successUrl = process.env.XENDIT_SUCCESS_URL || (base ? `${base}/checkout-success.html` : undefined);
  const failureUrl = process.env.XENDIT_FAILURE_URL || (base ? `${base}/checkout-failure.html` : undefined);

  const externalId = `ws-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  const payload = {
    external_id: externalId,
    amount,
    payer_email: payerEmail.trim(),
    description: 'Wild Stack — tools subscription',
    currency: 'IDR',
    items,
    invoice_duration: 86400,
  };

  if (successUrl) payload.success_redirect_url = successUrl;
  if (failureUrl) payload.failure_redirect_url = failureUrl;

  const auth = Buffer.from(`${secret}:`).toString('base64');

  try {
    const xr = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await xr.json().catch(() => ({}));

    if (!xr.ok) {
      console.error('Xendit API error', xr.status, data);
      return res.status(502).json({
        error: data.message || data.error_code || 'Could not create invoice',
        details: process.env.NODE_ENV === 'development' ? data : undefined,
      });
    }

    if (!data.invoice_url) {
      return res.status(502).json({ error: 'No invoice URL returned' });
    }

    return res.status(200).json({
      invoice_url: data.invoice_url,
      id: data.id,
      external_id: data.external_id || externalId,
    });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: 'Failed to reach payment provider' });
  }
}
