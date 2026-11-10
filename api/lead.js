// Vercel serverless function: receives every form on the site.
//
// Where leads go (set in Vercel → Project → Settings → Environment Variables):
//   LEAD_WEBHOOK_URL  - any webhook that accepts JSON (Zapier, Make, n8n, Slack
//                       incoming webhook, HubSpot workflow webhook, etc.)
//   RESEND_API_KEY    - optional: email each lead via resend.com
//   LEAD_NOTIFY_EMAIL - the address that receives lead emails (with Resend)
//   LEAD_FROM_EMAIL   - optional sender, e.g. "Leads <leads@yourdomain.com>"
// Every submission is also written to the function logs as a fallback.

const ALLOWED_FIELDS = [
  'form-name', 'website', 'email', 'first_name', 'last_name',
  'ad_spend', 'priority', 'message',
];

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return Object.fromEntries(new URLSearchParams(req.body));
  return {};
}

function clean(value) {
  return String(value ?? '').trim().slice(0, 2000);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const body = parseBody(req);

  // Honeypot: bots fill the hidden field, people don't.
  if (clean(body['bot-field'])) {
    res.writeHead(303, { Location: '/thank-you' });
    return res.end();
  }

  const lead = {};
  for (const key of ALLOWED_FIELDS) {
    if (body[key] !== undefined) lead[key] = clean(body[key]);
  }
  lead.form = lead['form-name'] || 'unknown';
  delete lead['form-name'];
  lead.submitted_at = new Date().toISOString();
  lead.referrer = clean(req.headers.referer);

  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    res.writeHead(303, { Location: '/#cx-contact' });
    return res.end();
  }

  console.log('New lead', JSON.stringify(lead));

  const jobs = [];

  if (process.env.LEAD_WEBHOOK_URL) {
    jobs.push(fetch(process.env.LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: `New ${lead.form} lead: ${lead.email}`, ...lead }),
    }));
  }

  if (process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) {
    const lines = Object.entries(lead).map(([k, v]) => `${k}: ${v}`).join('\n');
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'Leads <onboarding@resend.dev>',
        to: [process.env.LEAD_NOTIFY_EMAIL],
        reply_to: lead.email,
        subject: `New ${lead.form} lead: ${lead.email}`,
        text: lines,
      }),
    }));
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    if (r.status === 'rejected' || (r.value && !r.value.ok)) {
      console.error('Lead delivery failed', r.reason || r.value.status);
    }
  });

  res.writeHead(303, { Location: '/thank-you' });
  return res.end();
};
