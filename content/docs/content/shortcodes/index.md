---
downstream_modified: true
title: Shortcodes
description: Use OINK's local-first content components safely and accessibly.
---

Shortcodes add behavior that ordinary Markdown cannot express. OINK retains the
core Docsy components and adds locally served charts, terminal recordings,
infographics, carousels, cards, and disclosure widgets. Browser runtimes load
only on pages that use them.

Prefer Markdown for headings, prose, lists, links, tables, and images. A
shortcode becomes part of the content API: changing its name or parameters can
break every page that calls it.

## Shortcode delimiters

Hugo supports two forms:

- `{{</* name */>}}` uses standard delimiters and passes inner content as-is;
- `{{%/* name */%}}` uses Markdown delimiters and renders inner Markdown in the
  surrounding content context.

Use the form documented for the component. Nesting, indentation, and blank lines
matter, especially inside lists and blockquotes. In examples, the `/* ... */`
escape prevents Hugo from executing the displayed shortcode.

## `blocks/*` shortcodes <a id="shortcode-blocks"></a> {#blocks}

Block shortcodes compose full-width landing pages. Their `color` argument uses
OINK/Bootstrap semantic colors or a project-defined block style. Their `height`
argument accepts the values documented for each block.

### `blocks/cover` <a id="blockscover"></a> {#blocks-cover}

Creates a hero from the page bundle image matching `*background*` and optional
`*logo*`:

```markdown
{{</* blocks/cover title="OINK" subtitle="Local-first documentation"
    color="dark" height="max" */>}} [Get started](/docs/get-started/){ .btn
.btn-lg .btn-primary } {{</* /blocks/cover */>}}
```

`image_anchor` and `logo_anchor` control image cropping; `byline` attributes the
image. Heights are `auto`, `min`, `med`, `max`, or `full`. Essential hero text
must remain readable without the background.

### `blocks/lead` <a id="blockslead"></a> {#blocks-lead}

Creates a prominent introductory band:

```markdown
{{%/* blocks/lead color="primary" height="min" */%}} OINK builds the whole
documentation experience with Hugo Extended. {{%/* /blocks/lead */%}}
```

The height accepts `auto`, `min`, `med`, `max`, or `full`.

### `blocks/section` <a id="blockssection"></a> {#blocks-section}

Creates a general landing-page band:

```markdown
{{%/* blocks/section color="light" type="row" height="auto" */%}}

### One section

Use ordinary Markdown inside the block. {{%/* /blocks/section */%}}
```

`type` selects the container treatment; `height` uses the block height values.
Keep heading levels consistent with the page outline.

### `blocks/feature` <a id="blocksfeature"></a> {#blocks-feature}

Creates one feature cell, normally inside a section:

```markdown
{{%/* blocks/feature icon="fa-solid fa-box-archive"
    title="Works offline" url="/docs/oink/local-first/"
    url_text="Read the design" */%}} All required browser assets are pinned and
served locally. {{%/* /blocks/feature */%}}
```

The icon is decorative; `title` and link text must carry the meaning.

### `blocks/link-down` <a id="blockslinkdown"></a> {#blocks-link-down}

Adds a link from one block to the next. It must be nested inside a block. Set an
explicit `id` when the generated target must remain stable.

### Below-navbar layout correction {#td-below-navbar}

Blocks that begin directly below fixed navigation use
`td-below-navbar`/`td-anchor-no-extra-offset` to compensate for navbar height.
Reuse these classes rather than adding arbitrary top margins; verify direct
fragment navigation after changing navbar dimensions.

## Helper shortcodes <a id="helpers-shortcodes"></a> {#helpers-shortcodes}

### `alert`

The legacy alert shortcode remains available:

```markdown
{{%/* alert title="Compatibility note" color="warning" */%}} Prefer Markdown
blockquote alerts for new content. {{%/* /alert */%}}
```

`color` maps to a Bootstrap alert suffix. New content should generally use the
Markdown alert syntax described in
[Adding Content](/docs/content/adding-content/#alerts).

#### Alerts, indentation, and examples

Keep the opening and closing shortcode aligned with their surrounding list or
blockquote. Leave a blank line around block Markdown. If an example must show a
shortcode literally, escape its delimiters rather than wrapping an active call
in another component.

### `pageinfo`

Renders an informational panel around Markdown:

```markdown
{{%/* pageinfo color="info" */%}} This page describes a preview interface.
{{%/* /pageinfo */%}}
```

Use a semantic alert for warnings; `pageinfo` is intended for contextual page
information.

### `imgproc`

Processes an image from the current page bundle:

```markdown
{{%/* imgproc "architecture" Fit "960x540" */%}} OINK runtime architecture.
{{%/* /imgproc */%}}
```

Commands are `Fit`, `Resize`, `Fill`, and `Crop`. The third argument follows
Hugo image-processing syntax. The inner text becomes a caption, and a resource
`params.byline` is appended when present. Always provide useful alternative or
adjacent text.

### `swaggerui`

Embeds the locally vendored Swagger UI runtime:

```markdown
{{</* swaggerui src="/openapi.yaml" */>}}
```

Use a same-origin specification for offline and CSP-safe deployments. A remote
`src` is an explicit network dependency and can expose reader metadata to that
host. Only one Swagger UI instance should be placed on a page with the current
compatibility shortcode.

### `redoc`

Embeds the locally vendored Redoc runtime:

```markdown
{{</* redoc "openapi.yaml" */>}}
```

The first argument is a page-relative, site-relative, or explicit HTTP
specification. The optional second argument contains Redoc element options.
Treat specification content as reviewed input and test large schemas on mobile.

### `iframe`

Embeds another page:

```markdown
{{</* iframe src="/demo/" name="demo" id="demo-frame"
    sandbox="allow-scripts allow-same-origin" */>}}
```

Set a descriptive `name`, a unique `id`, a fallback `sub` message, and the
narrowest viable `sandbox`. The defaults support width and automatic-height
behavior, but cross-origin documents cannot always be measured. An iframe is a
security and privacy boundary, not a general layout tool.

## OINK content components

The following components are additions carried by OINK. Each runtime is pinned
in `theme/VENDOR.json` and loaded on demand from the same origin.

### `details`

Creates an accessible disclosure:

```markdown
{{%/* details title="Show migration notes" closed="false" */%}} The body accepts
Markdown. {{%/* /details */%}}
```

`closed` defaults to true. Use a concise summary and do not hide mandatory
instructions inside a closed disclosure.

### `asciinema`

Plays an asciinema `.cast` recording:

```markdown
{{</* asciinema file="casts/install.cast" speed="1.25"
    markers="0:Start,18:Verify" fit="width" */>}}
```

The window title uses `title` when supplied and otherwise displays `file`. Other
important parameters include `theme`, `autoplay`, `loop`, `preload`, `speed`,
`startAt`, `poster`, `cols`, `rows`, `idleTimeLimit`, `pauseOnMarkers`,
`markers`, and `fit` (`width`, `height`, `both`, or `none`). Local recordings
can come from Hugo assets or a site-relative URL. Avoid autoplay, remove secrets
from terminal history, and provide nearby text for essential steps.

### `echarts`

Renders an Apache ECharts options object from JSON or YAML:

```markdown
{{</* echarts height="320px" */>}} xAxis: type: category data: [Build, Test,
Publish] yAxis: type: value series:

- type: bar data: [42, 38, 12] {{</* /echarts */>}}
```

`height` must be a safe CSS length; `theme` selects an ECharts theme and
`full=true` removes the normal content-width clamp.

Fenced JavaScript blocks inside the shortcode can define callbacks referenced
from the JSON/YAML options as `$fn:name`. That code runs in the visitor's
browser, so include only reviewed code from trusted authors. Prefer declarative
JSON/YAML when callbacks are unnecessary, add an adjacent textual summary, and
verify dark mode.

### `infographic`

Renders the locally vendored infographic DSL:

```markdown
{{</* infographic height="360px" */>}} infographic
list-row-simple-horizontal-arrow data items - label Build - label Test - label
Publish {{</* /infographic */>}}
```

`height` is `auto` or a safe CSS length; `full=true` removes the width clamp.
The DSL is data, not arbitrary HTML. Provide prose that communicates the same
conclusion when the visualization is unavailable.

### `doc-cards` and `nav-cards`

Both containers accept `cols` from 1 through 4. Their child cards accept
`title`, `link`, `image`, `alt`, `icon`, `desc`, `accent`, and `badge`:

```markdown
{{</* nav-cards cols="2" */>}}
{{</* nav-card title="Get started" link="/docs/get-started/"
      icon="fa-solid fa-rocket" desc="Build with Hugo {version}." */>}} {{</* nav-card title="Architecture" link="/docs/oink/architecture/"
      badge="Design" */>}}
{{</* /nav-cards */>}}
```

`doc-card`/`doc-cards` share the rendering contract and suit editorial content;
`nav-card`/`nav-cards` signal navigation. Description tokens such as `{version}`
resolve from site parameters. Card images are lazy-loaded; supply meaningful
`alt` text unless the image is decorative.

### `doc-carousel`

Places `doc-card` elements in a keyboard-scrollable carousel:

```markdown
{{</* doc-carousel label="Release highlights" */>}}
{{</* doc-card title="Local assets" */>}}No CDN required.{{</* /doc-card */>}}
{{</* doc-card title="Bilingual" */>}}Stable English and Chinese
routes.{{</* /doc-card */>}} {{</* /doc-carousel */>}}
```

`label` names the region for assistive technology. Previous/next buttons are
localized. Do not place information only in an off-screen card; the track must
remain usable without script.

### `param`

Prints a page parameter, falling back through Hugo's `Page.Param` rules to site
configuration:

```markdown
OINK version {{</* param version */>}}.
```

A missing parameter fails the build. Use `param` for scalar display values, not
for injecting unreviewed HTML. The internal `_param` compatibility shortcode
also performs numbered placeholder replacement for legacy content.

## Tabbed panes

Tabs group equivalent representations, such as YAML/TOML/JSON configuration.
They must not hide sequential steps or unrelated choices.

```markdown
{{</* tabpane text=true persist=lang */>}}
{{</* tab header="YAML" lang="yaml" */>}} params: offlineSearch: true
{{</* /tab */>}} {{</* tab header="TOML" lang="toml" */>}} [params]
offlineSearch = true {{</* /tab */>}} {{</* /tabpane */>}}
```

Selection persistence is local to the browser. `persist` accepts `header`,
`lang`, or `disabled`. The deprecated `persistLang` should not be used in new
content.

### Shortcode details

`text=true` renders inner content as prose rather than highlighted code.
`right=true` aligns tabs to the end. `langEqualsHeader=true` derives language
identifiers from headers. Pane defaults can be overridden per tab.

#### `tabpane`

The parent validates boolean and persistence parameters, builds unique IDs, and
ensures a selected tab. Use one disabled header tab only when it adds a useful
group label.

#### `tab`

`tab` must be inside `tabpane`. It accepts `header`, `selected`, `lang`,
`highlight`, `text`, `right`, and `disabled`. Only one tab should be selected.
Translate reader-facing headers, but keep language identifiers stable.

## Card panes

The legacy `cardpane`/`card` pair lays out Bootstrap-style cards. New navigation
surfaces should prefer OINK content cards, but existing Docsy content can keep
the compatibility component.

### Shortcode `card`: textual content

```markdown
{{%/* cardpane */%}}
{{%/* card header="Note" title="Local build" footer="Verified" */%}} Markdown
**content**. {{%/* /card */%}} {{%/* /cardpane */%}}
```

`header`, `title`, `subtitle`, and `footer` accept rendered text. Keep equal
cards concise and avoid using cards as a replacement for headings.

### Shortcode `card`: programming code

Set `code=true` and optionally `lang`/`highlight`:

```markdown
{{</* cardpane */>}} {{</* card code=true header="Go" lang="go" */>}}
fmt.Println("OINK") {{</* /card */>}} {{</* /cardpane */>}}
```

### Card groups

Adjacent cards in `cardpane` form a responsive group. Test unequal text length,
mobile stacking, code overflow, and both language variants.

## Include external files

The `readfile` shortcode reads a repository file at build time and either
renders it as Markdown or highlights it as code. The path is relative to the
current content file unless it begins with `/`.

### Reuse documentation

```markdown
{{%/* readfile "includes/installation.md" */%}}
```

Included Markdown is not an independent published page and is exempt from the
page-pair audit. If shared prose is reader-facing, create and select
language-specific include files deliberately; Hugo cannot translate an include.

## Installation

Keep reusable fragments under an `includes/` directory near their callers.
Document ownership and avoid deep include chains: readers and reviewers should
be able to locate the source quickly.

### Include code files

```markdown
{{</* readfile file="includes/config.yaml" code="true" lang="yaml" */>}}
```

`code=true` highlights the file with `lang`. Never include secrets, generated
credentials, or untrusted paths.

### Error reporting

A missing file fails the build. `draft=true` replaces that failure with a
visible draft warning, which is suitable only during authoring and must not
reach a release build.

## Conditional text

`conditional-text` selects content using `params.buildCondition`:

```markdown
{{%/* conditional-text include-if="enterprise,preview" */%}} This paragraph
appears only in matching builds. {{%/* /conditional-text */%}}
```

`include-if` and `exclude-if` accept condition lists. A condition cannot appear
in both. Use the feature for genuinely different published variants, not for
language selection; multilingual content belongs in translated page files.
