# Components

> Every component available for writing, ordered by how often you reach for it.

---

LLMS index: [llms.txt](/llms.txt)

---

OINK's components fall into two groups: **the writing primitives you use every
day**, and **the larger components you need for specific situations**.

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

## Shared contract {#shared-contract}

- Standard shortcode notation `{{< … >}}`.
- Nested names (`filetree/folder`, `gallery/image`, `field`) are valid only
  inside their parent.
- An invalid parameter **fails the build** with its source position; strict
  failure beats silent degradation.
- Only Fields descriptions accept Markdown; every other public string parameter
  is plain text.
- A page that does not use a component never receives its runtime.

---

Section pages:

- [Code blocks and Code Groups](/docs/components/code-blocks/): Add filenames, exact Copy behavior, wrapping, collapse, and shareable groups to Hugo code examples.
- [Badge](/docs/components/badge/): Add compact, semantic status labels without custom colors or JavaScript.
- [Kbd](/docs/components/kbd/): Write keyboard shortcuts as accessible, static key sequences.
- [Fields and Field](/docs/components/fields/): Describe configuration, parameters, properties, and response fields with responsive semantic HTML.
- [FileTree](/docs/components/filetree/): Present repository and directory structures as semantic, progressively disclosed lists.
- [Gallery](/docs/components/gallery/): Arrange related images in a responsive static grid that can reuse Image Zoom.
- [Image Zoom](/docs/components/image-zoom/): Let readers inspect meaningful standalone images with an optional native dialog.
- [Shortcodes](/docs/components/layout/): Use OINK's local-first content components safely and accessibly.
- [Diagrams and formulae](/docs/components/diagrams/): Add local diagrams, mind maps, and scientific formulae to a page.
- [Apache ECharts](/docs/components/echarts/): Build responsive, local-first charts from structured JSON or YAML.
- [Infographics with AntV](/docs/components/infographic/): Turn concise declarative data into local SVG infographics.
