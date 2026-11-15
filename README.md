# Alisina — Software Engineer & Product Builder

A dark-first editorial personal portfolio built using the approved **Product Specification v1.0** and **Software Development Workflow V5**.

**Current milestone:** Phase 05 — content review, release safeguards and deployment handoff. **Release preparation implemented; owner approval and public deployment are blocked/pending.** The development preview deliberately remains `noindex,nofollow` until the P05 launch gates and owner content approval pass.

## Routes and content

| Route | Available | Purpose |
| --- | --- | --- |
| `/` | Yes | Responsive Home, six featured projects, design system and theme |
| `/projects` | Yes | Search/filter/sort catalog and URL-driven paging |
| `/projects/[slug]` | Yes for six public preview cases | Detailed engineering case, context, evidence, status, related work |
| `/about` | Yes | Profile narrative, four evidence-linked capability clusters, project-derived skills and process |
| `/contact` | Yes (direct email pending approval) | Professional contact context, public GitHub/project links and conditionally approved email actions |
| `/resume.pdf` | Conditional, currently hidden | Appears only when an approved real PDF is provided |
| `/sitemap.xml`, `/robots.txt` | Yes (gated) | Public URLs and crawler access only after owner approval |
| Unmatched route | Yes | Branded 404 with useful wayfinding; invalid case-study slugs return 404 |
| `/opengraph-image` and per-page images | Yes | Original editorial share artwork; never fabricated UI screenshots |
| `/writing` | No (optional P06) | Only after owner-approved articles exist |

Six featured case studies currently cover MaktabLink, Futsal, BazaarLink, AmlakLink, DandanLink and KankorPrep. The nine additional public repos in `content/review-queue.json` require product/content review before being shown on the website. Authentic product media has not been provided; the card and case hero visuals are clearly marked **conceptual artwork, not screenshots**.

## Local setup — Windows PowerShell

For an empty folder, clone the repository **once**:

```powershell
cd C:\projects\portfolio
git clone https://github.com/Alisina137/portfolio.git .
npm install
npm run dev
```

If your folder is already a Git clone, use the regular update workflow:

```powershell
cd C:\projects\portfolio
git pull --ff-only origin main
npm install
npm run dev
```

Visit http://localhost:3000. This is a **Next.js website**, so no Expo tunnel, mobile device QR code, database, or `pnpm dev:api` process is required.

## Checks

```powershell
npm run check:content
npm run check:seo
npm test
npx tsc --noEmit
npm run build
npm run smoke:http  # requires completed production build
npm run check:launch  # lists missing owner approvals (preview-safe)
npm run check:links -- --strict  # online link check; network/HTTP throttling may be inconclusive
# After a real host is configured: npm run smoke:deployed -- --url=https://YOUR-ACTUAL-DOMAIN --mode=preview
```

`npm run check:launch` reports outstanding owner release requirements without breaking preview CI. `npm run check:launch:strict` and `npm run check:release` are intentionally strict prelaunch gates and fail until content/contact approval, approved HTTPS origin, real owner sign-off in `content/launch-approval.json`, and live device/HTTPS acceptance are finished. Configure `NEXT_PUBLIC_SITE_URL` only after a real HTTPS domain is approved. `PORTFOLIO_LAUNCH_APPROVED` remains false until Phase 5 owner sign-off; setting it true does not override content checks. Node tests exercise catalog filtering, URL behavior, content boundaries, and static source checks. `scripts/render-preview.mjs` and `scripts/render-catalog-preview.mjs` create **development-only HTML previews**, not deployment artifacts or evidence that the real Next runtime was tested.

## Content editing and publication

- `content/profile.json`: public identity; only add approved facts and verified contact information.
- `content/projects.json`: public project records and featured ordering; `publicationStatus` is separate from the product's development status.
- `content/case-studies.json`: factual case stories, source evidence, feature/architecture notes, optional approved gallery media.
- `content/review-queue.json`: internal editorial checklist for projects not yet ready for the portfolio; do **not** import into client components.
- `public/media/`: optional reviewed and sanitized local images; every gallery item requires an existing approved file, alt text, caption, and category.
- `lib/catalog.ts`: pure URL/search/sort/pagination rules; `lib/content.ts`: published-only projection; `lib/status.ts`: client-safe status labels.
- `docs/PHASE-02.md`, `docs/PHASE-03.md`, `docs/PHASE-04.md`, `docs/PHASE-05.md` and `docs/OWNER-REVIEW-CHECKLIST.md`: requirements, proof and remaining release blockers.

DEC-01 public email approval remains a launch blocker: the site cannot claim to accept messages yet. To enable it, enter an explicitly approved public address and set `publicEmailApproved` in `content/profile.json`. For a résumé, only publish a reviewed `public/resume.pdf` and set `resumeApproved`/`resumeUrl` when the real PDF exists. No real patient data, school records, private contact information, tokens, or third-party media without rights should be committed. Public repository availability does not mean product launch readiness.

## Development & Git delivery

The authorized GitHub-first workflow pushes reviewed changes to the `main` branch before handing off a PowerShell pull command. Keep your local `.env*` files uncommitted. Do not force reset, delete source, or overwrite local work to resolve pull conflicts.

## Phase 5 release approval and preview deployment

Phase 5 adds `content/launch-approval.json`, deterministic launch-readiness checks, external GitHub/link checks, a read-only hosted HTTP smoke script, and a manual GitHub Actions hosted-smoke workflow. The separate owner approval record is required for search indexing even if `PORTFOLIO_LAUNCH_APPROVED=true`. It defaults to false; **do not set approval flags to true without actual owner sign-off**. The six current case studies, public contact and biography are not yet approved, and no HTTPS domain or hosting account was supplied. This is not a publicly launched website.

**Release runbook and rollback:** `docs/PHASE-05.md`. **Owner decisions:** `docs/OWNER-REVIEW-CHECKLIST.md`. **Public GitHub link evidence:** `docs/GITHUB-LINK-AUDIT.md`.

## P04 pending external checks

GitHub Actions has passed TypeScript and Next.js production compilation, but a compiled site does not establish a deployed working site. Run `npm install`, `npx tsc --noEmit`, `npm run build`, keyboard/screen-reader QA, Lighthouse at 320/360/768/1440 px, and inspect the real HTTP 404, OpenGraph image, robots, sitemap and headers after hosting. No deployment has been performed in Phase 4.

## Phase 06 — Writing / technical articles (owner approval required)

Phase 06 adds a full editorial Writing experience, but it **is not public yet**. The Product Specification requires two genuinely owner-approved articles before the Writing navigation and routes ship; the repository currently contains two complete **review drafts** with `ownerApproval: "owner_pending"` and no publication dates. `/writing` intentionally returns 404 until that requirement is met.

Review articles and the safe publication steps in `docs/PHASE-06.md`. The site uses source-controlled markdown without a CMS, authentication, a database or paid content tools. When the gate is satisfied, `/writing`, individual articles, responsive code samples with copy feedback, related projects, metadata, OG images, and sitemap entries activate as one coherent feature. Do **not** change the public-site launch approval flag merely to show Writing.

```powershell
npm run check:writing
npm test
npm run build
npm run smoke:http
```

Source documentation and draft content are present now. Live-browser accessibility and published-mode checks must still run after final approval.


## Phase 08 — owner content Studio and guarded contact form

The optional **private owner-only Studio** is accessible at `/studio/login` only after real GitHub OAuth credentials, owner GitHub numeric ID, a 32+ character session secret, an intentionally repo-scoped GitHub write token, and `PORTFOLIO_STUDIO_ENABLED=true` are configured. It provides forms for the public biography, verified project metadata, case-study narratives, the two draft technical articles, and sanitized project screenshots. **Every change goes through a GitHub draft PR**, never directly to `main`; after review and merge, redeploy to publish the approved content.

The optional `/contact` message form is **off** until email provider, spam verification and durable rate limiter credentials are configured; do not use dummy delivery or enable without security/privacy review. No database or public admin account is exposed by default. Public Writing still requires two articles approved by the owner; SEO launch still requires Phase 05 sign-off. See `docs/PHASE-08.md` for all environment keys, configuration, tests, backup/export and current limitations.

After installing dependencies: `npm run verify`; `npm run backup:content` exports a local integrity-manifest snapshot to an ignored folder; store a copy securely away from the repository.

## Phase 07 — Dari and Pashto internationalization

The source now includes full public-page translation drafts, six source-backed bilingual case studies, RTL presentation, `/fa` and `/ps` route families, localized filters, and guarded `hreflang` metadata. **No translations are automatically declared owner-approved.** Until content proofreading and the 320/768/1440px RTL QA pass, `/fa` and `/ps` remain unpublished and the language selector is hidden on a production build. The original English site stays unchanged. `npm run check:locales` validates content coverage and prints the English-source revision fingerprint.

For a **development-only preview** set `$env:PORTFOLIO_LOCALE_PREVIEW="true"` before `npm run dev` and inspect `/fa` and `/ps`. This does not enable publication, indexing, or any unconfigured contact/admin feature. Details and exact owner-approval workflow: [`docs/PHASE-07.md`](docs/PHASE-07.md).

**If `git pull --ff-only origin main` fails with `tsconfig.json` would be overwritten:** Save that *specific* tracked local change without deleting it, then pull again:

```powershell
cd C:\projects\portfolio
git stash push -m "Backup local tsconfig before portfolio pull" -- tsconfig.json
git pull --ff-only origin main
```

Don't blindly apply the stash after pulling. Review its saved diff if needed. Never use a destructive reset to bypass a merge conflict.
