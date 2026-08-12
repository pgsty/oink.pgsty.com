# Content components

> Use Oink's local, reusable components for richer documentation.

---

LLMS index: [llms.txt](/llms.txt)

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

All primitives except Kbd use named parameters and standard `{{< ... >}}`
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
{{< asciinema
  file="images/install.cast"
  speed="1.5"
  markers="0:Start,1:Done"
>}}
```

<div id="td-asciinema-c2991d9c1e63802fe6d6714eb471381a-0" class="td-asciinema td-max-width-on-larger-screens" data-td-asciinema
  data-timer-label="Playback time">
  <div class="td-asciinema__chrome">
    <span class="td-asciinema__lights" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="td-asciinema__title" dir="auto">images/install.cast</span>
  </div>
  <div data-td-asciinema-player></div>
  <script type="application/json" data-td-asciinema-config>{"options":{"autoPlay":false,"fit":"width","loop":false,"markers":[0,"Start",1,"Done"],"preload":false,"speed":1.5,"startAt":0},"src":"/images/install.cast","theme":"auto"}</script>
</div>


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
{{< nav-cards cols="3" >}}
  {{< nav-card
    title="Architecture"
    link="/docs/about/architecture/"
    icon="fa-solid fa-diagram-project"
    desc="Understand the build and runtime boundaries."
  >}}
  {{< nav-card
    title="Deployment"
    link="/docs/deploy/"
    badge="Hugo-only"
  >}}Publish the static output.{{< /nav-card >}}
{{< /nav-cards >}}
```

<!-- prettier-ignore-start -->

<div id="td-nav-cards-c2991d9c1e63802fe6d6714eb471381a-1" class="td-content-cards" style="--td-card-columns: 3">
<article id="td-nav-card-c2991d9c1e63802fe6d6714eb471381a-nav-cards-1-0" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><i class="fa-solid fa-diagram-project td-content-card__icon" aria-hidden="true"></i><a class="td-content-card__title" href="/docs/about/architecture/">Architecture</a></div><p class="td-content-card__description">Understand the build and runtime boundaries.</p>
  </div>
</article>

<article id="td-nav-card-c2991d9c1e63802fe6d6714eb471381a-nav-cards-1-1" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><a class="td-content-card__title" href="/docs/deploy/">Deployment</a><span class="td-content-card__badge">Hugo-only</span></div>
    <div class="td-content-card__links">Publish the static output.</div>
  </div>
</article>

</div>


<!-- prettier-ignore-end -->

A card accepts `title`, `link`, `image`, `alt`, `icon`, `desc`, `accent`, and
`badge`. Its body can contain Markdown links. Tokens such as `{version}` in
`desc` resolve from site parameters when a matching value exists.

Wrap document cards in `doc-carousel` to create an accessible horizontal
carousel:

```go-html-template
{{< doc-carousel label="OINK workflow" >}}
  {{< doc-card title="Write" >}}Create paired content.{{< /doc-card >}}
  {{< doc-card title="Build" >}}Run Hugo Extended.{{< /doc-card >}}
  {{< doc-card title="Verify" >}}Inspect the static site.{{< /doc-card >}}
{{< /doc-carousel >}}
```

<!-- prettier-ignore-start -->

<section id="td-carousel-c2991d9c1e63802fe6d6714eb471381a-2" class="td-doc-carousel" data-td-carousel role="region"
  aria-roledescription="carousel" aria-label="OINK workflow">
  <button class="td-doc-carousel__button" type="button" data-td-carousel-action="previous"
    aria-controls="td-carousel-c2991d9c1e63802fe6d6714eb471381a-2-track" aria-label="Previous card">‹</button>
  <div id="td-carousel-c2991d9c1e63802fe6d6714eb471381a-2-track" class="td-doc-carousel__track" data-td-carousel-track tabindex="0">
<article id="td-doc-card-c2991d9c1e63802fe6d6714eb471381a-doc-carousel-2-0" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">Write</strong></div>
    <div class="td-content-card__links">Create paired content.</div>
  </div>
</article>

<article id="td-doc-card-c2991d9c1e63802fe6d6714eb471381a-doc-carousel-2-1" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">Build</strong></div>
    <div class="td-content-card__links">Run Hugo Extended.</div>
  </div>
</article>

<article id="td-doc-card-c2991d9c1e63802fe6d6714eb471381a-doc-carousel-2-2" class="td-content-card">
  <div class="td-content-card__body">
    <div class="td-content-card__head"><strong class="td-content-card__title">Verify</strong></div>
    <div class="td-content-card__links">Inspect the static site.</div>
  </div>
</article>

</div>
  <button class="td-doc-carousel__button" type="button" data-td-carousel-action="next"
    aria-controls="td-carousel-c2991d9c1e63802fe6d6714eb471381a-2-track" aria-label="Next card">›</button>
</section>


<!-- prettier-ignore-end -->

`label` supplies the carousel's accessible name. Arrow keys and visible
previous/next controls navigate the track; reduced-motion preferences disable
unnecessary animation.

## Details

`details` emits native `details` and `summary` elements:

```go-html-template
{{% details title="Why Hugo-only?" closed="false" %}}
Committed browser assets keep the consuming build reproducible.
{{% /details %}}
```

<!-- prettier-ignore-start -->

<details id="td-details-c2991d9c1e63802fe6d6714eb471381a-3" class="td-details" open>
  <summary>Why Hugo-only?</summary>
  <div class="td-details__body">
Committed browser assets keep the consuming build reproducible.
</div>
</details>


<!-- prettier-ignore-end -->

`title` sets the summary. The block is closed by default; set `closed=false` to
render it open.

## Tabs

OINK keeps Docsy's `tabpane` and `tab` authoring model while preserving
`selected=true` and whitespace behavior used by imported sites:

```go-html-template
{{< tabpane text=true >}}
  {{< tab header="Local" selected=true >}}
  Build with the complete local theme.
  {{< /tab >}}
  {{< tab header="Cloudflare" >}}
  Run the same Hugo command from the source branch.
  {{< /tab >}}
{{< /tabpane >}}
```

<!-- prettier-ignore-start -->

**Local**

Build with the complete local theme.

**Cloudflare**

Run the same Hugo command from the source branch.

<!-- prettier-ignore-end -->

Use `text=true` for Markdown content; otherwise tabs are syntax-highlighted
code. Tab panes also support language-aware persistence, disabled tabs, and
right-aligned entries. Generated tab and panel IDs have matching ARIA
relationships.

## Parameters

`param` prints a page parameter, falling back to the site parameter of the same
name:

```go-html-template
Current version: {{< param version >}}
```

Current version: `v0.3.0`

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

---

Section pages:

- [Badge](/docs/components/badge/): Add compact, semantic status labels without custom colors or JavaScript.
- [Kbd](/docs/components/kbd/): Write keyboard shortcuts as accessible, static key sequences.
- [Fields and Field](/docs/components/fields/): Describe configuration, parameters, properties, and response fields with responsive semantic HTML.
- [FileTree](/docs/components/filetree/): Present repository and directory structures as semantic, progressively disclosed lists.
- [Image Zoom](/docs/components/image-zoom/): Let readers inspect meaningful standalone images with an optional native dialog.
- [Gallery](/docs/components/gallery/): Arrange related images in a responsive static grid that can reuse Image Zoom.
- [Code blocks and Code Groups](/docs/components/code-blocks/): Add filenames, exact Copy behavior, wrapping, collapse, and shareable groups to Hugo code examples.
