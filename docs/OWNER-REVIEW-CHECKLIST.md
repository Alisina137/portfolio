# Owner sign-off checklist — do not treat as approved automatically

This document is **a review form**, not an authorization by the portfolio owner. Empty boxes are outstanding. No private credentials or personal documents should be pasted into GitHub.

## Essential approvals before Phase 5 launch

- [ ] **DEC-01 Contact** — Choose a genuinely reachable professional email to be **public** (or explicitly approve another actual direct contact mechanism and update the specification). Verify it works from a phone and desktop. There is no contact form in MVP.
- [ ] **DEC-02 Projects** — Read and approve the summary, your actual role, technical decisions, development status, GitHub URL and source evidence for each of MaktabLink, Futsal, BazaarLink, AmlakLink, DandanLink and KankorPrep. Confirm no app falsely claims launch, payments, live healthcare appointments or traction.
- [ ] **DEC-03 Identity** — Approve displayed name, role, headline, biography and public location. Approve university/degree wording separately before making it visible.
- [ ] **DEC-04/07 Imagery** — Provide reviewed screenshots if desired, with all names/emails/phone numbers and real patient/student records removed. Otherwise approve the honestly labeled conceptual artwork fallback. Confirm ownership/licensing of every file.
- [ ] **DEC-05 Optional** — Provide a sanitized actual PDF résumé and/or an approved professional network profile. If absent, keep all those links hidden; these are not launch blockers.
- [ ] **DEC-06 Deployment** — Choose a real hosting account and HTTPS site URL; review relevant host plan and DNS settings. Never enter passwords or API keys in repo files.
- [ ] **External links** — Rerun `npm run check:links -- --strict`, review inconclusive cases manually, and inspect all visible CTAs and demo URLs. Check each GitHub repository remains public.
- [ ] **Accessibility/performance** — Record real browser testing at 320/360/768/1440 widths, keyboard, focus, reduced motion, 200% zoom, screen reader, and Lighthouse. Correct defects.
- [ ] **HTTPS acceptance** — Run `npm run smoke:deployed -- --url=https://YOUR-ACTUAL-DOMAIN --mode=preview` on deployed staging, complete JRN-01–06 and verify 404, SEO/images/canonical/security headers.
- [ ] **Final release** — Review an actual Git commit SHA; record today's sign-off date and real HTTPS origin in `content/launch-approval.json`, mark the seven checks true only when each has real evidence, and rerun `npm run check:release` with launch environment enabled. Publish only afterward.

`content/launch-approval.json` remains `false` while any required item is open. A public GitHub repo and green CI are NOT public release approval.
