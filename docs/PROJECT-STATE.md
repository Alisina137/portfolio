# Portfolio project state

**Product authority:** Alisina — Portfolio Website Product Specification v1.0 (14 Nov 2026).  
**Delivery authority:** Software Development Workflow V5.  
**Project:** New Next.js 16 App Router / React 19 / TypeScript / token-based CSS site; no database, authentication or API.

## Phase P01 — Identity, design system and useful Home

**Status:** IMPLEMENTED — VERIFICATION PENDING; not publicly launchable.

| Gate | Evidence or status |
| --- | --- |
| P01-A01 Identity and CTAs | Source implementation Home + internal anchors + verified public GitHub; preview inspection pending |
| P01-A02 4–6 featured | 6 source-checked project records with external GitHub links; owner approval **PENDING** |
| P01-A03 Theme | Client persistence + initial system preference / localStorage fallback; real Next runtime check pending |
| P01-A04 Visible links | No unreleased route in header/footer; GitHub URLs from connected repository inventory, external health live check pending |
| P01-A05 Responsive keyboard | CSS breakpoints 320–1440, focus-aware mobile menu, reduced motion; manual browser checks pending |
| P01-A06 Draft exclusion | Published selector + content validator; real Next build/bundle inspection pending |

**Delivered:** Public visitor Home and global shell, theme, mobile header, six project cards, developer-facing content records/validator. No public routes for future phases.

**Release blockers:** Owner-approved contact address (DEC-01); owner sign-off on role/bio and individual projects (DEC-02/03); authentic sanitized screenshots (DEC-07, recommended); pending P02–P05. `robots:noindex,nofollow` while preview.

**Repository:** `https://github.com/Alisina137/portfolio`. P01 source published on `main` when the GitHub handoff is confirmed.

**Infrastructure limitations:** Registry/DNS unavailable from packaging environment, so Next dependencies could not be installed; no true Next build, CI or server-side test could run. `scripts/render-preview.mjs` generates an ignored development-only HTML snapshot for browser QA of visual CSS and interactions, NOT a production build.

**Next:** P02 — Catalog and comprehensive project journeys.

## 14 November 2026 local verification evidence

- `node scripts/check-content.mjs`: **PASS**, six source-backed featured records, no duplicate slugs.
- `npm run test`: **PASS**, six Node-native content/link/route-visibility checks.
- TypeScript `transpileModule` **syntax parser** on ten TS/TSX files: **PASS**. This is **not** equivalent to `tsc --noEmit` or a Next build.
- Browser visual preview (separate development-only HTML snapshot, not the Next runtime): Chromium/Playwright **PASS** for no horizontal overflow and exactly one H1 / six project cards at 320, 360, 390, 768, 1024, 1280, 1440 CSS px. Dark/light theme switch, mobile focus return and Escape **PASS** after preview focus timing fix.
- `npm run check:release`: **EXPECTED FAIL** due owner-pending project copy, bio and real contact channel; later MVP phases have not shipped.
- Actual Next.js install, typecheck, build, SSR rendering, cross-route checks and theme persistence across reloads: **NOT RUN / BLOCKED** by unavailable npm registry in this packaging environment.
