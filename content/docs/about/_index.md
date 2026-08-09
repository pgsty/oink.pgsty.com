---
downstream_modified: true
title: About OINK
linkTitle: About
description: >-
  OINK is a local-first, Hugo-only theme for multilingual technical
  documentation
type: docs
aliases: [/about/]
weight: 99
icon: fa-solid fa-circle-info
---

OINK turns Markdown, configuration, and local assets into a complete technical
documentation site. Once a site has the theme source and Hugo Extended, it can
build documentation, a blog, multilingual navigation, local search, diagrams,
API references, and reusable content components without installing a frontend
toolchain.

Start with the [documentation](/docs/), explore the
[working examples](/examples/), or read the
[OINK product reference](/docs/oink/).

## What OINK is

OINK is an independent theme directly evolved from Docsy. It preserves Docsy's
mature Hugo content model while establishing one canonical product surface:

- a branded, responsive documentation shell;
- Hugo-only consumer builds;
- versioned local browser runtimes;
- multilingual routing, metadata, search, and navigation;
- reusable, accessibility-conscious content components;
- a bilingual starter and verifiable offline distribution.

OINK is the project's current working name. Until a public release defines the
final brand, module path, and release coordinates, use an explicit checkout,
archive, or immutable revision rather than inferring them from inherited
metadata.

<a id="so-whats-a-technical-documentation-site"></a>

## What makes technical documentation work

Technical documentation should help readers understand a product and complete a
task with as little friction as possible. A useful documentation set is:

- **Reliable:** statements, commands, versions, and examples match the product.
- **Comprehensive:** readers can find the concepts, procedures, references, and
  troubleshooting material appropriate to their role.
- **Well organized:** related information is grouped consistently and reachable
  through navigation, search, and stable links.
- **Accessible:** content, components, color, focus, and keyboard behavior work
  for a broad audience.
- **Maintainable:** authors can review, translate, test, and publish changes
  without a fragile delivery pipeline.

For an international audience, the same information should also remain
equivalent across languages. OINK treats language identity, translated routes,
stable heading IDs, search indexes, and alternate metadata as infrastructure
rather than optional decoration.

<a id="how-does-docsy-help"></a>

## What OINK provides

| Capability                     | What the theme supplies                                                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Documentation and blog layouts | Responsive navigation, breadcrumbs, table of contents, page metadata, feedback, print output, and content indexes                          |
| Automatic navigation           | Hugo content structure becomes section navigation without a separate menu manifest                                                         |
| Multilingual behavior          | Native-language selectors, translated-page routing, home-page fallback, `hreflang`, locale metadata, and per-language local search         |
| Local-first browser features   | Bootstrap, Font Awesome, fonts, Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, and Infographic assets ship with the theme |
| Content components             | Tabs, details, cards, navigation cards, carousels, diagrams, terminal recordings, charts, and parameter substitution                       |
| Site-owned customization       | Hugo configuration, menus, content, project SCSS, templates, and business components remain under site control                             |
| Reproducible delivery          | A Hugo-only production command, bilingual starter, vendor manifest, offline archive, migration guide, and automated fixtures               |

<a id="simple-authoring-and-publishing"></a>

### Author and publish simply

Write content in Markdown or HTML, preview it with Hugo's local server, then
publish the generated `public/` directory through any static hosting platform.
The consumer production command is:

```sh
hugo --gc --minify
```

See [deployment options](/docs/deployment/) for local, GitHub Pages, Cloudflare
Pages, Netlify, and object-storage patterns.

<a id="built-in-integration-with-common-tools"></a>

### Build and search locally

OINK's default path performs no build-time download and emits no theme-owned
third-party browser request. Search uses a language-specific same-origin index,
including a CJK substring fallback for Simplified Chinese. Authors may still
configure remote analytics, media, diagram services, or hosted search, but those
boundaries are explicit site decisions.

<a id="get-organized"></a>

### Serve a multilingual audience

Translations can live beside their source pages as `page.md` and `page.zh.md`.
The theme derives language switching and SEO metadata from Hugo's page model.
This site demonstrates English as the primary language, Simplified Chinese as
the second language.

Read [multi-language support](/docs/language/) for content organization,
explicit stable heading IDs, RTL behavior, and translation checks.

<a id="make-it-your-own"></a>

### Customize without forking the shell

Sites own their logo, colors, typography, menus, content, and business-specific
components. OINK owns the canonical shell and general-purpose primitives. This
separation avoids maintaining a copied layout tree while preserving ordinary
Hugo overrides where a real product requirement calls for them.

See [look and feel](/docs/content/lookandfeel/) and
[content components](/docs/oink/components/).

<a id="keep-up-to-date"></a> <a id="focus-on-great-content"></a>

## Upstream projects and acknowledgements {#relationship-to-docsy}

OINK stands on mature open-source work. Hugo, Docsy, and Fumadocs each influence
the project in a different way: Hugo is the build platform, Docsy is the direct
upstream, and Fumadocs is a design reference.

| Project      | Relationship to OINK | What OINK takes forward                                                                                |
| ------------ | -------------------- | ------------------------------------------------------------------------------------------------------ |
| [Hugo][]     | Build platform       | Content model, templates, asset pipeline, multilingual routing, taxonomies, and static-site generation |
| [Docsy][]    | Direct upstream      | Repository history, documentation conventions, layouts, Bootstrap foundation, and compatible APIs      |
| [Fumadocs][] | Design reference     | A restrained, content-first shell, clear information hierarchy, and polished navigation interactions   |

### Hugo: the platform

[Hugo][] is the static site generator that builds an OINK site. OINK uses Hugo
Extended for content discovery, templates, multilingual pages, taxonomies, asset
processing, and static output. OINK is a Hugo theme, not a fork of Hugo.

### Docsy: the direct upstream

[Docsy][] is the direct code and content-model upstream of OINK. OINK preserves
Docsy's Apache-2.0 history and attribution, along with the content conventions
and compatible APIs that remain useful to existing sites.

OINK is not an optional skin layered over a separate Docsy installation. It
develops the inherited theme into an independent product with a standard shell,
Hugo-only consumer builds, local browser runtimes, a generalized multilingual
model, and additional content components.

### Fumadocs: design inspiration

[Fumadocs][] is a React.js documentation framework designed by Fuma Nama. In
OINK's lineage and dependency model, it is a design reference rather than the
direct code upstream or build platform.

OINK's current visual language and documentation shell take inspiration from
Fumadocs: its restrained, content-first presentation, information hierarchy,
navigation geometry, sidebar interactions, and table-of-contents treatment. OINK
reinterprets those ideas for Hugo and the Docsy-derived codebase rather than
making a pixel-for-pixel copy.

We thank Fuma Nama and the Fumadocs contributors for sharing their work in the
open and for raising the standard of documentation design.

### Attribution and boundaries

References to Hugo, Docsy, and Fumadocs describe project lineage, platform
dependencies, or design inspiration. They do not imply endorsement. The names
and trademarks belong to their respective owners. Source and distributions
retain the applicable license and notice files.

[Docsy]: https://www.docsy.dev/
[Fumadocs]: https://www.fumadocs.dev/
[Hugo]: https://gohugo.io/

<a id="whats-next-for-docsy"></a>

## Project status and next steps

This checkout is an implementation and documentation preview. A successful local
build does not by itself establish a public release, hosted deployment, or
stable remote module path.

- [Build the bilingual starter](/docs/oink/getting-started/).
- Review the [architecture](/docs/oink/architecture/) and
  [local-first contract](/docs/oink/local-first/).
- Read the [implementation diary](/blog/2026/oink-implementation-diary/).
- Follow the [release checklist](/docs/oink/release/).
- Join the [community](/community/) or read the
  [contribution guide](/docs/contributing/).

<!-- There must not be a blank line at the end of this file otherwise it creates an empty paragraph in the rendered page -->
