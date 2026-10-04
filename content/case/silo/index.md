---
title: silo.pgsty.com
description: >-
  SILO: the community-maintained MinIO fork for S3-compatible object storage. A large bilingual migration whose checked manifest generates the documentation navigation.
images: [featured.webp]
weight: 40
date: 2026-08-12
search_keywords: [silo.pgsty.com, SILO, migration, generated navigation, S3]
tags: [Docs, Bilingual, Migration]
---

[silo.pgsty.com](https://silo.pgsty.com/) documents SILO, an S3-compatible
object store. The case snapshot counted 411 pages per language. A migration
manifest covering 387 upstream pages generates `data/docs_nav.json`, which then
drives the documentation sidebar. The site also has module taxonomy and a
download page.

## What it demonstrates {#what-it-demonstrates}

- Migrating a large upstream manual without flattening its information design.
- Generating navigation from a checked manifest instead of hand-maintaining it.
- Layering local bilingual content, taxonomy, and downloads around imported docs.

Use this pattern when the upstream corpus remains authoritative but the local
site needs its own navigation, language peers, and product surfaces.

## Follow the navigation data boundary {#implementation}

The committed [`data/docs_nav.json`](https://github.com/pgsty/silo.pgsty.com/blob/6acbbe552a0dde62b08f64d7c231a0dbdfed9df8/data/docs_nav.json)
records its inputs in `meta.generated_from` (`migration/reports/navigation.csv`)
and `meta.manifest` (`migration/minio-docs-manifest.csv`). The migration process
owns those inputs and the generated navigation; OINK consumes the resulting
tree. Those input paths describe provenance, not a generator bundled with OINK.

This trades a second, site-maintained navigation artifact for control over an
imported manual's order. Use the ordinary content tree for a small original
manual; adopt generated navigation only when you also maintain its source and
regeneration procedure.

→ [Navigation](/docs/customize/navigation/) · [All OINK cases](/case/)
