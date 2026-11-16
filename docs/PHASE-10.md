# Phase 10 — Professional Experience (project-based, not invented employment)

**Status:** Implemented in source; Next.js CI and live visual checks must pass before acceptance.

## What is actually known

The portfolio owner has not supplied a verified employer, formal job title, organization, contract dates, or paid role. The previous portfolio source lists six reviewed project case studies and no approved personal attribution. A public career chronology or employers list would therefore be misleading.

Phase 10 presents a **clearly labeled independent-project experience** timeline, with evidence links, status and technical scope, in a curated order rather than fake chronological dates. It does not claim company employment or sole authorship. Dates, employer names, project metrics, implementation responsibility, and finished product releases remain explicitly unclaimed unless the owner approves real evidence.

## Implemented functionality

- On Home: 3 curated independent software projects (MaktabLink, Futsal, DandanLink), with CTA to the full About experience section.
- On About: all 6 source-reviewed portfolio projects in a styled vertical timeline. Entries are not a chronological sequence: no date ranges or employer badges.
- Native accessible `<details>` expanders reveal up to 3 case-study feature descriptions and 2 engineering notes sourced from `content/case-studies.json`. Real links navigate to each case-study URL; technologies and project status derive from `content/projects.json`.
- Strong semantic hierarchy, keyboard focus, responsive cards, low-contrast decorative rail, accessible expandable controls, dark/light theming and reduced-motion support.
- Header and footer Experience anchor links; tablet-width navigation uses the same keyboard-accessible mobile menu rather than overlapping navigation labels.
- The source-controlled `content/experience.json` contains a curated selection/order and **no formal job entries**. `getApprovedEmployment()` only returns validated records with `ownerApproved: true`, a non-empty actual employer and role, YYYY-MM date range, responsibility entries and technologies. A future real record can then render in the separate verified-employment section. Do not add fictitious entries.
- Draft localized Dari and Pashto labels and descriptions follow the existing unpublished P07 locale route. Translation source fingerprint now includes `content/experience.json` so later role updates invalidate stale language approvals. Public locale and full-site SEO release gates remain disabled.

## Acceptance / verification

1. Home `/#experience`: 3 correctly labeled independent project cards; `Explore` expansion works with mouse, touch and keyboard.
2. About `/about#experience-about`: all 6 projects; technical notes match linked case studies, no employer/date claims.
3. From Home, follow the complete-experience CTA; project detail links resolve to actual cases; browser Back works.
4. Header/footer Experience link, mobile and tablet navigation, dropdown keyboard/escape/focus, dark/light theme and reduced-motion.
5. Check 320, 360, 768, 1024 and 1440px plus a 200%-zoom layout. Confirm no clipped controls or excessive whitespace.
6. Run `npm run check:locales`, `npm test`, `npm run build`. Live Netlify deployment, real-browser accessibility, and future language approval are distinct checks.

Future owner action: add *verified* employment evidence and dates to the editorial JSON record when available; do not invent past employers or self-employment dates. Also approve personal role attribution and claims in six project case studies before activating public search indexing. Phase 05 release flags are untouched.
