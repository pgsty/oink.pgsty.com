---
title: Scenario components
linkTitle: Scenarios
weight: 45
icon: fa-solid fa-layer-group
description: >-
  Configure complete reading, release, landing-page, and Book publishing
  workflows from local content and data.
search_keywords:
  [scenario components, pager, releases, downloads, landing, book]
cascade:
  categories: [Scenarios]
---

Scenario Components solve a complete publishing job rather than one fragment of
a page. Each scenario coordinates content, local data, navigation, runtime
loading, accessibility, and non-HTML output behind one strict contract.

They complement the [component reference](/docs/components/): use that chapter
to look up an individual writing primitive, and use this chapter when the job
spans multiple pages, files, or output formats.

## Choose a scenario {#choose-a-scenario}

| Scenario                            | Use it when you need                                      | Primary source of truth                |
| ----------------------------------- | --------------------------------------------------------- | -------------------------------------- |
| [Sequential reading](reading/)      | A manual, Book, or blog should have a dependable sequence | Sidebar/content tree and page metadata |
| [Releases and downloads](releases/) | Release facts, assets, and install paths must agree       | Front matter and `data/download/`      |
| [Landing pages](landing/)           | A product page needs reusable full-width sections         | `data/landing/` or inline section data |
| [Book publishing](book/)            | Long-form work needs numbering, citations, and print      | Existing Book tree and stable page IDs |

## Shared guarantees {#shared-guarantees}

- **Local facts:** normal builds do not fetch release state, stars, prices,
  screenshots, avatars, or other mutable facts from remote APIs.
- **Static first:** HTML contains the complete content before progressive
  enhancement; a page receives JavaScript only for the capabilities it uses.
- **Strict input:** malformed parameters, identifiers, URLs, checksums, or data
  records fail the build with a useful source position.
- **Output aware:** HTML, print, Markdown, and RSS either receive a defined
  representation or deliberately omit interaction-only content.
- **One navigation authority:** the visible content tree also drives pagers,
  Book tables of contents, and aggregate print order.
- **Language safe:** shared facts use documented suffix fallback, while
  narrative data may be maintained per language.

## Before adoption {#before-adoption}

Pin the minimum release that owns these contracts:

```go
require github.com/pgsty/oink v0.4.0
```

Use Hugo Extended 0.160.1 or newer. Adopt one scenario at a time, build every
configured output, and inspect the result in each language. A local build, a
public theme tag, a site version pin, and a hosted deployment are separate
evidence gates; do not infer one from another.

For an existing Oink site, start with the
[0.4.0 upgrade guide](/docs/upgrade/v0-4/).
