---
title: Landing pages
linkTitle: Landing pages
weight: 30
description: >-
  Compose reusable, full-width product pages from local, language-aware data and
  Oink's validated section registry.
search_keywords:
  [landing page, sections, pricing, timeline, case study, bar chart]
---

A Landing page is a regular Hugo content page with a full-width scenario shell.
It keeps the site navbar, Command Palette, and configured footer, but removes
the docs sidebar and table-of-contents rail. Content remains local and
server-rendered; no frontend build or remote fact API is required.

The homepage continues to use `data/home/<lang>.yaml`, but now shares the same
renderer and section contracts.

## Create a Landing page {#create-a-landing-page}

Create a regular content file and name its local data key:

```yaml
---
title: Pricing
layout: landing
landing: pricing
outputs: [HTML, print, markdown]
---
```

Put the English and Chinese narrative data in separate files:

```text
data/
└── landing/
    └── pricing/
        ├── en.yaml
        └── zh.yaml
```

A non-home page resolves data in this order:

1. `sections` written directly in page front matter;
2. `data/landing/<key>/<exact-language>.yaml`;
3. the exact-language entry in `data/landing/<key>.yaml`;
4. the English or unsuffixed local record.

Use per-language files for narrative content. Shared fact fields may use an
exact language suffix, then a primary-language suffix, then an unsuffixed
fallback; language tags normalize `-` to `_`. For example, `title_zh_cn`
precedes `title_zh`, which precedes `title`. camelCase suffix aliases are not
accepted.

## Compose sections {#compose-sections}

Each `sections` entry is either a type string or a map. A map may set `type`,
read a differently named `key`, supply a stable `id`, disable itself with
`enabled: false`, or carry one-off inline `data`:

```yaml
sections:
  - type: hero
    data:
      eyebrow: Local-first documentation
      title: Publish a product page with Hugo
      lead: Complete server-rendered content, enhanced only when needed.
      actions:
        - { label: Read the docs, url: /docs/, style: primary }
  - type: metrics
    key: project-facts
  - type: command-box
    data:
      title: Install
      code: hugo mod get github.com/pgsty/oink@v0.4.0
      lang: bash
  - type: download
    data:
      title: Download
      keys: [product]
  - cta

project-facts:
  title: Local facts
  items:
    - { value: 21, label: Section types }
    - { value: 0, label: Runtime fact requests }
```

Use canonical hyphenated type names. Underscores in existing homepage data are
normalized for compatibility. Unknown types warn instead of silently
disappearing. A deliberate site-owned `partial` remains an escape hatch, but it
is a local template contract rather than portable Landing data.

## Section registry {#section-registry}

Oink 0.4.0 provides 21 canonical section types:

| Type              | Use it for                                                   |
| ----------------- | ------------------------------------------------------------ |
| `hero`            | Primary message, actions, and theme-aware artwork            |
| `metrics`         | Compact facts, numbers, links, and count-up enhancement      |
| `capabilities`    | Alternating feature narratives and specialist visual panels  |
| `principles`      | Numbered product or operating principles                     |
| `cards`           | Generic feature, benefit, service, or path collections       |
| `logo-wall`       | Tools or partners in a grid or CSS-only marquee              |
| `gallery`         | Screenshots or icon-led examples                             |
| `testimonials`    | Quotations with optional attribution                         |
| `contributors`    | People, roles, avatars, and profile links                    |
| `faq`             | Native disclosures or a static flat question list            |
| `markdown`        | Free-form prose                                              |
| `cta`             | One final action or a compact action group                   |
| `pricing`         | Product tiers, prices, features, and calls to action         |
| `pricing-compare` | Feature comparison matrices across pricing tiers             |
| `command-box`     | A focused copyable command and optional note                 |
| `steps`           | Ordered procedures with optional command examples            |
| `timeline`        | Dated milestones, roadmaps, and release histories            |
| `code-plate`      | Chroma code or validated line arrays in a presentation panel |
| `case-study`      | Evidence-led stories with metrics, quotation, and source     |
| `download`        | One or more validated `data/download/` records               |
| `bar-chart`       | Comparable non-negative values normalized without chart JS   |

The existing
[homepage configuration](/docs/configure/overview/#homepage-and-footer)
documents the shared collection and Hero fields. For the nine scenario-oriented
types, begin from a small entry and let strict validation identify a missing or
invalid field. The Oink repository's
[`exampleSite` data](https://github.com/pgsty/oink/blob/v0.4.0/exampleSite/data/landing/demo/en.yaml)
is the complete executable reference.

## Keep facts local {#local-facts}

Pricing, stars, screenshots, avatars, quotes, and download state must exist
before Hugo starts. Refresh them in a site-owned maintenance or CI job, review
the diff, then commit or generate local data. Do not add browser fetches to a
section.

Optional local chrome facts are also strict:

```yaml
params:
  offlineSearch: true
  ui:
    landing_search: true
    github_stars: 2189
    alt_site:
      label: 中文站
      url: https://example.cn/
```

`landing_search` must be a boolean and only exposes the existing local Command
Palette when `offlineSearch` is also enabled. `github_stars` is a committed
string or number, not a GitHub API request. `alt_site` requires a label and an
absolute HTTP(S) URL.

## Progressive enhancement and accessibility {#progressive-enhancement}

HTML sets one page flag and conditionally loads `landing.js`. That runtime
enhances reveal, count-up, copy, theme-image, and compact-menu behavior; the
server-rendered document remains complete with JavaScript disabled.

Marquee duplication is CSS-only. The duplicate track is hidden from assistive
technology and interaction, and a localized checkbox pauses motion without
JavaScript. Reduced-motion preferences disable movement and reveal transitions;
forced-colors mode preserves controls and state distinctions. The compact menu
uses real links and buttons, traps no focus, and does not duplicate the desktop
navigation tree.

## Output and validation {#validation}

| Output   | Contract                                                           |
| -------- | ------------------------------------------------------------------ |
| HTML     | Complete static content, then conditional progressive enhancement  |
| Print    | Content retained; motion surfaces become static; controls removed  |
| Markdown | Headings, prose, lists, tables, and code without component classes |
| RSS      | Landing sections omitted                                           |

Before publication, test with JavaScript disabled, reduced motion, forced
colors, keyboard-only input, both color modes, each language, and a subpath base
URL. Confirm every internal link and asset retains the deployment prefix. The
inherited Docsy block shortcodes remain compatible, but use Landing data for new
pages rather than adding another custom HTML layer.
