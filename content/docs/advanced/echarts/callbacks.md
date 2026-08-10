---
title: ECharts callbacks and trusted code
linkTitle: Callbacks and trusted code
description:
  Use reviewed formatter and styling functions when structured options are not
  enough.
weight: 20
icon: fa-solid fa-code
---

Most ECharts options should remain declarative JSON or YAML. Some valid options,
including custom formatters and data-dependent styles, require functions. Oink
supports those cases through fenced JavaScript blocks and `$fn:name` references.

## Trusted-author boundary {#trusted-author-boundary}

Callback code runs in every visitor's browser with the page's origin and normal
JavaScript privileges. Oink safely serializes structured chart options, but it
does not sandbox author-supplied callbacks. Only trusted project authors should
add or review them.

Callbacks can also change a site's Content Security Policy requirements because
the shortcode emits an inline registration script. Prefer declarative options
when they can express the same behavior.

## Register and reference functions {#register-and-reference-functions}

Place one or more `js` or `javascript` fences inside the shortcode. Declare each
function with a named `var`, `let`, `const`, or function declaration, then refer
to it from YAML or JSON as `$fn:name`.

````go-html-template
{{</* echarts height="320px" */>}}
```js
var formatMinutes = function (value) {
  return value + ' min';
};
```

```yaml
yAxis:
  type: value
  axisLabel: { formatter: $fn:formatMinutes }
```
{{</* /echarts */>}}
````

Oink removes the JavaScript fences before parsing the remaining options,
registers the named functions, and replaces `$fn:name` values before calling
`chart.setOption()`.

## Example: labels and colors {#example-labels-and-colors}

The following chart formats duration labels and highlights the slowest stage.
Its data says writing takes 18 minutes, review takes 11, and publication takes
four.

<!-- prettier-ignore-start -->

{{< echarts height="320px" >}}
```js
var formatAxisMinutes = function (value) {
  return value + ' min';
};
var formatBarMinutes = function (params) {
  return params.value + ' min';
};
var stageColor = function (params) {
  return params.name === 'Write' ? '#f97316' : '#3b82f6';
};
```

```yaml
tooltip: { trigger: axis }
xAxis:
  type: category
  data: [Write, Review, Publish]
yAxis:
  type: value
  axisLabel: { formatter: $fn:formatAxisMinutes }
series:
  - type: bar
    data: [18, 11, 4]
    itemStyle: { color: $fn:stageColor }
    label:
      show: true
      position: top
      formatter: $fn:formatBarMinutes
```
{{< /echarts >}}

<!-- prettier-ignore-end -->

## Callback checklist {#callback-checklist}

- Keep functions deterministic and limited to chart presentation.
- Do not read cookies, credentials, storage, or unrelated page content.
- Do not fetch remote data from a formatter or style callback.
- Use a unique, descriptive function name on pages with several charts.
- Treat code copied from an external example as source code that requires review
  and license checking.
- Exercise callbacks with missing, null, string, and numeric values as
  appropriate.
- Test both site color modes, narrow layouts, printing, and reduced motion.

## Troubleshooting {#troubleshooting}

If a `$fn:name` value remains unresolved, verify that the spelling matches a
named declaration inside the same page and that the fence language is `js` or
`javascript`. Anonymous expressions that are not assigned to a name cannot be
registered.

If Hugo fails before rendering, reduce the body to valid JSON or YAML first,
then add one callback. A browser console error means the structured options
parsed successfully but callback execution or an ECharts option still needs
inspection.
