# Phase 11 — Education & Certifications

**Status:** Implemented in source; credential publication requires owner approval plus evidence review. Hosted and real-device QA remain separate.

## Delivered

- A responsive education-and-credentials preview on the **Home** page and complete **Education**, **Certifications**, and **Professional training** cards on the About page (`/about#education`).
- Editorial-style credential cards with year ranges when supplied, institution and issuer fields, supporting descriptions, and optional safe public verification URLs. Degree-associated academic projects appear only when the owner explicitly associates them with a reviewed qualification record.
- Each category renders a transparent, useful empty state while no approved record exists. No fake degree, dates, institution, training course, certificate, serial number, badges, or issuer.
- An independent **Learning in practice** showcase links to existing MaktabLink and KankorPrep case studies, clearly labeled independent software projects rather than university coursework or certification outcomes.
- Footer and homepage CTAs lead to the About section; existing header navigation is left uncluttered. English, Dari, and Pashto previews use the same semantic structure and RTL adjustments, with owner-pending translations.
- Scoped premium CSS supports dark/light themes, accessible focus, 3/2/1-column layouts, 320–1440px breakpoints, and reduced-motion preferences.
- `content/qualifications.json` is the only place for reviewed, approved public structured qualifications. Its three arrays are **intentionally empty** until evidence is provided. `lib/qualifications-core.mjs` fails closed unless `ownerApproved=true` **and** `documentReviewed=true` on every record.
- Compatible with the previously created `profile.education` approval system: when an owner-approved legacy education string exists, it is displayed without inventing a graduation date.
- `npm run check:credentials` checks public credential data and the published-learning-project slugs. The production build now runs this validation. New tests cover malformed data, false approval flags, unsafe external URLs, structure and responsive styling.
- The source fingerprint used for locale approvals now includes `content/qualifications.json`; changes to qualifications will require re-review of Dari and Pashto translations. Search indexing and launch approval remain gated.

## Safe path for adding a real university qualification

1. The owner shares the correct university, exact degree wording, field, dates if known, and the diploma for private review. Never copy full diploma scans, document IDs, registration numbers, signatures, birth dates, grades, or private credentials into Git.
2. After confirming what may be publicly shown, add a sanitized record to `content/qualifications.json`, with `ownerApproved:true` and `documentReviewed:true` only after actual owner sign-off and document review.
3. For professional certificates, verify the exact issuer, title, dates (if included), and public credential URL (if available). Only an actual safe HTTPS public verification link should appear; no made-up credential numbers or certificates.
4. Keep `academicProjects` empty unless the owner confirms a real course-related project. A project about education does not automatically count as an academic project.
5. Run `npm run check:credentials`, `npm run check:content`, `npm run check:locales`, `npm test`, and `npm run build`. Use a reviewed PR and Netlify's GitHub auto-deployment to publish.

## Acceptance checks

On the Netlify preview, inspect `/#education-preview` and `/about#education`, keyboard and touch project links, 320/360/768/1024/1440px layouts, color contrast, theme persistence, reduced-motion setting, and graceful empty states. Once real records are approved, verify safe links and accurate dates. Translation publication needs independent RTL and language approval.

No change is made to the existing Phase 5 launch record, `PORTFOLIO_LAUNCH_APPROVED`, contact providers, Studio credentials, or public search indexing.
