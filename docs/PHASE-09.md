# Phase 09 — Skills & Technologies

**Status:** Implemented in source; production CI and live visual QA are separate verification gates. This phase follows the owner's 12-phase portfolio roadmap (Phases 9–20).

## Delivered

- A shared, professionally styled Skills & Technologies section on **Home** (after selected work) and **About** (replacing the former flat technology-pill list), rather than two inconsistent implementations.
- Six categories: Frontend; Mobile; Backend & APIs; Data & persistence; Languages & foundations; Workflow & delivery. The first five are dynamically filtered against technology names in *published project records*, with case-study links leading to real pages.
- The final card clearly labels **this portfolio's own GitHub-to-Netlify publishing workflow** and links to the portfolio source; it must not be read as a claim to have run production systems for a third-party employer.
- Original local inline SVG illustrations; coherent card hierarchy and typography tokens from Phase 8; light/dark palette, keyboard focus styles, 3/2/1-column grids, reduced-motion support and logical RTL mirroring.
- Header and footer Skills links point to the meaningful /#skills section, including localized routes. Section numbers in Home reflect the new item.
- Dari and Pashto draft copy for the same section is implemented, but existing locale release gates are **unchanged** and the translations remain owner-pending.

## Evidence and limits

Project skills come from the explicit technologies in content/projects.json; no invented proficiency percent, skill levels, endorsements or certifications. An item no longer supported by a published project is excluded. Editorial case claims still require owner review under Phase 05. Direct Netlify deployment verification, mobile/tablet/desktop rendering, accessible interaction QA, and RTL linguistic proofreading cannot be inferred merely from a passing build.

## Acceptance tests

1. On Home, follow Skills navigation to /#skills and verify all six cards, project links and theme switch.
2. On About, verify the grouped skills section replaces the prior flat chip collection without repeating content.
3. Open two linked case studies and confirm source-backed technology labels.
4. Check layouts at 360, 768, 1024 and 1440px, including keyboard focus, dark/light contrast and prefers-reduced-motion.
5. For development-only RTL review, run with PORTFOLIO_LOCALE_PREVIEW=true and inspect /fa and /ps. Never enable public locales or search indexing without the preexisting owner approval gates.
6. Run npm test, npm run check:locales and npm run build. CI tests/build can pass even when human/hosted checks remain pending.

No environment variables, contact configuration, Studio features, or owner release approvals are changed in Phase 09.
