# Phase 20 — Professional Availability & Opportunities

**Status:** Source implementation complete; owner confirmation of actual current availability and real-device/hosted acceptance remain pending.

## Purpose

Give recruiters, collaborators and prospective project partners a clear, professionally designed destination for evaluating engineering fit, including **current availability only when the portfolio owner explicitly approves it**. No assumed employment availability, salary expectations, job offer, paid-client history or appointment scheduling.

This implements the original Phase 20 intent after the Phase 19 Contact & Collaboration Hub. It reuses the Phase 19 inquiry planner and Phase 08 secured contact delivery rather than introducing a duplicate messaging or booking system.

## Delivered UI

- A responsive and visually distinct `/availability` route, with source-grounded engineering evidence, a clear status panel and professional contact actions.
- Homepage preview and About/Contact/footer links, localized draft routes `/fa/availability` and `/ps/availability` behind owner language approval and RTL QA. No new entry is forced into an already crowded desktop navigation bar.
- Status logic: `not_shared` / `open` / `selective` / `unavailable`. With no verified public status, the page says **availability not publicly confirmed** instead of claiming to be open.
- Once approved and current: visible full-time/part-time/contract/internship choices, remote/hybrid/on-site preferences, work across Afghanistan or international remote if explicitly chosen, and selected technical focus areas. Notes are optional and cannot include email, phone or HTML.
- Focus/evidence cards link to the existing three source-backed service groups and their documented project cases.
- `Start an inquiry` leads to the existing privacy-conscious Contact builder. A résumé, professional LinkedIn, direct email and outbound contact form only appear if the original corresponding owner/provider approval gates have separately been satisfied. GitHub code link remains public if already owner-approved.
- SEO, Open Graph and gated sitemap, with locale translations drafted but still owner-pending. Layout uses existing soft display font, responsive dark/light colors and keyboard/reduced-motion support.

## Truthful update model

The source is `content/availability.json`. Default is deliberately:
```json
{"schemaVersion":1,"ownerApproval":"owner_pending","status":"not_shared",
 "employmentTypes":[],"workModes":[],"regions":[],"focus":[],
 "reviewedAt":null,"validUntil":null,"note":null}
```
This is **not** a statement of current unavailability: it simply withholds the unverified fact. The public projection returns `null` for any pending or invalid/expired record.

When genuinely ready, use **Owner Studio → Availability** to review a proposed status, work types, regions and timing, then explicitly check owner approval and provide an accurate review date and expiration date no more than **90 days** after that review. The Studio creates a **draft GitHub pull request**. A PR review, passing tests and merge must happen before the approved record can display. Without configured owner Studio credentials, an equivalent reviewed source-controlled PR is supported. No open public form can alter the availability record.

Security rules: only known enum values; unique arrays; international remote requires Remote, open/selective states require actual work-type/mode/focus preferences, dates must be real, owner-approved status cannot be `not_shared`, notes max 260 chars with no emails/phone numbers/control characters. Future review dates and expired statements are never public. Expires automatically—**no background monitor** is claimed. Existing public launch/locale approval flags remain unchanged.

To withdraw status, propose `ownerApproval: "owner_pending"`, `reviewedAt: null`, `validUntil: null` and merge the reviewed change; the status panel returns to the neutral state. Git history may retain old statements; don't enter private information in this public source.

## Verification and acceptance

Automated:
```powershell
cd C:\projects\portfolio
npm run check:availability
npm run check:locales
npm test
npm run build
npm run smoke:http
```

Manual before relying on live UI:
1. Confirm neutral status on `/availability` when owner approval is absent; no employment type or region silently appears.
2. Test Home/Preview, About and Contact/footer links and `/contact#inquiry-planner` entry.
3. Review 320, 360, 768, 1024, 1440, 1920 widths; zoom 200%; keyboard and screen reader landmarks; light/dark and reduced motion.
4. In a **test-only** branch or isolated tests, exercise approved open, selective, unavailable, stale expiry, and note sanitization. Do not publish synthetic owner approvals.
5. When actual professional info is owner-approved, verify optional PDF/LinkedIn only if those underlying profile approval fields and files are set, contact delivery only if the separate provider stack is configured, and review expiration behavior.
6. Verify preview /robots.txt remains disallow and launch /sitemap.xml remains empty until Phase 05 release gates are genuinely completed. Confirm locale routes remain unavailable in production until verified.

No Netlify secrets, live appointment tools, résumé files, user data or search indexing flags were changed.
