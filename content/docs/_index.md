---
# LLMSFULL publishes the whole section as llms-full.txt per language; front
# matter outputs replace the site list, so the ordinary formats repeat here.
outputs: [HTML, RSS, print, markdown, LLMSFULL]
title: OINK Documentation
linkTitle: Docs
description: Build a technical content site. Use shared navigation, multilingual support, and search for documentation, blogs, books, and API references.
weight: 10
search_keywords:
  [
    OINK,
    Hugo theme,
    technical documentation,
    documentation site,
    Docsy,
    Markdown native,
  ]
type: docs
icon: fa-solid fa-book
sidebar_expanded: true
sidebar_root_for: self
sidebar_root_link_self: true
# The section root is a table of contents, not a destination: backlinks
# belong on the pages it leads to, so it opts out of the site-wide default.
backlinks: false
# Docs pins the title bar: a reference tree is read by jumping between pages,
# so the global menu has to stay where the pointer left it.
navbar_autohide: false
# Section identity: Docs keeps the brand blue, and names it rather than
# inheriting it silently so the sidebar root switcher can draw all four
# marks in their own color instead of leaving one of them uncolored.
cascade:
  theme_color: '#245f94'
  theme_color_dark: '#5da2dd'
  type: docs
  navbar_autohide: false
  footer_style: fat
  comments: true
  feedback: false
  search_boost: 1.35
---

OINK is a Hugo theme for technical documentation: product manuals, project
sites, books and API references, in one language or many. You write plain
Markdown, run `hugo`, and get a static site with a navigation tree, local
full-text search, light and dark modes, and a print view. The theme ships every
script, font and stylesheet it uses, so the build needs no Node.js, npm or CDN.

New to OINK? [Get started](/docs/start/) has this site running locally in two
minutes and shows how to build your own with an AI agent. Already running
OINK? Read the [1.7.0 release notes](/release/1.7.0/), then follow the
[upgrade guide](/docs/admin/upgrade/#preparing-1-7).

## Where to start {#five-entries}

- [Get started](/docs/start/) — Clone the docs locally, try the AI agent prompt, or add OINK to a project.
- [Components](/docs/components/) — Callouts, tabs, diagrams, cards and more, each with its source beside the result.
- [OINK Hands-On](/book/) — Build a site from one prompt, then learn every layer of it in ten hands-on chapters.
- [Case studies](/case/) — How production sites solved navigation, migration and landing-page design.
{.cards}

## Find it by task {#where-to-go}

| I want to…                                   | Read                                           |
| -------------------------------------------- | ---------------------------------------------- |
| Decide whether OINK fits my project          | [What is OINK](/docs/about/)                   |
| Write a documentation page                   | [Writing pages](/docs/write/pages/)            |
| Turn a folder tree into the sidebar          | [Organizing content](/docs/write/organize/)    |
| Look up a component's syntax                 | [Components](/docs/components/)                |
| Publish a blog, a book or an image album     | [Blog posts](/docs/write/blog/) · [Books](/docs/write/book/) · [Expo albums](/docs/write/expo/) |
| Change the name, logo, colors and fonts      | [Brand and appearance](/docs/customize/brand/) |
| Look up a configuration key and its default  | [Configuration](/docs/customize/config/)       |
| Publish in two or more languages             | [Languages](/docs/customize/i18n/)             |
| Deploy to GitHub Pages, Cloudflare or my own server | [Deploy](/docs/admin/deploy/)           |
| Upgrade OINK or migrate from Docsy           | [Upgrade](/docs/admin/upgrade/)                |
| Fix a build error or a missing feature       | [Troubleshooting](/docs/admin/troubleshooting/) |

**Design** and **CLI**, at the bottom of the sidebar, document how OINK itself
is built and maintained. You do not need them to build a site.
