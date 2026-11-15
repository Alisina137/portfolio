# Premium portfolio visual refinement

## Design intent

The supplied reference uses alternating text and graphic feature modules with a directional flow. Case studies now map **actual case-study feature headings and descriptions** to alternating editorial rows with a glassy conceptual visualization. Connector rhythm is subtle rather than reproducing the thick blue arrows from the reference.

## Rendering and trust

- Feature scenes are local CSS illustrations: dashboard, records, booking/calendar, commerce and network variants; no image hosts, random third-party imagery, paid 3D library or performance-heavy WebGL.
- Each scene visibly says it is a concept, not a product screenshot; `role=img` includes a localized equivalent (English/Dari/Pashto) of the disclaimer. All data labels in scenes are deliberately generic; no fake numbers, real user identities, traction, customers or project screens.
- Feature copy continues to come from `content/case-studies.json`. The specific visual shape is illustrative and is not guaranteed to reflect a real app's UI.
- Actual approved screenshots can be placed in `public/projects/<slug>/`, referenced via the `screenshot` property on a feature, and require descriptive alt text, privacy review and user confirmation. The mock disappears only when `approved: true` is explicitly present in a reviewed content update.
- Translated public pages display illustrative graphics until screenshot alt and captions are localized and reapproved. Phase 7 language publication still requires explicit owner review and RTL acceptance.

## Responsive and accessible

- Large screens: alternating copy/image rows with a vertical connecting rhythm. Phones/tablets ≤850 px: text followed by visual on every row, preserving logical reading order.
- CSS hover/floating animations are decorative. `prefers-reduced-motion: reduce` disables them. All feature links lead to the existing `#technical` section. No external scripts or fonts are required.
- Dark and light color palettes maintain the existing theme control and use clear accent and focus separation. Final contrast, high zoom, screen-reader, RTL, touch, and real-browser testing remain required.

## Implementation and verification

Modified English and localized case-study pages to use the shared `FeatureShowcase`, added isolated `styles/premium.css` loaded last, extended the optional approved feature screenshot type, and kept existing gallery behavior intact. `tests/premium-experience.test.mjs` adds nonvisual source checks. This visual refinement does not override outstanding launch approval, writing publication, Studio credentials or locale review.
