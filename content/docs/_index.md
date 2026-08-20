---
title: OINK Documentation
linkTitle: Docs
description: OINK is a documentation theme that needs nothing but Hugo Extended — components are written in Markdown, assets ship with the theme, both languages work out of the box, and one source produces four outputs.
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
navbar_enabled: true
navbar_autohide: true
cascade:
  type: docs
  navbar_enabled: false
  footer_style: slim
  comments: true
  feedback: false
  search_boost: 1.35
---

OINK is a Hugo theme for technical documentation. Components are part of the
Markdown syntax rather than a second template language; the fonts, icons,
search and diagram runtimes the browser needs ship with the theme; the only
build dependency is one Hugo Extended binary, with no Node.js and no CDN
request. The current release is {{% param version %}}.

## Five ways in {#five-entries}

- [Quick start](/docs/start/) — install Hugo, clone this site, replace the site details, deploy.
- [Components](/docs/components/) — one page per component, source first and rendered result after it.
- [Write Beautiful Docs](/book/) — a hands-on tutorial from first preview to a maintained publication.
- [Case studies](/case/) — production sites explained as reusable design and migration patterns.
- [Design and development](/docs/design/) — contracts, accepted decisions, research evidence, and active proposals for OINK maintainers.
  {.cards}

## Find it by task {#where-to-go}

| What you want to do                                   | Where to go                                    |
| ----------------------------------------------------- | ---------------------------------------------- |
| Decide whether it fits                                | [What is OINK](/docs/about/)                   |
| Install and preview                                   | [Quick start](/docs/start/)                    |
| Write a documentation page                            | [Writing pages](/docs/write/pages/)            |
| Turn a directory tree into a sidebar                  | [Organizing content](/docs/write/organize/)    |
| Look up a component's syntax                          | [Components](/docs/components/)                |
| Change the name, logo, colours and fonts              | [Brand and appearance](/docs/customize/brand/) |
| Look up a configuration key's default                 | [Configuration](/docs/customize/config/)       |
| Run a bilingual or multilingual site                  | [Languages](/docs/customize/i18n/)             |
| Learn OINK end to end                                 | [Write Beautiful Docs](/book/)                 |
| Study a production implementation                     | [Case studies](/case/)                         |
| Deploy                                                | [Deploy](/docs/admin/deploy/)                  |
| Upgrade, or migrate from Docsy                        | [Upgrade](/docs/admin/upgrade/)                |
| Maintain the theme, review a contract, or write a PRD | [Design and development](/docs/design/)        |

The seven Docs sections are ordered the way they are read: understand, install,
write content, look up components, adjust the site, run the release, then study
or maintain the contracts and design records behind it.
