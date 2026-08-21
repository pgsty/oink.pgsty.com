---
title: pgext.cloud
description: The PostgreSQL Extension Catalog — the one site in this family that is a bespoke data application rather than an OINK site.
weight: 150
date: 2026-08-01
manual_link: https://pgext.cloud/
search_keywords: [pgext.cloud, PostgreSQL extension catalog, data application, boundary case]
tags: [Catalogue, Data driven, Not OINK]
---

[pgext.cloud](https://pgext.cloud/) is the PostgreSQL Extension Catalog: search
across extensions, package families, dependencies, and the exact PostgreSQL and
operating-system combinations each one is available for. It is the boundary case
in this library, because it does not run OINK. The catalogue is a hand-written
single-page application served as static files, with its own query interface
over the extension dataset.

## What it demonstrates {#what-it-demonstrates}

- Where a documentation theme stops being the right tool. The primary object
  here is a queryable dataset, not a tree of pages, so page-per-topic
  navigation, a sidebar, and a reading shell would all be in the way.
- The counter-example to [PG Exporter](/case/pg-exporter/) and
  [pigsty.io](/case/pigsty-io/), where structured catalogues live *inside* an
  OINK site because prose surrounds them.

Use OINK when readers arrive to read; reach for a purpose-built application when
they arrive to query. The two can sit side by side in one project and link to
each other, as they do here.

→ [PG Exporter case](/case/pg-exporter/) · [pigsty.io case](/case/pigsty-io/) · [All OINK cases](/case/)
