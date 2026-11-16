# Phase 16 — Achievements & Impact

**Status:** Implemented in source. Automated GitHub tests/build and live Netlify/device QA are separate acceptance steps.

## Truthfulness and measurable impact

There are six publicly linked and source-reviewed project case studies (MaktabLink, Futsal, BazaarLink, AmlakLink, DandanLink, KankorPrep), six matching public project GitHub repositories, and four distinct product categories (Education, Sports, Marketplace, Healthcare). These are **portfolio coverage statistics**, computed from records already in `content/projects.json`, `content/case-studies.json` and `content/repositories.json`. They are **not** clients, shipped apps, active users, revenue, deployments, product success or time saved.

No evidence-reviewed adoption / ROI / revenue / time-saved metrics have been supplied, so `content/impact.json` includes **no measured outcomes** and the UI shows a useful truthful empty state. This intentionally avoids fabricated statistics.

## Delivered

- Home `/#impact` section: evidence-first snapshot with 3 derived documentation counts and 2 featured engineering achievements, clear disclaimer and an `/impact` CTA.
- New detailed `/impact` page with six documented project/repository coverage statistics, four clearly scoped engineering/project patterns and an honest `Measurable results` block.
- Each engineering highlight expands with a keyboard-accessible native `<details>` control, showing **two source-reviewed project notes**, clickable corresponding case-study links, actual GitHub repository links and README-based review statements.
- Functional `All / Engineering systems / Product workflows` filters with `aria-pressed`, live result counts, status text and empty-state recovery; no API keys or service integrations.
- Premium light/dark colors, full semantic heading hierarchy, accessible labels, responsive cards at 320–1720px, reduced-motion, no artificial client logos or dashboard performance claims.
- Dari/Pashto **draft** translation keys and dedicated translated achievement copy. Locale routes `/fa/impact` and `/ps/impact` remain subject to the existing owner-approval and RTL gates; source fingerprint now includes impact data.
- Honest optional measured results: only allow sanitized values when `ownerApproved=true`, `evidenceReviewed=true`, meaningful measurement methodology/period and reviewable HTTPS GitHub evidence under the owner’s repositories. Public source validator rejects incomplete/unreviewed records.
- Header/footer Impact nav, About CTA, SEO metadata/Open Graph image and source-reviewed sitemap policy integrated with existing launch controls.

## Source records / updating

The machine-readable source is `content/impact.json`, with:
```json
{
  "schemaVersion": 1,
  "framing": "repository_and_case_study_evidence_not_business_outcomes",
  "highlights": [{ "id": "architecture", "category": "engineering", "evidence": [
    { "slug": "maktablink", "note": "Tenant boundaries", "source": "technicalNotes" },
    { "slug": "dandanlink", "note": "Roles and tenancy", "source": "technicalNotes" }
  ] }],
  "measuredOutcomes": []
}
```
(The live file includes all four complete highlight records.) Changes to source-backed notes must match the **exact real title** in published case-study records.

Only add real adoption/result metrics after the owner supplies a verifiable source showing what was measured, how, and over what timeframe; remove personal/sensitive data and obtain permission. A real measured result contains `id`, `title`, numeric `value`, `unit`, `timeframe`, `methodology`, `sourceUrl` and optional `projectSlug`; source must be a reviewable safe GitHub URL from `Alisina137`, with explicit `ownerApproved: true` and `evidenceReviewed: true`. The build does not permit an unpublished or unapproved metric to appear accidentally.

## Acceptance

Run `npm run check:impact`, `npm run check:locales`, `npm test`, `npm run build`. On Netlify verify:
- Homepage `/#impact` and dedicated `/impact` (when latest Netlify deploy shows Published).
- All four expandable evidence cards, internal case-study routes, external verified GitHub links.
- Each category filter and live result count; back/forward links, screen reader and keyboard navigation.
- Mobile 320/360px, tablet 768/1024px, desktop 1440/1720/1920px, 200% zoom, light/dark and reduced-motion.
- In development-only preview (requires `PORTFOLIO_LOCALE_PREVIEW=true`), Dari/Pashto copy and RTL mirrors.
- Confirm no user metrics, production launch, employer records, date ranges, endorsement or product impact claims without evidence.

Phase 05 public-indexing approvals and localization gates remain unchanged.
