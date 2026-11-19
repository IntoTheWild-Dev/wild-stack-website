# CLAUDE.md: wildstack.studio

Read this file before you change anything in this repo.

## What this is

This is the marketing site for Wildstack, a print and digital design service for multi-location brands. It is one page.

- The design is **final and approved**.
- `site/` is the finished site: plain HTML, CSS and JS. There is no framework and no build step.
- The job is to launch it and keep it working. It is **not** to rebuild it, restyle it or "clean it up".

## Layout in THIS repo (read first)

This handoff was merged into the existing `wild-stack-website` repo, which deploys on **Vercel** from the repo root. So:

- Where this file says `site/...`, the file is at the **repo root** (`index.html`, `assets/`, `robots.txt`, `sitemap.xml`).
- `site/_headers` was not copied. The same cache and security headers are in `vercel.json`.
- `.vercelignore` keeps the dev files (`CLAUDE.md`, `README.md`, `tests/`, `reference/`, `package.json`, `playwright.config.js`) off the live site.
- **Do not touch `landing/`.** It is a separate landing page at `wildstack.studio/landing/`. It is out of scope for this site.
- The old main-site pages (`cart.html`, `marketplace.html`, `figma-plugins*.html`, `cmyk.html`, `motion-graphics.html`, `custom-automations.html`, `adobe-scripts.html`, `checkout-*.html`, `ci-guide.html`, `styles*.css`, `product-pages.css`, `api/`) are kept but not linked from the new page. Do not link, change or delete them without the owner's OK.
- The README's Cloudflare Pages steps do not apply while the site stays on Vercel.
- **Newsletter:** the footer form posts to `api/newsletter.js` (a Vercel function), which passes sign-ups to a Google Sheet through an Apps Script web app (`scripts/newsletter-apps-script.gs`). It needs two Vercel env vars, `NEWSLETTER_SHEET_URL` and `NEWSLETTER_SECRET`, in Production and Preview. `/scripts` is not deployed.
- **Privacy and Terms:** `privacy/index.html` and `terms/index.html` reuse the main page's styles, header, footer, cookie panel and scripts, plus a plain reading column. If you change the header, footer, cookie panel or the footer form on the main page, make the same change on both pages. The text is from the owner's draft and still needs a lawyer's review.
- **Removed on request (Nov 2026), do not add back unless asked:** the logo bar, the big wordmark in the footer, the social icons, the Blog link and the chat widget. The round button at the bottom right is now an email link (`a.chat-btn`, `mailto:hello@wildstack.studio`). Do not add a chat script.

## Hard rules

1. **Do not rebuild the page.** Do not move it to React, Next.js, Astro, Tailwind or any other framework, unless the owner asks for that in writing.
2. **Do not reformat `site/index.html`.** Do not run Prettier or any formatter on it. Do not split the inline CSS or JS into files. Do not rename classes or ids. Do not "simplify" CSS. Many values are tuned by hand (spacing, clamp() sizes, animation timing, contrast).
3. **Change only what the task needs.** Make the smallest edit that does the job.
4. **Add no new scripts, fonts, trackers or libraries to the page** unless the task asks for one. The page uses one outside service: Calendly (a link only). The newsletter form posts to our own `/api/newsletter`.
5. **Run the match test after every change** (see below). A change that the task did not ask for must not change any screenshot.
6. **Never update the baseline screenshots to make a failing test pass.** Update a baseline only for a change the owner asked for, and only for the sections that change.
7. **Asset cache:** files in `site/assets/` are cached for one year (`site/_headers`). If you change an asset, give it a **new file name** (for example `og-image-v2.jpg`) and update every reference.
8. **Speed:** Lighthouse must stay at 90+ in Performance, Accessibility, Best Practices and SEO, on both mobile and desktop. CLS must stay 0.
9. **Do not delete files** without the owner's OK.

## Folder map

```
site/                 the website (Cloudflare Pages serves this folder)
  index.html          the whole page: head tags, inline CSS, markup, inline JS
  assets/             images, film, font (Satoshi), favicons, share image
  _headers            cache and security headers (Cloudflare Pages / Netlify format)
  robots.txt, sitemap.xml
reference/            approved screenshots per section: desktop/mobile x light/dark (for your eyes)
tests/match.spec.js   match test: per-section screenshots + console errors + Calendly links
playwright.config.js  test settings (4 projects: desktop-light, desktop-dark, mobile-light, mobile-dark)
README.md             launch steps and open items (for people)
```

## Run it

```bash
npm install
npx playwright install chromium
npm run dev            # http://localhost:4173
```

Always test on `localhost`. The page has a "capture view" for link-preview bots: when an automated browser opens it on any host other than `wildstack.studio` or `localhost`, it hides the header button, menu and chat. This is on purpose. Do not remove it.

## Match test

**First time only, before any change:** make the baseline from the untouched files and commit it.

```bash
npm run baseline       # writes tests/baseline/<project>/<NN-section>.png
git add tests/baseline && git commit -m "Baseline screenshots of the approved design"
```

The baseline must be made on the same computer that runs the tests, because fonts render a little differently on each OS. The images in `reference/` are for people to look at. The test does not use them.

**After every change:**

```bash
npm test               # all 4 projects
npm run report         # opens the diff viewer if something failed
```

- The test masks the moving parts: the bird flock (canvas), the film (video), the race bar and the swapping hero word.
- It also fails on console errors, on missing files (404s) and on any "Book a call" button that does not go to Calendly.
- **For an approved change** (for example a copy edit), run it like this, check the diff, then commit the new snapshots with the change:

```bash
npx playwright test --update-snapshots -g "approved design"
```

**Speed check before a deploy:**

```bash
npx serve site -l 4173 &
npx lighthouse http://localhost:4173 --preset=desktop --only-categories=performance,accessibility,best-practices,seo
npx lighthouse http://localhost:4173 --only-categories=performance,accessibility,best-practices,seo   # mobile
```

## How the page works

| Thing | Where |
|---|---|
| Colour tokens, light theme (default) | `:root{` near line 35 |
| Dark theme tokens | `html[data-theme="dark"]{` near line 51 |
| Theme choice | saved in `localStorage` key `ws-theme`. A small script before the header sets it, so there is no flash. The toggle is the moon/sun button in the footer. |
| Sections, in order | `section.hero`, `#who`, `#how`, `#team`, `#print`, `#enterprise`, `#compare`, `#pricing`, `#proof`, `#about`, `#faq`, `#demo` (closing), `footer#newsletter` |
| "Book a call" buttons | every link with `data-cta`. JS sets them to `CALENDLY_URL` (search for `var CALENDLY_URL`) and opens a new tab. |
| Email button | `a.chat-btn` (bottom right): a round link to `mailto:hello@wildstack.studio`. No chat script. |
| Newsletter form | `form#news-form` in the footer: email, a consent checkbox (the Sign up button stays off until it is ticked and the email is valid) and a hidden `company` honeypot. The script is marked `Footer newsletter form: start/end`, and the Privacy and Terms pages carry a copy. |
| Hero bird flock | WebGL on `canvas#hero-swarm`. Skips itself on slow or GPU-less devices, runs at 30 fps, pauses off screen, gives one still frame with reduced motion. |
| Image loading | images are `loading="lazy"`. 200 ms after load, a script makes them all load at low priority, so nothing pops in on scroll (`afterLoad`). |
| Head tags | title, description, canonical, Open Graph, X card and JSON-LD (Organization, WebSite, Service, FAQPage) are in the real `<head>`. If you change the price, the FAQ or the offer, update the JSON-LD too. |

## Tasks you may be asked to do

### Newsletter sign-ups

Sign-ups land in the "Subscribers" tab of the Google Sheet "Wildstack newsletter": Signed up (UTC), Email, Consent, Consent text, Source page, Status. Duplicates are ignored. There is no automatic unsubscribe: when someone asks to unsubscribe, change their Status to `unsubscribed` by hand. If you change the consent wording next to the checkbox, the new wording is what gets saved from then on (the form sends the exact text it shows).

### Copy edits

Text-only edits are fine. Keep the HTML entities (`&rsquo;`, `&nbsp;`, `&#8209;`), because they control line breaks. After the edit, update only the snapshots of the sections you changed.
