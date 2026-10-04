---
title: pig.pgsty.com
description: >-
  PIG: the package manager that installs any PostgreSQL extension. A compact bilingual product manual with a data-driven home page and an active companion blog.
images: [featured.webp]
weight: 70
date: 2026-08-09
search_keywords: [pig.pgsty.com, PIG, package manager, compact documentation]
tags: [Docs, Bilingual, Product]
---

[pig.pgsty.com](https://pig.pgsty.com/) documents PIG, the PostgreSQL extension
package manager. Its core manual is deliberately compact—18 pages per language
in the case snapshot—while a 50-post bilingual blog carries updates and deeper
explanations. The home page is assembled from `data/home`.

## What it demonstrates {#what-it-demonstrates}

- A shallow, mostly single-file documentation tree for a focused CLI product.
- English and Chinese peers without duplicating navigation design.
- A data-driven home page paired with a larger stream of blog content.

Choose this pattern when the reference manual is small and stable but product
news, tutorials, and release context need room to grow.

## Reuse the separation, not the product data {#implementation}

The [Docs root](https://github.com/pgsty/pig.pgsty.com/blob/d9065c0b4b04285f230f7af7e24d7f3bc12c4cde/content/docs/_index.md)
selects the documentation type. Separately,
[`data/home/metrics.yaml`](https://github.com/pgsty/pig.pgsty.com/blob/d9065c0b4b04285f230f7af7e24d7f3bc12c4cde/data/home/metrics.yaml)
keeps product counters outside the prose. The site maintains those facts and
the templates that consume them; OINK supplies the reading shell.

For a small product, start with ordinary Docs files and add structured home
data only for facts reused elsewhere. Copy the organization, not PIG's package
counts or product-specific home implementation.

→ [Docs structure](/docs/start/anatomy/) · [All OINK cases](/case/)
