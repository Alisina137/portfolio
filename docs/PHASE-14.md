# Phase 14 — Featured GitHub Repositories

**Status:** Implemented in GitHub source. Production build/CI and real-device Netlify verification are distinct acceptance gates.

## What is supported by actual GitHub verification

On **2026-11-16**, the connected GitHub repository API confirmed that `Alisina137/maktab`, `Alisina137/futsal`, `Alisina137/bazaar-`, `Alisina137/amlak`, `Alisina137/dentist`, `Alisina137/kankor` and `Alisina137/portfolio` are **public**, with `main` as the default branch and `TypeScript` as GitHub's primary language. All six product repositories already have matching verified links in `content/projects.json`, plus published source-reviewed case studies.

The date shown on the site is when **GitHub URLs and metadata were checked**, not a latest activity/commit date, and is **not automatically updated**. GitHub returns volatile stars/issues/etc., but the UI deliberately does not display or cache those metrics; no popularity or activity claims are made.

## Implementation

- New three-card **Featured Code Repositories** preview on Home (`/#repositories`), showing MaktabLink, Futsal, DandanLink, technology labels, relevant source URLs and case studies, with CTA to the complete directory.
- New `/repositories` page featuring **7 verified public repositories**: six software projects and this portfolio site itself, with exact GitHub paths and source-review date. Repo details derive safely from published project data and are suppressed when mismatched/unpublished.
- **Functional client-side search, filter (all/product/portfolio) and sort (featured first/name)**, live result counts, no-results state and reset; no client-side token or external API required.
- Every repo card has a genuine GitHub external link opening in a new tab with `noopener noreferrer` and a local case-study link for project repos. Portfolio source is distinguished, not misleadingly called a client product.
- Header/footer navigation item **Repositories**, About CTA; responsive nine-item header uses the existing scrollable accessible mobile overlay up to 1600px, rather than cramming links.
- Dedicated route SEO metadata, open-graph image, sitemap and locale path support (owner-gated English/Dari/Pashto). Source revisions invalidate old translation approvals.
- Original inline repository vector art, premium cards, 3/2/1-column responsive grid, type-scale tokens, light/dark palettes, RTL-safe layout, keyboard focus, touch-friendly controls and reduced-motion support.
- Source-only validation `npm run check:repositories` included in build/verify scripts. Regression tests enforce link integrity, zero fake metrics, localization, full route wiring and design contracts.

## Acceptance

Run `npm run check:repositories`, `npm run check:locales`, `npm test`, `npm run build`; then inspect production at `/#repositories` and `/repositories`. Test entering `Next.js`, `maktab`, and `portfolio`; apply each filter and sort order; clear an empty result; open GitHub URL and return to case studies. Check menu at 320/360/768/1024/1440/1600/1700px; 200% zoom; light/dark; keyboard navigation; reduced-motion; RTL drafts locally. No personal details, real client claims, or public index approvals have been changed.

## Refresh policy

When adding a repo, first confirm the exact public GitHub repo and URL through an authorized source, ensure `content/projects.json` has a published case record (or explicit approved standalone entry), add it to `content/repositories.json` with correct branch/language, and update `verifiedOn` only after actual re-verification. Re-review Dari/Pashto copy before changing its release gates. Never invent star counts, push dates, issue totals, or "recently active" tags.
