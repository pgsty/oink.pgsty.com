---
title: What is OINK
linkTitle: Introduction
description: A documentation theme that needs nothing but Hugo Extended. Evolved from Docsy, its components are written in Markdown, its assets ship with the theme, and thirteen production sites run on it.
weight: 10
icon: fa-solid fa-circle-info
search_keywords: [OINK, Hugo theme, Docsy, technical documentation, documentation site, local-first, Markdown native]
cascade:
  categories: [Introduction]
aliases:
  - /docs/about/contributing/
---

OINK is a standalone [Hugo](https://gohugo.io/) theme for medium and large
technical documentation sites. It evolved from
[Docsy](https://github.com/google/docsy): the content model and the
multilingual behaviour are kept, while the shell, navigation, search and
content components are replaced.

A consuming site's only build dependency is one Hugo Extended binary. There is
no Node.js, no npm, no PostCSS and no CDN request. Bootstrap, Font Awesome, the
fonts, local search, the diagram runtimes and the API reference runtimes are all
committed to the theme repository and shipped only to the pages that use them.

Components are not a second template language: `> [!NOTE]` is a callout, a table
with a `{.fields}` line is a parameter list, and an image followed by
`{caption=}` has a caption. [Thirteen production sites](/docs/about/showcase/)
run on it today, this one among them.

![OINK turns Markdown content, configuration and local assets into one static documentation site](/images/hero-light.webp)
{width="900" height="600" caption="One Hugo build produces a static site ready to host"}

## What the theme provides {#what-oink-provides}
- The documentation and blog shell: navigation, sidebar tree, table of contents, breadcrumbs, pager, dark mode, print view and accessible interaction.
- The multilingual frame: translation routing, fallback for untranslated pages, language weighting, RTL, and 32 interface language packs.
- Local runtimes: Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, Infographic and local full-text search.
- Content components: callouts, tabs, steps, cards, field lists, file trees, galleries, badges, keys and more — most with a native Markdown form.
- Content types: beyond ordinary documentation, built-in book numbering and cross-references, release and download pages, data-driven landing pages, and OpenAPI reference pages.

The theme does not handle source hosting or deployment: a site can live on
GitHub, GitLab or a private Git server, and the static files Hugo produces can
be published anywhere. A site's own content, brand and business components stay
with the site; the theme supplies the shell and the reusable components.

## Is OINK for me {#is-oink-for-me}
| A good fit when | A poor fit when |
| --- | --- |
| There are many pages and mixed content types: documentation, blog, a book, release pages and an API reference in one site | There are one or two pages and no need for structured navigation; a README or a lighter Hugo theme is simpler |
| You need real multilingual support, not a translation link bolted onto an English site | The site is mostly application UI rather than documentation: OINK can carry the documentation part while business components stay at the site layer |
| Reproducible builds and network isolation matter, and the build machine has no outbound access | You need interactive components inside the prose (React / MDX) |
| Several sites share one shell, so layouts and shortcodes are not copied around | You want one switch that swaps in a different look: the theme has no brand switch, and appearance changes go through CSS tokens and partial overrides |
| The team has no front-end engineers and maintains no Node toolchain | You need a built-in CMS or a WYSIWYG editor |

## How it differs from other documentation systems {#comparison}

The table below lists structural differences only, and only what can be
confirmed from each project's own documentation and repository. Versions change;
check each project's current documentation before choosing.

| Dimension | OINK | Docsy | Hextra | Docusaurus |
| --- | --- | --- | --- | --- |
| Build tool | Hugo Extended, one binary | Hugo Extended + Node/npm | Hugo | Node.js toolchain |
| Does a consuming site need npm | No | Yes: Bootstrap and Font Awesome are mounted from `node_modules/` | No | Yes |
| Where front-end assets come from | All committed to the theme repository; `VENDOR.json` records version, source, licence and checksum | jQuery is loaded from a CDN on every page unconditionally; Mermaid, KaTeX and others also fetch from a CDN at build time | Prebuilt artifacts committed to the repository | npm dependencies |
| How components are written | Native Markdown attributes and fences first, 29 shortcodes as the fallback | Shortcodes (19) | Shortcodes (29) first; callouts also have a `> [!NOTE]` native form | MDX (React components) |
| Multilingual | Hugo multilingual + 32 interface language packs | Hugo multilingual (OINK's packs are inherited from it) | Hugo multilingual + 21 interface language packs | Built-in i18n framework |
| Book numbering and cross-references / release and download pages / data-driven landing pages | Built into the theme | None | None | Build your own or find a plugin |

Two qualifications. Per-page Markdown output and `llms.txt` are not unique to
OINK — Docsy and Hextra have them too, and all three need the site to opt in
under `outputs`. Only the last row is exclusive to OINK, and it comes from
PGSTY's own production sites rather than from what a general documentation site
needs. The theme's interactive features are off by default: search, zoom,
comments and feedback all require the site to turn them on.

OINK is not a skin layered over Docsy but a theme that forked and evolved
separately. Docsy's source history, its Apache-2.0 obligations and its
attribution are kept intact; the details are in
[License and acknowledgements](/docs/about/license/).

## Start here {#start-here}
- [Quick start](/docs/start/) — install Hugo, clone this site, replace the site details, publish to GitHub Pages.
- [Components](/docs/components/) — one page per component, source first and rendered result after.
- [Showcase](/docs/about/showcase/) — thirteen production sites and which part of OINK each one uses.
{.cards}

[Highlights](/docs/about/features/) lists what the theme provides capability by
capability, each entry linking to the guide that covers it.
