---
title: personalpage-dvh.pages.dev
linkTitle: Zhangyi's Notes
description: >-
  Zhangyi's Notes: a bilingual personal engineering log on Cloudflare Pages publishing Markdown essays, project notes, and decision records for humans and AI agents.
images: [featured.webp]
site_url: https://personalpage-dvh.pages.dev/
case_group: community
weight: 550
date: 2026-11-13
search_keywords: [zhangyi1995, Cloudflare Pages, personal blog, Markdown, AI agents, bilingual, community]
tags: [Community, Blog, Personal]
---

[personalpage-dvh.pages.dev](https://personalpage-dvh.pages.dev/) is a bilingual Chinese-and-English technical notes and decision-log site maintained in [`zhangyi1995/PersonalPage`](https://github.com/zhangyi1995/PersonalPage) and deployed to Cloudflare Pages. Spanning 31 Markdown files with KaTeX math, Giscus comments, and `llms.txt`, it highlights OINK's dual-audience model right on the homepage: write Markdown once, serve HTML to people and Markdown to agents.

## What it demonstrates {#what-it-demonstrates}

- Pinning an explicit Hugo release binary inside `bin/build.sh` so Cloudflare Pages builds stay independent of older pre-installed platform Hugo versions.
- Organizing technical notes, projects, and multi-part series in a crisp bilingual OINK site with `llms.txt` enabled.

→ [Deploy](/docs/admin/deploy/) · [Agent outputs](/docs/customize/agents/) · [All OINK cases](/case/)
