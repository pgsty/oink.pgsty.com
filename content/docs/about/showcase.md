---
title: Case Guide
linkTitle: Cases
description: Find the OINK production case closest to your documentation, book, landing page, or interactive tool.
weight: 20
search_keywords: [case guide, showcase, examples, production sites, Pigsty, who uses OINK]
aliases:
  - /docs/about/examples/
---

The canonical [Case library](/case/) turns fifteen production sites into short,
reusable implementation patterns, and the home page mirrors the same fifteen.
All of them run OINK, including this documentation site itself as a
self-referential case.

Use this guide when you know the shape of the site you want to build. Follow a
case for its architecture and trade-offs, then use the linked documentation for
the exact configuration. Counts in individual cases describe the audited
snapshot rather than a permanent property of a live site.

## Distribution documentation {#pigsty-sites}

### [pigsty.io](/case/pigsty-io/) {#pigsty-io}

A very large English site combining a distribution manual, editorial blog,
extension catalogue, taxonomies, version navigation, and pricing landing pages.

### [pigsty.cc](/case/pigsty-cc/) {#pigsty-cc}

The Chinese peer deployed as an independent single-language site—a useful
trade-off when both language corpora have become products in their own right.

### [pgsty.pro](/case/pgsty-pro/) {#pgsty-pro}

A bilingual version archive that renders many release pages from reusable,
structured release data.

## Product documentation {#product-sites}

### [PIG](/case/pig/) {#pig-pgsty-com}

A compact bilingual CLI manual with a data-driven home page and a much larger
companion blog.

### [SOW](/case/sow/) {#sow-pgsty-com}

A bilingual operations manual with a dedicated download content type fed by
release metadata.

### [SILO](/case/silo/) {#silo-pgsty-com}

A large upstream migration whose checked manifest generates the bilingual
documentation navigation.

### [PG Exporter](/case/pg-exporter/) {#exp-pgsty-com}

A metrics manual combining generated navigation, a structured catalogue, and a
system-font presentation.

## Books {#book-sites}

### [Designing Data-Intensive Applications](/case/ddia/) {#ddia-vonng-com}

A multilingual, multi-edition book and the strongest example of numbered
figures, cross-references, chapter navigation, and indexes.

### [The Product-Minded Engineer](/case/tpme/) {#tpme-vonng-com}

A focused bilingual publication that needs only OINK's Book shell.

### [PG Internal](/case/pg-internal/) {#pgint-vonng-com}

A finished Chinese translation published as a deliberately single-language Book,
with no documentation tree and nothing to switch languages to.

## Aggregate, landing, and custom sites {#other-sites}

### [pgsql.cc](/case/pgsql-cc/) {#pgsql-cc}

An aggregate operations library where several upstream manuals and partially
translated language trees share one search and visual system.

### [pgsty.com](/case/pgsty-com/) {#pgsty-com}

A small bilingual corporate site showing that OINK can primarily be a
data-driven landing-page system.

### [Capslock](/case/capslock/) {#caps-vonng-com}

A two-page-per-language project whose custom shell hosts an interactive,
data-driven configuration generator.

### [oink.pgsty.com](/case/oink/) {#oink-pgsty-com}

The full reference site: public documentation, live component examples, design
contracts, multiple content shells, and regression coverage in one repository.

### [pgext.cloud](/case/pgext-cloud/) {#pgext-cloud}

The PostgreSQL extension catalog: a queryable dataset as the primary object of
a site, indexing 2,241 extensions and 576 packaged builds across 16 platforms.

## Choosing a starting point {#choosing-a-starting-point}

- For a conventional product manual, begin with [PIG](/case/pig/) or
  [SOW](/case/sow/).
- For a large migration, compare [SILO](/case/silo/) and
  [pgsql.cc](/case/pgsql-cc/).
- For a book, compare [TPME](/case/tpme/) with the more elaborate
  [DDIA](/case/ddia/) implementation, or [PG Internal](/case/pg-internal/) for a
  single-language one.
- For a landing or interactive site, start with [pgsty.com](/case/pgsty-com/)
  or [Capslock](/case/capslock/).
- For the broadest reference, use [OINK Docs](/case/oink/).
- For a queryable dataset presented as the primary object of a site, see
  [ext.pgsty.com](/case/pgext-cloud/).

The theme repository's `tests/site/` is an internal CI fixture, not a starter
template. Its pages exist to exercise rendering behavior; the production cases
above are the better design references.

→ [Browse all cases](/case/) · [Quick start](/docs/start/) · [Repository tour](/docs/start/anatomy/)
