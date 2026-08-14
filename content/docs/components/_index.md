---
title: Components
linkTitle: Components
weight: 40
icon: fa-solid fa-cubes
description:
  Every component available for writing, ordered by how often you reach for it.
cascade:
  categories: [Components]
---

OINK's components fall into two groups: **the writing primitives you use every
day**, and **the larger components you need for specific situations**. Complete
multi-page publishing workflows live under
[Scenario components](/docs/scenarios/).

They all follow one contract: semantic HTML, no JavaScript for the
non-interactive ones, a defined presentation in print and Markdown output, and a
failed build rather than silent degradation when a parameter is invalid.

## Everyday writing {#everyday}

| Component                              | Purpose                                             | Needs JS           |
| -------------------------------------- | --------------------------------------------------- | ------------------ |
| [Code blocks and groups](code-blocks/) | Filenames, copy, collapse, synchronized tabs        | On pages with code |
| [Badge](badge/)                        | Status labels such as Beta or Deprecated            | No                 |
| [Kbd](kbd/)                            | Keyboard shortcuts                                  | No                 |
| [Fields](fields/)                      | Configuration, parameter, and response descriptions | No                 |
| [FileTree](filetree/)                  | Directory structures                                | No                 |

## Media {#media}

| Component                 | Purpose                            | Needs JS                |
| ------------------------- | ---------------------------------- | ----------------------- |
| [Gallery](gallery/)       | A grid of related images           | Reuses the zoom runtime |
| [Image zoom](image-zoom/) | Enlarging screenshots and diagrams | Per page when enabled   |

## Layout and structure {#layout}

| Component                               | Purpose                                            |
| --------------------------------------- | -------------------------------------------------- |
| [Tabs, cards, steps, and more](layout/) | Tabbed panes, cards, steps, disclosures, carousels |

## Diagrams and visualization {#visualization}

| Component                          | Purpose                           | Runtime  |
| ---------------------------------- | --------------------------------- | -------- |
| [Diagrams and formulae](diagrams/) | Mermaid, KaTeX, Markmap, PlantUML | Per page |
| [ECharts](echarts/)                | Interactive data charts           | Per page |
| [Infographic](infographic/)        | Process and information graphics  | Per page |

## Scenario workflows {#scenario-workflows}

| Scenario                                         | Coordinated capabilities                           |
| ------------------------------------------------ | -------------------------------------------------- |
| [Sequential reading](../scenarios/reading/)      | Pager order, head relations, local mathematics     |
| [Releases and downloads](../scenarios/releases/) | Facts, checksums, rolling and pinned channels      |
| [Landing pages](../scenarios/landing/)           | Full-width shell, local data, 21 reusable sections |
| [Book publishing](../scenarios/book/)            | Numbered media, xrefs, indexes, whole-Book print   |

These scenarios compose several primitives with navigation, data, and output
rules. Their pages are the authoritative adoption guides; do not infer a
scenario contract from one shortcode example alone.

## Shared contract {#shared-contract}

- Standard shortcode notation `{{</* … */>}}`.
- Nested names (`filetree/folder`, `gallery/image`, `field`) are valid only
  inside their parent.
- An invalid parameter **fails the build** with its source position; strict
  failure beats silent degradation.
- Only Fields descriptions accept Markdown; every other public string parameter
  is plain text.
- A page that does not use a component never receives its runtime.
