# Phase 07 — Dari / Pashto internationalization and RTL

**Status:** Implemented in source, translation owner review and live-browser RTL acceptance pending. The locale switcher and public `/fa` / `/ps` pages are deliberately **not released** before the gates pass. English remains functional at its original canonical routes. P08 Studio/contact features remain gated as before, and P06 Writing remains unpublished.

## Scope delivered

- Explicit URL families: English remains at `/`, `/projects`, `/projects/[slug]`, `/about`, `/contact`. Dari and Pashto have equivalent paths under `/fa` and `/ps`. `/en/...` safely redirects to its English canonical path; unsupported languages and unknown case slugs return genuine 404s. Article paths do **not** appear in translated navigation while article translations are absent.
- New Dari/Pashto translations: 247 public interface strings in each language, including navigation, the homepage, About/Contact, search/filter/sort, accessible control names, fallback contact, optional contact-form labels/feedback, and six complete source-based project case studies in each language. Technical names and project brands intentionally remain recognizable. No fake company, project status, screenshot or live demo is introduced.
- `proxy.ts` supplies a server-trusted locale header to ensure correct initial `<html lang="fa|ps">` and `dir="rtl"`. A small client component updates those attributes after client-side navigation because root layouts persist. The URL, not an unchecked cookie or `Accept-Language`, determines the displayed locale. Selected Dari/Pashto paths save an optional `portfolio-language` preference cookie; the URL remains shareable and the language switch preserves query and hash state.
- RTL typography/spacing, Arabic-capable fallback font stack, right-to-left cards, mirrored directional arrows, code/technology isolation, focus treatment, and 320px responsive language-control bounds. No new third-party font service or runtime translation API is used.
- Bilingual project search with normalized URLs and stable category/status identifiers, native-language filter display, pagination state, case links, breadcrumb and return-to-catalog behavior.
- SEO: translated metadata for the eventual locale pages; `hreflang`, canonical language alternates and sitemap additions are **only emitted when that locale is independently owner-approved**, source-fingerprint-validated, and accessible. Robots remain no-index until the independent Phase 05 launch approval.
- Existing optional P08 contact form is translated only when its independent security/provider gates allow display. The private P08 Studio remains English only, without creating an unfinished locale route or weakening its authorization.

## Editorial gates — DO NOT bypass

`content/locales/approval.json` defaults to both owner approvals **false** with no RTL acceptance or source fingerprint. These are explicit owner actions, not an automated `true` flag after generating translations. This guarantees that a page with a half-translated paragraph or an unreviewed legal/privacy explanation cannot silently become public. Translation QA should be done by a competent Dari and Pashto reader, particularly for product wording, sensitive health/school descriptions, mixed-direction punctuation and date formats.

When approved, calculate the exact current English-source fingerprint:

```powershell
npm run check:locales
```

After reviewing the full translated interface and all six cases, record the printed SHA256 for the appropriate locale in `approval.json`, and only then set its `ownerApproved` and `rtlQaPassed` flags to true. This change must be separately reviewed and committed to Git. A change to the English biography, project/case content, or writing manifest invalidates the fingerprint; translation must be reviewed again. **The generated translations are editorial drafts until that review.**

### Developer-only locale preview

```powershell
cd C:\projects\portfolio
$env:PORTFOLIO_LOCALE_PREVIEW="true"
npm run dev
```

Open `/fa`, `/fa/projects`, `/fa/projects/maktablink`, `/fa/about`, `/fa/contact`, and their `/ps` equivalents. This flag works only with `NODE_ENV !== 'production'`; it **does not** grant release approval or indexability. Preview reflects real Next components, unlike the HTML preview scripts. If an approved gallery image is later introduced, its alt and caption must also be translated before the locale can publish.

### Verification acceptance matrix

| Requirement | Source verification | Acceptance still needed |
| --- | --- | --- |
| P07-A01 all important public content localized | UI dictionaries, six complete cases, localized sections, source parity test | Owner proofread, no untranslated user-facing content; translated writing if later published |
| P07-A02 correct locale route and persistence | Deep links, query/case back state, explicit URL locale, cookie, mobile menu | Real browser language switch and Back/Forward on devices |
| P07-A03 RTL layout at 320/768/1440 | RTL CSS, logical direction, labels, narrow selector, unit contracts | Manual screenshots, keyboard, screen reader, 200% zoom, Dari/Pashto shaping |
| P07-A04 SEO metadata/hreflang | Locale meta, translated title/description, gated canonical/alternate/sitemap | Production HTTPS, share crawlers, canonical audit after approval |

### Deferred by approved scope

- **Writing:** no Dari/Pashto Writing tab until owner-approved translations of the actual articles exist. The two English drafts remain unpublished under P06. When the owner publishes English writing, the locale gate fails closed until those articles are translated too.
- **Studio:** private editing interface remains intentionally English-only and owner-only. Public translation editing takes place through reviewed Git changes for now. This can be extended later only with explicit product approval.
- **Domain and contact:** Phase 05 launch approval, public email, verified media and live hosting are separate unresolved prerequisites. A source build alone is not public launch acceptance.

## Recurring local `tsconfig.json` pull conflict (PowerShell)

Next.js or an IDE may modify the *tracked* local `tsconfig.json`. An incoming `git pull --ff-only` correctly refuses to overwrite that work. This procedure saves exactly that file and preserves other local changes:

```powershell
cd C:\projects\portfolio
git diff -- tsconfig.json
git stash push -m "Backup local tsconfig before portfolio pull" -- tsconfig.json
git pull --ff-only origin main
```

**Do not automatically `git stash pop`**: the incoming `tsconfig.json` may already contain Next.js's required `plugins` and `.next/{dev/,}types` inclusions. To examine the saved change later use `git stash list` then `git diff 'stash@{0}^' 'stash@{0}' -- tsconfig.json`. A stash is a backup, not a fix that hides source modifications. Avoid `reset --hard`, `clean`, `skip-worktree`, and force pushes.
