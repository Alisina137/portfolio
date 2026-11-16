# Phase 17 — Testimonials & Recommendations

**Status:** Source implementation and editorial safeguards prepared. GitHub Actions, Netlify production deployment and manual mobile/RTL/keyboard QA are separate release checks.

## Editorial truth and consent

There are **zero verified public testimonials** in the provided source material. The site does not imply a commercial client base, workplace references or customer ratings; no invented names, occupations, companies, photographs, quotations, star ratings or testimonial counts are shown.

`content/testimonials.json` starts with an empty `entries` array. The Home preview and detailed `/testimonials` page show an honest, polished empty state and link visitors to source-backed case studies. When genuine recommendations are ready, they appear in a responsive quote grid with relationship filters, contributor attribution, professional context and optional verified project/public profile links.

## Requirements for adding a real recommendation

Collect permission **outside public source control** and retain the consent evidence securely. Confirm the person's identity, their relationship to the owner and the factual context. Never put private email, phone, screenshots of private conversations, medical/student data or unredacted evidence in this GitHub repository.

After consent, use the **owner-only Studio → Recommendations** form to propose a record through a *draft GitHub pull request* if Studio has been configured. It requires attestations for identity verification, reviewed context, written consent and owner approval. Alternatively create a reviewed GitHub pull request editing `content/testimonials.json`. No anonymous publishing endpoint exists. The required record fields are:

```json
{
  "id": "unique-kebab-id",
  "name": "Real contributor name",
  "role": "Verified professional role",
  "relationship": "collaborator",
  "quote": "The contributor's exact words, shared with written permission and sufficient context.",
  "context": "An accurate public description of the work done together.",
  "projectSlug": "maktablink",
  "language": "en",
  "consentedAt": "2026-11-01",
  "reviewedAt": "2026-11-16",
  "published": true,
  "ownerApproved": true,
  "identityVerified": true,
  "evidenceReviewed": true,
  "consentToPublish": true
}
```

**The example is documentation only; it is not a live recommendation.** Optional fields: `organization` (only with permission), `profileUrl` (consented public GitHub/LinkedIn profile), `projectSlug` (must be a published project) and `language` (en/fa/ps). Allowed relationships: `client`, `collaborator`, `colleague`, `mentor`. Do not use a client relationship unless actual client work is evidenced. The consent date cannot be later than the review date. The public UI does not display private audit booleans.

If the contributor revokes permission, remove the record in a reviewed pull request and redeploy promptly. Public GitHub history can retain previously committed words; disclose that limitation before obtaining permission and do not store private consent evidence in Git history. An unapproved record fails `npm run check:testimonials` rather than leaking into the build.

## Implemented UI

- Homepage `/#testimonials`: featured (max 2) approved quotes when available; otherwise an honest empty state and route CTA.
- `/testimonials`: editorial hero and quotation artwork, genuine recommendation cards, relationship filters with `aria-pressed`/live result count, 3-stage publication standards, and case-study CTA.
- Header, footer, About, sitemap, Open Graph and SEO integration.
- Responsive layout, premium light/dark styles, keyboard focus and reduced-motion controls, untranslated quotes preserved in their original language with `lang` and `dir=auto`.
- Dari/Pashto translated page structure remains **draft and owner-review gated**; source fingerprint includes testimonial data so a new quote invalidates prior translation review.
- Owner Studio → Recommendations editorial form: authenticated by the existing owner session, same-origin POST, strict server-side validator, approved project linkage, and draft GitHub PR only. This feature stays disabled while Studio environment/provider setup is incomplete. No public submission endpoint exists; anonymous people cannot post unmoderated endorsements.

## Verification

Run `npm run check:testimonials`, `npm run check:locales`, `npm test`, `npm run build`. In Netlify preview, test `/testimonials`, Home/Testimonials and About links, truthful empty state, 320–1920px, 200% zoom, keyboard, screen reader, light/dark and reduced motion. For populated fixture test **only in test code**, verify filters, links, consent gate and that original quotation language is preserved.

Existing Phase 05 indexing and Dari/Pashto locale publication approvals remain OFF until separately reviewed.
