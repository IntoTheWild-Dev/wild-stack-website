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
```

## Completed — 2026-05-25
- [x] Moved landing page from root URL to `/landing/`
- [x] Main website restored to `wildstack.studio/`
- [x] Vercel production branch switched from `landing-page` → `main`
- [x] Vercel root directory cleared (was `Wild Stack Landing Page`)
- [x] Formspree `_next` redirect updated to absolute URL
- [x] Favicon added to main site
- [x] OG + Twitter Card social share meta tags added to both pages
- [x] Social share image added to both pages
- [x] "Other feature request" checkbox + expandable text field added to waitlist form

## Pending
- [ ] Delete old `landing-page` branch (cleanup, not urgent)
- [ ] UI colour updates (in progress)
