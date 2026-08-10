---
title: Example sites
description:
  Explore the full project site, the theme example, and a minimal bilingual
  consumer.
downstream_modified: true
weight: 10
icon: fa-solid fa-cubes
aliases: [/examples/, /docs/examples/, /docs/about/example/]
---

OINK provides examples at three different scales. Choose the smallest one that
answers the question you are investigating; the complete project site is useful
for regression coverage, but it is deliberately larger than a normal consumer.

## Choose an example {#choose-an-example}

| Example                    | Best for                                    | Repository or guide      |
| -------------------------- | ------------------------------------------- | ------------------------ |
| Bilingual project site     | Production-scale configuration and QA       | `pgsty/oink.pgsty.com`   |
| Theme `exampleSite/`       | Landing-page composition and theme checkout | `pgsty/oink/exampleSite` |
| Minimal bilingual consumer | Starting a new documentation site           | [Create a new site][]    |

## Bilingual project site {#bilingual-project-site}

The [`pgsty/oink.pgsty.com`](https://github.com/pgsty/oink.pgsty.com) repository
is the complete documentation and regression site you are reading. It keeps
English and Simplified Chinese content side by side, pins the published Oink
module in `go.mod`, and exercises documentation, blog, search, print, rich
content, metadata, and responsive navigation.

Clone and preview the published module path with Hugo:

```sh
git clone https://github.com/pgsty/oink.pgsty.com.git
cd oink.pgsty.com
hugo server --disableFastRender
```

Create the production artifact with:

```sh
hugo --gc --minify
```

Node.js and npm are maintenance dependencies for this repository's formatting,
translation, link, browser, and regression checks. They are not Oink consumer
build requirements.

## Theme example site {#theme-example-site}

The theme repository contains a deliberately small `exampleSite/`. It exercises
the checked-out theme directly and demonstrates a composable landing page
without importing the project site's documentation or npm workspace.

```sh
git clone https://github.com/pgsty/oink.git
cd oink/exampleSite
hugo server
```

Use this example when changing landing-page data or checking a theme checkout.
Use the bilingual project site when testing documentation navigation,
translations, local search, rich components, or release behavior.

## Build a minimal consumer {#build-a-minimal-consumer}

Follow [Create a new site][] to assemble a small bilingual consumer from an
empty directory. The guide creates the module pin, configuration, content tree,
and first preview explicitly, so readers can see every required file instead of
depending on a copied starter that may drift.

Related references include:

- [Architecture] for repository and build boundaries;
- [Content components] for reusable authoring primitives;
- [Multi-language support] for colocated translations and stable anchors;
- [Deployment] for artifacts, static hosts, acceptance checks, and rollback;
- [Migration] for moving an existing Docsy consumer to Oink.

## Verify the right layer {#verify-the-right-layer}

A local preview proves that one checkout renders. It does not prove that a theme
tag is public, a deployment contains the same commit, or the hosted route works.
Record source, build, release, and hosted verification separately when using an
example as evidence.

[Architecture]: /docs/about/architecture/
[Content components]: /docs/content/components/
[Create a new site]: /docs/tutorial/create-site/
[Deployment]: /docs/deploy/
[Migration]: /docs/upgrade/migrate-from-docsy/
[Multi-language support]: /docs/advanced/language/
