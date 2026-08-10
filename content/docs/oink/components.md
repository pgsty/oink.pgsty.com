---
title: Content components
weight: 40
description: Local, reusable components added by OINK
---

OINK promotes the content components that proved reusable across PGSTY sites
into the theme. Each component has a stable authoring API, unique instance IDs,
local assets, and a defined safety boundary. Site-specific data widgets remain
outside the theme.

## Loading model

Interactive shortcodes mark the features used by a page. OINK then adds each
required stylesheet or runtime once, even if the page has several component
instances. A plain page does not download component code it never uses.

Relative asset and link parameters pass through Hugo's URL handling, so they
remain correct under a subpath `baseURL`. Component markup also has print,
dark-mode, mobile, keyboard, and reduced-motion behavior where applicable.

## Asciinema

Use `asciinema` for a terminal recording stored as a local `.cast` file:

```go-html-template
{{</* asciinema
  file="images/install.cast"
  speed="1.5"
  markers="0:Start,1:Done"
*/>}}
```

{{< asciinema file="images/install.cast" speed="1.5" markers="0:Start,1:Done" >}}

`file` is required and can also be the first positional argument. The terminal
window uses `title` when supplied and otherwise displays the `file` value.
Supported options are `title`, `theme`, `fit` (`width`, `height`, `both`, or
`none`), `autoplay`, `loop`, `preload`, `speed`, `startAt`, `poster`, `cols`,
`rows`, `idleTimeLimit`, `pauseOnMarkers`, and comma-separated `markers`.

Keep cast files local for offline use. A remote URL is accepted only when the
author explicitly supplies it.

## ECharts

The shortcode accepts JSON or YAML and serializes the parsed value into an
`application/json` element:

```go-html-template
{{</* echarts height="280px" */>}}
xAxis: { type: category, data: [Source, Build, Publish] }
yAxis: { type: value }
series: [{ type: bar, data: [1, 2, 3] }]
{{</* /echarts */>}}
```

<!-- prettier-ignore-start -->

{{< echarts height="280px" >}}
xAxis: { type: category, data: [Source, Build, Publish] }
yAxis: { type: value }
series: [{ type: bar, data: [1, 2, 3] }]
{{< /echarts >}}

<!-- prettier-ignore-end -->

`height` defaults to `400px` and must use a safe CSS length unit. `theme`
selects an ECharts theme, and `full=true` removes the normal content-width
constraint.

Charts that need callbacks may include a fenced JavaScript block and reference
its declared functions from JSON/YAML options as `$fn:name`. The code runs in
the visitor's browser, so include only reviewed code from trusted authors and
prefer structured options when callbacks are unnecessary.

## Infographic

`infographic` renders the AntV Infographic DSL locally:

```go-html-template
{{</* infographic */>}}
infographic list-row-simple-horizontal-arrow
data
  items
    - label Source
      desc Markdown and configuration
    - label Build
      desc Hugo Extended
    - label Publish
      desc Static files
{{</* /infographic */>}}
```

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-row-simple-horizontal-arrow
data
  items
    - label Source
      desc Markdown and configuration
    - label Build
      desc Hugo Extended
    - label Publish
      desc Static files
{{< /infographic >}}

<!-- prettier-ignore-end -->

`height` accepts `auto` or a safe CSS length; `full=true` removes the normal
content-width constraint. The DSL is serialized as data rather than inserted as
an executable script.

## Cards and carousel

`doc-card` and `nav-card` share one card implementation. `doc-cards` and
`nav-cards` create responsive groups of one to four columns. The aliases let an
existing site's content keep its most descriptive name without duplicating
markup or styles.

```go-html-template
{{</* nav-cards cols="3" */>}}
  {{</* nav-card
    title="Architecture"
    link="/docs/oink/architecture/"
    icon="fa-solid fa-diagram-project"
    desc="Understand the build and runtime boundaries."
  */>}}
  {{</* nav-card
    title="Deployment"
    link="/docs/oink/deployment/"
    badge="Hugo-only"
  */>}}Publish the static output.{{</* /nav-card */>}}
{{</* /nav-cards */>}}
```

<!-- prettier-ignore-start -->

{{< nav-cards cols="3" >}}
{{< nav-card title="Architecture" link="/docs/oink/architecture/" icon="fa-solid fa-diagram-project" desc="Understand the build and runtime boundaries." />}}
{{< nav-card title="Deployment" link="/docs/oink/deployment/" badge="Hugo-only" >}}Publish the static output.{{< /nav-card >}}
{{< /nav-cards >}}

<!-- prettier-ignore-end -->

A card accepts `title`, `link`, `image`, `alt`, `icon`, `desc`, `accent`, and
`badge`. Its body can contain Markdown links. Tokens such as `{version}` in
`desc` resolve from site parameters when a matching value exists.

Wrap document cards in `doc-carousel` to create an accessible horizontal
carousel:

```go-html-template
{{</* doc-carousel label="OINK workflow" */>}}
  {{</* doc-card title="Write" */>}}Create paired content.{{</* /doc-card */>}}
  {{</* doc-card title="Build" */>}}Run Hugo Extended.{{</* /doc-card */>}}
  {{</* doc-card title="Verify" */>}}Inspect the static site.{{</* /doc-card */>}}
{{</* /doc-carousel */>}}
```

<!-- prettier-ignore-start -->

{{< doc-carousel label="OINK workflow" >}}
{{< doc-card title="Write" >}}Create paired content.{{< /doc-card >}}
{{< doc-card title="Build" >}}Run Hugo Extended.{{< /doc-card >}}
{{< doc-card title="Verify" >}}Inspect the static site.{{< /doc-card >}}
{{< /doc-carousel >}}

<!-- prettier-ignore-end -->

`label` supplies the carousel's accessible name. Arrow keys and visible
previous/next controls navigate the track; reduced-motion preferences disable
unnecessary animation.

## Details

`details` emits native `details` and `summary` elements:

```go-html-template
{{%/* details title="Why Hugo-only?" closed="false" */%}}
Committed browser assets keep the consuming build reproducible.
{{%/* /details */%}}
```

<!-- prettier-ignore-start -->

{{% details title="Why Hugo-only?" closed="false" %}}
Committed browser assets keep the consuming build reproducible.
{{% /details %}}

<!-- prettier-ignore-end -->

`title` sets the summary. The block is closed by default; set `closed=false` to
render it open.

## Tabs

OINK keeps Docsy's `tabpane` and `tab` authoring model while preserving
`selected=true` and whitespace behavior used by imported sites:

```go-html-template
{{</* tabpane text=true */>}}
  {{</* tab header="Local" selected=true */>}}
  Build with the complete local theme.
  {{</* /tab */>}}
  {{</* tab header="Cloudflare" */>}}
  Run the same Hugo command from the source branch.
  {{</* /tab */>}}
{{</* /tabpane */>}}
```

<!-- prettier-ignore-start -->

{{< tabpane text=true >}}
{{< tab header="Local" selected=true >}}
Build with the complete local theme.
{{< /tab >}}
{{< tab header="Cloudflare" >}}
Run the same Hugo command from the source branch.
{{< /tab >}}
{{< /tabpane >}}

<!-- prettier-ignore-end -->

Use `text=true` for Markdown content; otherwise tabs are syntax-highlighted
code. Tab panes also support language-aware persistence, disabled tabs, and
right-aligned entries. Generated tab and panel IDs have matching ARIA
relationships.

## Parameters

`param` prints a page parameter, falling back to the site parameter of the same
name:

```go-html-template
Current version: {{</* param version */>}}
```

Current version: `{{< param version >}}`

The shortcode fails the build when the named parameter does not exist. This is
intentional: a missing release or repository value should not silently produce
misleading documentation.

## Existing rich content

OINK also ships local runtimes for inherited content features:

- fenced `mermaid`, `math`, and `markmap` code blocks;
- `swaggerui` and `redoc` API documentation shortcodes;
- Docsy blocks, alerts, image, include, readfile, cards, and other established
  shortcodes.

See [Shortcodes](/docs/content/shortcodes/) and
[Diagrams and formulae](/docs/content/diagrams-and-formulae/) for the complete
authoring reference.

## Authoring rules

- Prefer structured data over executable content.
- Give images useful `alt` text and carousels a meaningful `label`.
- Do not enable autoplay unless the content genuinely requires it.
- Test several identical instances on one page when creating a new wrapper.
- Verify keyboard navigation, focus visibility, dark and light themes, mobile
  layout, print output, and reduced-motion behavior.
- Keep business-specific data components in the consuming site.
