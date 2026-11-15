# Portfolio typography — soft, consistent type system

The public portfolio uses **Manrope Variable** (English and Latin UI) and **Vazirmatn Variable** (Dari/Pashto and Arabic-script text). Both fonts are bundled from versioned, OFL-licensed Fontsource npm packages, so the browser does not call a font CDN. CSS unicode ranges and `font-display: swap` keep readable fallbacks during initial load.

- English body: Manrope, 400 weight, 16 px / 1.7 line height, modest negative tracking. Headings use Manrope 600–750 weight; primary hero tracks at −0.057 em and secondary headings at approximately −0.04 em.
- Dari/Pashto body and headings: Vazirmatn with 1.85 line height, natural shaping, zero letter spacing and existing RTL logical layout. Latin monogram elements retain Manrope.
- Buttons, inputs, menus, project features and Studio share the site font. System fallbacks remain available if a font file fails to load. No font files are added to the repository manually.

## Verify

After `npm install`, run `npm test`, `npm run build`, and inspect Home, Projects, About, Contact, a long case study and /studio (when configured) at 320, 390, 768 and 1440 px. For RTL development preview, enable `PORTFOLIO_LOCALE_PREVIEW=true` and inspect `/fa` and `/ps` for shaping and overflow. Before release, review fonts with actual Dari and Pashto text on a mobile device. No additional tracking or remote font origins are required.

## Type-scale correction — 15 November 2026

The shared design system now uses a **single fluid semantic hierarchy** (imported last in `styles/type-scale.css`) so Home, Projects, case studies, About, Contact, Writing and the optional Studio do not each invent their own heading sizes. Page titles use roughly 41–72px desktop and 38–56px mobile; section titles 30–48px; card/feature titles 23–30px; body paragraphs 16px; interactive controls and secondary copy 14px; metadata 13px. Tiny 12px type is reserved for nonessential decorative artwork captions. Process steps, section numbers, and feature counters are 16px with tabular figures.

Check at 320, 390, 768, 1024 and 1440px, plus browser 200% zoom and `/fa` and `/ps` RTL development previews. The new source-level test verifies stylesheet ordering and heading/number/description coverage, but browser screenshots and device acceptance are still necessary. Do not claim a full visual acceptance until these checks have been run on a working Next.js build.
