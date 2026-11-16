# Phase 13 — Currently Working On / Now

**Status:** Implemented in repository source. CI and live Netlify/device acceptance are separate verification gates.

## What the page means

The `/now` page is a **source-reviewed snapshot** of portfolio projects with a recorded development status of concept, prototype, in development, or pilot. The checked project records all carry a source-review date (currently 2026-11-14). That date means *when the portfolio source record was reviewed*, **not** a latest commit timestamp, current sprint date, live update, employer contract, completion percentage, or assurance that each project is being worked on today.

Status, technology names and description come from `content/projects.json`. Next verification or release-readiness checks are presented from each project's `content/case-studies.json` `nextSteps[0]` field—not as a work commitment. No personal learning goals are published until explicitly approved.

## Delivered

- A compact Home **In Progress** preview with MaktabLink, Futsal and DandanLink. All three cards link to source-backed case studies. The preview CTA leads to a functional `/now` page.
- A dedicated polished Now page showing all eligible, published projects (currently six), project status, category, technology tags, actual review date, next verification item, and case-study links.
- **Interactive client-side search + category filters**: instant results, clear selected-state buttons, live result count, zero-results recovery, keyboard-friendly inputs and labels, no dependency on an external API. Filters operate on the sanitized server-projected public project fields only.
- Three **Technical Threads** evidence cards generated from real published projects and technology associations. The categories are project-evidence themes, not claimed personal learning objectives or measured skill levels.
- Optional future owner-approved learning goals in `content/now.json`. Currently empty. `getPublicLearningGoals()` fails closed for missing approval or malformed items; no personal plan or dates are fabricated.
- Header and footer Now links, a related About-page CTA, a new Open Graph page card, metadata and approved-only sitemap inclusion. Main menu adjusts to a compact, accessible overlay for layouts below 1501px so expanded navigation remains usable.
- Draft Dari/Pashto text and focus descriptions, route matching, RTL-safe styling and locale source-revision fingerprint; the existing translation-owner approval gates are unchanged.
- Color-token-based premium CSS with restrained transitions, readable type tokens, dark/light themes, responsive 3/2/1 and 2/1 grids, accessible focus styles and reduced-motion behavior.

## Acceptance criteria

- `npm run check:now`, `npm run check:locales`, `npm test`, `npm run build` pass; GitHub PR must pass CI before merge.
- View `/#now`, `/now` and `/about` and verify all project links resolve. Search for a technology; filter by area; combine category and keyword; test empty results and reset. No fabricated progress/last-commit claims.
- Inspect layouts at 320, 360, 768, 1024, 1366, 1440 and 1600px; keyboard-only navigation and focus; mobile overlay scroll; theme; prefers-reduced-motion; text zoom 200%.
- Preview `/fa/now` and `/ps/now` only in development, with `PORTFOLIO_LOCALE_PREVIEW=true`. Neither translation is publicly approved. All personal education/contact and launch gates remain unchanged.
- Netlify must show Published for the merged commit; a successful GitHub build alone does not prove hosted deployment.

## Updating the snapshot

1. Update the underlying project and case-study records with **source-confirmed** status, next review needs and review dates; do not invent milestones or progress percentages.
2. To change highlighted projects or technical threads, update the strictly validated `content/now.json`, while preserving evidence links to published cases.
3. To publish a real learning objective, request owner approval for the exact wording before adding it to `learningGoals`; avoid private or unreviewed sensitive information.
4. Update corresponding Dari/Pashto drafts and re-approve translations separately. CI checks stale approval fingerprints.
5. Merge the reviewed PR into GitHub `main`; the existing Netlify integration then triggers a new production deployment.
