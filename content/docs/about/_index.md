---
downstream_modified: true
title: About Oink
description:
  Understand Oink's examples, design principles, architecture, and open-source
  model.
type: docs
aliases: [/about/, /docs/oink/]
weight: 90
icon: fa-solid fa-circle-info
---

OINK turns Markdown, configuration, and local assets into a complete technical
documentation site. With the theme source and Hugo Extended, a site can build
documentation, a blog, multilingual navigation, local search, diagrams, API
references, and reusable content components without maintaining a frontend
toolchain.

## What Oink provides {#what-oink-provides}

| Capability                     | Theme contract                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Documentation and blog layouts | Responsive navigation, breadcrumbs, table of contents, page metadata, feedback, print output, and content indexes |
| Multilingual behavior          | Translated-page routing, language metadata, stable anchors, and per-language local search                         |
| Local-first browser features   | Versioned styles, fonts, search, diagrams, API references, recordings, charts, and infographics                   |
| Content components             | Tabs, details, steps, cards, carousels, diagrams, terminal recordings, charts, and parameter substitution         |
| Reproducible delivery          | A Hugo-only consumer build, pinned assets, an auditable vendor manifest, and regression fixtures                  |

OINK evolves Docsy's mature Hugo content model into one independent theme. It
uses Hugo as its build platform and takes design inspiration from Fumadocs. The
[open-source licenses](license/) page records those relationships and keeps
upstream lineage, inspiration, dependencies, and licensing distinct.

## Explore the project {#explore-the-project}

The About section follows the lifecycle from evaluation through maintenance:

1. [Example sites](examples/) shows the full bilingual project site, the small
   theme example, and the guide for creating a minimal consumer.
2. [Local-first operation](local-first/) defines which build and browser
   capabilities work without hidden network access.
3. [Architecture](architecture/) explains the repository, build, page-shell,
   runtime, and extension boundaries.
4. [Contribution guidelines](contributing/) covers theme and bilingual
   documentation changes.
5. [Open-source licenses](license/) explains provenance, dependencies,
   acknowledgements, and the licenses for the site and theme.

## Repository boundaries {#repository-boundaries}

The published Hugo Module is
[`github.com/pgsty/oink`](https://github.com/pgsty/oink). Documentation,
examples, and regression tests live in the independent
[`github.com/pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com)
repository. Production consumers should pin a released tag or an immutable
commit.

Site-specific content, branding, configuration, and business components remain
under site control. General-purpose layouts, reusable components, local browser
runtimes, and translations belong in the theme.

## Start here {#start-here}

- [Install Oink](/docs/tutorial/install/) or
  [create a bilingual site](/docs/tutorial/create-site/).
- Review the [content authoring guide](/docs/content/) and
  [advanced features](/docs/advanced/).
- Read the [implementation diary](/blog/oink/oink-implementation-diary/) for
  design decisions and verification evidence.

A successful local build proves that one source tree renders in one local
environment. It does not prove that a theme tag is public or that the hosted
site contains the same commit.
