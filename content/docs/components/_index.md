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

Most components are **Markdown-native**: an ordinary block plus a marker such as
`{.steps}` or an attribute line such as `{tab="npm"}`, readable on GitHub and in
any Markdown editor. Shortcodes remain only where a plain block cannot express
the content. All of them follow one contract: semantic HTML, no JavaScript for
the non-interactive ones, a defined presentation in print and Markdown output,
and a failed build rather than silent degradation when a parameter is invalid.

## Everyday writing {#everyday}

| Component                            | Form                                        | Purpose                                             | Needs JS           |
| ------------------------------------ | ------------------------------------------- | --------------------------------------------------- | ------------------ |
| [Callouts](layout/#callouts)         | `> [!TYPE] title` blockquote                | Notes, tips, warnings, foldable details             | No                 |
| [Code blocks and tabs](code-blocks/) | fence attributes `{title= copy= tab=}`      | Filenames, copy, collapse, synchronized tabs        | On pages with code |
| [Badge](badge/)                      | `{{</* badge */>}}`                         | Status labels such as Beta or Deprecated            | No                 |
| [Kbd](kbd/)                          | `{{</* kbd */>}}` or raw `<kbd>`            | Keyboard shortcuts                                  | No                 |
| [Fields](fields/)                    | table + `{.fields}` or `{{</* fields */>}}` | Configuration, parameter, and response descriptions | No                 |
| [Tables](tables/)                    | `{.matrix}` `{caption=}` `{.full-width}` …  | Matrices, captions, numbered and tabbed tables      | Only tabbed tables |
| [FileTree](filetree/)                | ` ```filetree ` fence                       | Directory structures                                | No                 |

## Media {#media}

| Component                            | Form                                              | Purpose                           | Needs JS                |
| ------------------------------------ | ------------------------------------------------- | --------------------------------- | ----------------------- |
| [Images and Image Zoom](image-zoom/) | `![alt](src)` + `{caption= command= options= link=}` | Figures, processed previews, zoom | Per page when enabled   |
| [Gallery](gallery/)                  | ```` ```gallery ```` fence                        | A grid of related images          | Reuses the zoom runtime |

## Layout and structure {#layout}

| Component                                   | Form                                                                                      | Purpose                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Callouts, tabs, steps, and cards](layout/) | `{.steps}` `{.cards}` lists, `{{</* tabs */>}}`, `{{</* cards */>}}`, `{{%/* steps */%}}` | Tabbed panes, step sequences, card grids, includes |

## Diagrams and visualization {#visualization}

| Component                          | Form                                         | Purpose                           | Runtime  |
| ---------------------------------- | -------------------------------------------- | --------------------------------- | -------- |
| [Diagrams and formulae](diagrams/) | `mermaid` `math` `markmap` `plantuml` fences | Mermaid, KaTeX, Markmap, PlantUML | Per page |
| [ECharts](echarts/)                | `echarts` fence                              | Interactive data charts           | Per page |
| [Infographic](infographic/)        | `infographic` fence                          | Process and information graphics  | Per page |

## Scenario workflows {#scenario-workflows}

| Scenario                                         | Coordinated capabilities                               |
| ------------------------------------------------ | ------------------------------------------------------ |
| [Sequential reading](../scenarios/reading/)      | Pager order, head relations, local mathematics         |
| [Releases and downloads](../scenarios/releases/) | Facts, `checksums` fences, rolling and pinned channels |
| [Landing pages](../scenarios/landing/)           | Full-width shell, local data, 21 reusable sections     |
| [Book publishing](../scenarios/book/)            | Numbered media, xrefs, indexes, whole-Book print       |

These scenarios compose several primitives with navigation, data, and output
rules. Their pages are the authoritative adoption guides; do not infer a
scenario contract from one shortcode example alone.

## Shared contract {#shared-contract}

- Native forms use Goldmark block attributes on the line right after the block
  (`{.steps}`, `{tab="…"}`); the site enables `attribute.block` and
  `renderer.unsafe`.
- `{{%/* steps */%}}` is the only `{{%/* */%}}` shortcode; every other shortcode
  uses `{{</* … */>}}` and renders its Markdown body itself. Nested names
  (`tab`, `card`, `field`) are valid only inside their parent.
- An invalid parameter or attribute **fails the build** with its source
  position; strict failure beats silent degradation. `style` and event handlers
  are never accepted; `class`, `data-*`, and `aria-*` pass through.
- Public string parameters (captions, labels, titles) are plain text; only
  Markdown _bodies_ (tab, card, field, image caption) are Markdown.
- A page that does not use a component never receives its runtime.
