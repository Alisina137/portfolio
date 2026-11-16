# Phase 12 — Services / What I Can Do

**Status:** Implemented in source; content is a portfolio demonstration, not evidence of contracted work. CI and hosted acceptance required before calling delivery verified.

## Scope

- A **Services** item in header and footer, linking to a full `/services` page; a compact **What I Can Build** preview section on the Home page and an About page route CTA.
- Six categories represented by consistent, original inline SVG icons and cards: **Web applications, Mobile applications, Backend APIs, Database design & management, Full-stack product systems, and Application UI & workflow improvements.**
- Three highlighted capabilities on Home; all six on the new Services route. Each contains a purpose-led summary, three concrete areas of work, technologies found in linked source-reviewed projects, and working, appropriately localized project case study links.
- Evidence-first data: `content/services.json` references actual published projects rather than invented client contracts. `lib/services.ts` projects safely from published projects, source-reviewed case studies, and per-project technologies. If a case or technology is unpublished, its evidence is not displayed.
- Modern premium style: six readable balanced cards on desktop, two on tablet, one on mobile; responsive hero illustration, focus styles, light/dark compatibility, reduced-motion behavior, and RTL mirroring.
- Marketing copy carefully avoids promising price, project delivery time, client results, actual commercial availability or agency/team size. Contact CTA routes to the existing owner-gated contact page. No unapproved personal email or fabricated testimonials.
- Dedicated SEO metadata/Open Graph resource, legitimate sitemap inclusion only after existing launch approvals, distinct localized preview routes `/fa/services` and `/ps/services` subject to the existing translation publication gates, and a locale source fingerprint including service content.
- `scripts/check-services.mjs` and regression tests enforce six categories, 3 highlighted preview cards, valid published projects, technology support, translations, and route/a11y design contracts.

## Verification

Run `npm run check:services`, `npm run check:locales`, `npm test`, and `npm run build` locally. CI verifies the merged branch. After Netlify auto-deploy completes, check:
- `/` preview section, `/services` detailed page and `/about` Services CTA.
- Header/footer navigation, project links, keyboard focus and mobile menu at 360/768/1024/1360/1440px.
- Responsive 1/2/3-column layouts, light/dark colors, contrast and reduced-motion.
- Localized paths under development locale preview; translations remain owner-pending.
- No unchecked commercial claims or unapproved contact details.

**Not in this phase:** A quote/order funnel, pricing, booking, contracting, client metrics, invoices or actual paid services. These require separate owner-approved commercial requirements and backend integrations. No owner launch flag or indexing setting has changed.
