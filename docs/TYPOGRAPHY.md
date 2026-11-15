# Portfolio typography — soft, consistent type system

The public portfolio uses **Manrope Variable** (English and Latin UI) and **Vazirmatn Variable** (Dari/Pashto and Arabic-script text). Both fonts are bundled from versioned, OFL-licensed Fontsource npm packages, so the browser does not call a font CDN. CSS unicode ranges and `font-display: swap` keep readable fallbacks during initial load.

- English body: Manrope, 400 weight, 16 px / 1.7 line height, modest negative tracking. Headings use Manrope 600–750 weight; primary hero tracks at −0.057 em and secondary headings at approximately −0.04 em.
- Dari/Pashto body and headings: Vazirmatn with 1.85 line height, natural shaping, zero letter spacing and existing RTL logical layout. Latin monogram elements retain Manrope.
- Buttons, inputs, menus, project features and Studio share the site font. System fallbacks remain available if a font file fails to load. No font files are added to the repository manually.

## Verify

After `npm install`, run `npm test`, `npm run build`, and inspect Home, Projects, About, Contact, a long case study and /studio (when configured) at 320, 390, 768 and 1440 px. For RTL development preview, enable `PORTFOLIO_LOCALE_PREVIEW=true` and inspect `/fa` and `/ps` for shaping and overflow. Before release, review fonts with actual Dari and Pashto text on a mobile device. No additional tracking or remote font origins are required.
