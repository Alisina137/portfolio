# Alisina — Personal Portfolio

**Current phase:** P01 · Identity, design system, usable homepage  
**Status:** IMPLEMENTED — VERIFICATION PENDING (framework build, owner content approval, and browser acceptance)

This is the first **vertical slice** of the approved *Alisina Portfolio Product Specification v1.0*, using *Software Development Workflow V5*. It is an English, public-facing portfolio preview with no backend, login, database or paid integrations. The design direction is **Editorial Product Lab**.

## What P01 contains

- Responsive home route `/` with identity, capability ribbon, six source-checked featured projects, approach, bio preview and closing GitHub CTA.
- Six real external repository links (no claimed live product links), explicit **In development** maturity and typographic artwork rather than fabricated screenshots.
- Working theme switch with system default + persistent explicit preference, accessible sticky header, responsive keyboard-operable mobile menu, back-to-top and visible focus.
- Typed project/profile content registry, publication-status gating, validation script and Node-native tests.
- No placeholder `/projects`, `/about`, `/contact`, `/writing` or PDF routes. These are correctly deferred.

## Run on Windows PowerShell

```powershell
cd C:\projects\portfolio
npm install
npm run check:content
npm run test
npm run dev
# Open http://localhost:3000
```

If your local machine uses pnpm, use `pnpm install`, `pnpm check:content`, `pnpm test`, `pnpm dev`. No `ngrok` or API server is needed because this phase is a public static web experience.

Run `npm run build` once dependencies are available to verify Next.js rendering, then `npm run start` to view a production build. The initial install generates the appropriate lockfile; commit it when doing your local verification. The repository does not contain a generated lockfile because the packaging environment could not resolve npm registry hosts.

## Content review and release constraints

`content/projects.json` contains **six source-checked, pre-release editorial records**, selected from the provided specification's suggested featured projects. They are explicitly **NOT owner-signed-off for a public launch** (`contentApproval: owner_pending`). `publicationStatus` controls site visibility during development and must not be confused with application maturity. `npm run check:release` intentionally fails until owner approval, contact details and remaining launch phases are completed.

The case studies, catalog, About, Contact, résumé and SEO crawlability **have not shipped** in P01. This preview declares `robots: noindex,nofollow`; do not publicly publish it as the finished portfolio. Personal contact email, resume, testimonials, invented usage metrics and confidential screenshots are intentionally absent.

## Files

- `app/`: Next.js App Router layout + Home
- `components/`: header, menu, theme, cards, headings, footer
- `styles/globals.css`: themed tokens and responsive components
- `content/profile.json`, `content/projects.json`: one source of copy and project metadata
- `lib/content.ts`: published-featured selector, status labels
- `scripts/check-content.mjs`: validation + release preflight
- `scripts/render-preview.mjs`: zero-dependency **visual inspection only** snapshot
- `tests/`: data and publication rules
- `docs/PROJECT-STATE.md`: phase progress, evidence and blockers

## QA when npm is unavailable

```powershell
npm test
# Tests generate a development-only snapshot: open preview/index.html (not production app)
```

The static preview is only a tool to inspect typography/responsiveness and test basic interactions in a browser. It is not an exported Next.js build, an alternate production implementation or deployment artifact. Production pages render through `app/`.

## Next phase

P02 — build the complete Projects catalog, source-backed case studies, search/filter/sort, deep links, real image gallery only when provided, 404 handling for unpublished records, and nav activation after working destinations exist.

## GitHub-first updates

Repository: https://github.com/Alisina137/portfolio . Approved phases are delivered to `main` and can be pulled from the existing `C:\projects\portfolio` Git checkout with `git pull --ff-only origin main`. Initial setup in an empty folder: `git clone https://github.com/Alisina137/portfolio.git .` . Preserve local modifications before pulling.

The original approved Product Specification v1.0 (.docx) and Software Development Workflow V5 were supplied by the owner as separate source documents; this source repository does not republish those original attachments. The implementation follows them.
