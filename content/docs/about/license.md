---
title: License and acknowledgements
linkTitle: License
description: Which licence applies to which layer — Apache-2.0 for the theme, CC BY 4.0 for the documentation, and their own terms for every third-party runtime shipped with the theme.
weight: 30
search_keywords: [license, Apache-2.0, CC BY 4.0, acknowledgements, VENDOR.json, third-party dependencies, Docsy, font licence, Font Awesome]
---

OINK is three layers of material: the theme source, the documentation content,
and the third-party assets shipped with the theme. None of them is relicensed
into a single combined work. Every table below points at the authoritative file
in the repository; **where a summary and the licence text disagree, the file
wins**.

## Which licence covers what {#license-map}

| Scope | Licence | Authoritative file |
| --- | --- | --- |
| OINK theme source (layouts, partials, shortcodes, SCSS, JS, i18n) | Apache License 2.0 | Theme [`LICENSE`](https://github.com/pgsty/oink/blob/main/LICENSE), [`NOTICE`](https://github.com/pgsty/oink/blob/main/NOTICE) |
| This site's own code, build scripts and material derived from Docsy | Apache License 2.0 | Site [`LICENSE`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE), [`NOTICE`](https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE) |
| This site's original documentation content, except where stated otherwise | Creative Commons Attribution 4.0 International | Site [`LICENSE-CC-BY-4.0`](https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0) |
| Browser libraries, fonts and icons shipped with the theme | Each component's own licence | Theme [`VENDOR.json`](https://github.com/pgsty/oink/blob/main/VENDOR.json) and the licence files beside each asset |

Two boundaries are worth keeping straight. CC BY 4.0 covers the original
documentation content only, not the theme code, the trademarks, the screenshots
or the third-party assets. And the theme being Apache-2.0 does not turn its
bundled dependencies into Apache-licensed works.

## Upstream: Docsy {#upstream-docsy}

What the theme's `NOTICE` records:

- OINK is derived from [Docsy](https://github.com/google/docsy), Copyright 2018 Google LLC and Docsy contributors.
- OINK's own theme work is Copyright 2026 PGSTY contributors.
- The project and its upstream are both under Apache License 2.0. The licence, source, version and checksum of every third-party browser dependency are recorded in `VENDOR.json`, and each NOTICE file a dependency requires is distributed beside the asset it belongs to.
- The Docsy name and Google's trademarks belong to their respective holders; naming them here identifies the upstream project and **implies no endorsement**.

This site is likewise derived from the Docsy project website, and that lineage
is recorded in the site's own `NOTICE`. Docsy is OINK's only code upstream: the
source history, the Apache-2.0 obligations and the copyright notices are kept
intact, and as Apache-2.0 requires, modified files carry a modification notice.

## Third-party runtimes shipped with the theme {#vendored-runtimes}

The theme commits everything the browser needs to the repository
(`assets/third_party/`, `assets/js/third_party/`, `static/webfonts/`), so a
consuming site needs no npm and downloads nothing at build time. `VENDOR.json`
is the machine-readable manifest for that material: for each entry it records
the name, the pinned version, the source URL, the licence file path and the
SHA-256 of every selected artifact, plus an aggregate checksum for each of the
three asset trees.

The table below is a snapshot of that manifest (`VENDOR.json` generated
2026-08-17, schema 1, 26 entries). Versions change with each theme release, so
**the `VENDOR.json` in the repository is authoritative**. Every source is the
npm registry (`https://registry.npmjs.org/…`).

| Package | Version | Licence | What it does in the theme |
| --- | --- | --- | --- |
| bootstrap | 5.3.8 | MIT | Grid, components and the RTL stylesheet |
| @popperjs/core | 2.11.8 | MIT | Overlay positioning for Bootstrap |
| @fortawesome/fontawesome-free | 7.3.1 | CC-BY-4.0 AND OFL-1.1 AND MIT | Icons throughout the site |
| @fontsource-variable/inter | 5.3.0 | OFL-1.1 | Interface and body font |
| @fontsource/chakra-petch | 5.3.0 | OFL-1.1 | Brand display font |
| @fontsource/ibm-plex-mono | 5.3.0 | OFL-1.1 | Code font |
| lunr | 2.3.9 | MIT | Local full-text search |
| @docsearch/js | 5.0.1 | MIT | The optional Algolia DocSearch front end |
| @docsearch/css | 5.0.1 | MIT | Its stylesheet |
| mermaid | 11.16.1 | MIT | Mermaid diagrams |
| katex | 0.18.4 | MIT | Mathematics |
| markmap-autoloader | 0.18.12 | MIT | Mind maps |
| markmap-lib | 0.18.12 | MIT | Mind maps |
| markmap-view | 0.18.12 | MIT | Mind maps |
| markmap-toolbar | 0.18.12 | MIT | Mind map toolbar |
| d3 | 7.9.0 | ISC | Markmap dependency |
| @highlightjs/cdn-assets | 11.12.0 | BSD-3-Clause | Markmap dependency |
| webfontloader | 1.6.28 | Apache-2.0 | Markmap dependency |
| swagger-ui-dist | 5.32.13 | Apache-2.0 | OpenAPI reference pages |
| redoc | 2.5.3 | MIT | OpenAPI reference pages |
| asciinema-player | 3.17.0 | Apache-2.0 | Terminal recording playback |
| echarts | 6.1.0 | Apache-2.0 | Charts |
| @antv/infographic | 0.2.19 | MIT | Infographics |
| pako | 3.0.1 | MIT AND Zlib | Decompression (diagram data) |
| external-svg-loader | 1.7.1 | MIT | Inlining external SVG |
| idb-keyval | 6.2.0 | Apache-2.0 | Browser-side caching |

Licence texts sit beside the asset they belong to — for example
`assets/third_party/bootstrap/LICENSE` and
`assets/third_party/katex/LICENSE` — and Swagger UI, Redoc and ECharts also ship
their own `NOTICE` or bundled-declaration files. Lunr is the one exception: its
code is in `assets/js/third_party/` while its licence is at
`assets/third_party/lunr/LICENSE`.

Redistributing the theme means carrying all of this licence and notice material
with it. Updating a runtime means updating the artifact, the licence file, the
source and the checksum in the same change.

## Fonts and icons {#fonts-and-icons}

All three fonts (Inter, Chakra Petch, IBM Plex Mono) are under the SIL Open Font
License 1.1, and the font files are committed to `static/webfonts/`: fourteen
Inter subset files, four brand-font files, and Font Awesome's three, twenty-one
in all. Font Awesome Free 7.3.1 carries a composite licence — CC BY 4.0 for the
icon artwork, SIL OFL 1.1 for the font files, MIT for the code — with the text
in `assets/third_party/Font-Awesome/LICENSE.txt`.

The theme makes no request to a remote font service: there is no Google Fonts
link in the repository, and fonts are always served from the site's own
`baseURL`. To change fonts or switch to the platform stack, see
[Brand and appearance](/docs/customize/brand/).

## Design references {#design-references}

Docsy is the only code upstream. The projects below are references for the
design language. They are neither a source of code nor a runtime dependency, and
OINK has ported no code from them:

| Project | What was learned from it |
| --- | --- |
| [Fumadocs](https://www.fumadocs.dev/) | Content-first presentation, information hierarchy, and writing components such as file trees and field lists (the theme's `NOTICE` records this acknowledgement) |
| [Nextra](https://nextra.site/) | A spare documentation shell, filename and copy affordances on code blocks, per-page layout switches |
| [Hextra](https://imfing.github.io/hextra/) | A Hugo-native approach to implementation, file trees, badges, tabs |
| [Mintlify](https://mintlify.com/) | Layered navigation structure, synchronized code groups, the reading experience of an API reference |

[Hugo](https://gohugo.io/) is the build platform, and Go resolves modules when
the theme is installed as a Hugo Module. Both are prerequisites, and the theme
redistributes neither binary.

Naming these projects describes lineage, dependency or inspiration and
**implies no endorsement by them**; project and product names belong to their
respective holders.

## Reusing this documentation {#reusing-the-docs}

CC BY 4.0 permits sharing and adaptation for any purpose, provided you give
attribution, link to the licence, state whether you made changes, and do not
imply that OINK, PGSTY or any upstream project endorses your adaptation. A
sufficient attribution reads:

> Adapted from the OINK documentation by PGSTY contributors, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with modifications.

Images or quotations that carry their own attribution on a page keep their own
credit and licence; removing the footer does not discharge the attribution
obligation.

## Reusing the theme {#reusing-the-theme}

Apache-2.0 permits using, modifying and distributing the theme source and its
build output under its terms, provided you keep the licence, copyright and
attribution notices, keep the contents of `NOTICE`, and state which files you
changed when distributing modified source. A theme distribution should include
`LICENSE`, `NOTICE`, `VENDOR.json`, and every third-party licence file the
manifest references.

Apache-2.0 grants no trademark rights, and it does not turn third-party assets
into Apache-licensed works.

## Related {#related}

- [What is OINK](/docs/about/) — what the project is and where it came from
- [Highlights](/docs/about/features/) — what local-first means in practice
- [Configuration](/docs/customize/config/) — which features bring in an external service
- [Brand and appearance](/docs/customize/brand/) — changing fonts and icons
