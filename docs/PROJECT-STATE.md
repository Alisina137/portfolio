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

**P05:** Release preparation is in source; owner contact/content/domain/HTTPS device acceptance are not yet approved. Read the appended P05 section and release runbook.

**CI cleanup (P04):** Fixed P01–P03 preview scripts to create their generated output folder; fixed P02 catalog TypeScript generic and P04 Person schema property access after CI feedback. This was necessary to obtain a genuinely passing Next.js production build.


## P05 — Content verification, release safeguards and deployment handoff

**Status:** IMPLEMENTED — PUBLIC LAUNCH BLOCKED / LIVE VERIFICATION PENDING. The site's main pages remain a working **preview**, not an approved public product. Source now includes `content/launch-approval.json` (all flags false), safe launch-readiness audit, networked external link verification, deployed HTTPS smoke checks (preview/launch), manual GitHub Actions deployment smoke, owner content review checklist and a documented publish/rollback runbook. Phase 5 did not invent an email, headshot, résumé, hosting account, domain, screenshots, live demos or user approvals. The P05 release milestone is NOT complete.

**Evidence:** GitHub connector confirmed the six featured repos and nine queued repos exist and are public, not archived (2026-11-14); source `npm run check:content`, `npm run check:seo`, preview `npm run check:launch`, Node P01–P05 test suite pass locally. `npm run check:launch:strict` fails intentionally with actual owner/domain/live gates missing. Production Next build and running site browser checks must be confirmed in GitHub Actions/deployed host. Manual keyboard and screen-reader, Lighthouse, and real HTTPS acceptance still required.

**External blockers:** DEC-01 approved public email, DEC-02 six project summaries/case statuses/role attribution, DEC-03 biography, DEC-06 chosen actual domain/hosting, reviewed media or explicitly agreed conceptual fallback, manually recorded P05 live acceptance. Owner can optionally supply an approved résumé and LinkedIn; never show broken links. Keep `PORTFOLIO_LAUNCH_APPROVED=false`, the approval record false, and robots noindex until real sign-off. Full gates in `docs/PHASE-05.md` and `docs/OWNER-REVIEW-CHECKLIST.md`.

**Next planned release:** P06 — technical writing *only if* two real owner-approved articles exist; otherwise maintain the MVP and finish outstanding P05 human release gates. P07 and P08 remain optional/later.

## P06 — Technical writing and content publication gate

**Status:** IMPLEMENTED — OWNER APPROVAL / LIVE VERIFICATION PENDING. `lib/writing-core.mjs` provides shared validation, Markdown parsing, safe links and an explicit minimum-two-approved-articles public gate. `/writing` and `/writing/[slug]` are built with metadata, contextual navigation, responsive reading, code copy and related project links, but intentionally return 404 while the gate is unmet. Mobile/desktop Writing navigation and sitemap entries stay absent. Two substantial technical article **drafts** exist under `content/writing/`; they are **not owner-approved or published** and have no invented publication dates. See `docs/PHASE-06.md` for the review flow and acceptance matrix. No launch approval or SEO indexing was changed. Next: owner-review both drafts (P06-A01), then real Next.js build/HTTP/browser QA; P07 localization is a separate later release.


## P08 — Owner Studio and optional contact form (approved to start 2026-11-15)

**Status:** IMPLEMENTED — VERIFICATION PENDING / EXTERNAL ENABLEMENT BLOCKED. Implemented private GitHub-OAuth owner sign-in and HMAC session, source-controlled content editing with draft PR review/audit, optional sanitized image submissions, secure offsite-backup export path, and optional public contact form with Turnstile, durable Upstash Redis rate limiting, and Resend delivery. **Both are disabled until all secure environment variables/providers are configured and tested**. Phase 05 launch/content approvals and Phase 06 article review remain pending. Phase 07 language translation was intentionally skipped (no navigation/control shown). See `docs/PHASE-08.md` and `.env.example` for exact setup, acceptance evidence, and risks.

## Phase 07 — internationalization and RTL (15 November 2026)

**Source milestone:** prepared bilingual public portfolio with locale-prefixed routes. English stays at the original URLs. Added 247 Dari and 247 Pashto UI entries, all six translated project case studies (context, features, architecture, tradeoffs and states), localized search/filter/link destinations, body direction and client navigation handling, no-index-gated canonical/hreflang/sitemap, and optional contact-form translations. Checks: `npm run check:locales` and `node --test tests/phase07-i18n.test.mjs`, existing content/writing/SEO checks. Source and HTML contracts do not prove visual RTL acceptance or real-device QA.

**Honest pending status:** `content/locales/approval.json` is owner-pending for both languages; no public language switch or public locale routes yet. Developer preview requires `PORTFOLIO_LOCALE_PREVIEW=true` in a non-production server. Owner must review Dari/Pashto quality, public claims, sensitive case wording and screenshot captions; perform screen-reader/keyboard + 320/768/1440 RTL tests and record fingerprint before enabling each language. Published Writing remains English-only until approved translations exist; private P08 Studio remains English-only by scope. Phase 05 public launch and provider configuration still pending.

**Local Git pull issue reported:** the owner's `C:\projects\portfolio\tsconfig.json` has an uncommitted local edit that prevents fast-forward. It is not visible in this remote workspace. Preserve it via `git stash push -- tsconfig.json` before retrying pull; do not force reset or automatically reapply the stash. Current tracked tsconfig already includes the standard Next.js plugin and `.next` type paths. See `docs/PHASE-07.md`.

## Design refinement — typography, color and project feature visualization (15 November 2026)

**IMPLEMENTED — VISUAL / RUNTIME VERIFICATION PENDING.** Owner requested a stronger editorial type system, refined cobalt/indigo/coral tokens in dark/light modes, CSS-generated holographic/3D-inspired illustrations and accessible transitions. Added a complete alternating feature-story section per published case study, with source-backed feature descriptions, mobile stack, RTL mirror and visible placeholder labels. No unapproved third-party screenshots or fictional product metrics added. Owner can later replace concepts using approved local screenshots. Content and localization approval gates remain unchanged. Test source contracts and existing source checks; actual Next.js CI build, keyboard/RTL real-browser and device testing remain follow-up verification.

## Typography refinement — 15 Nov 2026

Replaced inconsistent platform-only English font fallbacks with self-hosted **Manrope Variable** and Arabic-script fallback stacks with self-hosted **Vazirmatn Variable**. Updated heading weights and letter spacing to be softer and more legible; public/Studio components share the same tokens. Added `tests/typography.test.mjs` and `docs/TYPOGRAPHY.md`. These changes require `npm install` after pulling. GitHub CI/build results and real-device visual acceptance must be checked separately; this is not a public launch approval.

## Phase 09 — Skills and technologies (16 November 2026)

**IMPLEMENTED IN SOURCE; HOSTED AND DEVICE QA PENDING.** Evidence-linked six-category card grid introduced on Home and About with responsive theming, inline SVGs, accessible links, typography and RTL support. Categories derive from published project records, while GitHub/Netlify are explicitly labeled the current portfolio delivery path. Added navigation anchor and draft Dari/Pashto copy; no automatic owner approval for locales, identity, or public indexing. See docs/PHASE-09.md for scope and acceptance checks.

## Phase 10 — experience portfolio timeline (16 November 2026)

**IMPLEMENTED IN SOURCE / CI AND LIVE VISUAL QA FOLLOW-UP.** Homepage three-project experience preview; About full six-project independent-work timeline with accessible expandable case-study scope, technical notes, repository-backed technologies and working project links. All are explicitly labeled *independent projects*, not employment; no fictional employer, date, compensation, accomplishment or role attribution is presented. Schema in `content/experience.json` has zero formal roles and server projection only permits actual owner-approved validated formal records. Header/footer anchors, responsive tablet nav, draft Dari/Pashto copy, locale review fingerprint and regression tests included. See `docs/PHASE-10.md`.
