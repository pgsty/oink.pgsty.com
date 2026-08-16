---
title: Apache ECharts
linkTitle: ECharts
description:
  Build responsive, local-first charts from an echarts fence with structured
  JSON or YAML.
weight: 100
---

An `echarts` fenced code block renders an Apache ECharts options object with the
versioned runtime bundled by OINK. The fence body is JSON or YAML — data, not
code — so it stays a readable code block on GitHub and in any Markdown reader.
Hugo parses the options at build time, serializes the result into the page, and
loads ECharts only on pages that use the fence.

Use ECharts for quantitative charts whose axes, encodings, tooltips, or series
need more control than a diagram or table provides. Keep a nearby textual
summary so the conclusion does not depend on color, pointer interaction, or
JavaScript.

## Quick start {#quick-start}

````markdown
```echarts {height="300px"}
xAxis:
  type: category
  data: [Draft, Review, Publish]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
```
````

The example shows 12 draft pages, nine pages in review, and four pages ready to
publish.

<!-- prettier-ignore-start -->

```echarts {height="300px"}
xAxis:
  type: category
  data: [Draft, Review, Publish]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
```

<!-- prettier-ignore-end -->

## How OINK loads a chart {#how-oink-loads-a-chart}

The render hook creates a unique chart container and stores the parsed options
in an `application/json` element. The page includes the local ECharts runtime
and OINK initializer once, even when it contains several charts.

If `theme` is not set, OINK initializes the chart for the current site color
mode and redraws it when the reader changes modes. A `ResizeObserver` resizes
the chart with its container. Setting an explicit ECharts theme opts out of
automatic site-theme switching for that chart.

## Fence attributes {#shortcode-parameters}

| Attribute | Default | Behavior                                                                            |
| --------- | ------- | ----------------------------------------------------------------------------------- |
| `height`  | `400px` | Accepts a nonnegative number with `px`, `rem`, `em`, `vh`, `vw`, or `%`             |
| `theme`   | unset   | Uses a named ECharts theme; when unset, follows the site's light or dark color mode |
| `full`    | `false` | Set to `true` to remove OINK's normal content-width clamp                           |

Invalid height values, unknown attributes, and a body that does not decode to an
ECharts options mapping fail the Hugo build instead of creating a blank chart
silently.

## Callbacks and trusted code {#choose-a-guide}

The fence is declarative only; it cannot carry JavaScript. Where an ECharts
option needs a function — a tooltip formatter, a data-driven color — write the
string `"$fn:name"` in the options and register `name` on
`window.tdEchartsFunctions` from a page-level `<script>` block or a site asset.
Unregistered names are ignored with a console warning:

````markdown
<script>
window.tdEchartsFunctions = window.tdEchartsFunctions || {};
window.tdEchartsFunctions.bytesFormatter = (params) => `${params.value} MB`;
</script>

```echarts {height="240px"}
tooltip:
  formatter: "$fn:bytesFormatter"
series:
  - type: bar
    data: [3, 5, 8]
```
````

Start with declarative JSON or YAML. Add JavaScript callbacks only when the
ECharts option cannot be expressed as data, and treat that script as reviewed
site code.

## Authoring checklist {#authoring-checklist}

- State the chart's conclusion and data scope in prose.
- Label axes, units, series, and time ranges explicitly.
- Do not use color as the only way to distinguish important values.
- Keep legends and tooltips readable in both site color modes.
- Test the chart at narrow widths and with long translated labels.
- Prefer a shared `dataset` when several series use the same records.
- Record the data source and observation date for nonillustrative data.
- Avoid animation when it does not help comprehension, and respect reduced
  motion for custom effects.

## Further reference {#further-reference}

OINK documents its fence and delivery behavior; the full options schema belongs
to Apache ECharts. Print, Markdown, and RSS output show the fence source instead
of a chart. Use the
[ECharts concepts handbook](https://echarts.apache.org/handbook/en/concepts/chart-size/),
[dataset guide](https://echarts.apache.org/handbook/en/concepts/dataset/), and
[option reference](https://echarts.apache.org/en/option.html) for chart-specific
settings. The theme's `VENDOR.json` records the exact runtime version and
license shipped by a release.
