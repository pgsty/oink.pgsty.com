---
title: License and acknowledgements
linkTitle: License
description: Find which license covers the theme, this documentation and each bundled third-party runtime, and what you must keep when you reuse them.
weight: 30
search_keywords: [license, Apache-2.0, CC BY 4.0, acknowledgements, VENDOR.json, third-party dependencies, Docsy, font licence, Font Awesome]
---

OINK consists of three kinds of material, each under its own license: the
theme source, this site's documentation, and the third-party assets the theme
ships. They are not relicensed as one combined work. Every table here links to
the authoritative file in the repository, and
**where a summary disagrees with the license text, the file is authoritative**.

## Which licence covers what {#license-map}

| Scope                                                                     | Licence                                        | Authoritative file                                                                                                                                |
|---------------------------------------------------------------------------|------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| OINK theme source (layouts, partials, shortcodes, CSS, JS, i18n)          | Apache License 2.0                             | Theme [`LICENSE`](https://github.com/pgsty/oink/blob/main/LICENSE), [`NOTICE`](https://github.com/pgsty/oink/blob/main/NOTICE)                    |
| This site's own code, build scripts and material derived from Docsy       | Apache License 2.0                             | Site [`LICENSE`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE), [`NOTICE`](https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE) |
| This site's original documentation content, except where stated otherwise | Creative Commons Attribution 4.0 International | Site [`LICENSE-CC-BY-4.0`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0)                                                   |
| Browser libraries, fonts and icons shipped with the theme                 | Each component's own licence                   | Theme [`VENDOR.json`](https://github.com/pgsty/oink/blob/main/VENDOR.json) and the licence files beside each asset                                |

CC BY 4.0 covers only the original documentation content, not theme code,
trademarks, screenshots or third-party assets. Likewise, the theme's
Apache-2.0 license leaves each bundled dependency under its own license.

## Community contributors {#community-contributors}

OINK is maintained by PGSTY. Thank you to
[@imbajin](https://github.com/imbajin), who reported and contributed the
reading repairs below together with their fixtures, regression tests and
bilingual docs. They first shipped in 1.3.1 and remain in **1.8.0**.

| Contribution | Pull request |
| --- | --- |
| Markmap node text across light/dark modes and visual presets | [Theme #48](https://github.com/pgsty/oink/pull/48) |
| Fixed TOC clearance above the footer | [Theme #50](https://github.com/pgsty/oink/pull/50) |
| Complete FileTree comments, integrated behind `wrap=true` | [Theme #52](https://github.com/pgsty/oink/pull/52) |
| Readable technical tables with an opt-in layout | [Theme #54](https://github.com/pgsty/oink/pull/54) |
| Bilingual contracts, release documentation, and companion regression coverage | [Documentation #11](https://github.com/pgsty/oink.pgsty.com/pull/11) |

The [1.3.1 release notes](/release/1.3.1/#thanks) record how they were
integrated. To contribute a correction, translation or fix, see the
[contribution guide](/docs/about/contributing/).

## Upstream: Docsy {#upstream-docsy}

The theme's `NOTICE` records:

- OINK is derived from [Docsy](https://github.com/google/docsy), Copyright 2018 Google LLC and Docsy contributors.
- OINK's own theme work is Copyright 2026 PGSTY contributors.
- The project and its upstream both use Apache License 2.0. `VENDOR.json` records each third-party browser dependency's license, source, version, and checksum. Each required NOTICE file accompanies its asset.
- The Docsy name and Google's trademarks belong to their respective holders. These names identify the upstream project and **imply no endorsement**.

This site also derives from the Docsy project website, as the site's own
`NOTICE` records. Docsy is OINK's only code upstream: OINK keeps Docsy's source
history, Apache-2.0 obligations and copyright notices, and modified files carry
a modification notice as Apache-2.0 requires.

## Third-party runtimes shipped with the theme {#vendored-runtimes}

Everything the browser needs is committed to the theme repository, under
`assets/third_party/` and `static/webfonts/`, so these assets need no npm step
and no download at build time; resolving the theme as a Hugo Module still needs
Go and an available module source. `VENDOR.json` is their machine-readable
manifest. Each entry records the name, pinned version, source URL, license
file path and the SHA-256 of every selected artifact, and the manifest adds an
aggregate checksum for each of the two asset trees.

The table matches the
[OINK v1.8.0 manifest](https://github.com/pgsty/oink/blob/v1.8.0/VENDOR.json)
(`VENDOR.json` generated 2026-11-28, schema 1, 26 entries). Versions change
with each theme release, so **use the manifest from your pinned theme version**.
Every source is the npm registry (`https://registry.npmjs.org/…`).

| Package                            | Version  | Licence                       | What it does in the theme                 |
|------------------------------------|----------|-------------------------------|-------------------------------------------|
| bootstrap                          | 5.3.8    | MIT                           | Grid, component styles, and RTL bundle    |
| @fortawesome/fontawesome-free      | 7.3.1    | CC-BY-4.0 AND OFL-1.1 AND MIT | Icons throughout the site                 |
| @fontsource-variable/inter         | 5.3.0    | OFL-1.1                       | Interface and body font                   |
| @fontsource-variable/ibm-plex-sans | 5.3.0    | OFL-1.1                       | Body font for Paper; print font for Terminal |
| @fontsource/chakra-petch           | 5.3.0    | OFL-1.1                       | Brand display font                        |
| @fontsource/ibm-plex-mono          | 5.3.0    | OFL-1.1                       | Code font (and screen text for Terminal)  |
| @docsearch/js                      | 5.2.0    | MIT                           | The optional Algolia DocSearch front end  |
| @docsearch/css                     | 5.2.0    | MIT                           | Its stylesheet                            |
| mermaid                            | 12.4.0   | MIT                           | Mermaid diagrams                          |
| katex                              | 0.19.1   | MIT                           | Mathematics styles and fonts              |
| swagger-ui-dist                    | 5.36.0   | Apache-2.0                    | OpenAPI reference pages                   |
| redoc                              | 3.2.0    | MIT                           | OpenAPI reference pages                   |
| asciinema-player                   | 3.19.0   | Apache-2.0                    | Terminal recording playback               |
| echarts                            | 6.1.0    | Apache-2.0                    | Charts                                    |
| @antv/infographic                  | 0.2.20   | MIT                           | Infographics                              |
| leaflet                            | 1.9.4    | BSD-2-Clause                  | Interactive maps (opt-in via `params.map`) |
| pako                               | 3.0.3    | MIT AND Zlib                  | Decompression (diagram data)              |
| external-svg-loader                | 1.7.1    | MIT                           | Inlining external SVG                     |
| idb-keyval                         | 6.3.0    | Apache-2.0                    | Browser-side caching                      |
| @plantuml/core                     | 1.2026.10 | MIT                           | Local PlantUML diagram engine             |
| @viz-js/viz                        | 3.31.0   | MIT AND EPL-2.0               | Graphviz layout for local PlantUML        |
| @markmap/core                      | 1.1.1    | MIT                           | Mind maps (core model)                    |
| @markmap/parse                     | 1.1.1    | MIT                           | Mind maps (Markdown parser)               |
| @markmap/render                    | 1.1.1    | MIT                           | Mind maps (SVG renderer)                  |
| @markmap/view                      | 1.1.1    | MIT                           | Mind maps (interactive view)              |
| @markmap/plugin-math               | 1.1.1    | MIT                           | Mind map formula rendering (MathJax)      |
{.wide .expand}

Each license text sits beside its asset under `assets/third_party/`, for
example `assets/third_party/bootstrap/LICENSE` and
`assets/third_party/katex/LICENSE`, and Mermaid ships its upstream `THIRD_PARTY_NOTICES`. Swagger UI, ReDoc and ECharts keep
their own `NOTICE` or bundled-declaration files. `@viz-js/viz` 3.31.0 embeds
Graphviz 16.1.0 (**EPL-2.0**, replacing EPL-1.0) and Expat 2.8.5 (MIT); their
notices and upstream source links sit beside the scripts in
`assets/third_party/plantuml/`. The scoped Markmap 1.1.1 packages list every
sub-package they bundle, MathJax and D3 primitives included, in
`assets/third_party/markmap/PACKAGES.json` and `LICENSES.txt`. Packages that
1.5.1 and earlier shipped are no longer distributed: Bootstrap's JavaScript
bundle, `@popperjs/core`, `lunr` (with `assets/js/third_party/`), and the
legacy Markmap 0.18, D3, highlight.js and WebFontLoader packages; the
[1.6.0 release notes](/release/1.6.0/#leaner-runtime) describe their removal.

If you redistribute the theme, include all of this license and notice
material. If you update a runtime, update its artifact, license file, source
and checksum in the same change.

## Fonts and icons {#fonts-and-icons}

Inter, IBM Plex Sans, Chakra Petch and IBM Plex Mono use the SIL Open Font
License 1.1. OINK 1.8.0 ships 33 files under `static/webfonts/`: fourteen
Inter subsets, twelve IBM Plex Sans subsets, four brand-font files and three
Font Awesome files. Font Awesome Free 7.3.1 has a composite license: CC BY 4.0
for the icon artwork, SIL OFL 1.1 for the font files and MIT for the code, with
the text in `assets/third_party/Font-Awesome/LICENSE.txt`.

The theme makes no request to a remote font service: the repository contains
no Google Fonts link, and the site serves fonts only from its own `baseURL`. To
change fonts or switch to the platform's system fonts, see
[Brand and appearance](/docs/customize/brand/).

## Design references {#design-references}

Docsy is the only code upstream. The projects below influenced the design
language only: OINK has ported no code from them and depends on none of them at
runtime.

- [Fumadocs](https://www.fumadocs.dev/) — Content-first presentation, information hierarchy, and writing components such as file trees and field lists (the theme's `NOTICE` records this acknowledgement).
- [Nextra](https://nextra.site/) — A simple documentation shell, filename labels and copy controls on code blocks, and per-page layout switches.
- [Hextra](https://imfing.github.io/hextra/) — A Hugo-native approach to implementation, file trees, badges, and tabs.
- [Mintlify](https://mintlify.com/) — Layered navigation structure, synchronized code groups, and the reading experience of an API reference.
{.cards .td-cards-list}

[Hugo](https://gohugo.io/) is the build platform, and Go resolves modules when
the theme is installed as a Hugo Module. Both are prerequisites; the theme
redistributes neither binary.

These names describe origin, dependency or design influence and
**imply no endorsement by these projects**. Project and product names belong
to their respective holders.

## Reusing this documentation {#reusing-the-docs}

CC BY 4.0 lets you share and adapt this documentation for any purpose,
provided you give attribution, link to the license, state whether you made
changes, and do not imply endorsement by OINK, PGSTY or any upstream project.
This attribution is sufficient:

> Adapted from the OINK documentation by PGSTY contributors, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with modifications.

Images and quotations credited separately keep their own credit and license.
Removing the page footer does not remove the attribution obligation.

## Reusing the theme {#reusing-the-theme}

Apache-2.0 lets you use, modify and distribute the theme source and build
output on its terms: keep the license, copyright and attribution notices and
the contents of `NOTICE`, and state which files you changed when you
distribute modified source. A theme distribution should include `LICENSE`,
`NOTICE`, `VENDOR.json` and every third-party licence file the manifest
references.

Apache-2.0 grants no trademark rights, and it does not turn third-party assets
into Apache-licensed works.

## Related {#related}

- [Contributing](/docs/about/contributing/) — report problems, improve docs, and submit fixes
- [What is OINK](/docs/about/) — what the project is and where it came from
- [Highlights](/docs/about/features/) — what local-first means in practice
- [Configuration](/docs/customize/config/) — which features bring in an external service
- [Brand and appearance](/docs/customize/brand/) — changing fonts and icons
