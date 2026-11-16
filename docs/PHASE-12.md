# Phase 12 — Services / What I Can Do

**Status:** Implemented in source; GitHub automated verification and live Netlify/device acceptance are separate gates. Follows Phases 9–20 roadmap.

## Scope and credibility

Show types of software work represented in current portfolio sources. Do **not** imply agency status, commercial client engagements, fixed prices, guaranteed availability, finished public products, or independently verified project authorship. Phase 05 owner release gates remain closed.

## Delivered

- Home preview of 3 areas: web applications, mobile applications and backend APIs, with a CTA to the full Services page.
- Full `/services` page covers 6 types: web, mobile, backend APIs, database design and management, full-stack systems, and application UI/workflow improvements.
- Each card offers a summary, 3 scope items, the tech recorded in published case studies, and real linked project evidence. Missing project evidence and unsupported technologies are suppressed by `getServices()`.
- New Services header and footer link, related About-page callout, project links and contact CTA. **Contact still uses the previous owner-controlled channels**, not a newly fabricated address or enabled form.
- Dedicated Next.js SEO metadata, Open Graph image and owner-gated sitemap inclusion. Old noindex and translation-review guards remain in effect.
- Premium, responsive design with original vector icons and conceptual (non-screenshot) artwork. Existing light/dark tokens, readable typography, keyboard/touch links, RTL direction and reduced-motion preferences respected.
- Draft Dari/Pashto service routes and localized descriptions; source fingerprint includes new Services data for eventual separate owner review.
- At tablet widths the expanded header uses the existing keyboard-accessible mobile menu, with viewport-constrained scrolling to avoid cutting off lower links.

## Data and validation

`content/services.json` holds the six areas and approved source references. `content/locales/fa-services.json` and `ps-services.json` hold draft localizations. `scripts/check-services.mjs` verifies unique service IDs, published case references, supported technology labels, complete translated strings and exactly three homepage previews. `npm run check:services` is part of `build` and `verify`. `tests/phase12-services.test.mjs` protects route wiring, links, content guards and responsive design.

## Acceptance

Verify `npm run check:services`, `npm run check:locales`, `npm test`, `npm run build`. On a real Netlify deployment test Home → Services → real project case → Contact; try screen widths 320, 360, 768, 1024 and 1440px plus 200% zoom; both themes, keyboard focus, reduced motion and deep-link navigation. Check `/fa/services` and `/ps/services` only in development preview while locale approvals are pending. Unapproved route variants should remain unavailable in production.

No Netlify environment variable changes, global launch approvals, resume/email publication or paid-service claims were made.
