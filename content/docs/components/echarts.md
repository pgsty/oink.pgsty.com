---
title: ECharts
linkTitle: ECharts
description: Draw bar, line and pie charts by writing ECharts options as YAML or JSON in an `echarts` fence, with colors that follow light and dark mode.
weight: 240
search_keywords: [ECharts, chart, bar, line, pie, height, theme, OinkEchartsFunctions, OinkEchartsThemes, registerTheme]
---

An `echarts` fence draws a chart with axes, series and a legend: table sizes,
release timelines, the share of each category in a total. You describe the
chart as an ECharts option object in YAML or JSON, so the fence holds data,
not code, and the numbers sit in your Markdown where a diff shows every change.
Hugo checks the options while it builds, the theme's bundled copy of ECharts
draws the chart in the reader's browser, and the colors follow light and dark
mode. There is nothing to configure, and pages without a chart load nothing.
For relationships and flows, use [Mermaid](/docs/components/mermaid/); for
order and hierarchy, use [Infographic](/docs/components/infographic/).

## Shortest form {#minimal}

A bar chart needs `xAxis`, `yAxis` and `series`. This one shows the size of six
tables in an application database:

````markdown {title="Source"}
```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
  name: GB
series:
  - name: size
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

```echarts {height="320px"}
tooltip:
  trigger: axis
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
  name: GB
series:
  - name: size
    type: bar
    data: [4, 4, 8, 22, 15, 7]
```

YAML and JSON both work; YAML is shorter because it needs no quotes or
commas. If the options do not parse, or parse to a list instead of a mapping,
the build warns with the source line and the page shows your source instead
of an empty chart.

## Multiple line series {#line}

`series` is a list, with one entry per line, and `legend` lets readers hide a
line by clicking its name. This chart shows when each PostgreSQL major version
was released and when the community's five-year support ends:

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

The version numbers are quoted because YAML reads a bare `10` or `9.6` as a
number, and labels on a category axis must be strings.

## Pie and doughnut charts {#pie}

Give `radius` two values to cut a hole in a pie and get a doughnut. This one
groups OINK's 29 shortcodes by purpose:

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

`{b}`, `{c}` and `{d}` are ECharts placeholders for the name, the value and
the percentage. A formatter string with placeholders covers most labels and
tooltips without a function.

## Height and full width {#size}

`height` defaults to `400px` and accepts `px`, `rem`, `em`, `vh`, `vw` and `%`.
`full=true` lets the chart leave the reading column and use the whole content
area, which gives many data points or long labels room:

````markdown {title="Source"}
```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 48
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
yAxis:
  type: value
  name: queries/s
series:
  - type: bar
    data: [310, 280, 260, 250, 255, 290, 420, 780, 1150, 1320, 1380, 1400, 1290, 1350, 1410, 1380, 1300, 1180, 960, 820, 700, 590, 470, 380]
```
````

```echarts {height="260px" full=true}
tooltip:
  trigger: axis
grid:
  left: 48
  right: 16
  top: 24
  bottom: 32
xAxis:
  type: category
  data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
yAxis:
  type: value
  name: queries/s
series:
  - type: bar
    data: [310, 280, 260, 250, 255, 290, 420, 780, 1150, 1320, 1380, 1400, 1290, 1350, 1410, 1380, 1300, 1180, 960, 820, 700, 590, 470, 380]
```

An invalid height such as `360` or `36pt` warns and uses `400px`.

## Light and dark {#theme}

Without `theme`, a chart takes the reader's current color scheme and redraws
in place when the reader switches, without a reload; it also resizes with its
container. Switch this page to dark mode to watch the charts above change
their background and text.

A fixed `theme` keeps the same colors in both modes:

````markdown {title="Source"}
```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [replica-1, replica-2, replica-3, replica-4]
yAxis:
  type: value
  name: lag (ms)
series:
  - type: bar
    data: [12, 8, 15, 9]
```
````

```echarts {height="240px" theme="dark"}
xAxis:
  type: category
  data: [replica-1, replica-2, replica-3, replica-4]
yAxis:
  type: value
  name: lag (ms)
series:
  - type: bar
    data: [12, 8, 15, 9]
```

`dark` is the only theme built into ECharts. Leave `theme` out unless your
brand requires fixed colors, so that charts match the rest of the page.

For a theme of your own, define it on `window.OinkEchartsThemes` under the name
the fence uses. ECharts loads only when the first chart comes on screen, so a
site script has no moment to call `echarts.registerTheme()` itself; instead
each chart registers every theme it finds there before it draws:

````markdown {title="Source"}
<script>
  window.OinkEchartsThemes = window.OinkEchartsThemes || {};
  window.OinkEchartsThemes.brand = {
    color: ['#0b5394', '#e69138', '#6aa84f', '#a64d79'],
    backgroundColor: '#f7f9fc',
  };
</script>

```echarts {height="240px" theme="brand"}
legend: {}
xAxis:
  type: category
  data: [Mon, Tue, Wed, Thu, Fri]
yAxis:
  type: value
  name: queries (k/s)
series:
  - name: primary
    type: bar
    data: [42, 45, 51, 48, 39]
  - name: replica
    type: bar
    data: [31, 33, 36, 35, 30]
```
````

<script>
  window.OinkEchartsThemes = window.OinkEchartsThemes || {};
  window.OinkEchartsThemes.brand = {
    color: ['#0b5394', '#e69138', '#6aa84f', '#a64d79'],
    backgroundColor: '#f7f9fc',
  };
</script>

```echarts {height="240px" theme="brand"}
legend: {}
xAxis:
  type: category
  data: [Mon, Tue, Wed, Thu, Fri]
yAxis:
  type: value
  name: queries (k/s)
series:
  - name: primary
    type: bar
    data: [42, 45, 51, 48, 39]
  - name: replica
    type: bar
    data: [31, 33, 36, 35, 30]
```

A theme is a plain object in ECharts' theme format, such as the JSON its theme
builder exports. To offer it on every page, put the script in
`layouts/_partials/hooks/body-end.html` instead of a page. A name defined
nowhere draws with ECharts' default colors and no warning, and an entry named
`dark` replaces the palette that charts without `theme` use in dark mode.

## Callbacks with `$fn:` {#callbacks}

A fence holds data and cannot contain JavaScript. When an option needs a
function, such as a tooltip that computes a share or a color that depends on
the value, write the string `"$fn:name"` in the options and register a
function under that name on `window.OinkEchartsFunctions`:

````markdown {title="Source"}
<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.tableShare = function (params) {
    var p = params[0];
    return p.name + ': ' + p.value + ' GB, ' + Math.round((p.value / 60) * 100) + '% of the database';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:tableShare"
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```
````

<script>
  window.OinkEchartsFunctions = window.OinkEchartsFunctions || {};
  window.OinkEchartsFunctions.tableShare = function (params) {
    var p = params[0];
    return p.name + ': ' + p.value + ' GB, ' + Math.round((p.value / 60) * 100) + '% of the database';
  };
</script>

```echarts {height="300px"}
tooltip:
  trigger: axis
  formatter: "$fn:tableShare"
xAxis:
  type: category
  data: [customers, products, orders, events, sessions, audit_log]
yAxis:
  type: value
series:
  - type: bar
    data: [4, 4, 8, 22, 15, 7]
```

Hover over a bar to see the sentence the function builds. A name that is not
registered becomes `undefined`, and the chart draws as if the option were
missing, with no warning at build time or in the browser, so keep the script
next to the fence where both change together. The script is your site's own
code: review it like any other, and on a site with a Content Security Policy
allow it as described under [Deploy](/docs/admin/deploy/#csp). Use a function
only when a formatter string with `{b}`, `{c}` and `{d}` cannot do the job.

## Where the data lives {#data}

Hugo does not expand shortcodes, front matter values or `data/` files inside a
fence, so the numbers are written in the fence itself. Two charts cannot share
one dataset this way, but each chart travels with its data and a diff shows
exactly which number changed.

Data that changes often, such as version matrices or download lists, should
not be a chart. Use a [table](/docs/components/table/), or the `data/`-driven
components of a [release page](/docs/write/releases/).

## Output {#outputs}

Print and RSS show the fence's option source instead of a chart, and the
page's Markdown output keeps the fence as written. Say what the chart shows in
the surrounding prose, so that those readers get the conclusion too.

## Parameter reference {#reference}

The fence attribute line (```` ```echarts {…} ````):

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `height` | CSS length | `400px` | A non-negative number plus `px` `rem` `em` `vh` `vw` `%`; anything else warns and uses the default |
| `theme` | string | unset | Pin an ECharts theme and stop following the site's color scheme; `dark` is built in, other names come from `window.OinkEchartsThemes` |
| `full` | bool | `false` | `true` drops the reading-column limit and fills the content area; a value other than `true` or `false` warns and uses `false` |
| `class` | space-separated classes | — | Passed through to the container for site CSS |
{.fields meta="type default"}

Unknown attributes warn and are ignored; Hugo takes `style` as a highlighting
option and strips `on*`, so both are ignored without a warning. An empty
fence warns and renders nothing. The option keys themselves belong to ECharts
and are listed in its [option manual](https://echarts.apache.org/en/option.html).
ECharts has no site-level setting in `hugo.yml`.

## Limits {#limits}

- A fence cannot contain JavaScript; functions go through `$fn:` and themes
  through `window.OinkEchartsThemes`, and a name that is not registered fails
  silently.
- A fence cannot read `data/`, front matter or shortcodes; the numbers must be
  in the fence.
- Quote category values such as `10`, `9.6`, `on` and `yes`, which YAML would
  otherwise turn into numbers or booleans.
- Do not rely on color alone to tell series apart. Vary the line style or
  marker shape as well, and check the legend's contrast in both color schemes.

## Related {#related}

- [Infographic](/docs/components/infographic/) — structure and order, not statistics
- [Tables](/docs/components/table/) — for few values that must be read exactly
- [Mermaid](/docs/components/mermaid/) — relationship and flow diagrams
- [Code blocks](/docs/components/code/) — the general rules for fence attribute lines
