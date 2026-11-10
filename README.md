# CRO, Tracking & Reporting — Landing Page

A static, single-page site for a B2B CRO / conversion tracking / reporting consultancy. No build step: plain HTML, CSS and a little JS, deployed on Netlify.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The landing page |
| `assets/styles.css` | All styles (colors are tokens at the top) |
| `assets/main.js` | Mobile menu, tabs, `dataLayer` events |
| `thank-you.html` | Where every form redirects; pushes `lead_thank_you` to the dataLayer |
| `404.html` | Not-found page (Netlify serves it automatically) |
| `netlify.toml` | Publish settings and security/cache headers |

## Deploy on Netlify

1. In Netlify: **Add new site → Import an existing project → GitHub** and pick this repo.
2. Leave the build command empty and set the publish directory to `.` (already set in `netlify.toml`).
3. Deploy. Every push to `main` redeploys automatically.
4. In **Site configuration → Forms**, make sure form detection is enabled. Three forms are detected: `audit-request`, `contact`, `newsletter`.
5. Add form notifications (email or Slack) under **Forms → Form notifications**.
6. Add your custom domain under **Domain management**, then update the `canonical` URL in `index.html`.

## Before going live

- Replace every `[BRACKETED]` placeholder (name, client logos, results, prices, photo, testimonial, live session date).
- Paste your Google Tag Manager snippet where marked in `index.html` and `thank-you.html`.
- In GTM, trigger lead conversion tags on the `lead_thank_you` event (or `form_submit` with `form_name`).
- Point the insight cards and free-resource links at real URLs.

## Change the brand color

Edit `--accent`, `--accent-ink` and `--accent-text` at the top of `assets/styles.css`.
