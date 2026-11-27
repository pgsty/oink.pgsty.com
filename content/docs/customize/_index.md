---
title: Customization
linkTitle: Customization
description: Configure the site brand, navigation, layout, search, languages, versions, print output, and agent output.
weight: 50
icon: fa-solid fa-sliders
search_keywords: [customization, configuration, site settings, brand, navigation, layout, search, languages]
cascade:
  categories: [Customization]
aliases:
  - /docs/configure/
  - /docs/advanced/
# The body's task map links every child page; the generated card list
# would repeat it. The Markdown output still lists the children.
no_list: true
---

Customization covers whatever applies to the whole site rather than to one
page: how it looks, how readers find their way around, what it publishes
besides HTML, and which languages and versions it serves. Most of it is a key
in `hugo.yml`; the rest lives in data files under `data/` and in your own
stylesheets under `assets/`. To write a page and set its front matter, see
[Authoring](/docs/write/).

## Find it by what you want to change {#what-to-change}

| I want to change… | Read |
| --- | --- |
| The site name, logo or favicon | [Brand and appearance](/docs/customize/brand/#logo) |
| Colors, light and dark mode, fonts | [Brand and appearance](/docs/customize/brand/#theme-color) |
| The navbar menu and its dropdowns | [Navigation and menus](/docs/customize/navigation/#main-menu) |
| Sidebar width, icon density or outline depth | [Layouts and page types](/docs/customize/layout/#sidebar) |
| The home page and landing pages | [Home and landing pages](/docs/customize/home/) |
| Full-text search and what it indexes | [Search](/docs/customize/search/) |
| What the command palette offers | [Command palette](/docs/customize/panel/) |
| Keyboard shortcuts | [Keyboard navigation](/docs/customize/keyboard/) |
| The languages the site publishes | [Languages](/docs/customize/i18n/) |
| Several versions of the docs, or the archive banner | [Versions](/docs/customize/versions/) |
| Tags and categories | [Taxonomies](/docs/customize/taxonomy/) |
| "Edit this page", last-modified dates and contributors | [Repository links and page info](/docs/customize/repository/) |
| Printing a page or a whole chapter | [Print](/docs/customize/print/) |
| What AI agents read: `llms.txt` and per-page `.md` files | [AI-agent support](/docs/customize/agents/) |
| Any parameter's type and default | [Configuration](/docs/customize/config/) |
| Comments, analytics or the deployment target, which need an outside service | [Operations](/docs/admin/) |
