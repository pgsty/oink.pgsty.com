---
title: Content components
weight: 90
icon: fa-solid fa-shapes
description: Use Oink's local, reusable components for richer documentation.
aliases: [/docs/oink/components/]
sidebar_expanded: true
---

OINK promotes the content components that proved reusable across PGSTY sites
into the theme. Each component has a stable authoring API, unique instance IDs,
local assets, and a defined safety boundary. Site-specific data widgets remain
outside the theme.

## Loading model {#loading-model}

Interactive shortcodes mark the features used by a page. OINK then adds each
required stylesheet or runtime once, even if the page has several component
instances. A plain page does not download component code it never uses.

Relative asset and link parameters pass through Hugo's URL handling, so they
remain correct under a subpath `baseURL`. Component markup also has print,
dark-mode, mobile, keyboard, and reduced-motion behavior where applicable.

## Everyday content primitives {#everyday-content-primitives}

Everyday primitives cover small structures that recur throughout engineering
documentation. Each guide below explains when to use the primitive, shows the
rendered result beside its source, and records its complete version-one API.

### Choose a primitive {#choose-a-primitive}

| Documentation need                         | Reference                   | JavaScript                    |
| ------------------------------------------ | --------------------------- | ----------------------------- |
| Release state, lifecycle, or short status  | [Badge](badge/)             | None                          |
| Shortcut or key sequence                   | [Kbd](kbd/)                 | None                          |
| Configuration, parameter, or response data | [Fields and Field](fields/) | None                          |
| Repository or directory structure          | [FileTree](filetree/)       | None; folders use `details`   |
| Inspect a screenshot or architecture image | [Image Zoom](image-zoom/)   | Optional, loaded on demand    |
| Compare several related images             | [Gallery](gallery/)         | Reuses optional Image Zoom JS |

### Shared authoring contract {#shared-authoring-contract}

All primitives except Kbd use named parameters and standard `{{</* ... */>}}`
shortcode notation. Parameter names are case-sensitive. Unknown parameters,
quoted booleans or integers, empty required strings, invalid enum values, and
incorrect parent/child combinations stop the build with the source position.

The public APIs do not accept arbitrary `class`, `style`, colors, or event
handlers. Visible labels come from the author or Oink's translations. Static
primitives add no JavaScript; interactive primitives mark their page so the
required runtime is included once.

### Validation and fallbacks {#validation-and-fallbacks}

The output contract keeps the same information available without a browser
runtime:

| Primitive    | HTML                               | Markdown                   | Print and RSS             | JavaScript               |
| ------------ | ---------------------------------- | -------------------------- | ------------------------- | ------------------------ |
| Badge        | Semantic status span or link       | Emphasized text or link    | Static inline content     | None                     |
| Kbd          | Nested `kbd` sequence              | `Ctrl + K`                 | Plain key notation        | None                     |
| Fields       | Responsive definition list         | Metadata bullet list       | Complete definitions      | None                     |
| FileTree     | Nested lists and native disclosure | Nested list                | Fully expanded tree       | None                     |
| Shared image | Figure, image, and caption         | Ordinary image and caption | Static figure             | Reuses Zoom when enabled |
| Gallery      | Responsive figure grid             | Images and captions        | Sequential static figures | Reuses Zoom when enabled |

Missing required parameters and invalid values fail the Hugo build instead of
silently changing meaning. Historical positional `imgproc` remains compatible,
but new content should use the accessible named form.

### Deliberate limits {#deliberate-limits}

Version one does not add a public Icon shortcode or an `icon` parameter to
Badge. Oink's private shell SVG registry remains separate from author-facing
content icons. Automatic TypeScript parsing, API playgrounds, directory reads,
remote image downloads, and complex pan or wheel-zoom controls also remain
outside the Hugo-only theme boundary.

## Asciinema {#asciinema}

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

## Advanced visualizations {#advanced-visualizations}

ECharts and Infographic remain Oink content components, but each now has a
dedicated section under Advanced. This page keeps the reusable component
overview concise and points to the richer examples.

### Apache ECharts {#echarts}

Use [Apache ECharts](/docs/advanced/echarts/) for quantitative charts based on
structured JSON or YAML. The [chart gallery](/docs/advanced/echarts/gallery/)
contains several live patterns, and
[callbacks and trusted code](/docs/advanced/echarts/callbacks/) documents the
explicit executable-code boundary.

### AntV Infographic {#infographic}

Use [Infographics with AntV](/docs/advanced/infographic/) for declarative
processes, timelines, cycles, grids, and funnels. The dedicated pages explain
template semantics, themes, local-first constraints, and accessible textual
fallbacks.

## Cards and carousel

`doc-card` and `nav-card` share one card implementation. `doc-cards` and
`nav-cards` create responsive groups of one to four columns. The aliases let an
existing site's content keep its most descriptive name without duplicating
markup or styles.

```go-html-template
{{</* nav-cards cols="3" */>}}
  {{</* nav-card
    title="Architecture"
    link="/docs/about/architecture/"
    icon="fa-solid fa-diagram-project"
    desc="Understand the build and runtime boundaries."
  */>}}
  {{</* nav-card
    title="Deployment"
    link="/docs/deploy/"
    badge="Hugo-only"
  */>}}Publish the static output.{{</* /nav-card */>}}
{{</* /nav-cards */>}}
```

<!-- prettier-ignore-start -->

{{< nav-cards cols="3" >}}
{{< nav-card title="Architecture" link="/docs/about/architecture/" icon="fa-solid fa-diagram-project" desc="Understand the build and runtime boundaries." />}}
{{< nav-card title="Deployment" link="/docs/deploy/" badge="Hugo-only" >}}Publish the static output.{{< /nav-card >}}
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
