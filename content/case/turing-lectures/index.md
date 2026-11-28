---
title: ACM Turing Award Lectures
linkTitle: Turing Award Lectures
description: >-
  ACM Turing Award Lectures: 42 Chinese translations of 1966–2024 Turing Award lectures and 100+ Turing papers rendered with OINK KaTeX formulas and hypothes.is.
images: [featured.webp]
site_url: https://c2j.github.io/ACM-Turing-Award-Lectures/
case_group: community
weight: 390
date: 2026-11-13
search_keywords: [Turing Award Lectures, computer science, KaTeX, numbered equations, hypothes.is, Chinese, community]
tags: [Community, Book, Chinese]
---

[c2j.github.io/ACM-Turing-Award-Lectures](https://c2j.github.io/ACM-Turing-Award-Lectures/) publishes Chinese translations of 42 ACM A.M. Turing Award lectures (1966–2024) along with more than 100 papers from the four-volume *Collected Works of A.M. Turing*. Maintained in [`c2j/ACM-Turing-Award-Lectures`](https://github.com/c2j/ACM-Turing-Award-Lectures), it generates its Hugo content tree directly from repository Markdown in GitHub Actions, enabling OINK's build-time KaTeX math (`{#eq-N}` numbered equations), translator note sidebars, and `hypothes.is` reader annotations.

## What it demonstrates {#what-it-demonstrates}

- Rendering math-heavy computer science literature with OINK's build-time KaTeX passthrough and numbered equation anchors (`{#eq-N}`).
- Building a large historical lecture archive cleanly in GitHub Actions with only Hugo and Go—no Node.js toolchain required.
- Extending OINK cleanly with community reading annotations (`hypothes.is`) while keeping source Markdown readable directly on GitHub.

→ [Math](/docs/components/math/) · [Writing a book](/docs/write/book/) · [All OINK cases](/case/)
