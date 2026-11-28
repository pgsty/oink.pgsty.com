# OINK Release Notes

> Oink release notes, Hugo-only build requirements, and versioned upgrade history

---

LLMS index: [llms.txt](/llms.txt)

---

> [!NOTE] Versioned history
> Each release note records the requirements and validation of that version at release time. For current Hugo and Go requirements, see the [toolchain contract](/docs/design/architecture/#hugo-toolchain).

The current release is [OINK 1.7.0](/release/1.7.0/): six new content components
(Timeline, Update, Video, Audio, Social, and Map with vendored Leaflet
1.9.4), typeset rich-text copy, a sheet of 29 single-key shortcuts with local
browsing history, fold-all, reading-width steps, and a reader opt-out, refined
presets with Paper's ivory-and-clay palette and preset-specific CJK system
typography, plus Markmap corner SVG download controls, site ECharts themes, and
styled archived-version banners. Keep warnings visible, and never enable
`--panicOnWarning` or `HUGO_PANICONWARNING`. No Sass compiler is required.

For the changes contributed in 1.3.1, see its
[reading repairs and contributor credits](/release/1.3.1/#thanks).

---

Section pages:

- [OINK 1.7.0 — Six components, typeset copy, and 29 shortcuts](/release/1.7.0/): Add Timeline, Update, Video, Audio, Social, and Map components; introduce typeset rich-text copy, a sheet of 29 shortcuts with browsing history and reading-width steps, and preset-specific CJK typography.
- [OINK 1.6.0 — Plain CSS and BM25 local search](/release/1.6.0/): Replace Sass with plain CSS for Hugo 0.170+ compatibility, remove Bootstrap JS and Lunr, introduce scanning BM25 local search with split indexes and field anchors, and upgrade bundled runtimes.
- [OINK 1.5.1 — Duo View and publishing fixes](/release/1.5.1/): Stabilize Duo View, correct RSS and Print output, and harden navigation, validation, search, and accessibility after the 1.5.0 review.
- [OINK 1.5.0 — Read translations side by side](/release/1.5.0/): Compare a page with its translation in an opt-in bilingual view, with scroll sync by shared headings.
- [OINK 1.4.0 — Easier reading, better search](/release/1.4.0/): Expand selected tables, render and read diagrams locally, search across languages, and browse posts in a gallery.
- [OINK 1.3.2 — Hugo-only builds restored](/release/1.3.2/): Remove the mandatory Dart Sass dependency and use Hugo Extended 0.168.0 with visible warnings for all maintained sites.
- [OINK 1.3.1 — Readability repairs](/release/1.3.1/): Readable Markmap labels, reliable TOC footer clearance, opt-in technical tables and FileTree comment wrapping, with Hugo 0.168 and Dart Sass.
- [OINK 1.3.0 — Expo image albums](/release/1.3.0/): Expo brings resource-backed image albums, three layouts and an original-image viewer to OINK, with more reliable navigation, dialogs and focus.
- [OINK 1.2.0 — Four styles, one local-first theme](/release/1.2.0/): OINK 1.2.0 introduces Paper, Slate, Ink and Terminal, independent style and light/dark controls, local fonts, clearer search, consistent navigation, and safer book publishing and site maintenance.
- [OINK 1.1.0 — Native locales and site extensions](/release/1.1.0/): OINK 1.1.0 brings 32 native interface catalogs, taxonomy directories, reliable sidebar state, site-owned search actions, and fixes for printing, keyboard focus, and copying images.
- [OINK 1.0.0 — Stable contracts and public release](/release/1.0.0/): OINK 1.0.0 makes the current knowledge-publishing contracts stable and rolls up every theme change since 0.8.0: Print and Book correctness, pinned Go 1.27 and Hugo 0.165.0 release tooling, a supported Starter, and the public metadata and media needed to enter the wider Hugo ecosystem.
- [OINK 0.8.2 — Go 1.26 module compatibility](/release/0.8.2/): OINK 0.8.2 lowers the Hugo Module's Go directive from 1.27 to 1.26 so GOTOOLCHAIN=local builders, including the official Hugo Themes pipeline, can import the theme without changing its Hugo floor or rendered behavior.
- [OINK 0.8.1 — Print anchors and Book numbering](/release/0.8.1/): OINK 0.8.1 is a focused maintenance release: single-page Print keeps the same heading and footnote anchors as ordinary HTML, long Book titles no longer squeeze their sidebar numbers, and the project presentation now leads new sites through OINK Starter.
- [OINK 0.8.0 — Agent outputs and backlinks](/release/0.8.0/): Oink 0.8.0 adds two opt-in output formats for readers that arrive as programs — a full-text bundle holding an entire section in one file, and a navigation tree published as JSON — plus static backlinks, which list the pages that link to a page in its right rail. All three stay off until you ask.
- [OINK 0.7.1 — Security and validation patch](/release/0.7.1/): Oink 0.7.1 is a security and validation patch. Swagger UI stops sending your spec URL to a third party, misconfigured values warn instead of killing an ordinary build, and the OpenAPI and terminal components finally behave in print, Markdown and RSS the way every other component already did.
- [OINK 0.7.0 — Theme colors, fonts, and diagrams](/release/0.7.0/): Oink 0.7.0 gives a section its own accent through the shell's grounds, hands the site control of all seven typography roles, and turns a Mermaid fence into a figure that is centred, redrawn in place on a colour-scheme change, and openable at its own size.
- [OINK 0.6.0 — Immersive blogs and safer builds](/release/0.6.0/): Oink 0.6.0 adds an immersive presentation to the existing Blog shell, completes Blog publishing with images, authors, series, three index forms and sharing, and replaces build-stopping template errors with safe warnings.
- [OINK 0.5.0 — Component API v5, converged config](/release/0.5.0/): Oink 0.5.0 replaces most shortcodes with native Markdown forms, converges every configuration and front matter key on three rules, removes the 0.x compatibility layer, and ships the migration toolkit that rewrites a 0.4 site. Every old key, shape, and shortcode fails the build with its replacement instead of being silently ignored.
- [OINK 0.4.0 — Scenario publishing components](/release/0.4.0/): Oink 0.4.0 adds sequential reading and release surfaces, reusable landing pages, Book publishing with stable references, and a keyboard-first site shell in one consolidated Scenario Components release.
- [OINK 0.3.0 — Authoring, navigation, no jQuery](/release/0.3.0/): Oink 0.3.0 adds enhanced code blocks and code groups, everyday content primitives, nested navigation with a Command Palette, semantic typography presets, and removes jQuery from every page.
- [OINK 0.2.0 — Richer content and presentation](/release/0.2.0/): Oink 0.2.0 adds composable homepage sections, theme-aware media, wordmarks, navigable component boards, a steps shortcode, polished terminal recordings, and a clearer release-publishing experience.
- [OINK 0.1.0 — Stable local-first foundation](/release/0.1.0/): The first stable Oink release turns the implementation preview into a polished Hugo module with a responsive shell, multilingual infrastructure, local-first components, and a stronger accessibility baseline.
