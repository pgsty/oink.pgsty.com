---
title: Case Guide
linkTitle: Cases
description: Find the OINK production case closest to your documentation, book, landing page, or interactive tool.
weight: 20
search_keywords: [case guide, showcase, examples, production sites, Pigsty, who uses OINK]
aliases:
  - /docs/about/examples/
---

The [Case library](/case/) describes fifteen OINK site projects and their
implementation patterns, including this documentation site. Case pages link to
the live result or project source. Where a pattern needs custom implementation,
they distinguish site-owned code from theme features.

If you know the type of site you want to build, use this guide. Read a
case to understand its architecture and trade-offs. Then use the linked
documentation for exact configuration. Counts in each case reflect the audited
snapshot.

## Distribution documentation {#pigsty-sites}

### [pigsty.io](/case/pigsty-io/) {#pigsty-io}

This very large English site combines a distribution manual, editorial blog,
extension catalog, taxonomies, version navigation, and pricing landing pages.

### [pigsty.cc](/case/pigsty-cc/) {#pigsty-cc}

This Chinese peer is deployed as an independent single-language site. This
approach is useful when each language corpus has become a separate product.

### [pgsty.pro](/case/pgsty-pro/) {#pgsty-pro}

This bilingual version archive renders many release pages from reusable,
structured release data.

## Product documentation {#product-sites}

### [PIG](/case/pig/) {#pig-pgsty-com}

This compact bilingual CLI manual has a data-driven home page and a much larger
companion blog.

### [SOW](/case/sow/) {#sow-pgsty-com}

This bilingual operations manual has a dedicated download content type that uses
release metadata.

### [SILO](/case/silo/) {#silo-pgsty-com}

This large upstream migration uses a checked manifest to generate bilingual
documentation navigation.

### [PG Exporter](/case/pg-exporter/) {#exp-pgsty-com}

This metrics manual combines generated navigation, a structured catalog, and
system fonts.

## Books {#book-sites}

### [Designing Data-Intensive Applications](/case/ddia/) {#ddia-vonng-com}

This multilingual, multi-edition book is the strongest example of numbered
figures, cross-references, chapter navigation, and indexes.

### [The Product-Minded Engineer](/case/tpme/) {#tpme-vonng-com}

This focused bilingual publication needs only OINK's Book shell.

### [PG Internal](/case/pg-internal/) {#pgint-vonng-com}

This finished Chinese translation is deliberately published as a single-language
Book. It has no documentation tree or other language to select.

## Aggregate, landing, and custom sites {#other-sites}

### [PostgreSQL ecosystem library](/case/pgsql-cc/) {#pgsql-cc}

This aggregate operations library combines several upstream manuals and partially
translated language trees. They share one search and visual system.

### [pgsty.com](/case/pgsty-com/) {#pgsty-com}

This small bilingual corporate site shows how OINK can primarily serve as a
data-driven landing-page system.

### [Capslock](/case/capslock/) {#caps-vonng-com}

This project has two pages per language. Its custom shell hosts an interactive,
data-driven configuration generator.

### [oink.pgsty.com](/case/oink/) {#oink-pgsty-com}

This full reference site contains public documentation, live component examples,
design contracts, multiple content shells, and regression coverage in one repository.

### [pgext.cloud](/case/pgext-cloud/) {#pgext-cloud}

This PostgreSQL extension catalog uses a queryable dataset as its primary object.
It indexes 2,241 extensions and 576 packaged builds across 16 platforms.

## Choosing a starting point {#choosing-a-starting-point}

- For a conventional product manual, begin with [PIG](/case/pig/) or
  [SOW](/case/sow/).
- For a large migration, compare [SILO](/case/silo/) and
  [PostgreSQL ecosystem library](/case/pgsql-cc/).
- For a book, compare [TPME](/case/tpme/) with the more elaborate
  [DDIA](/case/ddia/) implementation, or [PG Internal](/case/pg-internal/) for a
  single-language one.
- For a landing or interactive site, start with [pgsty.com](/case/pgsty-com/)
  or [Capslock](/case/capslock/).
- For the broadest reference, use [OINK Docs](/case/oink/).
- For a queryable dataset presented as the primary object of a site, see
  [ext.pgsty.com](/case/pgext-cloud/).

The theme repository's `tests/site/` is an internal CI fixture. Do not use it as
a starter template. Its pages test rendering behavior. Use the production cases
above as design references.

→ [Browse all cases](/case/) · [Quick start](/docs/start/) · [Repository tour](/docs/start/anatomy/)
