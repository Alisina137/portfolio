# Portfolio project state

**Source of truth:** Alisina Portfolio Product Specification v1.0 (14 Nov 2026) and Software Development Workflow V5.  
**Repo:** https://github.com/Alisina137/portfolio (`main`); browser/pull instructions in README.  
**Stack:** Next.js 16.3.5 App Router / React 19 / TypeScript / plain CSS design tokens. No database, auth or paid backend.

## P01 — Identity, design system & homepage

**Status:** IMPLEMENTED — VERIFICATION PENDING. Premium responsive Home, six curated project illustrations, theme preference, keyboard-accessible mobile navigation, and safe verified GitHub source links. P02 now upgrades card destinations to case studies. Owner approval is still outstanding.

## P02 — Public project catalog & case-study journeys

**Status:** IMPLEMENTED — VERIFICATION PENDING. Scoped routes `/projects` and `/projects/[slug]`, six substantial source-reviewed public cases, responsive card grids, URL-backed search/category/status/sort/page filters and recovery states, context-aware return navigation, related cases, optional accessible gallery with zero unapproved media, and active Projects navigation.

**Content:** Six published *preview* projects in `content/projects.json`, six studies in `content/case-studies.json`; nine other public repos held in `content/review-queue.json` pending owner sign-off. No fabricated screenshots or released-product claims. Some original published content fields still say `owner_pending`; **do not launch or index** before approvals.

**Tests:** `node scripts/check-content.mjs`, `npm test` (14 Node tests), and TS transpilation syntax check passed. The layout-only catalog HTML preview showed no horizontal overflow at 320/360/768/1024/1440 px in local Chromium. Actual Next.js dependency install, production build, semantic TypeScript check, rendered app E2E, and live-device gallery testing remain unverified because the npm registry cannot be reached from this environment. Details in `docs/PHASE-02.md`.

**Release:** `robots:noindex,nofollow` retained; `npm run check:release` intentionally fails while owner approval, real contact, and P03–P05 are pending. Do not interpret pushed source or green Node tests as a public launch.

**Next:** P03 — About, Contact, optional approved résumé. Pending decisions DEC-01 public contact, DEC-02 published projects and role attribution, DEC-03 biography, DEC-07 authentic sanitized imagery.
