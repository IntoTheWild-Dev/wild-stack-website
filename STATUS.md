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
| `--orange` / `--accent` | `#DF6F6D` | Coral accent, all card borders, hero value bar |
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

## Pending
- [ ] Delete old `landing-page` branch on GitHub (cleanup, not urgent)
- [ ] Review `figma-plugins-new.html` — references missing `styles-new.css`, not linked anywhere
