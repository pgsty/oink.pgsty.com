---
title: OINK
linkTitle: OINK
weight: 5
icon: fa-solid fa-layer-group
description: Product boundaries, architecture, and operating model
---

Oink is an independent, local-first Hugo documentation theme derived from Docsy.
It keeps Docsy's mature content model while making one implementation the
canonical product: a documentation shell, a Hugo-only consumer build, local
browser runtimes, multilingual infrastructure, and reusable content components.

The public Hugo Module is `github.com/pgsty/oink`. Documentation and regression
content live separately in `github.com/pgsty/oink.pgsty.com`.

## Product contract

### One canonical theme

Oink is not a skin layered over another Docsy installation. There is no
`oink.enabled` switch, no `params.oink.*` namespace, and no second visual
implementation to synchronize. The layouts and assets at the theme repository
root are the product.

Use Hugo's native language, module, menu, output, and markup settings; use
existing Docsy parameters where their semantics still fit; add a narrowly scoped
parameter only when the theme needs a real choice.

### Hugo-only consumer builds

After a site imports the module, its production build is:

```sh
hugo --gc --minify
```

A consuming site does not install Node.js, npm, PostCSS, Autoprefixer, or
browser packages. Maintainer tooling in the project-site repository is outside
the consumer build contract.

### Local-first by default

Bootstrap, Font Awesome, webfonts, local search, diagram and API-documentation
runtimes, and Oink content components ship with the theme. Assets are served
from the generated site and, where practical, loaded only on pages that use
them.

Authors can still link to the web, embed remote media, enable hosted services,
or configure PlantUML and Diagrams.net endpoints. Those boundaries are explicit;
Oink does not silently select public endpoints for theme-owned features.

### Multilingual as infrastructure

Language behavior is derived from Hugo's configured languages and page
translations. Oink emits language, direction, canonical, `hreflang`, and Open
Graph locale metadata and supports colocated translations such as `.md` and
`.zh.md`.

## What ships

- responsive docs and blog shells, navigation, search, print, dark mode, and
  mobile behavior;
- local Mermaid, KaTeX, Markmap, Swagger UI, Redoc, Asciinema, ECharts, and
  Infographic runtimes;
- details, tabs, cards, navigation cards, document cards, and carousels;
- translations and a versioned `VENDOR.json` with source, license, and checksum
  metadata;
- the Hugo module declaration, Apache-2.0 license, and required attribution.

## What does not ship

The theme repository does not contain the project website, generated `public/`
output, npm workspaces, product-specific widgets, or deployment configuration.
Those responsibilities stay in the consuming site or the separate project-site
repository.

Production sites should pin a released tag or immutable commit rather than
follow `main`.

## Repositories

| Repository                                                        | Purpose                                        |
| ----------------------------------------------------------------- | ---------------------------------------------- |
| [`pgsty/oink`](https://github.com/pgsty/oink)                     | Published theme and Hugo Module                |
| [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) | Documentation, examples, tests, and deployment |

For local theme development, clone them as siblings and connect them with an
ignored Go workspace.

## Project status

Hugo Extended `0.164.0` is the current validation baseline, and the theme
declares `0.160.1` as its minimum. A successful local build does not by itself
prove that a tag, hosted site, or downstream deployment exists.

The project preserves Docsy's Apache-2.0 history and attribution. Source and
offline distributions must retain `LICENSE`, `NOTICE`, and applicable
third-party notices.

## Next steps

1. [Install the Hugo Module](getting-started/).
2. Read the [architecture](architecture/) and [local-first model](local-first/).
3. Review [components](components/) and [configuration](configuration/).
4. Choose a [deployment](deployment/) and follow the
   [release checklist](release/).
5. For an existing Docsy site, start with the [migration guide](migration/).
