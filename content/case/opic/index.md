---
title: project-opic.github.io/opic-website
linkTitle: OPIC
description: >-
  OPIC: bilingual Open Intelligent Computing platform website and documentation migrated from Docusaurus 3 to Hugo and OINK with zero Node dependencies.
images: [featured.webp]
site_url: https://project-opic.github.io/opic-website/
case_group: community
weight: 260
date: 2026-11-13
search_keywords: [OPIC, Docusaurus migration, AI computing, Paper preset, bilingual, community]
tags: [Community, Docs, Bilingual]
---

[project-opic.github.io/opic-website](https://project-opic.github.io/opic-website/) is the official website and technical documentation for **OPIC** (*Open Intelligent Computing Platform*). Maintained in [`Project-Opic/opic-website`](https://github.com/Project-Opic/opic-website), the repository migrated completely from Docusaurus 3 (archived in `legacy-docusaurus/`) to Hugo and OINK on the `paper` preset—dropping Node.js, npm, and Vite in favor of a single Hugo binary with local BM25 Chinese search, KaTeX math, and `llms.txt`.

## What it demonstrates {#what-it-demonstrates}

- Migrating an active open-source documentation site from Docusaurus 3 to Hugo + OINK while preserving document ordering (`sidebar_position` → `weight`), blog posts, and bilingual routes.
- Vendoring the OINK theme cleanly inside `themes/oink/` for deterministic single-binary builds without external network dependencies.
- Combining data-driven Chinese and English landing pages (`data/home/zh.yaml`, `data/home/en.yaml`) with deep architecture documentation.

→ [Home and landing pages](/docs/customize/home/) · [From scratch and offline builds](/docs/start/from-scratch/) · [All OINK cases](/case/)
