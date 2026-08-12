---
title: Apache ECharts
linkTitle: ECharts
description: Build responsive, local-first charts from structured JSON or YAML.
weight: 100
---

The `echarts` shortcode renders an Apache ECharts options object with the
versioned runtime bundled by Oink. Hugo parses JSON or YAML at build time,
serializes the result into the page, and loads ECharts only on pages that use
the component.

Use ECharts for quantitative charts whose axes, encodings, tooltips, or series
need more control than a diagram or table provides. Keep a nearby textual
summary so the conclusion does not depend on color, pointer interaction, or
JavaScript.

## Quick start {#quick-start}

```go-html-template
{{</* echarts height="300px" */>}}
xAxis:
  type: category
  data: [Draft, Review, Publish]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
{{</* /echarts */>}}
```

The example shows 12 draft pages, nine pages in review, and four pages ready to
publish.

<!-- prettier-ignore-start -->

{{< echarts height="300px" >}}
xAxis:
  type: category
  data: [Draft, Review, Publish]
yAxis:
  type: value
series:
  - type: bar
    data: [12, 9, 4]
{{< /echarts >}}

<!-- prettier-ignore-end -->

## How Oink loads a chart {#how-oink-loads-a-chart}

The shortcode creates a unique chart container and stores the parsed options in
an `application/json` element. The page includes the local ECharts runtime and
Oink initializer once, even when it contains several charts.

If `theme` is not set, Oink initializes the chart for the current site color
mode and redraws it when the reader changes modes. A `ResizeObserver` resizes
the chart with its container. Setting an explicit ECharts theme opts out of
automatic site-theme switching for that chart.

## Shortcode parameters {#shortcode-parameters}

| Parameter | Default | Behavior                                                                            |
| --------- | ------- | ----------------------------------------------------------------------------------- |
| `height`  | `400px` | Accepts a nonnegative number with `px`, `rem`, `em`, `vh`, `vw`, or `%`             |
| `theme`   | unset   | Uses a named ECharts theme; when unset, follows the site's light or dark color mode |
| `full`    | `false` | Set to `true` to remove Oink's normal content-width clamp                           |

Invalid height values fail the Hugo build. The shortcode body must decode to an
ECharts options object; malformed JSON or YAML also fails at build time instead
of creating a blank chart silently.

## Choose a guide {#choose-a-guide}

scatter plots, legends, and visual encodings.

- Callbacks and trusted code: explains formatter functions, data-dependent
  styles, the `$fn:name` bridge, and its security boundary.

Start with declarative JSON or YAML. Add JavaScript callbacks only when the
ECharts option cannot be expressed as data.

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

OINK documents its wrapper and delivery behavior; the full options schema
belongs to Apache ECharts. Use the
[ECharts concepts handbook](https://echarts.apache.org/handbook/en/concepts/chart-size/),
[dataset guide](https://echarts.apache.org/handbook/en/concepts/dataset/), and
[option reference](https://echarts.apache.org/en/option.html) for chart-specific
settings. The theme's `VENDOR.json` records the exact runtime version and
license shipped by a release.
