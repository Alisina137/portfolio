# Phase 08 — Private owner editor & guarded contact messaging

**Status:** CODE IMPLEMENTED — EXTERNAL CONFIGURATION, LIVE SECURITY/DELIVERY TESTING, AND OWNER ACCEPTANCE PENDING. Phase 07 localization is independent and was **not** implemented by this change. Public portfolio and Writing launch gates remain unchanged.

Specification references: P08 / FEAT-020 / owner-content maintenance and optional contact-form upgrade. Phase 08 was authorized by the instruction to start it. This is a proportionate owner-only, source-controlled workflow, **not** a general-purpose public SaaS CMS.

## What is built

### Owner-only Studio

- `/studio/login` and `/studio`, accessible only when `PORTFOLIO_STUDIO_ENABLED=true` and all owner OAuth/security variables are configured. No Studio tab is shown to public visitors. Unconfigured routes are actual 404 responses.
- GitHub OAuth app sign-in with single-use random state cookie (10 min). After GitHub verifies the OAuth code, the app compares the returned numeric GitHub user ID with `PORTFOLIO_OWNER_GITHUB_ID`. Client-asserted usernames cannot grant access. OAuth token is not placed in cookies or saved by the site.
- HMAC-signed, HttpOnly, SameSite=Lax, secure-on-HTTPS, four-hour owner session; server checks owner ID and expiry for every operation. Server-only repo token never enters a client bundle. No anonymous account creation, shared editor roles, password database or broad admin access.
- GitHub `main` is the read source of truth. The Studio provides categorized controls for **profile, existing project summaries/status/approvals, existing case-study top-level narrative, and existing technical articles**. Studio deliberately does not support dangerous free-form JS/HTML, arbitrary file paths, general repo writes or database management.
- Every save creates a **draft GitHub pull request** on a unique Studio branch. It never pushes directly to `main`. Editing checks the client-observed `main` SHA to reject stale updates; GitHub diff, PR review, required checks, merge history and deployment constitute the approval and audit history. Public content is updated only after the PR merges and the site rebuilds.
- Writing remains hidden until two complete, owner-approved articles meet P06's publication gate. Approving a story via Studio is not the same as approving the entire portfolio's Phase 05 launch. Case-study images require explicit privacy attestation, content metadata, and source review.
- Media: owner may submit genuine JPEG/PNG/WebP up to 4 MB. Server validates decoded image and pixel count (≤16 MP), normalizes rotation, resizes to at most 1600 × 1400, re-encodes WebP using `sharp` without original EXIF/GPS metadata, enforces output size ≤2 MB, and opens a review PR containing the file and case metadata. No arbitrary image URLs, SVG, raw byte pass-through or direct production asset upload.
- `/api/studio/*` checks signed owner session, same-origin mutation request and strict allowed content keys. GitHub token permission errors fail closed with an actionable error; unknown content IDs/paths cannot be edited. One owner account only.

### Optional public contact form

- Replaces the currently honest fallback on `/contact` **only** when `PORTFOLIO_CONTACT_ENABLED=true` and the HTTPS origin, recipient, sender, email provider, Turnstile and durable Redis rate-limit settings are all valid.
- Native accessible fields: sender name, reply email, subject, message, honeypot, Cloudflare Turnstile. Inline loading/validation/error/success feedback. Server validates all fields and limits requests to 13 KB.
- CSRF origin gate, a per-address (3/h) and global (80/h) atomic Redis counter, verified single-use Turnstile token, and then server-side Resend email API submission. Any verifier, limiter or provider failure returns an error; **never a fake success**. If email provider accepts but fails later, provider diagnostics must be checked by the owner. No contact-submission database or site-side message retention; Redis stores only salted, expiring hashes/counters. Delivery provider may retain messages according to its policies.
- The form warns users not to submit passwords, medical records, student information or other sensitive personal material. A public privacy notice and real-world legal/privacy review are needed before enabling external data collection.
- GitHub Studio itself is not a contact inbox. The site's existing direct-email fallback remains available only after email owner approval, independently of the optional form.

## Owner setup (DO NOT commit secrets)

1. Have a real **HTTPS** `NEXT_PUBLIC_SITE_URL` and server-capable hosting with deployment on merged `main` branches. This cannot be a static-only export; `/api` routes must execute on a Node.js runtime.
2. Create a GitHub OAuth App that uses `https://YOUR-REAL-DOMAIN/api/studio/auth/callback` as its exact callback. Configure `PORTFOLIO_GITHUB_CLIENT_ID` and secret from the app.
3. Get your numeric GitHub owner ID from GitHub and configure `PORTFOLIO_OWNER_GITHUB_ID`. Generate a random 32+ character `PORTFOLIO_STUDIO_SESSION_SECRET` and store it as a **server-only secret**. Use GitHub fine-grained token limited to **Alisina137/portfolio**, with Contents read/write and Pull requests read/write. Set `PORTFOLIO_STUDIO_REPOSITORY=Alisina137/portfolio`.
4. Set `PORTFOLIO_STUDIO_ENABLED=true` only after reviewing account access and secrets. Sign in at `/studio/login`, confirm a second GitHub identity is denied, submit a draft project-text change, inspect GitHub PR file paths, review CI, merge, and verify a redeploy. Confirm no direct commits to `main` come from Studio.
5. For the **contact form separately**: select and approve an email provider (Resend), verify a sender domain, configure recipient/sender email addresses and `PORTFOLIO_RESEND_API_KEY`; configure Cloudflare Turnstile production site key and secret for your real site; create a durable Upstash Redis database with REST URL/token for atomic rate limiting. Set the `PORTFOLIO_CONTACT_*` variables in host secrets, only the **Turnstile site key** in `NEXT_PUBLIC_*`, then explicitly set `PORTFOLIO_CONTACT_ENABLED=true` after external-service approval. Free tiers/availability may change; do not assume that any paid services have been authorized.
6. Verify contact success against a **real received email**; test invalid captcha, missing origin, malformed email, flood/rate limit, missing Redis, unavailable mail provider, phone browser, keyboard-only use, and server logs for sensitive data. For public launch, update privacy notice and obtain relevant local data-handling approval.
7. For backups, `npm run backup:content` writes an integrity-manifest snapshot of `content/` and sanitized public media to `.portfolio-backups/` (gitignored). Store a copy securely **outside** the repo/host. Git branches and PRs provide revision history, but Git alone is not an independent offsite backup. To roll back, safely revert the merged editorial commit in GitHub, redeploy and validate links; never force-reset or delete user data.

## Known limitations / risk management

- External GitHub OAuth, GH content-write API, Resend, Turnstile, Redis, real-browser, mail inbox and production permissions have **not** been exercised without user credentials, hosting and domain. The editor and form are **off by default**; neither has been deployed or verified as a public live workflow.
- Form protection assumes the hosting proxy provides trusted real-IP headers. Without them, a shared fallback limiter protects the endpoint but may over-limit visitors. Validate proxy configuration before enabling; do not trust direct arbitrary `X-Forwarded-For` from clients.
- Existing project/case/article content may be **edited**, but creating and deleting entire projects or renaming stable slugs is intentionally not available in the UI; these are higher-risk schema/SEO operations handled in a reviewed Git change. Media is added, not overwritten in place. The editor has no automatic public publish action.
- Standard GitHub, image provider and mail service operational limits apply. GitHub token rotation and least-privilege access are the owner's responsibility. No private medical or student records may be committed in project screenshots.
- Phase 05 human content and domain approvals and Phase 06 two-article owner approval are still pending. Phase 07 internationalization was skipped at the user's request and can be completed separately.

## Acceptance and status

| ID | Condition | Evidence/status |
| --- | --- | --- |
| P08-A01 | Owner login identity, denied access, session expiry | Implementation + pure security tests; **live OAuth pending** |
| P08-A02 | Editor forms create reviewable draft PR; not public until merged | GitHub API integration implemented; **credentialed E2E pending** |
| P08-A03 | Draft/published article visibility and audited publication | Existing P06 gate preserved; PR review path; **owner approval pending** |
| P08-A04 | Image content sanitized, privacy confirmed, reviewed | Sharp pipeline implemented; **real image and GitHub PR test pending** |
| P08-A05 | Contact validation, CSRF, Turnstile, rate limit, actual email and graceful failure | Pure tests pass; **real provider inbox/failure tests pending** |
| P08-A06 | Backups/export, rollback and log/secret policy | Offline integrity backup script + documentation; remote offsite storage owner-managed |
| P08-A07 | CI source build/tests + real responsive accessibility | Node tests available; Next.js GitHub Actions build to be verified after merge; real browser pending |

**Truthful phase classification:** IMPLEMENTED — VERIFICATION PENDING; external enablement is BLOCKED until owner safely configures and approves credentials/services. No claim of Phase 08 being live or launch-ready.
