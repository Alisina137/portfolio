# Alisina — Software Engineer & Product Builder

A dark-first editorial personal portfolio built using the approved **Product Specification v1.0** and **Software Development Workflow V5**.

**Current milestone:** Phase 03 — About, Contact & conditional résumé. **Implemented — verification pending; not approved for production launch.** The development preview deliberately remains `noindex,nofollow` until the P03–P05 launch gates and owner content approval pass.

## Routes and content

| Route | Available | Purpose |
| --- | --- | --- |
| `/` | Yes | Responsive Home, six featured projects, design system and theme |
| `/projects` | Yes | Search/filter/sort catalog and URL-driven paging |
| `/projects/[slug]` | Yes for six public preview cases | Detailed engineering case, context, evidence, status, related work |
| `/about` | Yes | Profile narrative, four evidence-linked capability clusters, project-derived skills and process |
| `/contact` | Yes (direct email pending approval) | Professional contact context, public GitHub/project links and conditionally approved email actions |
| `/resume.pdf` | Conditional, currently hidden | Appears only when an approved real PDF is provided |
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
npm test
npx tsc --noEmit
npm run build
```

`npm run check:release` is an intentionally stricter prelaunch gate and fails until content/contact approval and later MVP phases are finished. Node tests exercise catalog filtering, URL behavior, content boundaries, and static source checks. `scripts/render-preview.mjs` and `scripts/render-catalog-preview.mjs` create **development-only HTML previews**, not deployment artifacts or evidence that the real Next runtime was tested.

## Content editing and publication

- `content/profile.json`: public identity; only add approved facts and verified contact information.
- `content/projects.json`: public project records and featured ordering; `publicationStatus` is separate from the product's development status.
- `content/case-studies.json`: factual case stories, source evidence, feature/architecture notes, optional approved gallery media.
- `content/review-queue.json`: internal editorial checklist for projects not yet ready for the portfolio; do **not** import into client components.
- `public/media/`: optional reviewed and sanitized local images; every gallery item requires an existing approved file, alt text, caption, and category.
- `lib/catalog.ts`: pure URL/search/sort/pagination rules; `lib/content.ts`: published-only projection; `lib/status.ts`: client-safe status labels.
- `docs/PHASE-02.md` and `docs/PHASE-03.md`: phase requirements, validation evidence and remaining blockers.

DEC-01 public email approval remains a launch blocker: the site cannot claim to accept messages yet. To enable it, enter an explicitly approved public address and set `publicEmailApproved` in `content/profile.json`. For a résumé, only publish a reviewed `public/resume.pdf` and set `resumeApproved`/`resumeUrl` when the real PDF exists. No real patient data, school records, private contact information, tokens, or third-party media without rights should be committed. Public repository availability does not mean product launch readiness.

## Development & Git delivery

The authorized GitHub-first workflow pushes reviewed changes to the `main` branch before handing off a PowerShell pull command. Keep your local `.env*` files uncommitted. Do not force reset, delete source, or overwrite local work to resolve pull conflicts.
