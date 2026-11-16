# Phase 18 — Technical blog and article experience

**Status: Implemented in source; publication remains blocked pending owner's article approval and real-device acceptance.** This phase advances the Phase 06 foundation rather than creating a second blog implementation.

## Complete reader experience

- A professional, responsive `/writing` editorial landing page for approved posts, with search by title/excerpt/category/tag, category shortcuts, tag selection, newest/oldest/title sorting, visible result range, reset and shareable URL query state.
- Six articles per page with server-side pagination, honest empty results, reading-time information, verified publication dates, category/tag labels and distinct lead-card styling.
- Rich article detail: structured breadcrumb, original article body in safe React-rendered Markdown, fixed reading-progress indicator, active section table of contents, safe syntax-highlighted code blocks with accessible copy, topical tag links, related source-backed projects, related articles, back link and native share or clipboard fallback.
- Article SEO and optional schema.org BlogPosting data when all existing public indexing approvals have been independently satisfied. OG image/routes remain private until writing approval.
- Homepage two-article preview and About link **only after** the two-owner-approved-articles gate opens. No draft excerpt appears in public navigation, pages, homepage previews, sitemap or structured data.
- Private Owner Studio Writing form has a styled Markdown preview that never creates a public route or changes publication status; all edits continue as draft GitHub pull requests.
- Light/dark visuals, 320px–1920px responsive CSS, keyboard focus, 200% zoom-oriented fluid type, RTL-safe layout styles, reduced-motion and helpful loading/error states. **Dari/Pashto article publication stays disabled** pending actual translations and owner review, as required by Phase 07.

## Publication requirement / source ownership

The two existing original technical notes remain exactly as they were: `draft`, `owner_pending`, null publication dates. An owner must read the entire Markdown, verify technical claims/authorship, approve both articles, and set `publicationStatus: "published"`, `ownerApproval: "owner_approved"` and true publication dates in their editorial pull requests. Do not invent dates or treat the user's Phase 18 request as blanket approval to publish.

The `writingIsLive()` gate remains the single source of truth; when fewer than two valid articles are approved:
- `/writing` returns HTTP 404; individual detail and OG endpoints are inaccessible.
- Header/footer omit Writing; the Home writing preview returns null and About links are omitted.
- Sitemap excludes Writing. Generic static content and locale release gates are unchanged.
- The private preview is available only inside the authenticated and separately configured Studio; without owner Studio credentials this editor is intentionally disabled.

## Manual acceptance checklist

1. Run `npm install`, `npm run check:writing`, `npm test`, `npm run build`, `npm run smoke:http`.
2. Confirm the production or preview deployment still hides unapproved articles and the language switch never exposes unapproved translations.
3. After a *separate* reviewed publishing PR, verify /writing queries (`q`, `category`, `tag`, `sort`, `page`), back/forward state, 0 matches, pagination boundaries and related article routes. Test device sizes 320, 360, 768, 1024, 1440, 1920; 200% zoom; dark/light; keyboard; screen reader; reduced motion.
4. In published article detail verify TOC anchors, scroll progress, code-copy feedback, share/fallback and internal/external link safety.
5. In authenticated Studio preview a draft, make an intentional Markdown change and confirm a new draft GitHub PR is created (not immediate publication). Confirm 404 without authorization.
6. Do not enable site indexing, translations, résumé or third-party media as a side effect of article approval.

## Reviewable files

Core: `lib/writing-catalog.mjs`, `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`, `components/writing-reader-tools.tsx`, `components/writing-preview.tsx`, `components/studio-writing-preview.tsx`, `styles/phase18.css`. Regression coverage: `tests/phase18-writing.test.mjs`, `scripts/check-writing.mjs`, existing Phase 06 gate tests. No new services or secrets.
