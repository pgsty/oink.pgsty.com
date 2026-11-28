---
title: CAI Field Manual Library
linkTitle: CAI Field Manual Library
description: >-
  Red Hat CAI Field Manual Library: an aggregated OpenShift AI bookshelf mounting multiple field manual repositories over a shared OINK Hugo Module shell.
images: [featured.webp]
site_url: https://rh-aiservices-bu.github.io/CAI-Field-Manual-Library/
case_group: community
weight: 250
date: 2026-11-13
search_keywords: [Red Hat, CAI Field Manual, OpenShift AI, bookshelf, Hugo modules, enterprise, community]
tags: [Community, Book, Enterprise]
---

[rh-aiservices-bu.github.io/CAI-Field-Manual-Library](https://rh-aiservices-bu.github.io/CAI-Field-Manual-Library/) is the aggregated field-manual bookshelf for Red Hat's Customer Adoption and Innovation (CAI) team. Maintained in [`rh-aiservices-bu/CAI-Field-Manual-Library`](https://github.com/rh-aiservices-bu/CAI-Field-Manual-Library), the content-only repository mounts individual OpenShift AI manual repositories (such as RHOAI migration and MaaS guides) as git submodules and imports [`CAI-Field-Manual-Shell`](https://github.com/rh-aiservices-bu/CAI-Field-Manual-Shell)—a reusable enterprise Hugo Module layered directly on OINK.

## What it demonstrates {#what-it-demonstrates}

- Wrapping OINK inside a shared organizational Hugo Module (`CAI-Field-Manual-Shell`) so multiple documentation repositories inherit uniform chrome, scripts, and brand rules without duplicating layouts.
- Assembling separate manual repositories into a single bookshelf landing page via Hugo `module.mounts` and git submodules.
- Pairing a custom five-axis deployment variant selector with OINK's `llms.txt` and `llms-full.txt` outputs for both human operators and AI assistants.

→ [Writing a book](/docs/write/book/) · [Agent outputs](/docs/customize/agents/) · [All OINK cases](/case/)
