---
title: Open-source licenses and acknowledgements
linkTitle: Open-source licenses
description:
  Understand Oink's upstream lineage, dependencies, acknowledgements, and
  licensing boundaries.
weight: 50
aliases: [/license/, /docs/about/licenses/]
---

OINK combines an Apache-licensed theme, a separately licensed documentation
site, and third-party components that retain their own licenses. These layers
are intentionally not relicensed as one undifferentiated work.

This page is a practical provenance guide, not a substitute for the license
texts. When the summary and a license file differ, the license file controls.

## License map {#license-map}

| Surface                                                   | License                                        | Authoritative record                                                        |
| --------------------------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| Oink theme source and Oink theme changes                  | Apache License 2.0                             | Theme [`LICENSE`][] and [`NOTICE`][]                                        |
| Site code, build tooling, and Docsy-derived material      | Apache License 2.0                             | Site [`LICENSE`][site-license] and [`NOTICE`][site-notice]                  |
| Original Oink documentation, unless noted otherwise       | Creative Commons Attribution 4.0 International | [`LICENSE-CC-BY-4.0`][site-cc-by] and the page or asset's own attribution   |
| Browser libraries, fonts, icons, and other bundled assets | Each component's own license                   | Theme [`VENDOR.json`][] and the license files distributed beside the assets |

The Creative Commons license applies to original documentation content, not to
theme code, copied source code, trademarks, screenshots, or third-party assets
that carry a different notice. Likewise, Apache-2.0 on the theme does not
replace a bundled dependency's license.

## Upstream lineage {#upstream-lineage}

OINK is an independent theme directly derived from
[Docsy](https://github.com/google/docsy). It preserves Docsy's source history,
Apache-2.0 license, copyright notices, content conventions, and compatible APIs
that remain part of the product. The project site is also derived from the Docsy
project website and records that origin in its own `NOTICE`.

OINK is not an optional skin over a second Docsy installation. The inherited
codebase has evolved into one standard theme with a Hugo-only consumer build,
local browser runtimes, multilingual behavior, and its own release process.
Contributors must retain applicable upstream notices and mark modified files as
required by Apache-2.0.

## Projects Oink depends on {#projects-oink-depends-on}

[Hugo Extended](https://gohugo.io/) is the build platform. Go resolves the Hugo
Module when a site uses the module installation path, and Git provides the
source and release workflow. These tools are prerequisites; the theme does not
redistribute their executables.

The theme does redistribute versioned browser assets so a consumer does not need
npm or a public CDN. The following table groups the current major dependencies;
`VENDOR.json` is authoritative for exact versions, selected artifacts, sources,
checksums, and license paths.

| Capability             | Included projects                                          | License families recorded by the theme        |
| ---------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| UI foundation          | Bootstrap, Popper                                          | MIT                                           |
| Icons and fonts        | Font Awesome, Open Sans, Chakra Petch, IBM Plex Mono       | CC BY 4.0, SIL OFL 1.1, and MIT as applicable |
| Search                 | Lunr, DocSearch                                            | MIT                                           |
| Diagrams and formulae  | Mermaid, KaTeX, Markmap, D3, Highlight.js, Web Font Loader | MIT, ISC, BSD-3-Clause, and Apache-2.0        |
| API and terminal views | Swagger UI, Redoc, Asciinema Player                        | Apache-2.0 and MIT                            |
| Data visualization     | Apache ECharts, AntV Infographic                           | Apache-2.0 and MIT                            |
| Supporting runtimes    | pako, external-svg-loader, idb-keyval, PrismJS             | MIT, Zlib, and Apache-2.0 as applicable       |

Redistributions must keep the license and notice material required by each
component. Updating a vendored file means updating its manifest entry, checksum,
source, license files, and any required notice in the same change.

## Projects Oink acknowledges {#projects-oink-acknowledges}

| Project      | Relationship to Oink              | What Oink drew from it                                                                                                           |
| ------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Hugo][]     | Build platform                    | Content model, templates, asset pipeline, multilingual routing, taxonomies, static site generation                               |
| [Docsy][]    | **Direct upstream (forked from)** | Repository history, documentation conventions, layouts, Bootstrap foundation, compatible APIs                                    |
| [Fumadocs][] | Design reference                  | Content-first presentation, information hierarchy, table-of-contents handling, authoring components such as Files and Type Table |
| [Nextra][]   | Design reference                  | A spare documentation shell, filename and copy affordances on code blocks, per-page layout switches                              |
| [Hextra][]   | Design reference                  | A Hugo-native implementation posture, FileTree, Badge, Tabs, and lightweight banners                                             |
| [Mintlify][] | Design reference                  | Structured navigation tiers, synchronized code groups, API reference reading experience                                          |

OINK is **forked from Docsy**, its only code upstream. The source history, the
Apache-2.0 license, and the attribution in `NOTICE` are all preserved.

Fumadocs, Nextra, Hextra, and Mintlify are **design references, not code sources
and not runtime dependencies**. OINK reinterprets those ideas for Hugo and a
Docsy-derived codebase rather than copying them pixel for pixel, and no code was
ported from any of them.

Thanks to the Hugo and Docsy communities, and to the projects above, for
publishing and maintaining this work in the open.

These references describe lineage, dependency, or design inspiration. They **do
not imply endorsement**; project and product names remain the property of their
respective owners.

## Reusing the documentation {#reusing-the-documentation}

CC BY 4.0 permits sharing and adaptation of covered documentation for any
purpose, provided that you give appropriate credit, link to the license, and
indicate whether you made changes. You must not imply that Oink, PGSTY, or an
upstream project endorses the adaptation.

A concise attribution can read:

> Adapted from the Oink documentation by PGSTY contributors, licensed under
> [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Changes were made.

If a page includes separately attributed media or imported text, preserve that
material's attribution and license as well. Removing a footer does not remove
the obligation to provide attribution elsewhere.

## Reusing the theme {#reusing-the-theme}

Apache-2.0 permits use, modification, and distribution of the covered theme
source and compiled output, subject to its terms. In particular, preserve the
license, applicable copyright and attribution notices, and the contents of
`NOTICE` when the license requires them; mark modified files when distributing
modified source.

Theme distributions should include `LICENSE`, `NOTICE`, `VENDOR.json`, and the
third-party license files referenced by the manifest. Apache-2.0 does not grant
permission to use project trademarks, and it does not turn third-party assets
into Apache-licensed works.

For a source contribution or redistribution review, start with the
[contribution guidelines](../contributing/) and the actual license and notice
files linked below.

[Docsy]: https://www.docsy.dev/
[Fumadocs]: https://www.fumadocs.dev/
[Hugo]: https://gohugo.io/
[`LICENSE`]: https://github.com/pgsty/oink/blob/main/LICENSE
[`NOTICE`]: https://github.com/pgsty/oink/blob/main/NOTICE
[`VENDOR.json`]: https://github.com/pgsty/oink/blob/main/VENDOR.json
[site-cc-by]:
  https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE-CC-BY-4.0
[site-license]: https://github.com/pgsty/oink.pgsty.com/blob/main/LICENSE
[site-notice]: https://github.com/pgsty/oink.pgsty.com/blob/main/NOTICE
[Nextra]: https://nextra.site/
[Hextra]: https://imfing.github.io/hextra/
[Mintlify]: https://mintlify.com/
