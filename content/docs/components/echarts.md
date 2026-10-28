---
title: ECharts
linkTitle: ECharts
description: Write ECharts options as YAML or JSON in an `echarts` fence. Hugo validates them, and bundled ECharts draws charts that follow the color scheme.
weight: 150
search_keywords: [ECharts, chart, bar, line, pie, height, theme, OinkEchartsFunctions]
---

An `echarts` fence contains an ECharts option object in YAML or JSON. It contains data, not code.
Use it for quantitative charts with axes, series, and a legend.
Use [Mermaid](/docs/components/mermaid/) for relationships and flows. Use [Infographic](/docs/components/infographic/) for order and hierarchy.
Hugo parses options at build time. Invalid input warns and preserves readable source.
The browser draws charts with the theme's bundled ECharts. Only pages that use it load the runtime.

## Shortest form {#minimal}

A bar chart needs `xAxis`, `yAxis`, and `series`. This chart shows page counts for the six documentation sections.

````markdown {title="Source"}
```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [Introduction, Get started, Authoring, Components, Customization, Operations]
yAxis:
  type: value
  name: pages
series:
  - name: pages
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [Introduction, Get started, Authoring, Components, Customization, Operations]
yAxis:
  type: value
  name: pages
series:
  - name: pages
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```

Both formats are supported. YAML is shorter because it needs no quotes or commas.
Incorrect indentation or an array instead of a map warns, identifies the source line, and shows the source instead of a blank chart.

## Multiple line series {#line}

`series` is an array. Add an entry for each line. `legend` lets readers hide a series.
This chart shows PostgreSQL major release years and the end-of-support years from the community's five-year policy.

````markdown {title="Source"}
```echarts {height="360px"}
tooltip:
  trigger: axis
legend:
  data: [Released, End of support]
grid:
  left: 56
  right: 24
  top: 48
  bottom: 40
xAxis:
  type: category
  name: major version
  data: ["9.6", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
yAxis:
  type: value
  min: 2015
  max: 2031
  name: year
series:
  - name: Released
    type: line
    smooth: false
    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  - name: End of support
    type: line
    lineStyle:
      type: dashed
    data: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
```
````

```echarts {height="360px"}
tooltip:
  trigger: axis
legend:
  data: [Released, End of support]
grid:
  left: 56
  right: 24
  top: 48
  bottom: 40
xAxis:
  type: category
  name: major version
  data: ["9.6", "10", "11", "12", "13", "14", "15", "16", "17", "18"]
yAxis:
  type: value
  min: 2015
  max: 2031
  name: year
series:
  - name: Released
    type: line
    smooth: false
    data: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
  - name: End of support
    type: line
    lineStyle:
      type: dashed
    data: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]
```

Quote version numbers. YAML reads unquoted `10` and `9.6` as numbers. Category-axis labels must be strings.

## Pie and doughnut charts {#pie}

Give `radius` two values to create a doughnut chart. This example groups OINK's 29 shortcodes by purpose.

````markdown {title="Source"}
```echarts {height="340px"}
tooltip:
  trigger: item
  formatter: "{b}: {c} ({d}%)"
legend:
  bottom: 0
series:
  - type: pie
    radius: [42%, 70%]
    itemStyle:
      borderRadius: 6
      borderWidth: 2
    label:
      formatter: "{b} {c}"
    data:
      - { value: 14, name: Core components }
      - { value: 10, name: Book numbering and indexes }
      - { value: 3, name: Releases and downloads }
      - { value: 2, name: OpenAPI }
```
````

```echarts {height="340px"}
tooltip:
  trigger: item
  formatter: "{b}: {c} ({d}%)"
legend:
  bottom: 0
series:
  - type: pie
    radius: [42%, 70%]
    itemStyle:
      borderRadius: 6
      borderWidth: 2
    label:
      formatter: "{b} {c}"
    data:
      - { value: 14, name: Core components }
      - { value: 10, name: Book numbering and indexes }
      - { value: 3, name: Releases and downloads }
      - { value: 2, name: OpenAPI }
```

`{b}`, `{c}`, and `{d}` are ECharts placeholders for name, value, and percentage.
Use them in a string. No function is needed.

## Height and full width {#size}

`height` defaults to `400px` and accepts `px rem em vh vw %`.
`full=true` removes the reading-column limit and fills the content area. Use it for charts with many points or long labels.

````markdown {title="Source"}
```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 40
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: [i18n, taxonomy, font tokens, content contracts, navigation, runtime, sidebar icons, search, actions, palette, params, reading, release assets, download, landing, book, migrations, keyboard, shell, output, goldens]
yAxis:
  type: value
  name: scripts
series:
  - type: bar
    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
```
````

```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 40
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: [i18n, taxonomy, font tokens, content contracts, navigation, runtime, sidebar icons, search, actions, palette, params, reading, release assets, download, landing, book, migrations, keyboard, shell, output, goldens]
yAxis:
  type: value
  name: scripts
series:
  - type: bar
    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
```

Invalid heights such as `360` and `36pt` warn and use the default `400px`.

## Light and dark {#theme}

Without `theme`, charts use the reader's current color scheme. They redraw in place when the scheme changes, without reloading the page.
Charts resize when their containers resize. Switch this page to dark mode to change each chart's background and text.

A fixed `theme` keeps the same colors in both modes:

````markdown {title="Source"}
```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [HTML, Print, Markdown, RSS]
yAxis:
  type: value
series:
  - type: bar
    data: [1, 1, 1, 1]
```
````

```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [HTML, Print, Markdown, RSS]
yAxis:
  type: value
series:
  - type: bar
    data: [1, 1, 1, 1]
```

`dark` is the only built-in runtime theme. Register other ECharts themes with `echarts.registerTheme()` before naming them here.
Unless branding requires a fixed theme, omit `theme` so charts follow the site.

## Callbacks with `$fn:` {#callbacks}

A fence contains data and cannot contain JavaScript.
If an option needs a function, such as a tooltip formatter or data-dependent color, use `"$fn:name"` in the options.
Register the name on `window.OinkEchartsFunctions`:

````markdown {title="Source"}
<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.pageShare = function (params) {
    var p = params[0];
    return p.name + ': ' + p.value + ' pages, ' + Math.round((p.value / 60) * 100) + '% of the site';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:pageShare"
xAxis:
  type: category
  data: [Introduction, Get started, Authoring, Components, Customization, Operations]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.pageShare = function (params) {
    var p = params[0];
    return p.name + ': ' + p.value + ' pages, ' + Math.round((p.value / 60) * 100) + '% of the site';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:pageShare"
xAxis:
  type: category
  data: [Introduction, Get started, Authoring, Components, Customization, Operations]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```

Hover over a bar to see the tooltip sentence from the function.
Unregistered names resolve to `undefined`. The chart draws as if the option were absent, without build or runtime warnings.
Keep the script beside the fence so they change together.

The script is site code and needs code review. If string templates (`{b}`, `{c}`, `{d}`) can express the formatting, no function is needed.

## Where the data lives {#data}

Fence bodies are literal text. Hugo does not expand shortcodes, front matter variables, or `data/` files inside them.
Write the numbers in the fence. Data cannot be shared this way, but Git stores the chart with its data and shows changed numbers.

Do not chart data that changes frequently, such as version matrices or asset lists.
Use a [table](/docs/components/table/) or a `data/`-driven component on a [release page](/docs/write/releases/).

## Output {#outputs}

| Output | Shape |
| --- | --- |
| HTML | A canvas container inside `<div class="td-echarts">` plus an `application/json` options block; the local ECharts draws it |
| Print | No chart; the fence source inside `<pre class="td-echarts-source">` |
| Markdown | The `echarts` fence and its option source, kept as written |
| RSS | Same as print — source only |

Explain the chart's information in prose. Print and RSS do not include the chart.

## Parameter reference {#reference}

The fence attribute line (```` ```echarts {…} ````):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | CSS length | `400px` | A non-negative number plus `px` `rem` `em` `vh` `vw` `%`; anything else warns and uses the default |
| `theme` | string | unset | Pin an ECharts theme and stop following the site's colour scheme; only `dark` is built in |
| `full` | bool | `false` | `true` drops the reading-column limit and fills the content area |
| `class` | space-separated classes | — | Passed through to the container for site CSS |
{.fields meta="type default"}

`style`, `on*`, and unknown attributes warn and are ignored.
If a fence body does not parse to a YAML/JSON map, it warns and displays the source.
ECharts defines the option keys in its [official option manual](https://echarts.apache.org/en/option.html).

ECharts has no site-level parameter. It needs no switch in `hugo.yml` and loads only on pages that use it.

## Limits {#limits}

- Fences cannot contain JavaScript. Use `$fn:` for functions. Unregistered names resolve to `undefined` without an error.
- Fences cannot read external data. They cannot access `data/`, front matter, or shortcodes. Write the numbers in the fence.
- Print and RSS include only the source. State the conclusion in prose.
- Quote category-axis values such as `10`, `9.6`, `on`, and `yes`. YAML can convert them to numbers or booleans.
- Use line styles or marker shapes as well as color to distinguish series. Check legend contrast in both color schemes.

## Related {#related}

- [Infographic](/docs/components/infographic/) — structure and order, not statistics
- [Tables](/docs/components/table/) — for few values that must be read exactly
- [Mermaid](/docs/components/mermaid/) — relationship and flow diagrams
- [Code blocks](/docs/components/code/) — the general rules for fence attribute lines
