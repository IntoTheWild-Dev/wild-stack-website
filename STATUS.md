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
| `--orange` / `--accent` | `#DF6F6D` | Coral accent throughout |
| `--grad-hero` | `#121414` | All hero section backgrounds |
| `--grad-cta` | `#121414` | All CTA section backgrounds |
| Section dividers | `rgba(223,111,109,0.3)` | Coral border on `.section-alt` / `.product-section--alt` |

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

### Main Site UI
- [x] App tiles repositioned to straddle hero/coral section boundary
- [x] "Cut production time by 80%" fixed to coral colour (CSS specificity fix)
- [x] Adobe Id + Ps icons aligned to same 140px height as Figma/Ae icons
- [x] Ps icon nudged up 2px for better vertical alignment with Id
- [x] All product cards given consistent gradient background
- [x] Hero headline: "Automate" and "asset updates" now coral
- [x] All hero sections: solid `#121414` (was blue/coral gradient) — all pages
- [x] All CTA sections: solid `#121414` (was gradient) — all pages
- [x] "Why Choose" section: `#121414` (was blue-grey gradient)
- [x] Marketplace section: `#121414` (matches all other sections)
- [x] Section divider lines: coral `rgba(223,111,109,0.3)` (was blue-grey)
- [x] Changes applied across `styles.css` AND `product-pages.css` (all subpages covered)

## Pending
- [ ] Delete old `landing-page` branch on GitHub (cleanup, not urgent)
- [ ] Review `figma-plugins-new.html` — references missing `styles-new.css`, not linked anywhere
- [ ] **Hero value bar (coral section)** — the salmon/coral band below the app tiles on the main site still needs a design update. Currently a solid coral fill with dark text. Needs to be redesigned (see screenshot shared in session — darker background direction)
