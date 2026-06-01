# Wild Stack Website — Status

## Live URLs
| Page | URL |
|------|-----|
| Main website | https://wildstack.studio |
| Landing page | https://wildstack.studio/landing/ |
| Thank you page | https://wildstack.studio/landing/thank-you.html |

## Deployment
- **Platform:** Vercel — [wild-stacks-projects/wild-stack-website](https://vercel.com/wild-stacks-projects/wild-stack-website)
- **Production branch:** `main`
- **Root directory:** _(empty — serves from repo root)_

## Repo Structure
```
/                        → Main website (wildstack.studio/)
/landing/                → Landing page (wildstack.studio/landing/)
  index.html
  thank-you.html
  styles.css
  assets/
    favicon.png
    favicon.svg
    social-image.png     → OG social share image (1200×630)
    logo-nav.png
    promo.mp4
    ...
/favicon.png             → Favicon for main site
/social-image.png        → OG social share image for main site
/styles.css              → Main site styles (shared via --grad-hero/--grad-cta vars)
/product-pages.css       → Subpage styles (extends styles.css)
```

## Colour System
| Token | Value | Used for |
|-------|-------|----------|
| `--orange` / `--accent` | `#DF6F6D` | Coral accent (text/icons only — card borders removed) |
| `--bg-card` | `#1E2020` | All card/box backgrounds site-wide |
| `--grad-hero` | `#121414` | All hero section backgrounds |
| `--grad-cta` | `#121414` | All CTA section backgrounds |
| Section dividers | _(removed)_ | Coral section borders removed from all pages |

## Completed — 2026-05-25
### Deployment & Infrastructure
- [x] Moved landing page from root URL to `/landing/`
- [x] Main website restored to `wildstack.studio/`
- [x] Vercel production branch switched from `landing-page` → `main`
- [x] Vercel root directory cleared (was `Wild Stack Landing Page`)
- [x] Formspree `_next` redirect updated to absolute URL

### SEO & Branding
- [x] Favicon added to main site
- [x] OG + Twitter Card social share meta tags added to both pages
- [x] Social share image (1200×630) added to both pages

### Landing Page
- [x] "Other feature request" checkbox + expandable text field added to waitlist form
- [x] Quote box changed to coral outline only (transparent background, white text)

### Main Site UI — Session 2 (2026-05-25)
- [x] Hero value bar redesigned: `#121414` background, coral `1px` border box, rounded corners (9px), 2-line text
- [x] Hero CTA button gap reduced (64px → 32px)
- [x] Two new app tiles added to hero: `indesign assetswap` + `photoshop assetswap` (all 6 in one row)
- [x] Ps icon nudged to `translateY(-4px)` for inline alignment with Id
- [x] All section divider lines removed — main site (`styles.css`) and all subpages (`product-pages.css`)
- [x] All card/box backgrounds: `#1E2020` site-wide (CSS variable `--bg-card` updated)
- [x] All card/box borders: coral `var(--orange)` — product cards, step cards, benefit cards, pricing tiers, feature items, ICP cards, bundle cards, teaser cards, available cards
- [x] Product card image area (top section): background updated to `#1E2020`, gradient overlay updated to match
- [x] Hero headline: "Automate" and "asset updates" coral
- [x] All hero/CTA sections: solid `#121414` across all pages
- [x] "Why Choose" section: `#121414`
- [x] Marketplace section: `#121414`

### Hero App Bar — Session 3 (2026-05-25)
- [x] Removed "indesign updater" tile from hero app strip (5 tiles remain)
- [x] Removed container box around app tiles (no border/background — tiles float free)
- [x] New tiles (indesign assetswap, photoshop assetswap) rebuilt as CSS text tiles to match existing style: same `#0f172b` bg, `wild | stack` brand mark, `.hero-app-line1/.hero-app-line2` text system

### Session 4 — Design polish (2026-05-25)
- [x] "Super Localise" → "Super Localize" — corrected across all live pages
- [x] Solution block border + label: blue → coral site-wide (`product-pages.css`)
- [x] Feature number badges, ICP tick marks, bundle icons: gradient → solid white site-wide
- [x] Placeholder testimonials section removed from all 4 product pages
- [x] figma-plugins.html hero banner: swapped to production asset `Super-Localize-Banner-1920x1080.png`
- [x] Product page heroes: left text + right image split layout (all 4 pages via shared CSS)
- [x] Mobile hero (<900px): stacks to column, image hidden
- [x] Nav logo + "Why Choose" logo: removed blue glow site-wide

### Session 5 — Design polish (2026-05-25)
- [x] "View All Automations" button: changed from coral `btn-primary` → `btn-outline-white btn-large` to match hero style
- [x] Marketplace card "Buy Now" buttons: changed from coral full-width → `btn-white btn-large` (white, narrower, header-matched)
- [x] Feature list check icons: recoloured from green → coral via CSS `filter` on `.check-icon`
- [x] CTA headline site-wide: "Stop" and "Start" wrapped in `<span class="text-white">` — coral text kept for rest
- [x] Added `.text-white { color: #ffffff }` utility class to `styles.css`
- [x] Marketplace hero gap: reduced `padding-top` from 64px → 40px on `.marketplace-page-section`
- [x] Marketplace category label renamed: "Motion Graphics" → "Adobe Solutions"
- [x] Dual InDesign/Photoshop icons: tightened gap with `gap: 4px` + `margin: 0 -25px` to compensate for built-in PNG transparent padding (~43px per side)
- [x] Four product pages restored: `figma-plugins.html`, `adobe-scripts.html`, `motion-graphics.html`, `cmyk.html` — CTA section + footer were missing (truncated by previous regex); rebuilt and restored
- [x] Cart page CTA headline: `color: #ffffff`, `white-space: nowrap`, `width: max-content` for proper centering
- [x] Cart page layout: `.cart-section-heading` moved above `.cart-layout` so first item card top-aligns with Order Summary box
- [x] Coral borders removed from every card/box site-wide (`styles.css` + `product-pages.css`): `border-color` reverts to `var(--border)` (subtle grey `rgba(73,101,122,0.28)`) — decorative accent lines on `.challenge-block` and `.solution-block` preserved

### Session 6 — Hero redesign (2026-06-01)
- [x] Header height increased: 73px → 80px
- [x] Nav horizontal padding: 16px → 48px per side
- [x] Nav link gap: 32px → 40px; link colour changed to `var(--text-muted)` (less active feel)
- [x] Active nav underline (yellow `::after`) removed — all links uniform
- [x] Nav `.btn-primary` resized: 15px font, 42px height, 9px radius
- [x] Header `border-bottom` made more subtle: `rgba(255,255,255,0.06)`
- [x] Hero layout converted from centred single-column → **two-column split**:
  - Left: headline + tagline + CTAs (left-aligned, max-width 540px)
  - Right: `.hero-visual` placeholder div (460×460px, dashed border) — **awaiting image/video**
- [x] Hero content padding: 100px top / 80px bottom (breathing room from nav)
- [x] Hero product tiles (`.hero-apps-wrap`) **hidden** — `display: none` for now
- [x] Hero value bar (`Save time…`) pulled up, padding normalised (110px → 60px top)

### Session 7 — Full site redesign (2026-06-01)
- [x] Container: max-width 1504px → 1280px, padding 16px → 48px (matches hero)
- [x] Section padding: 80px → 120px; section-header margin-bottom: 64px → 80px
- [x] CTA section: centred → two-column split (left text + right dashed placeholder), site-wide (6 pages)
- [x] Hero: `min-height: calc(100vh - 80px)` on hero-inner — value bar scrolls below fold on load
- [x] Product card icons: left-aligned (padding-left 24px matches text)
- [x] Subtitle accent: `display: block; margin-bottom: 14px` — gap between "Cut production time 80%" and subline
- [x] Nav dropdown: Solutions ▾ with 4 product pages, hover-stable (padding-bottom bridge), no icons
- [x] Nav dropdown order: Wild Super Localize → Wild CMYK → Motion Graphics → Adobe Plugins
- [x] Product page heroes: max-width 1280px, padding 100px 48px 80px, min-height calc(100vh - 80px)
- [x] All product page heroes: square dashed placeholder (460×460, no fill) — replaces banner image + missing right cols
- [x] Marketplace hero: full two-column (page-hero-row), square dashed placeholder
- [x] Marketplace products: replaced large card grid with horizontal solution-row layout (left: icon+name, right: bordered info card)
- [x] Solution icons doubled: 72px → 128px
- [x] Removed TBC/mo pricing text from all solution rows
- [x] Adobe row: new `ADOBE NEW Icon.png`, renamed to "Adobe Asset Updater"
- [x] Adobe plugins page: all "InDesign" references → "Adobe" in titles/headings/CTAs
- [x] `ADOBE NEW Icon.png` copied to `Wild,Stack logo/`

## Pending
- [ ] Drop image or video into right-column placeholders (hero, CTA, product page heroes — all pages)
- [ ] Decide whether to restore product tiles (`.hero-apps-wrap`) or remove permanently
- [ ] Delete old `landing-page` branch on GitHub (cleanup, not urgent)
- [ ] Review `figma-plugins-new.html` — references missing `styles-new.css`, not linked anywhere
