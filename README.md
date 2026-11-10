# CRO, Tracking & Reporting — Landing Page

A static, single-page site for a B2B CRO / conversion tracking / reporting consultancy, deployed on Vercel. No build step: plain HTML, CSS and a little JS, plus one serverless function for forms.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Portfolio home: work, use cases, deliverables, capabilities, process, contact |
| `work/*.html` | Case study pages (served at `/work/<name>` thanks to clean URLs) |
| `assets/styles.css` | All styles (colors are tokens at the top) |
| `assets/main.js` | Mobile menu, tabs, `dataLayer` events |
| `api/lead.js` | Serverless function that receives all three forms |
| `thank-you.html` | Where every form redirects; pushes `lead_thank_you` to the dataLayer |
| `404.html` | Not-found page (Vercel serves it automatically) |
| `vercel.json` | Clean URLs plus security and cache headers |

## Deploy on Vercel

1. In your Vercel project (`landing-pages-cro`): **Settings → Git → Connect Git Repository** and pick `etaihvan/conversion-rate-optimization`.
2. **Settings → Build & Deployment:** Framework Preset **Other**, leave the build command empty, output directory `.` (or blank).
3. Push to `main` (or click **Redeploy**). Every push to `main` deploys to production; other branches get preview URLs.
4. Add your domain under **Settings → Domains**, then update the `canonical` URL in `index.html`.

## Where form leads go

The audit, contact and newsletter forms POST to `/api/lead`. Set these in **Settings → Environment Variables**, then redeploy:

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL` | Any JSON webhook: Zapier, Make, n8n, a Slack incoming webhook, a HubSpot workflow webhook |
| `RESEND_API_KEY` | Optional: send each lead by email through [Resend](https://resend.com) |
| `LEAD_NOTIFY_EMAIL` | Address that receives lead emails (needed with Resend) |
| `LEAD_FROM_EMAIL` | Optional sender, e.g. `Leads <leads@yourdomain.com>` (a domain verified in Resend) |

Every submission is also written to the function logs (**Logs** tab, filter by `/api/lead`), so nothing is lost before you configure a destination. A hidden honeypot field filters basic spam.

## Before going live

- Replace every `[BRACKETED]` placeholder (name, client logos, results, prices, photo, testimonial, live session date).
- Paste your Google Tag Manager snippet where marked in `index.html` and `thank-you.html`.
- In GTM, trigger lead conversion tags on the `lead_thank_you` event (or `form_submit` with `form_name`).
- Point the insight cards and free-resource links at real URLs.

## Change the brand color

Edit `--accent`, `--accent-ink` and `--accent-text` at the top of `assets/styles.css`.
