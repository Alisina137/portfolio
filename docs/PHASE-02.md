# Phase 02 — Projects catalog and case studies

**Specification:** Alisina Portfolio Product Specification v1.0, PAGE-02/PAGE-03, P02-A01–A07.  
**Workflow:** Software Development Workflow V5.  
**State:** Implemented, real Next.js build/device E2E verification still pending; **not launch approved**.

## Route and user experience inventory

| Route or component | Job | Phase 02 behavior |
| --- | --- | --- |
| `/` | Home | Six original curated featured cards now link to individual case studies; "Explore projects" and "Explore all projects" open `/projects`. |
| `/projects` | Catalog | URL-controlled case-insensitive Unicode-normalized search, category/status intersection, Featured/Newest/A–Z sort, nine-per-page Load more, no-match state, clear filters, filter persistence. |
| `/projects/[slug]` | Case study | Factual audience, problem, implemented capabilities, architecture, decisions, status/limitations, source link, related cases, contextual return link. |
| `ProjectGallery` | Optional media viewer | Renders only approved local media: captions/alt, native modal dialog, Escape, arrows, close/focus return. No gallery UI exists while approved screenshots are absent. |
| Nav/footer | Shipped pages only | Home and Projects only; About/Contact/Writing remain hidden until respective phases. |

## Public content safety

- Source-backed public previews: MaktabLink, Futsal, BazaarLink, AmlakLink, DandanLink and KankorPrep. All are labeled **In development**; no store/demo/traction claims.
- Case studies use checked public repository READMEs as *source evidence*, not verification of real-world production behavior. Personal role attribution is still owner-pending.
- Nine additional public GitHub repositories remain in `content/review-queue.json`. They are **not catalog entries or client-visible case records** until scope, product naming, screenshots, and accurate facts are approved. This is not a declaration that those projects were fully audited.
- No authentic screenshots have been approved. The existing reusable `ProjectArtwork` is **explicitly labeled conceptual**, and no fabricated gallery appears. An owner-approved local capture may later be added under `/public/media` and described in the media array; the validator checks the path, alt, caption, group, and approval.
- Published content is obtained only through `lib/content.ts`; pure `lib/status.ts` avoids importing editorial/draft records into the client bundle.
- `getPublicProject` and `getCaseStudy` reject unpublished/unknown slugs; Next uses `dynamicParams=false`, `generateStaticParams`, and `notFound()` for invalid detail URLs.
- No contact route, contact form, résumé, editor, unapproved date, or localization control is introduced in P02.

## Core test scenarios

1. Open `/projects`; six source-reviewed cases; choose Education; search `school` → MaktabLink only; clear filters restores all.
2. Search `school` + Marketplace → explicit empty state, not invented result. `?q=...&category=...&status=...&sort=...&page=...` is shareable.
3. Open a case from a filtered listing; Back browser/"Projects" breadcrumb should preserve its query; related cases should not repeat current or show draft.
4. Simulate 0/1/9/10/50 records in the pure catalog test harness; page 2 reveals up to 18 and invalid `page` is bounded.
5. Unknown or unpublished project URL returns a proper Next 404; no case payload or related link exposes drafts.
6. Verify 320, 360, 768, 1024, and 1440 px for catalog and individual cases in real Next runtime; keyboard menu, theme, gallery, and focus flow.

## Evidence and limitations

- `node scripts/check-content.mjs`: passes case/publication/media integrity and featured curation checks.
- `npm test`: Node-native P01+P02 tests and development-only static previews (not the real Next runtime).
- TypeScript transpile syntax checks: no syntax errors; not a semantic typecheck.
- CSS visual static catalog preview: 320/360/768/1024/1440 px had no horizontal overflow with locally injected stylesheet. Actual Next rendering and interactions were not exercised because package-registry access is blocked here.
- `npm run check:release` **intentionally fails** until owner approves published copy, real reachable contact, full MVP and launch checks.
- Remaining external gate: `npm install`, `npx tsc --noEmit`, `npm run build`, real Next browser E2E on phone/desktop, owner content approval and real sanitized screenshots. No claim of full phase verification is made.

## Owner content checklist before launch

- Review public name, professional role, biography, and exact contribution/ownership of each case.
- Approve which of the nine review-queue repos should be added; avoid duplicate variants of the same product.
- Supply at least one authentic, sanitized capture for each featured case if available; review for school/clinic data and tokens.
- Approve verified public contact method for P03 and any optional CV/domain/social links.

**Next:** P03 — About, approved contact channel, optional approved résumé.
