# Phase 15 — Project screenshots, visual tours and interactive demos

**Status:** Implemented in source. Live Netlify visual acceptance and authentic media submission remain separate gates.

## Why no screenshots were invented

At the start of Phase 15, all six published source-reviewed case studies have **zero actual media records** and zero feature screenshots. These records must not be filled with random stock pictures, synthetic interface images labeled as real captures, misleading app screens, fake URLs, or imaginary video demonstrations.

To provide a complete experience NOW, Phase 15 adds a working visual tour using **clearly labeled CSS-only conceptual device mockups** derived from the real project feature titles. It is explicitly marked *CONCEPT MOCKUP — NOT A REAL SCREENSHOT*, and explains that the shapes are not running software, completed feature screens, or tested demos. The old abstract feature-showcase graphics remain labeled conceptual.

## Implemented

- Every English case study now renders a **Visual Walkthrough** at `#gallery` even before screenshots arrive. Sidebar navigation always links to it. The section includes a desktop/mobile/tablet CSS device progression, next/previous carousel controls, direct numbered thumbnail selection, accessible status/count announcement and mobile swipe navigation for concept views.
- Dari and Pashto development previews show the same working conceptual carousel with translated descriptions, visible mockup warnings and keyboard-safe controls. Existing locale public-release requirements remain closed.
- If real imagery is later approved and uploaded, the very same section **switches to approved media first**, with concept views remaining accessible through separate tab controls. Captures can be filtered by media group (Mobile app, Web/admin, Workflow/architecture) and opened in a real `<dialog>` lightbox with thumbnail selection, Escape/arrow-key navigation, next/previous controls, accessible focus restoration and background scroll locking.
- Approved MP4/WebM videos use **native click-to-play controls**, a local poster, and a real `.vtt` caption track; no autoplay, iframe, YouTube cookie embeds or fake video content. The media viewer supports both images and videos with meaningful source-based captions.
- All media is loaded from explicit, local, **per-project** paths `/media/<project-slug>/<file-name>.<ext>`. Server projection filters out unapproved or unsafe entries. Build-time `check:content` rejects unsupported formats, path traversal, foreign-project files, absent assets, empty/oversized files, and videos without posters or valid WEBVTT captions.
- Responsive, premium CSS extends the existing palette and typographic variables (dark/light, RTL, 320–1440px layouts, reduced-motion). No uncontrolled external image URLs or third-party embed scripts.
- Test coverage exercises publication boundaries, image/video validation, actual project evidence, carousel/lightbox hooks, CSS responsiveness and non-bypass of Phase 05 release gates.

## How the owner can add authentic screenshots

1. Capture an **actual current app screen** in a test/demo account. Remove student names, patients, real phone numbers, email addresses, credentials, private financial data, location pins, and identifiable user information; get rights/permission for any third-party content. Do not submit unredacted scans.
2. Export an optimized `.webp`, `.png`, `.jpg`, `.jpeg`, or `.avif` to e.g. `public/media/maktablink/admin-overview.webp`. Each image must be under 5 MB.
3. Add a record to the matching case in `content/case-studies.json` (`media` array):
   ```json
   {
     "kind": "image",
     "src": "/media/maktablink/admin-overview.webp",
     "alt": "MaktabLink administrator overview showing demonstration-only academic records",
     "caption": "Approved screenshot from the local administrator dashboard",
     "group": "Web/admin",
     "device": "desktop",
     "approved": true
   }
   ```
   Set `approved: true` only **after** checking truthfulness, privacy, source rights and owner authorization.
4. To add a demo video, upload a real optimized `.mp4` or `.webm` (<30 MB) with a matching local still poster and an actually written `WEBVTT` closed-caption file (<128 KB):
   ```json
   {
     "kind": "video",
     "src": "/media/futsal/booking-demo.mp4",
     "poster": "/media/futsal/booking-poster.webp",
     "captions": "/media/futsal/booking-demo.vtt",
     "alt": "Recorded demonstration of the Futsal booking flow with sample data",
     "caption": "Owner-reviewed recording of the real test booking flow",
     "group": "Mobile app",
     "device": "mobile",
     "approved": true
   }
   ```
   Confirm the recording actually exists, functions, shows safe sample data and accurately matches the implemented project. Remove private faces, account details and user-identifying audio. Do not claim public availability merely because the video exists.
5. Run `npm run check:content`, `npm test`, `npm run build`. Media is blocked at build if invalid or missing.
6. **Localization:** `getTranslatedCase` currently refuses approved gallery media on an unreviewed Dari/Pashto route. Before approving translated site release, translate captions and alt text and update the locale media projection and RTL QA. The English page can show approved captures as soon as they are reviewed.
7. Real `feature.screenshot` records remain supported in `features` but are separately validated and rendered in FeatureShowcase; the media gallery is the dedicated place for a linked screenshot/video series. Do not put a screenshot there unless its file exists.

## Acceptance checks

After GitHub CI completes, verify `/projects/maktablink#gallery`, `/projects/futsal#gallery`, `/projects/dandanlink#gallery` and all other case-study URLs. For every project: navigate slides via thumb, arrows and touch; confirm badge clearly says mockup; inspect desktop/tablet/mobile device versions; no broken images; visit features and technical pages via sidebar. Test 320/360/768/1024/1440px, light/dark, keyboard focus, 200% zoom, and reduced-motion. In dev RTL mode verify `/fa/projects/maktablink#gallery` and `/ps/projects/futsal#gallery` only after setting `PORTFOLIO_LOCALE_PREVIEW=true`.

**When authentic media is supplied**, additionally verify tabs and group filters, modal focus return, Escape/arrow keys, video captions and user-initiated playback, accurate alt text and correct source labels. Netlify `Published` status and browser QA remain separate from GitHub test success.

No environment variable, contact credential, resume approval, locale owner approval, or search indexing approval was changed.
