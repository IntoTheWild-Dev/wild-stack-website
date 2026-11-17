# wildstack.studio: build and launch handoff

**Do this today:** put this folder in a GitHub repo, run `npm run baseline`, and get the site live on a Cloudflare Pages preview URL. Steps 1–4 below take about an hour.

## What you get

The site is already built. `site/` is the finished, approved page: plain HTML, CSS and JS, with all images, the film and the font. You do not need to rebuild or restyle anything. If you launch these files as they are, the live site matches the design exactly.

| File | For |
|---|---|
| `site/` | the website (deploy this folder) |
| `reference/` | approved screenshots of every section: desktop and phone, light and dark |
| `CLAUDE.md` | the rules for Claude Code. It reads this file by itself. |
| `tests/` + `playwright.config.js` | a match test that fails if any change moves a pixel that it should not |
| `README.md` | this file |

Speed today (Lighthouse): mobile 91–98, desktop 100, Accessibility 100, CLS 0.

Design preview (for comparison only): https://claude.ai/artifact/5Ve34gQM2U6qKUb5XNtePs. After launch, this repo is the source of truth, not the preview.

## Launch steps

### 1. Repo

1. Make a **private** GitHub repo, for example `wildstack-site`, and push this folder to it.
2. Open the folder in Claude Code. Claude Code reads `CLAUDE.md` first.

### 2. Baseline (before any change)

```bash
npm install
npx playwright install chromium
npm run baseline
npm test               # must pass: 12 passed
git add tests/baseline && git commit -m "Baseline screenshots of the approved design"
```

From now on, run `npm test` after every change. If a test fails and you did not mean to change that section, undo the change.

### 3. Cloudflare Pages

1. Go to Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
2. Use these build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **`site`**
3. Deploy. You get a `*.pages.dev` URL. Open it on a phone and on a computer, and compare it with `reference/`.
4. Check the cache headers. `curl -I https://<project>.pages.dev/assets/og-image.jpg` must show `cache-control: public, max-age=31536000, immutable`.

Every push to `main` now deploys by itself. Other branches get their own preview URLs.

### 4. Domain: wildstack.studio

> ⚠️ **Email warning.** `mark@wildstack.studio` runs on **Ionos**. If you move the domain's DNS to Cloudflare, first copy **every** existing DNS record: MX, SPF (TXT), DKIM, autodiscover and any other records. Cloudflare's import usually finds them, but check each one against Ionos before you change the nameservers. If you miss one, Mark's email stops.

1. In Cloudflare, add the site `wildstack.studio` and check the imported DNS records against Ionos.
2. At Ionos, change the nameservers to the two that Cloudflare gives you.
3. In the Pages project → **Custom domains**, add `wildstack.studio` and `www.wildstack.studio`.
4. Send `www` to the main domain with a 301 redirect (Cloudflare → Rules → Redirect Rules), because the canonical URL is `https://wildstack.studio/`.
5. Send a test email to `mark@wildstack.studio` and reply from it.

### 5. After it is live

- [ ] Click every "Book a call" button. Each one opens Calendly in a new tab.
- [ ] Check the share card: paste the URL into a LinkedIn post draft and into X. It shows the logo, the headline and the short line.
- [ ] Run Lighthouse on the live URL (PageSpeed Insights), mobile and desktop. Every score must be 90+.
- [ ] Google Search Console: add the domain, then submit `https://wildstack.studio/sitemap.xml`.
- [ ] Toggle dark mode in the footer, reload, and check that the choice stays.

## Next tasks (Claude Code has the steps in CLAUDE.md)

| Task | Needs from Mark |
|---|---|
| **Newsletter → Loops.** The form stays on the page as it is now. Connect it to Loops when Mark sets up the Loops form. | The Loops custom-form URL |
| **Chat.** It is design-only now. It shows "Live chat opens at launch". | A Crisp website ID, **or** "hide it" |
| **Privacy and Terms pages.** The footer links go to the top of the page now. | The legal text |
| **Social icons.** They are not links yet. | LinkedIn, X and Instagram URLs |
| **Blog link.** It goes to the top of the page. | Hide it, or a blog plan |
| **Analytics.** There is none yet. The cookie panel is ready for one. | Which tool (or none) |
| **AI training crawlers.** `robots.txt` allows all now. | Allow or block |

## Before launch: claims to confirm (Mark)

These are on the page now. They must be true on launch day:

- **Step 3 cards:** "Pin comments on the exact spot" and "Partners review with one link". Do service clients get this review screen? If not, change the cards (copy review 5.2).
- **"Printed."** in the Step 3 headline. We deliver print-ready files. We do not print (copy review 5.1).
- **"Brand check on every file"** and **"Your files stay yours"**. They must match how we work and the contract.
- **CMYK files.** Do one printer test before launch.
- **Wolt quote.** Amit's written OK.
- **Logo strip.** Use only brands we may name.

The full list of suggested copy changes is in `wildstack-site-copy-review.md` (Mark has it). None of them is applied yet. Each one is a small text edit plus a snapshot update.

## Build notes from the design

- **Hero:** the background is a WebGL bird flock, light theme by default. It starts after load, runs at 30 fps, pauses off screen and uses fewer dots on phones. Reduced motion gives one still frame. The card film is `assets/wildstack-demo.mp4`.
- **Who it's for:** the four audiences are franchises, partner networks, events and venues, and listings and offers. The flyers show made-up brands. The footer "Who it's for" links go to `#who` until each audience has its own page. Make an audience page only when it has a real case study.
- **Compare:** the marks are our judgement, not sourced data. In-house wins on speed and CMYK. Agencies and in-house teams win on campaign ideas, which we do not sell.
- **Pricing:** Starter $3,000 / 100 files / 3 templates, Growth $5,000 / 300 / 7, Scale $8,000 / 600 / up to 15. No setup fee and no minimum term. "48 hours" means business days, Monday to Friday. If a price changes, update the JSON-LD `Service` offers too.
- **Proof:** the race bar shows 4.2 days with an agency against 48 hours with us, on one clock.
- **Cookies:** the "Cookies" link opens a simple panel that saves the choice in the browser. Replace it with a consent tool when tracking goes live.
