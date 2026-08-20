---
title: SILO
description: A large bilingual migration whose generated navigation preserves the structure of hundreds of upstream pages.
weight: 80
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

→ [Navigation](/docs/customize/navigation/) · [All OINK cases](/case/)
