# P04 — Search readiness, accessibility, performance & recovery

**Specification:** Portfolio v1.0, Phase P04; Workflow V5. **Status:** IMPLEMENTED — VERIFICATION PENDING (Next.js CI production build and TypeScript succeeded at commit `cd9f01e`; HTTP route smoke, full accessibility audit, Lighthouse and live HTTPS verification are remaining gates).

## Implemented behavior and acceptance coverage

| Gate | Source / user-visible behavior | Verification |
|---|---|---|
| P04-A01 | Distinct titles/descriptions, canonical URLs when a real origin exists, Twitter and OpenGraph metadata for Home, Projects, all case studies, About and Contact; programmatic original editorial OG images with factual project titles, not fabricated screenshots. | Source contracts and Node tests pass; CI confirms Next.js build and OG routes are generated; actual HTTP image/metadata smoke is being added, live share preview remains pending. |
| P04-A02 | `/robots.txt` disallows all crawlers by default. `/sitemap.xml` stays empty until fully approved; then includes exactly Home, Projects, About, Contact and published/approved case-study slugs. Draft, review, archived, unknown slugs excluded. | Unit tests and source audit pass; deployed crawler fetch pending. |
| P04-A03 | Static content avoids fetching APIs on page load; no remote fonts, stock media, trackers, analytics, or third-party scripts. Optional images already use Next Image with sizes; cases without approved media show honest original typographic illustrations, not broken screenshot requests. | Chromium development-only HTML previews: 20/20 combinations (Home, Projects, About, Contact at 320/360/768/1024/1440px) have no horizontal overflow; real Lighthouse CWV (LCP≤2.5s, INP≤200ms, CLS≤0.1 at p75) pending deployment and browser/field evidence. |
| P04-A04 | Skip link, semantic navigation, focus indicator, keyboard mobile menu, status announcements, reduced-motion support, minimum 44px key controls, descriptive error recovery controls, anchor scroll offset. | Source checks plus dev-preview reflow inspection; keyboard interaction of actual Next runtime pending; WCAG 2.2 AA manual screen reader and full app audit **pending**. |
| P04-A05 | Branded `/not-found` and route-error retry pages; unknown `/projects/[slug]` cases use `notFound()` with `dynamicParams=false`. Clear routes back to Projects and Home. | Tests assert route and recovery contracts; HTTP status verification in real Next app pending. |
| P04-A06 | OG art consists only of approved public identity/project names and summaries. Content validator rejects missing media and unapproved gallery entries. Conservative production security headers, no automatic source exposure. | Content and source checks pass; upload/privacy human review pending. |

## SEO and release controls

Set `NEXT_PUBLIC_SITE_URL` to an **owner-approved HTTPS origin** with no trailing path. Do not invent a domain. `PORTFOLIO_LAUNCH_APPROVED=false` is the default. Changing it to true does *not* by itself enable indexing: the actual public email, owner biography and each published project's content must also be approved. Until all checks pass, `robots` disallows crawlers, page metadata sets noindex/nofollow, and sitemap entries are empty. Canonical and absolute OG URLs are generated only when a valid origin exists.

`npm run check:release` separately validates launch criteria and is **expected to fail now** (DEC-01 public contact, DEC-02 project copy, DEC-03 bio, final media and P05 owner sign-off remain pending). Follow P05 deploy approval before changing the flag. When approved, redeploy, then inspect `https://<approved-domain>/robots.txt`, `/sitemap.xml`, each canonical, OG images, 404 HTTP status and security headers.

## Security and trade-offs

`next.config.ts` sends no-sniff, frame denial, restrictive browser permissions and referrer headers. Production adds CSP to block external scripts, framing, embedded objects and unknown connections. Next.js hydration and the existing early theme script require inline script/style allowances; adopt a nonce/hash strategy in a **separately validated** deploy before tightening CSP. HSTS is enabled only for an explicitly configured production HTTPS site (without `includeSubDomains` to avoid unintended effects on other subdomains). Do not assume hosting-specific security/CDN setup without deployment.

## Verification and demo path

```powershell
npm install
npm run check:content
npm run check:seo
npm test
npx tsc --noEmit
npm run build
```

Developer must also open 320/360/768/1440 px widths, use keyboard Tab/Shift+Tab/Escape across header and catalog, verify low-vision 200% zoom, reduced motion, aria-live announcements, and lightbox focus. In a deployed HTTPS environment, test a valid deep link and an invalid slug, see real 404 status, inspect share previews and fetch robots/sitemap. Run Lighthouse with mobile emulation, then document LCP/INP/CLS and any accessibility failures. **No full Next build, deployment, or real screen-reader verification has been claimed in this delivery.**

No database, authentication, backend API, user analytics, remote image generation, or contact form was added for P04. P05 remains responsible for editorial consent, deployment, verified public contact and real release gates.

**CI evidence:** GitHub Actions `Portfolio verification` run 43597231241 passed after fixing pre-existing TypeScript/preview directory issues. CI built 25 static/dynamic routes, including 6 case OG images, 404, robots and sitemap. Next emits an expected `metadataBase` warning while the owner has not supplied an approved site URL; the release gate rejects indexing/launch. Source previews are not substitutes for deployed real-device checks.
