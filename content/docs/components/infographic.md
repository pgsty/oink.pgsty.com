---
title: Infographic
linkTitle: Infographic
description: Turn a title and a short list of items into a flow, timeline, funnel, grid or hierarchy graphic with an `infographic` fence and an AntV template.
weight: 160
search_keywords: [Infographic, AntV, flow, timeline, funnel, template]
---

An infographic turns a short list into a picture of its structure: three
steps in a row, five years on a timeline, stages that narrow like a funnel, a
two-level hierarchy. You write the title and the items as plain data in an
`infographic` fence, name one of the AntV templates on the first line, and the
browser draws it; on GitHub the fence stays readable as text.

Reach for an infographic when the shape of the information is the message.
When readers need axes and exact numbers, use [ECharts](/docs/components/echarts/);
for a flow with conditions and branches, use [Mermaid](/docs/components/mermaid/).

## Shortest form {#minimal}

The first line is `infographic <template>`, followed by a `data` block with a
`title` and an `items` list in which every item has at least a `label`.

````markdown {title="Source"}
```infographic
infographic list-row-simple-horizontal-arrow
data
  title Upgrading to a new PostgreSQL major version
  items
    - label Back up
      desc Take a base backup and prove it restores
    - label Upgrade
      desc Run pg_upgrade on a replica first
    - label Switch over
      desc Promote the upgraded node, retire the old one
```
````

```infographic
infographic list-row-simple-horizontal-arrow
data
  title Upgrading to a new PostgreSQL major version
  items
    - label Back up
      desc Take a base backup and prove it restores
    - label Upgrade
      desc Run pg_upgrade on a replica first
    - label Switch over
      desc Promote the upgraded node, retire the old one
```

Indentation defines the structure, two spaces per level. Keep labels to a word
or two and put the explanation in `desc`, because long labels get squeezed or
cut off on a phone.

## Timelines {#timeline}

The `sequence-timeline-*` templates place items along a time axis: `label` is
the point in time and `desc` the event.

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

`sequence-funnel-simple` draws stages that narrow, such as the path from a
first visit to production use.

````markdown {title="Source"}
```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title From first visit to production
  items
    - label Visited
      desc Landed on any page of the site
    - label Read Get started
      desc Opened the tutorial
    - label Installed
      desc Ran the installer on a test machine
    - label First cluster
      desc Created a cluster and connected to it
    - label In production
      desc Serves real traffic
```
````

```infographic {height="420px"}
infographic sequence-funnel-simple
data
  title From first visit to production
  items
    - label Visited
      desc Landed on any page of the site
    - label Read Get started
      desc Opened the tutorial
    - label Installed
      desc Ran the installer on a test machine
    - label First cluster
      desc Created a cluster and connected to it
    - label In production
      desc Serves real traffic
```

## Grid cards {#grid}

When the items have no order, `list-grid-*` lays them out as a grid of cards
instead of a sequence. A `desc` under `data` adds a subtitle.

````markdown {title="Source"}
```infographic {height="380px"}
infographic list-grid-compact-card
data
  title Four ways to install
  desc Pick the one that matches how you already run servers
  items
    - label Packages
      desc RPM and DEB from the project repository
    - label Containers
      desc One image per major version
    - label Ansible
      desc Playbooks that build whole clusters
    - label Source
      desc Build with your own flags
```
````

```infographic {height="380px"}
infographic list-grid-compact-card
data
  title Four ways to install
  desc Pick the one that matches how you already run servers
  items
    - label Packages
      desc RPM and DEB from the project repository
    - label Containers
      desc One image per major version
    - label Ansible
      desc Playbooks that build whole clusters
    - label Source
      desc Build with your own flags
```

## Items with values {#values}

Templates that show proportions, such as pies, doughnuts and progress
displays, read a `value` on each item.

````markdown {title="Source"}
```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title Where a 200 GB database's disk goes
  items
    - label Tables
      value 120
    - label Indexes
      value 50
    - label WAL
      value 20
    - label Temporary files
      value 10
```
````

```infographic {height="400px"}
infographic chart-pie-donut-plain-text
data
  title Where a 200 GB database's disk goes
  items
    - label Tables
      value 120
    - label Indexes
      value 50
    - label WAL
      value 20
    - label Temporary files
      value 10
```

## Hierarchy and hand-drawn style {#hierarchy-and-theme}

Nest items with `children`, and a `hierarchy-mindmap-*` template draws two
levels of structure. A top-level `theme` block changes the look of the whole
graphic; its `type` is `light`, `dark` or `hand-drawn`.

````markdown {title="Source"}
```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Hugo site
    children
      - label content
        desc pages
        children
          - label docs
            desc documentation
          - label blog
            desc articles
      - label assets
        desc build inputs
        children
          - label css
            desc site styles
          - label images
            desc processed images
          - label parts
            desc shared fragments
```
````

```infographic {height="320px"}
infographic hierarchy-mindmap-level-gradient-compact-card
theme
  type hand-drawn
data
  root
    label Hugo site
    children
      - label content
        desc pages
        children
          - label docs
            desc documentation
          - label blog
            desc articles
      - label assets
        desc build inputs
        children
          - label css
            desc site styles
          - label images
            desc processed images
          - label parts
            desc shared fragments
```

Each graphic sits on its own canvas, which does not follow the site's light or
dark mode. The default and hand-drawn styles use a white canvas, a background
you set in the DSL wins, and a `type dark` graphic stays dark even on a light
page. Switching the site's mode leaves the graphic exactly as drawn, so if you
set a transparent background or your own text colors, check the contrast in
both modes.

## Picking a template {#templates}

Template names read `structure-variant`, and each structure comes in several
visual variants. The common families:

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

Pick the simplest form that shows the relationship. The
[AntV Infographic gallery](https://infographic.antv.vision/gallery) shows every
template; the names match the version bundled with the theme.

## Output {#outputs}

On the web the theme's bundled AntV runtime draws the graphic as SVG when the
reader scrolls near it, so a page with several graphics stays fast. Print and
RSS draw nothing and show the DSL source in a `<pre>` block instead, so state
the conclusion in the surrounding prose; the page's Markdown output keeps the
fence as written.

## Parameter reference {#reference}

The fence attribute line (```` ```infographic {…} ````):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | `auto` or a CSS length | `auto` | A non-negative number plus `px` `rem` `em` `vh` `vw` `%`; anything else warns and uses `auto` |
| `full` | bool | `false` | `true` drops the reading-column limit |
| `class` | space-separated classes | — | Passed through to the container |
{.fields meta="type default"}

`style`, `on*` and unknown attributes warn and are ignored. An empty fence
warns and renders nothing.

The top-level DSL keys, defined by AntV:

| Key | Description |
| --- | --- |
| `infographic` / `template` | The template name, on the first line |
| `data` | `title`, `desc`, `items` (or `sequences`, `compares`, `nodes`, `values`, `relations`, `root`, depending on the structure), `order` |
| `theme` | `type` (`light` / `dark` / `hand-drawn`), `palette`, `colorPrimary`, `stylize` … |
| `width` / `height` | Canvas size at the DSL level; usually left to the fence's `height` |
| `design` | Per-part tuning; rarely needed |
{.fields}

Each entry under `items` accepts `label`, `desc`, `value`, `icon`, `children`,
`group` and `id`. The [AntV Infographic documentation](https://infographic.antv.vision/learn)
defines the full DSL; the theme's `VENDOR.json` records the bundled version and
its checksum.

## Limits {#limits}

- A misspelled template name does not fail the build, because Hugo checks only
  the fence attributes and the DSL is parsed in the browser. The graphic area
  shows an error line instead, so look at the page after changing a template.
- SVG carries no semantic structure, and screen readers may not read the items
  in visual order. When a heading, a list or a table can say the same thing,
  prefer it.
- Long labels are squeezed or cut off on narrow screens; check the page at
  phone width after editing.

## Related {#related}

- [ECharts](/docs/components/echarts/) — when you need axes and exact numbers
- [Steps](/docs/components/steps/) — when the reader has to follow the procedure
- [Cards](/docs/components/cards/) — a grid of clickable entry points
- [Mermaid](/docs/components/mermaid/) — flows with branches and conditions
