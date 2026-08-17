# Components

> Every component available for writing, ordered by how often you reach for it.

---

LLMS index: [llms.txt](/llms.txt)

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
| [Badge](badge/)                      | `{{< badge >}}`                         | Status labels such as Beta or Deprecated            | No                 |
| [Kbd](kbd/)                          | `{{< kbd >}}` or raw `<kbd>`            | Keyboard shortcuts                                  | No                 |
| [Fields](fields/)                    | table + `{.fields}` or `{{< fields >}}` | Configuration, parameter, and response descriptions | No                 |
| [Tables](tables/)                    | `{.matrix}` `{caption=}` `{.full-width}` …  | Matrices, captions, numbered and tabbed tables      | Only tabbed tables |
| [FileTree](filetree/)                | ` ```filetree ` fence                       | Directory structures                                | No                 |

## Media {#media}

| Component                            | Form                                              | Purpose                           | Needs JS                |
| ------------------------------------ | ------------------------------------------------- | --------------------------------- | ----------------------- |
| [Images and Image Zoom](image-zoom/) | `![alt](src)` + `{caption=}`, `{{< image >}}` | Figures, processed previews, zoom | Per page when enabled   |
| [Gallery](gallery/)                  | image list + `{.gallery}`                         | A grid of related images          | Reuses the zoom runtime |

## Layout and structure {#layout}

| Component                                   | Form                                                                                      | Purpose                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Callouts, tabs, steps, and cards](layout/) | `{.steps}` `{.cards}` lists, `{{< tabs >}}`, `{{< cards >}}`, `{{% steps %}}` | Tabbed panes, step sequences, card grids, includes |

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
- `{{% steps %}}` is the only `{{% %}}` shortcode; every other shortcode
  uses `{{< … >}}` and renders its Markdown body itself. Nested names
  (`tab`, `card`, `field`) are valid only inside their parent.
- An invalid parameter or attribute **fails the build** with its source
  position; strict failure beats silent degradation. `style` and event handlers
  are never accepted; `class`, `data-*`, and `aria-*` pass through.
- Public string parameters (captions, labels, titles) are plain text; only
  Markdown _bodies_ (tab, card, field, image caption) are Markdown.
- A page that does not use a component never receives its runtime.

---

Section pages:

- [Code blocks and tabs](/docs/components/code-blocks/): Add titles, exact Copy behavior, wrapping, collapse, and shareable tab sets to Hugo code examples.
- [Badge](/docs/components/badge/): Add compact, semantic status labels without custom colors or JavaScript.
- [Kbd](/docs/components/kbd/): Write keyboard shortcuts as accessible, static key sequences.
- [Fields and Field](/docs/components/fields/): Describe configuration, parameters, properties, and response fields with responsive semantic HTML.
- [Tables](/docs/components/tables/): Choose a table kind — reference list, compatibility matrix, captioned, numbered, tabbed, or full-width — with one attribute line under a normal Markdown table.
- [FileTree](/docs/components/filetree/): Present annotated repository and directory structures with a `filetree` code fence: aligned comments, per-entry icons, and collapsible directories.
- [Gallery](/docs/components/gallery/): Arrange related images in a responsive static grid that can reuse Image Zoom.
- [Images and Image Zoom](/docs/components/image-zoom/): Write ordinary Markdown images, add figure captions and processed previews, and let readers inspect them in a native dialog.
- [Callouts, tabs, steps, and cards](/docs/components/layout/): Structure a page with Markdown-native callouts, tabs, steps, cards, and the small set of remaining shortcodes.
- [Diagrams and formulae](/docs/components/diagrams/): Add local diagrams, mind maps, and scientific formulae to a page.
- [Apache ECharts](/docs/components/echarts/): Build responsive, local-first charts from an echarts fence with structured JSON or YAML.
- [Infographics with AntV](/docs/components/infographic/): Turn concise declarative data in an infographic fence into local SVG infographics.
