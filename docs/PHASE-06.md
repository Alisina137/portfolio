# Phase 06 — Technical writing (FEAT-018 / PAGE-08 / ROUTE-09–10)

**Status:** IMPLEMENTED — OWNER APPROVAL AND PRODUCTION VERIFICATION PENDING. Writing is **not published**. This is intentional and required by Product Specification v1.0, P06-A01–03 and BR-022.

## What exists

- A source-controlled article manifest at `content/writing/articles.json`, with explicit `draft | published | archived` status, owner approval state, and truthful date fields.
- Two original technical **draft articles** for content review (not published, not claimed as personal achievements):
  - `publishing-content-without-leaking-drafts.md`: publication visibility, 404, validation and review.
  - `booking-calendars-and-shared-availability.md`: shared venue occupancy, server-side concurrency and booking recovery.
- Hidden-until-approved Next.js routes: `/writing` index, `/writing/[slug]` article, and both OG image routes. `/writing` returns an actual 404 if fewer than two articles are approved.
- Responsive editorial reading layout, dated metadata only once approved, section anchors, category filters, technical code highlighting, accessible copy with recovery, and project/related-article links.
- Navigation in mobile/desktop header and footer, SEO metadata, static article paths and sitemap all use the same `isWritingEnabled()` gate. No public admin, analytics or database required.
- Security: markdown is deliberately rendered via React text nodes only; unsafe inline protocols, executable embeds, raw HTML, and externally hosted images are not accepted. The article body is never placed under `public/`.
- `npm run check:writing` and `tests/phase06-writing.test.mjs` validate content, the publishing gate and safe rendering. Preview HTTP smoke checks cover both hidden and published modes.

## Acceptance and decision record

| ID | Expected result | Status |
| --- | --- | --- |
| P06-A01 / WRITE-01 | At least two *complete owner-approved* real articles | **PENDING:** two draft articles prepared, zero approved |
| P06-A02 / WRITE-02 | Functional routes, links, accessible code, SEO and browser checks | Code/tests implemented; **live Next.js/browser verification pending** |
| P06-A03 / WRITE-03 | Writing navigation appears only when at least two approved posts exist | Guard implemented and covered in tests; live-browser check pending |
| BR-020 | No unchecked HTML/external execution | React-safe Markdown renderer; unsafe protocols rejected |
| BR-022 | No placeholders, fake dates, or public draft routes | Both drafts have null dates; routes 404 until approval |

**Not approved:** Turning the drafts into published posts, inventing published dates, adding them to live navigation, or changing the Phase 5 launch approval flag.

## Review and publish when you are ready

1. Review both entire Markdown drafts for technical accuracy, wording, authorship, originality, and claims. Edit or replace them freely before approving them.
2. Review their `title`, `excerpt`, `category`, `tags`, and `relatedProjects` in `content/writing/articles.json`.
3. After explicit owner approval, update **both** article records with `ownerApproval: "owner_approved"`, `publicationStatus: "published"`, `publishedAt` to the actual date of publication (`YYYY-MM-DD`), and leave `updatedAt: null` until updated later. Never backdate a post arbitrarily.
4. Run `npm run verify` and `npm run smoke:http`, then check actual `/writing`, article URLs, mobile layouts, code copy, keyboard navigation, share images and sitemap on your test deployment. A second independent reviewer can help verify publication claims.
5. Release through the normal GitHub-reviewed flow. The public-site launch signoff (`content/launch-approval.json`) stays separate: do not enable indexing while Phase 5 approvals are pending.

**Failure behavior:** When fewer than two qualifying records exist, index, detail and OG routes return 404, the header/footer omit Writing, and the sitemap omits writing routes. If a reader requests an unknown, archived or unapproved slug after publishing, it also returns 404. The catalog stays unchanged.

## Demo and test commands

```powershell
cd C:\projects\portfolio
npm install
npm run check:writing
npm test
npm run build
npm run smoke:http
npm run dev
```

While the drafts remain unapproved, `/writing` must return 404. To preview the final public writing experience, use a separate local test branch with review-approved article metadata and real dates; do not commit fictitious approvals to `main`.
