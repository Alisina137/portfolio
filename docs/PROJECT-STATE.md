# Portfolio project state

**Source of truth:** Alisina Portfolio Product Specification v1.0 (14 Nov 2026) and Software Development Workflow V5.  
**Repo:** https://github.com/Alisina137/portfolio (`main`); browser/pull instructions in README.  
**Stack:** Next.js 16.3.5 App Router / React 19 / TypeScript / plain CSS design tokens. No database, auth or paid backend.

## P01 — Identity, design system & homepage

**Status:** IMPLEMENTED — VERIFICATION PENDING. Premium responsive Home, six curated project illustrations, theme preference, keyboard-accessible mobile navigation, and safe verified GitHub source links. P02 now upgrades card destinations to case studies. Owner approval is still outstanding.

## P02 — Public project catalog & case-study journeys

**Status:** IMPLEMENTED — VERIFICATION PENDING. Scoped routes `/projects` and `/projects/[slug]`, six substantial source-reviewed public cases, responsive card grids, URL-backed search/category/status/sort/page filters and recovery states, context-aware return navigation, related cases, optional accessible gallery with zero unapproved media, and active Projects navigation.

**Content:** Six published *preview* projects in `content/projects.json`, six studies in `content/case-studies.json`; nine other public repos held in `content/review-queue.json` pending owner sign-off. No fabricated screenshots or released-product claims. Some original published content fields still say `owner_pending`; **do not launch or index** before approvals.

**Tests:** `node scripts/check-content.mjs`, `npm test` (Phase 2 baseline tests), and TS transpilation syntax check passed. The layout-only catalog HTML preview showed no horizontal overflow at 320/360/768/1024/1440 px in local Chromium. Actual Next.js dependency install, production build, semantic TypeScript check, rendered app E2E, and live-device gallery testing remain unverified because the npm registry cannot be reached from this environment. Details in `docs/PHASE-02.md`.

**Release:** `robots:noindex,nofollow` retained; `npm run check:release` intentionally fails while owner approval, real contact, and P03–P05 are pending. Do not interpret pushed source or green Node tests as a public launch.

## P03 — Credible About, Contact and conditional résumé

**Status:** IMPLEMENTED — VERIFICATION PENDING / DEC-01 BLOCKED. Routes `/about`, `/contact` with complete styled content and navigation; project-supported capability clusters; conditionally rendered direct email with accurate clipboard success/manual selection behavior, approved social destinations and optional real PDF only. With no owner-approved email the Contact route clearly links GitHub/projects but **does not claim** visitors can directly send a message. No unapproved education, email, employer claims or résumé.

**Evidence:** Node content checks and P01–P03 tests passed, development-only static layout checks at 320/360/768/1024/1440 show no overflow. Actual Next.js build, SSR and interactive real-browser E2E unverified (offline dependencies). Read `docs/PHASE-03.md` for detailed gates.

## P04 — SEO, recovery, accessibility & performance safeguards

**Status:** IMPLEMENTED — VERIFICATION PENDING. Unique SEO metadata, canonical URLs when a real origin is configured, source-driven OpenGraph cards, public-only gated sitemap and robots, branded 404/error retry screens, conservative security headers, and responsive/focus/reduced-motion improvements. Content checks, source SEO audits, 30 Node tests and 20 Chromium static-preview reflow checks pass without a Next installation; actual Next build and TypeScript passed in GitHub Actions run 43597231241; the new production HTTP smoke check, screen-reader testing, deployed HTTPS checks, Lighthouse and live-device verification remain pending. See `docs/PHASE-04.md`.

**Publication remains OFF:** `PORTFOLIO_LAUNCH_APPROVED=false` by default. Site indexing additionally depends on approved HTTPS origin, public email, biography approval and owner-approved cases. No fictional domain/contact, fabricated gallery or secret/config bypass is published.

**Next:** P05 — owner content review, approved public contact, verified real assets/links, production deployment and release QA. Owner decisions DEC-01 contact, DEC-02 project approval, DEC-03 bio, DEC-05 résumé optional, DEC-07 sanitized authentic media. Keep noindex until complete approvals and real QA.

**CI cleanup (P04):** Fixed P01–P03 preview scripts to create their generated output folder; fixed P02 catalog TypeScript generic and P04 Person schema property access after CI feedback. This was necessary to obtain a genuinely passing Next.js production build.
