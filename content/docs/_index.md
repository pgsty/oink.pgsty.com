---
# LLMSFULL publishes the whole section as llms-full.txt per language; front
# matter outputs replace the site list, so the ordinary formats repeat here.
outputs: [HTML, RSS, print, markdown, LLMSFULL]
title: OINK Documentation
linkTitle: Docs
description: Build a technical content site. Use shared navigation, multilingual support, and search for documentation, blogs, books, and API references.
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

For a new OINK site, [Start with the Starter](/docs/start/). Preview the working site,
then replace its sample content. Write in Markdown and build with Hugo Extended
with its built-in Sass compiler. Hugo Modules also require Go to resolve the theme. Bundled theme assets require
no CDN or npm build step.

The current release is {{% param version %}}. See the
[1.4.0 release notes](/blog/release/1.4.0/) or the
[upgrade guide](/docs/admin/upgrade/#preparing-1-4) for an existing site.

## Five ways in {#five-entries}

- [Get started](/docs/start/) — Create an OINK Starter repository. Verify the local site, customize one part at a time, then deploy it.
- [Components](/docs/components/) — Each component has one page. The source appears first, followed by the rendered result.
- [Write Beautiful Docs](/book/) — Follow a six-chapter hands-on walkthrough from cloning the Starter to publishing a polished bilingual site.
- [Case studies](/case/) — Learn reusable design and migration patterns from production sites.
- [Design and development](/docs/design/) — Read contracts, accepted decisions, research evidence, and active proposals for OINK maintainers.
  {.cards}

## Find it by task {#where-to-go}

| What you want to do                                   | Where to go                                    |
| ----------------------------------------------------- | ---------------------------------------------- |
| Decide whether it fits                                | [What is OINK](/docs/about/)                   |
| Install and preview                                   | [Get started](/docs/start/)                    |
| Write a documentation page                            | [Writing pages](/docs/write/pages/)            |
| Turn a directory tree into a sidebar                  | [Organizing content](/docs/write/organize/)    |
| Look up a component's syntax                          | [Components](/docs/components/)                |
| Build an image album or browse the live gallery       | [Expo albums](/docs/write/expo/) · [Live Expo](/expo/) |
| Change the name, logo, colors, and fonts              | [Brand and appearance](/docs/customize/brand/) |
| Look up a configuration key's default                 | [Configuration](/docs/customize/config/)       |
| Run a bilingual or multilingual site                  | [Languages](/docs/customize/i18n/)             |
| Practice building and writing                         | [Write Beautiful Docs](/book/)                 |
| Study a production implementation                     | [Case studies](/case/)                         |
| Deploy                                                | [Deploy](/docs/admin/deploy/)                  |
| Upgrade, or migrate from Docsy                        | [Upgrade](/docs/admin/upgrade/)                |
| Maintain the theme, review a contract, or write a PRD | [Design and development](/docs/design/)        |

The first six sections in the sidebar (**Introduction**, **Get started**,
**Authoring**, **Components**, **Customization**, and **Operations**) are for
site authors and operators. **Design** and **CLI** at the bottom are reference
material for OINK theme contributors.
