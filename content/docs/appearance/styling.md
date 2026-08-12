---
downstream_modified: true
title: Look and feel
weight: 60
icon: fa-solid fa-palette
description: Customize themes, typography, code styles, and page layouts.
---

OINK ships a complete visual system built on Bootstrap and Docsy, with local
fonts, icons, styles, and browser code. A consuming site can change tokens and
project styles without rebuilding a Node dependency tree.

## Project styles

Hugo Extended compiles the theme's SCSS through Hugo Pipes. Project overrides
participate in the same bundle, so production builds can minify, fingerprint,
and integrity-check one same-origin stylesheet.

### Project style files

Override these files in the site's `assets/scss/` directory:

| File                               | Purpose                                                     |
| ---------------------------------- | ----------------------------------------------------------- |
| `_variables_project.scss`          | Variables set before Bootstrap and OINK defaults            |
| `_variables_project_after_bs.scss` | Variables or maps that require Bootstrap definitions        |
| `_styles_project.scss`             | Project selectors loaded after the theme's component styles |

Start with the smallest override:

```scss
// assets/scss/_variables_project.scss
$primary: #315f8f;
$secondary: #b4762e;
```

```scss
// assets/scss/_styles_project.scss
body.td-blog {
  --td-body-font-family: 'Noto Serif', 'Noto Serif SC', serif;
}
```

Do not edit vendored Bootstrap, Font Awesome, or local font files for ordinary
branding. A theme update would overwrite those changes and obscure the
dependency boundary.

### Advanced style customization

For the stable customization layers, typography presets, semantic font roles,
and content-scoped patterns, read [Advanced customization][].

OINK's SCSS import order is:

1. Bootstrap functions;
2. project variables;
3. OINK defaults and Bootstrap;
4. post-Bootstrap project variables;
5. OINK components and local brand layer;
6. project styles.

Use variables or CSS custom properties for stable design decisions. Override a
selector only when no token exists, and scope it to the smallest component.
Inspect both light and dark output because many colors are theme-dependent.

#### :warning: Resetting internal styles {#resetting-internal-styles}

OINK's internal partials are not a public Sass API. Importing or suppressing
individual internal files couples a site to repository layout and import order.
If a product needs a fundamentally different shell, override a Hugo layout or
maintain a deliberate theme fork instead of resetting the entire stylesheet.

#### Extra styles {#extra-styles}

For isolated third-party CSS, publish a local asset from a hook:

```go-html-template
{{ $extra := resources.Get "css/extra.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $extra.RelPermalink }}"
  integrity="{{ $extra.Data.Integrity }}" crossorigin="anonymous">
```

Put the template in `layouts/partials/hooks/head-end.html`. Prefer the project
SCSS files when the rules belong to the site's design system. Never use a remote
stylesheet as an implicit fallback.

## Colors and color themes

Bootstrap semantic colors and OINK brand tokens are available throughout the
theme. Semantic names communicate intent better than literal colors.

### Site colors

Set Bootstrap variables before compilation:

```scss
$primary: #315f8f;
$secondary: #b4762e;
$success: #2c7a4b;
$warning: #9a6700;
$danger: #b42318;
```

OINK's canonical layer also exposes CSS properties such as `--td-brand-elev`,
`--td-brand-silk`, `--td-brand-copper`, `--td-brand-header-bg`, and
`--td-brand-mark-gradient`. Override them on `:root` and
`[data-bs-theme='dark']` as a pair:

```scss
:root {
  --td-brand-copper: #a66722;
}

[data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
}
```

### Light/dark color theme and mode support {#lightdark-color-feature}

Color **theme** is the palette used by a component; color **mode** is the
site-wide light or dark state. OINK uses Bootstrap's
`data-bs-theme="light|dark"` attribute and stores an explicit reader choice in
local browser storage. With no choice, it follows `prefers-color-scheme`.

Every custom component must define legible states for both modes, including
hover, focus, disabled, selected, and code colors. Do not encode meaning by
color alone.

## Light/dark color modes

The default sample site enables color-mode support and shows the selector:

```yaml
params:
  ui:
    showLightDarkModeMenu: true
```

The selector updates the document before normal interaction to limit a flash of
the wrong theme. OINK's script is local and does not contact an external
service.

### Choosing themes or color modes for your site

Use the default automatic behavior for most sites. Choose a forced mode only
when the complete visual identity has been tested in that mode and readers do
not need an alternative. Screenshots are not sufficient: check real text,
tables, alerts, forms, diagrams, code, and focus indicators.

### How to disable dark mode

To disable dark mode and hide the menu:

```yaml
params:
  ui:
    showLightDarkModeMenu: false
```

The experimental value `enable-only (experimental)` enables theme-aware styles
without showing a selector. Treat it as transitional because the configuration
surface can change.

### How to pick colors with good color-contrast {#pick-good-color-contrast}

Meet WCAG contrast requirements in every component state. Test actual computed
colors, including translucent layers over images. As a working minimum, normal
text needs 4.5:1 contrast and large text needs 3:1; focus and non-text UI
indicators also need adequate contrast. Automated tools catch common failures,
but keyboard and visual review remain necessary.

## Fonts

OINK does not fetch Google Fonts. Open Sans, Chakra Petch, IBM Plex Mono, and
Font Awesome files used by the theme are stored locally. The legacy Sass
variable `$td-enable-google-fonts` controls the bundled Open Sans faces despite
its historical name.

Set typography in `_variables_project.scss`:

```scss
$td-enable-google-fonts: true;
$font-family-sans-serif: 'Noto Sans SC', 'Open Sans', system-ui, sans-serif;
$font-family-monospace: 'IBM Plex Mono', ui-monospace, monospace;
```

OINK also exposes build-time typography presets and runtime-independent semantic
font roles. See [Advanced customization][] for the complete public interface and
examples that scope a font to blog, OpenAPI, or code-heavy pages.

If you add a font, subset and self-host it, include the required scripts, use
`font-display: swap`, document its license in `VENDOR.json`, and test CJK
fallback. Do not make page rendering depend on a font CDN.

## CSS utilities

Bootstrap utility classes are available in Markdown with raw HTML and in
layouts. Prefer semantic Markdown and OINK shortcodes for content; use utilities
for small, presentational adjustments that remain understandable at different
breakpoints. Project-wide patterns belong in `_styles_project.scss`.

## Code blocks

OINK supports Hugo Chroma by default and a locally vendored Prism option. Choose
one highlighter consistently; enabling both produces duplicate markup or styles.
For filenames, Copy policies, wrapping, collapse, line anchors, and shareable
Code Groups, see [Code blocks and Code Groups](/docs/components/code-blocks/).

### Code highlighting with Chroma

Chroma runs during the Hugo build and requires no browser highlighter. Use a
language identifier:

````markdown
```go
fmt.Println("hello")
```
````

#### Basic Chroma style configuration {#chroma-style-configuration}

Configure markup in Hugo:

```yaml
markup:
  highlight:
    guessSyntax: false
    noClasses: false
    lineNos: false
```

OINK expects class-based output so light and dark styles can differ. When
regenerating a palette, keep the generated CSS local and review it against the
brand background.

#### Light/dark code styles and more {#lightdark-code-styles}

The theme includes separate Chroma palettes under `assets/scss/td/chroma/` and
applies them by mode. Project overrides should target `.chroma` beneath the
relevant theme attribute, not hard-code a global background.

##### Selecting console block content

Use `console` for terminal transcripts. OINK styles prompts and output for
selection so readers can copy commands without decorative prompt text. Keep
commands and their output on distinct lines, and never rely on color alone to
distinguish them.

#### Code blocks without a specified language

An unlabelled fence renders as plain code. Use it only when no grammar applies,
and label command sessions as `console` or `bash` instead of asking Chroma to
guess.

#### Copy to clipboard

Copy buttons are enabled for Chroma unless `params.disable_click2copy_chroma` is
true. Clipboard access requires a secure context in deployed browsers. The
control must remain keyboard accessible and must not copy line numbers or
prompts.

### Code highlighting with Prism

Set:

```yaml
params:
  prism_syntax_highlighting: true
```

to use OINK's local `prism.js` and `prism.css`. This is a compatibility option
for existing sites; Chroma is preferred for a browser-light build.

#### Code blocks with no language

Prism also treats unlabelled blocks as plain text. Add the correct language
class rather than enabling heuristic detection.

#### Extending Prism for additional languages or plugins

Build and vendor the exact Prism bundle, replace the local files in a controlled
theme change, record its version and license, and add a fixture that exercises
the language or plugin. Do not pull Prism components from a CDN at runtime.

## Navbar

OINK's navbar contains the project identity, main menu, version and language
selectors when applicable, color-mode control, and search. On small screens,
overflowing primary items remain horizontally reachable.

### Default look and feel

The navbar uses the local brand palette and a fixed minimum height.

#### On mobile

The brand and actions stay visible while the primary menu can scroll. Test long
Chinese labels, 200% zoom, touch targets, focus order, and both page directions.

#### On desktop

The main menu expands inline; version, language, mode, and search controls stay
grouped. Avoid enough custom entries to push controls outside the viewport.

##### Translucent over cover images {#default-over-cover}

The `blocks/cover` shortcode marks the navbar as cover-aware. It starts
translucent and gains the normal background as the page scrolls.

### Customizing the navbar {#navbar-customization}

Use configuration for behavior and project SCSS for presentation. Preserve the
landmark, focus order, accessible labels, and responsive overflow behavior when
overriding the navbar partial.

#### Navbar height {#navbar-height}

Override `$td-navbar-min-height` before theme styles compile. Re-test anchor
offsets, sidebar height, mobile wrapping, and cover blocks because all depend on
this value.

#### Background color/opacity {#navbar-background}

Set `--td-navbar-bg-color` or `--td-brand-header-bg` in both modes. If the
background is translucent, validate contrast over every cover image and provide
a solid scrolled state.

#### Setting the navbar light/dark color theme {#navbar-lightdark-theme}

A page can set `ui.navbar_theme: dark` in front matter or cascade when its cover
requires light foreground controls. This changes navbar component styling; it
does not force the whole site's color mode.

#### Translucent over cover images {#customize-over-cover}

Disable translucency site-wide with:

```yaml
params:
  ui:
    navbar_translucent_over_cover_disable: true
```

Prefer this when cover imagery is unpredictable or accessibility review cannot
guarantee contrast.

### Styling your project logo and name

Place logo partial overrides under `layouts/partials/` and source assets under
`assets/` or `static/`. Provide meaningful alternative text for informative
marks and an empty alternative for a purely decorative mark. SVGs must use a
view box and inherit or define colors for both modes.

The OINK sample uses a text wordmark with a local gradient. Change the site
title in language configuration and the visual tokens in project SCSS; do not
replace brand text with an image when selectable text works.

### Light/dark-mode menu

The selector appears when `params.ui.showLightDarkModeMenu` is true. Keep it in
the shared navigation so its state applies consistently across languages and
page types.

## Alerts

Markdown alert types map to semantic OINK/Bootstrap styles. Customize `.alert-*`
and the alert render hook only as a pair, retain a visible label or icon, and
test links and inline code inside every background. See
[Adding Content](/docs/content/adding-content/#alerts) for syntax.

## Tables

Markdown tables receive responsive and theme-aware styles. Keep cells concise,
use real header cells, add a caption in custom HTML when context requires one,
and test horizontal overflow on mobile. A table should not be used to position
unrelated content.

## Customizing templates

Hugo resolves site layouts before theme layouts. Copy only the smallest partial
that needs changing and compare it during upstream syncs; a full `baseof.html`
override can silently miss future accessibility and asset-pipeline fixes.

### Add code to head or before body end

Use `layouts/partials/hooks/head-end.html` for head additions and
`layouts/partials/hooks/body-end.html` for scripts or closing integrations.
Self-host assets, load them only on pages that need them, and keep production
CSP compatible.

### Adding a banner before page content {#before-page-content}

Override the relevant hook or content partial with a condition based on page
parameters. A banner must not hide the page heading, trap keyboard focus, or
shift anchor targets beneath the fixed navigation.

## Adding custom class to the body element

Set `body_class` in page front matter or a section cascade:

```yaml
---
body_class: product-reference
---
```

OINK appends the value to its generated body classes. Use a project-specific,
semantic class name and never insert untrusted content into this field.

[Advanced customization]: /docs/appearance/customize/
