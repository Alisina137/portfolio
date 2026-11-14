# Phase P03 — Credible About, Contact and conditional résumé

**Product source:** Portfolio Product Specification v1.0, PAGE-04/05/06, FEAT-008/009/010, P03-A01–05.  
**Workflow:** Software Development Workflow V5, vertical slices and truthfully reported acceptance.  
**Git base:** `daa1f3ccbfc7be472a8fc90f0611372557554fee` (`main`, Phase 2).

## Delivered in source

- `/about`: editorial introduction, accessible monogram (not a headshot), four skill clusters directly linked to source-reviewed project cases, project-derived technologies, product process, conditional **approved** education, and project/contact/social calls to action. No unverified employer, award, job dates, or education claims.
- `/contact`: clear professional outreach context and active public GitHub/project destinations. When an **owner-approved** valid email is configured, it renders selectable email text, `mailto:`, copy-to-clipboard with an accurate success live region, and an accessible manual-copy fallback. Until then, the page explicitly states that no direct email option has been approved and no message form is available. No invented address or fake form.
- `/resume.pdf` utility: only an approved PDF physically present in `public/resume.pdf` can appear in header, mobile menu, About, Contact or footer. Missing/unapproved file means **no broken résumé links**.
- Navigation: Home / Projects / About / Contact in desktop/mobile header and footer. Home's hero, About preview, and closing CTA now link to shipped destinations. Case study has a related contact call to action. Active nav, keyboard-operated mobile menu and theme retained from P01/P02.
- Privacy and release safeguard: server-only public identity projection isolates unapproved email, social URL, education and CV metadata from client props; `robots:noindex,nofollow` stays in place until launch approval.

## Verification evidence from environment

- `npm run check:content` — **PASS** (6 published preview cases, 9 pending review; no approved contact address or PDF).
- `npm test` — **PASS** (23 Node tests for P01–P03 including public identity privacy, route links and copy-failure behavior; inspect terminal to confirm count).
- P03 About and Contact **layout-only** HTML mock rendered in headless Chromium using `page.set_content` with actual CSS. No horizontal scroll at 320, 360, 768, 1024 and 1440 px. **This is not a production Next.js browser E2E test.**
- Actual framework build/typecheck and browser interaction **UNVERIFIED** because Next.js/React dependencies are unavailable offline in this container. `npm run build`/`npm install` should be run in the user's IDE and any failures fixed before approval.
- Real email click/copy and PDF link cannot be fully exercised because the owner has not approved an address or supplied a résumé. These remain **blocking acceptance** for the complete specified Contact journey and any résumé-dependent flow.

## Remaining owner decisions and release constraints

**DEC-01 (blocking):** Approve a professional **public** email or a demonstrably reachable alternative contact channel. Set `publicEmail` and `publicEmailApproved: true` in `content/profile.json` only after explicit approval; a private/unverified address must not be committed. A direct email option will then render automatically, and you must verify it in a real email client and test permission-denied clipboard behavior.

**DEC-03/02/07:** Confirm editorial bio, exact education wording, project ownership/claims and sanitized authentic media before launch. For approved education add `education` and set `educationApproved: true`. Do not create fictional jobs, quantified wins, clients or dates.

**DEC-05 (optional):** If a true, reviewed `public/resume.pdf` is supplied, set `resumeUrl: "/resume.pdf"` and `resumeApproved: true`. If no PDF is provided, keep both fields null/false. For an optional LinkedIn link add an approved HTTPS `/in/...` URL and `linkedInApproved: true`.

`npm run check:release` intentionally blocks P03 source from going live; P04/P05 quality, owner content and deployment tests still need to pass. **Honest phase status: IMPLEMENTED — VERIFICATION PENDING / DEC-01 BLOCKED.**

## Demo path

1. Home → **Explore projects** → MaktabLink → **Get in touch** → Contact; GitHub link works, unapproved direct address is not shown.
2. Home → **More about me** → all four skill clusters → related project, then browser Back → About → Contact.
3. At 360 px use mobile menu to visit all four routes; the active destination is indicated. Test keyboard and reduced-motion states on actual Next app.
4. Once public email is approved, open `mailto:` using a real configured mail application, copy successfully, block clipboard and verify manual selection + live-region feedback. Confirm hidden CV links until a true approved PDF exists.
