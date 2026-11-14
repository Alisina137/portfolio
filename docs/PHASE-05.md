# P05 — Content review, release gates and deployment preparation

**Specification:** Alisina Portfolio v1.0 P05, FEAT-015/017/022, P05-A01–A07. **Workflow:** V5.  
**Source baseline:** GitHub `Alisina137/portfolio`, Phase 04 `main` at `6d564aefe405c3d52f9ad3e320b22eed587de183`.

**Status:** IMPLEMENTED — OWNER SIGN-OFF AND LIVE VERIFICATION BLOCKED. This is a release-preparation increment, **not a public launch**. No owner-approved email, domain, verified screenshots, sign-off, deployed host, or real-device acceptance has been supplied. Do not invent these to turn checks green.

## P05 acceptance and actual evidence

| Gate | Delivered in source | Current result / still required |
| --- | --- | --- |
| P05-A01 External URLs | `npm run check:links` follows public, approved GitHub/LinkedIn URLs, detects bad redirects, prints OK/BROKEN/INCONCLUSIVE. GitHub connector separately checked the six published and nine review-queue repositories as public, non-archived on 2026-11-14. | **PARTIAL:** 15 repos valid at check time; rerun `npm run check:links -- --strict` from a networked device before public launch. User must approve linking them. No proof of live demos. |
| P05-A02 Contact | Existing Contact page hides email until a verified and approved address is provided. CLI requires direct contact and approved identity. | **BLOCKED DEC-01:** supply a real public contact email; test `mailto:` and clipboard in a browser and on a phone. |
| P05-A03 Copy, projects, media approved | Content data retains `owner_pending` for all six currently shown cases; `content/launch-approval.json` records explicit owner sign-off and privacy/image review. `npm run check:launch:strict` blocks unapproved publication. | **BLOCKED:** owner must review all six summaries, statuses, attribution, media and biography. No real screenshots have been approved; labeled conceptual artwork is used. |
| P05-A04 End-to-end journeys | Automated Node unit contracts and route smoke commands available; deployed smoke script checks critical routes, redirects, 404, share images, security headers, and crawler state. | **PENDING:** real browser/device and approved HTTPS deployment required; JRN-01–06 checklist below. |
| P05-A05 No dead controls | Existing source-driven navigation, status-aware menus and conditional CV/mail links maintained; deploy-smoke checks published routes. | **PENDING:** physical-device keyboard/touch/clipboard/back/filters/gallery checks. |
| P05-A06 Deployment/rollback | Documented safe deploy, smoke and rollback procedure below; GitHub manual deployment smoke workflow added. | **READY FOR OPERATOR:** no hosting account connected, no DNS approved, no site deployed. |
| P05-A07 Truthful product status | Repo evidence checked against public README, project `developmentStatus` remains in-development, no fabricated app store, customer or launch numbers. | **PARTIAL:** owner must confirm current repo state and case content just before launch. |

## Automated verification

From `C:\projects\portfolio` after pull and `npm install`:

```powershell
npm run check:content
npm run check:seo
npm run check:launch
npm test
npm run build
npm run smoke:http
```

`npm run check:launch` is a **preview-safe report**; it exits successfully with blockers so CI can still test previews. `npm run check:launch:strict` is the nonzero **owner release gate**. The existing `npm run check:release` also validates content rules and is intentionally expected to **fail before approval**. Do not suppress its exit code, change the launch flag just to pass CI, or claim missing credentials/assets are completed. `npm run check:links -- --strict` requires network connectivity; 403/429/rate limits and DNS errors are labeled inconclusive, not successful verification.

## The owner approval record

`content/launch-approval.json` is a deliberately separate, source-controlled release declaration. It starts with `approvedForPublicLaunch: false`, no origin/date/revision, and **seven false checklist values**. Only the portfolio owner can decide to approve content, screenshots/rights, contact, live mobile/keyboard accessibility and HTTPS journeys. `approvedOrigin` must exactly match `NEXT_PUBLIC_SITE_URL`; `ownerApprovedAt` must be a real nonfuture date; `reviewedCommit` must identify the exact Git SHA reviewed at the time of sign-off (not an invented one). Review approvals are versioned and included in the new release gates. The site's `lib/seo.ts` requires this record **in addition** to content approvals and the environment launch flag before indexing is enabled. This is a safety gate, not cryptographic attestation; a developer still must obtain the owner's genuine consent.

In `content/profile.json`, only an approved actual address can set `publicEmail` and `publicEmailApproved: true`; owner-approved biography can set `ownerBioApproved: true`. Each approved case in `content/projects.json` can be marked `contentApproval: "owner_approved"` **only after actual owner review**. Do not publish a CV or photograph without approved source files. Do not include patient data, student names, private school records, secret keys, or unlicensed imagery. No trackers, cookies/analytics or contact-form collection are present; add a specific privacy disclosure if those are introduced later.

## Deploy the reviewed source (manual operator action, not done here)

1. Review `main`, confirm the production checks and record the reviewed SHA. Prepare an owner-approved personal HTTPS domain or a hosting-provider subdomain. Do not assume the sample strings in this doc are real domains. Use an account under the portfolio owner's control. Recommended simple host: any service that builds **Next.js 16** from the GitHub repo (for example Vercel) without a database; confirm current platform support and plan before selecting it.
2. Import `Alisina137/portfolio`, set install to `npm install`, build to `npm run build`, and publish the preview **with `PORTFOLIO_LAUNCH_APPROVED=false`**. Leave it password-protected/private at host level if possible because the content is still awaiting approval. Configure `NEXT_PUBLIC_SITE_URL` to the real exact HTTPS origin for that deployment only, with no trailing path.
3. Test preview with `node scripts/smoke-deployed.mjs --url=https://ACTUAL-DEPLOYMENT-DOMAIN --mode=preview`, or GitHub Actions **Manual deployed portfolio smoke**, mode `preview`. Verify complete HTML, focus/menu, mobile, contacts, 404, share images, and that robots disallows indexing.
4. After all P05 approvals and live acceptance, fill `content/launch-approval.json`, approve biography/contact/project records, verify source and media rights, and run `npm run check:release` locally/CI with the real domain configured. Only then set `PORTFOLIO_LAUNCH_APPROVED=true` **in the production host's environment**, and redeploy approved reviewed source. Do not flip this flag on staging.
5. Run `node scripts/smoke-deployed.mjs --url=https://ACTUAL-DEPLOYMENT-DOMAIN --mode=launch` and manual full browser checks. Verify `robots.txt`, `/sitemap.xml`, case metadata/canonical, OG image, contact email, and that a truly invalid route returns HTTP 404. Submit to search engine indexing only after the live gate passes.

**Rollback:** Keep the last working deployment and its Git commit SHA. On a failed/incorrect public release, restore that deployment using the host's rollback controls (or redeploy a reviewed previous immutable commit) and set `PORTFOLIO_LAUNCH_APPROVED=false` on the affected environment as necessary. Verify the restored site's root, Contact, 404, sitemap and robots again. A `git reset --hard`, force push or deletion of owner content is **not** the rollback procedure. Domain/DNS changes and cache propagation are operational steps that must be checked with the actual host; no claims are made about instant reversal. Never include `.env` secrets in Git.

## Human-device test journeys (each still needs a recorded result)

- **JRN-01 Recruiter:** 360 px Home → MaktabLink case → About → optional **real** CV → Contact → working approved email.
- **JRN-02 Engineer:** `/projects?q=postgres&category=saas` → search/sort/filter → case → GitHub → browser Back preserving filter state → related project.
- **JRN-03 Client:** Android/iOS mobile nav → Marketplace category → case → Contact → copy approved email; blocked clipboard permits manual selection.
- **JRN-04 Keyboard/screen reader:** skip link, Home/Projects/About/Contact, toggles, focus trap/restore on mobile menu, gallery buttons if real media exists, reduced motion, 200% zoom.
- **JRN-05 Recovery:** unknown and unpublished slugs produce a true HTTP 404; recovery buttons return to real routes; network errors show retry affordance.
- **JRN-06 Theme/links:** system/light/dark preference persists; verified external links open correct destinations; narrow screens do not clip or produce horizontal overflow.

Run these on actual hosted HTTPS using Chrome/Firefox/Safari as available. Lighthouse/LCP/INP/CLS and WCAG 2.2 AA manual findings require real evidence; automated passing tests do not substitute for them. If new bugs are observed, fix and retest before sign-off.

## Follow-up after P05

Only after MVP is accepted: optional **P06 technical writing** when two real owner-approved posts exist. P07 (full localization) and P08 (editor/contact form) remain later/optional and are not visible as unfinished navigation.
