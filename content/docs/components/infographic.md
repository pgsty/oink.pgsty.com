---
title: Infographic
linkTitle: Infographic
description: Use an `infographic` fence and AntV template to display a title and items as a flow, timeline, funnel, grid, or hierarchy.
weight: 160
search_keywords: [Infographic, AntV, flow, timeline, funnel, template]
---

An `infographic` fence selects an AntV template to display a title and item list.
Use it for order, hierarchy, or comparison. Use [ECharts](/docs/components/echarts/) for axes and precise numbers.
Use [Mermaid](/docs/components/mermaid/) for flows with conditional branches.
The fence contains data and stays readable as text on GitHub.

## Shortest form {#minimal}

Start with `infographic <template>`, then add a `data` block. `title` sets the title.
Every entry under `items` needs at least a `label`.

````markdown {title="Source"}
```infographic
infographic list-row-simple-horizontal-arrow
data
  title Three steps in one documentation change
  items
    - label Write
      desc Start with the source language
    - label Check
      desc Zero build warnings, every example really rendered
    - label Ship
      desc Add the translated peer, open the PR
```
````

```infographic
infographic list-row-simple-horizontal-arrow
data
  title Three steps in one documentation change
  items
    - label Write
      desc Start with the source language
    - label Check
      desc Zero build warnings, every example really rendered
    - label Ship
      desc Add the translated peer, open the PR
```

Use two spaces per indentation level to define structure. Keep labels short and put explanations in `desc`.

## Timelines {#timeline}

The `sequence-timeline-*` family arranges items on a time axis. `label` gives the point in time, and `desc` gives the event.

````markdown {title="Source"}
```infographic {height="420px"}
infographic sequence-timeline-simple
data
  title The last five PostgreSQL major versions
  items
    - label 2021
      desc 14: another round of parallel query and logical replication work
    - label 2022
      desc 15: the MERGE statement
    - label 2023
      desc 16: logical replication from a standby
    - label 2024
      desc 17: incremental backup and JSON_TABLE
    - label 2025
      desc 18: the asynchronous IO subsystem
```
````

```infographic {height="420px"}
infographic sequence-timeline-simple
data
  title The last five PostgreSQL major versions
  items
    - label 2021
      desc 14: another round of parallel query and logical replication work
    - label 2022
      desc 15: the MERGE statement
    - label 2023
      desc 16: logical replication from a standby
    - label 2024
      desc 17: incremental backup and JSON_TABLE
    - label 2025
      desc 18: the asynchronous IO subsystem
```

## Funnels {#funnel}

`sequence-funnel-simple` displays narrowing stages.
This example shows the theme's five release states. They are not interchangeable. Only the last state is live.

````markdown {title="Source"}
```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title The five states a theme release passes through
  items
    - label Source complete
      desc The code is written, and that is all
    - label Validated
      desc Theme checks and the site suite are green
    - label Published
      desc An immutable signed tag, resolvable through the Go proxy
    - label Documented
      desc The documentation site pins that tag
    - label Deployed
      desc Production runs this version
```
````

```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title The five states a theme release passes through
  items
    - label Source complete
      desc The code is written, and that is all
    - label Validated
      desc Theme checks and the site suite are green
    - label Published
      desc An immutable signed tag, resolvable through the Go proxy
    - label Documented
      desc The documentation site pins that tag
    - label Deployed
      desc Production runs this version
```

## Grid cards {#grid}

For unordered items, `list-grid-*` uses a grid instead of a sequence.

````markdown {title="Source"}
```infographic {height="380px"}
infographic list-grid-compact-card
data
  title One page, four outputs
  desc Every content component has to produce something usable in all four
  items
    - label HTML
      desc Interactive, runtimes loaded on demand
    - label Print
      desc Disclosures expanded, zoom and copy removed
    - label Markdown
      desc Plain text, compared byte for byte against goldens
    - label RSS
      desc Static, from the same source as print
```
````

```infographic {height="380px"}
infographic list-grid-compact-card
data
  title One page, four outputs
  desc Every content component has to produce something usable in all four
  items
    - label HTML
      desc Interactive, runtimes loaded on demand
    - label Print
      desc Disclosures expanded, zoom and copy removed
    - label Markdown
      desc Plain text, compared byte for byte against goldens
    - label RSS
      desc Static, from the same source as print
```

## Items with values {#values}

Add `value` to an item for templates that show proportions, such as pies, doughnuts, or progress displays.

````markdown {title="Source"}
```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title How the 29 shortcodes break down
  items
    - label Core components
      value 14
    - label Book numbering and indexes
      value 10
    - label Releases and downloads
      value 3
    - label OpenAPI
      value 2
```
````

```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title How the 29 shortcodes break down
  items
    - label Core components
      value 14
    - label Book numbering and indexes
      value 10
    - label Releases and downloads
      value 3
    - label OpenAPI
      value 2
```

## Hierarchy and hand-drawn style {#hierarchy-and-theme}

Nest items with `children`. `hierarchy-mindmap-*` displays two levels of structure.
A top-level `theme` block sets the appearance. `type` accepts `light`, `dark`, or `hand-drawn`.

````markdown {title="Source"}
```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Theme repository
    children
      - label layouts
        desc templates
        children
          - label _markup
            desc render hooks
          - label _partials
            desc shell and helpers
      - label assets
        desc resources
        children
          - label scss
            desc tokens and component styles
          - label js
            desc browser runtimes
          - label third_party
            desc libraries shipped with the theme
```
````

```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Theme repository
    children
      - label layouts
        desc templates
        children
          - label _markup
            desc render hooks
          - label _partials
            desc shell and helpers
      - label assets
        desc resources
        children
          - label scss
            desc tokens and component styles
          - label js
            desc browser runtimes
          - label third_party
            desc libraries shipped with the theme
```

`theme` belongs to the DSL. In the development checkout, each diagram has its own
canvas: transparent default and hand-drawn diagrams use white, and an authored
background takes priority. A `type dark` diagram keeps its dark background even
on a light page. Site mode changes preserve the palette, text colors, and drawing
style without rerendering. Explicit transparency or custom text colors still
require checking contrast in both modes.

## Picking a template {#templates}

Template names use `structure-variant`. Each structure has several visual variants. Common families are listed below:

| Structure prefix | What it expresses | Example |
| --- | --- | --- |
| `list-row-*` `list-column-*` | Items in a row or a column | `list-row-simple-horizontal-arrow` |
| `list-grid-*` | A grid, no order between items | `list-grid-compact-card` `list-grid-badge-card` |
| `list-pyramid-*` `sequence-funnel-*` | Narrowing stages | `sequence-funnel-simple` |
| `sequence-timeline-*` `sequence-roadmap-vertical-*` | Timelines and roadmaps | `sequence-timeline-simple` |
| `sequence-steps-*` `sequence-snake-steps-*` | Ordered steps | `sequence-steps-simple` |
| `compare-binary-horizontal-*` `compare-quadrant-*` | Binary comparison and quadrants | `compare-binary-horizontal-simple-vs` |
| `hierarchy-mindmap-*` `hierarchy-structure-*` | Hierarchy, with `children` | `hierarchy-mindmap-level-gradient-compact-card` |
| `chart-pie-*` `chart-bar-*` `chart-column-*` | Illustrative charts, with `value` | `chart-pie-donut-plain-text` |
| `relation-network-*` `relation-dagre-flow` | Networks and flows, with `relations` | `relation-dagre-flow` |

Choose the simplest form that explains the relationship.
See the full [AntV Infographic](https://infographic.antv.vision/gallery) gallery. Template names match the version bundled with the theme.

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A canvas container inside `<div class="td-infographic">` plus the DSL; the local AntV runtime draws the SVG |
| Print | No diagram; the DSL source inside `<pre class="td-infographic-source">` |
| Markdown | The `infographic` fence and its DSL, kept as written |
| RSS | Same as print — source only |

Explain the diagram's information in prose. Print and RSS include only the DSL source.

## Parameter reference {#reference}

The fence attribute line (```` ```infographic {…} ````):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `auto` or a CSS length | `auto` | A non-negative number plus `px` `rem` `em` `vh` `vw` `%`; anything else warns and uses `auto` |
| `full` | bool | `false` | `true` drops the reading-column limit |
| `class` | space-separated classes | — | Passed through to the container |
{.fields meta="type default"}

`style`, `on*`, and unknown attributes warn and are ignored. Empty DSL bodies warn and render nothing.
Review the warning and rendered fallback before publication.

AntV defines these top-level DSL keys:

| Key | Description |
| --- | --- |
| `infographic` / `template` | The template name, on the first line |
| `data` | `title`, `desc`, `items` (or `sequences`, `compares`, `nodes`, `values`, `relations`, `root`, depending on the structure), `order` |
| `theme` | `type` (`light` / `dark` / `hand-drawn`), `palette`, `colorPrimary`, `stylize` … |
| `width` / `height` | Canvas size at the DSL level; usually left to the fence's `height` |
| `design` | Per-part tuning; rarely needed |
{.fields}

Each entry under `items` accepts `label`, `desc`, `value`, `icon`, `children`,
`group` and `id`. The DSL is defined by the
[AntV Infographic documentation](https://infographic.antv.vision/learn); the
version shipped with the theme and its checksum are recorded in the theme's
`VENDOR.json`.

## Limits {#limits}

- Incorrect template names do not fail the build. Hugo checks only fence attributes; the browser runtime parses the DSL.
  Missing templates display error text in the container. Check the page after changing template names.
- `theme` is part of the DSL and does not follow the site's color scheme. Check contrast in both modes.
- Print and RSS include only the DSL. State conclusions in prose.
- SVG does not provide semantic structure. Screen reader order can differ from visual order.
  Prefer headings, lists, or tables when they can express the information.
- Keep labels short. Narrow screens can truncate or compress long text. Check at phone width after editing.

## Related {#related}

- [ECharts](/docs/components/echarts/) — when you need axes and exact numbers
- [Steps](/docs/components/steps/) — when the reader has to follow the procedure
- [Cards](/docs/components/cards/) — a grid of clickable entry points
- [Mermaid](/docs/components/mermaid/) — flows with branches and conditions
