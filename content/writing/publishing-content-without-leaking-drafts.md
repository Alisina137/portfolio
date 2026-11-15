## The difference between written and public

A content record can exist without belonging on a public website. That distinction sounds simple, but publishing software often turns it into a collection of disconnected conditions: a card is hidden here, a menu item disappears there, and a route accidentally remains reachable elsewhere.

The safer starting point is a small, explicit lifecycle. A draft can be edited. A reviewed draft can be approved. A published item is eligible to appear to visitors. An archived item is no longer offered through public discovery. Those states are not interchangeable with a product's *development* status. A portfolio case study can describe software that is still in development without itself being an unapproved draft.

> Visibility is a data rule, not just a component style.

## Publish from one projection

For a content-driven Next.js website, I prefer one function that answers a specific question: *which records may be shown publicly right now?* Components should consume that approved projection rather than the full editorial collection.

For example, the following is illustrative pseudocode, not a copy of production source:

```ts
function visibleArticles(records: Article[]) {
  return records.filter((item) =>
    item.publicationStatus === 'published' &&
    item.ownerApproval === 'owner_approved' &&
    validPublicationDate(item.publishedAt)
  );
}
```

The same list should drive the article index, home-page recommendations, related articles, metadata, and sitemap. An individual article route must check that its slug exists in that approved set. Showing a generic 404 for unavailable content is safer than revealing the title of a private draft.

## A hidden link does not hide a route

Suppose a Writing tab is not yet in the header. Someone may still guess `/writing/some-draft-slug`, find an old search result, or follow a copied URL. A menu condition has no authority over these entry points.

The actual route handler must enforce visibility. In a statically generated site, generate public article paths only from approved records; reject unknown or unpublished paths. Robots rules and sitemap generation must use the same policy, but remember that `noindex` is a crawler instruction, not authorization.

The rule extends to assets. A draft PDF or screenshot stored under a publicly served directory can be fetched directly, even if no page links to it. Keep private drafts in source-controlled editorial storage, not in public assets. Check images for identifying information before publishing them.

## Validate the transition, not just the fields

A content schema should validate meaningful state combinations. A published article needs a reviewed title, an accurate publication date, complete body text, and a clear relationship to any referenced project. Drafts should not carry fictional public dates simply to make a listing look complete.

A release check can make these invariants concrete:

- All published slugs are unique and follow a stable URL format.
- Every published record has explicit owner approval and a real date.
- A published item has meaningful body content, not an empty introduction.
- Related project links target actual public case studies.
- No draft article appears in public route generation or the sitemap.

Invalid metadata should fail a build rather than silently becoming a broken page. The validation step is especially useful when a small portfolio is maintained through Git instead of a content management system.

## Keep editorial review separate from deployment

A successful deployment does not prove that an article is accurate, original, or suitable to publish. Automated checks can detect missing fields, unsafe links, and invalid dates. Only the writer can approve the substance of the text and take responsibility for claims about a product.

For a personal portfolio, that separation is practical. A repository contains drafts and review notes. Approved records become part of the public site. The code does not need a large administration dashboard or a database simply to respect the difference.

## What I would test before release

I would test both sides of the transition: a draft returning 404 before approval and a complete article becoming reachable after approval. I would also check keyboard navigation, readable code blocks, metadata, related links, mobile reading layouts, and the case where the publication threshold is not met.

This is the broader engineering lesson: make content visibility a single verified rule. When an editor changes a publication status, every public surface should agree on what happens next.
