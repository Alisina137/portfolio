# Phase 19 — Contact & Collaboration Hub

**Status:** Source implementation complete; browser/device acceptance and real owner approval of direct contact options remain separate.

## Objective
Help visitors initiate *meaningful and privacy-aware conversations* without inventing a public email, forcing external service dependencies, promising employment availability, or introducing a fake messaging backend. Preserve the approved-contact security model already developed in Phase 08.

## Delivered
- Redesigned the existing `/contact` flow with a guided opportunity planner, directly above the existing Contact methods. **No new top-level navigation item** was added to an already long header.
- Three conversation purposes: engineering employment, scoped project/contract, and technical collaboration. These are conversation topics, not claims that the owner has accepted any job or engagement.
- Six technical focus choices come from the existing `getServices()` catalogue backed by published project case studies, plus an undecided option. A timing selector indicates the sender's preferred timing, **not** the owner's availability.
- Lightweight client-only fields for goal and context. Local validation, useful subject/message formatting, a preview, a clipboard action with manual-copy recovery, and a clear **not sent** state.
- If and only if the existing provider-backed Contact form is enabled by secure environment configuration, an explicit `Use contact form` action copies the generated brief into the *existing* form without sending it. The user must still enter their identity, solve Turnstile and click Send. No new anonymous endpoint or bypass.
- If the form is off but the owner has approved a public email, an explicit `mailto:` action opens the visitor's own email application. With neither channel approved, the planner only builds/copies a brief; the existing source-backed GitHub/project links remain available. No invented email.
- Four concise, truthful FAQ entries explaining project provenance, technical topics, absence of appointment/response promises, and how data moves. English and draft Dari/Pashto localization; RTL-friendly styles and the pre-existing translation/SEO gates are unchanged.
- Responsive premium light/dark layouts (320–1920px), keyboard focus, pressed-state controls, semantic accordions, polite feedback, reduced motion, and no analytics, new database or message persistence.

## Security and privacy
`lib/inquiry-core.mjs` is dependency-free and has explicit intent/focus/timing enums, input length caps and control-character rejection. No draft enters an HTTP request, localStorage, sessionStorage or cookies. Copy is an explicit user action; it may place the user's own text on the OS clipboard. Using the optional contact form or email provider is a separate, conscious step.

**No guarantee:** The site does not claim to schedule calls, accept bookings, guarantee response times, quote prices, or represent independent projects as commercial client outcomes. Direct-contact publication, owner biography and Phase 05 indexing remain unapproved.

## Verification
Run `npm run check:inquiry`, `npm run check:locales`, `npm test`, `npm run build`, `npm run smoke:http`. When deploying, test:
- /contact in English (and /fa/contact, /ps/contact in development-only preview), in light/dark and RTL.
- Select all intent cards with keyboard, check focus options, invalid/valid goal length and 20–1200 character detail input.
- Generate, edit, regenerate, copy and simulate clipboard denial. Verify manual select fallback and that nothing is sent.
- With a configured contact provider (only in a trusted test deployment), transfer a brief into the existing Contact form; verify it does **not** submit until the user explicitly sends, and server-side Turnstile/rate limits remain enforced.
- With an owner-approved public email, check the opt-in mailto action. Without approval, ensure no address appears.
- Mobile 320/360/768/1024 and desktop 1440/1920, 200% zoom, reduced motion, keyboard focus and screen reader status.
- No change to SEO approval, credentials or third-party cookie policy.

See `tests/phase19-inquiry.test.mjs` for source/pure-function regression contracts.
