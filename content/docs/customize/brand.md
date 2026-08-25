---
title: Brand and appearance
linkTitle: Brand and appearance
description: Replace the site name, logo, favicon, accent colour, light and dark palettes and fonts, using configuration and two SCSS entry points.
weight: 20
search_keywords:
  [brand, appearance, logo, favicon, accent colour, palette, dark mode, fonts, typography, scss]
aliases:
  - /docs/appearance/
  - /docs/appearance/typography/
  - /docs/appearance/styling/
  - /docs/appearance/customize/
---

This page covers a site's appearance: the name and logo live in `hugo.yml`,
colours and fonts go through SCSS entry points, and page width and footer shape
are parameters. It assumes the site already builds
([Quick start](/docs/start/)).

There are four things to change: `hugo.yml`, the icons under `static/`,
`assets/scss/_variables_project.scss`, and
`assets/scss/_styles_project.scss`. **Do not edit files inside the theme
directory**: the theme is a Hugo Module, and an upgrade replaces the whole
directory.

## Site name {#site-title}

The site name appears in the navbar, the browser title and the footer. A
multilingual site writes one per language:

```yaml {title="hugo.yml"}
title: Product Docs

languages:
  en:
    title: Product Docs
    label: English
    locale: en-US
    weight: 1
  zh:
    title: 产品文档
    label: 简体中文
    locale: zh-CN
    weight: 2
```

The top-level `title` is the fallback, and `languages.<lang>.title` wins.

## Logo and wordmark {#logo}

The theme ships `assets/icons/logo.svg` and uses it by default. To replace it,
put the icon file in the site's `assets/` or `static/` and point the
configuration at it.

```yaml {title="hugo.yml"}
params:
  logo: images/product-mark.svg
  wordmark: logo.svg
```

- `params.logo` is the square mark, shared by the navbar, the sidebar and the footer. Under `assets/` it goes through Hugo's resource pipeline (and can be fingerprinted); under `static/` it is published as is. Either way the path is relative to the `assets/` or `static/` root.
- `params.wordmark` is the horizontal wordmark. Once set, the navbar uses it instead of "icon + site name", falling back to `params.logo` when the screen is too narrow. Left unset, "icon + site name" stays.

Crop the source SVG tight to the artwork, or the sizes will not line up. An SVG
needs a `viewBox`, and its colours should inherit `currentColor` or hold enough
contrast in both light and dark.

This site leaves both unset: the navbar pairs the theme's own
`assets/icons/logo.svg` with the site title, drawn in the display font.

## favicon {#favicon}

The favicon has no parameter. The theme scans the site's `static/` directory for
conventional filenames and emits the matching `<link>` on every page for
whichever it finds:

| File | Link generated |
| --- | --- |
| `static/favicon.ico` | `rel="icon"` |
| `static/favicon.svg` | `rel="icon"` `type="image/svg+xml"` |
| `static/favicon-32x32.png` | `rel="icon"` with `sizes`, emitted in ascending size order |
| `static/apple-touch-icon.png` | `rel="apple-touch-icon"` |
| `static/apple-touch-icon-180x180.png` | `rel="apple-touch-icon"` with `sizes` |

A sufficient minimum is `favicon.ico` plus `favicon.svg` plus
`apple-touch-icon.png`. A file with a size suffix has to be square (`NxN`) or it
is not recognized.

Generate these with any graphics tool. The theme needs no Node.js, and Hugo
simply publishes what is already in `static/`.

Extra head metadata such as a Web App Manifest is outside the scan; emit it
yourself through the `layouts/_partials/hooks/head-end.html` hook. To change the
discovery rules themselves (a different directory, more filenames), override
`layouts/_partials/favicons.html` in the site's `layouts/`.

## Accent colour and palette {#colors}

Colour comes in two layers: Bootstrap's semantic colours (Sass variables, at
compile time) and OINK's brand layer (CSS custom properties, at run time).

Change the semantic colours first; they decide the tone of buttons, links and
callouts:

```scss {title="assets/scss/_variables_project.scss"}
$primary: #315f8f;
$secondary: #b4762e;
$success: #2c7a4b;
$warning: #9a6700;
$danger: #b42318;
```

This file is loaded **before** Bootstrap and the OINK defaults, which is where
Sass variables are overridden. To reference a variable or map Bootstrap has
already defined, use `_variables_project_after_bs.scss` instead.

The brand layer is a set of CSS custom properties, and light and dark **must be
overridden in pairs** or one mode leaks the original colour:

```scss {title="assets/scss/_styles_project.scss"}
:root {
  --td-brand-copper: #a66722;
  --td-brand-mark-from: #1d588c;
  --td-brand-mark-to: #a66722;
}

[data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
  --td-brand-mark-from: #7fb8e8;
  --td-brand-mark-to: #e0a35c;
}
```

The brand properties available are `--td-brand-elev` (overlay ground),
`--td-brand-silk` (secondary text), `--td-brand-copper` and
`--td-brand-copper-dim` (the accent and its muted form),
`--td-brand-line-strong` (rules), `--td-brand-header-bg` (navbar background),
`--td-brand-shadow-sm` / `--td-brand-shadow-md` (shadows), and
`--td-brand-mark-from` / `--td-brand-mark-to` / `--td-brand-mark-gradient` (the
brand gradient).

## Section theme colour {#theme-color}

The brand palette above sets the colour of the whole site. `theme_color` is the
smaller instrument beside it: one hex that tints the **accent grounds** of the
shell, so a reader can tell which part of the site they are standing in without
being told.

```yaml {title="hugo.yml"}
params:
  ui:
    theme_color: '#6d28d9'
    theme_color_dark: '#a78bfa' # optional
```

It is more useful per section than site-wide. Written into a section root's
`cascade`, it gives that whole section an identity — a navy Docs beside a
violet Blog and an orange Book — while the site default stays the brand colour:

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

Hugo resolves these cascade values on the section page as well as its
descendants, so the pair is declared once. The same resolved pair drives the
page's accent and that section's mark in the root switcher.

**What it touches:** the selected sidebar row and the greyed ground its
neighbours take under the pointer, hover washes, the outline pill and its
travelling rail and dot, a Book chapter's headings under the pointer, tag and
chip hovers, a content card's hovered edge, a share button's hover fill, text
selection, focus rings, and each root's mark in the sidebar switcher.

**What it deliberately does not touch:** prose links, external URLs, and
inline code. Those are reading conventions, not brand surfaces — a page dense
in identifiers should read as code and prose in every section, and a link
should look like a link wherever it is. This is why the accent is its own
custom property rather than a repaint of Bootstrap's link colour.

The dark half is optional. Left out, it is derived by lightening the light
colour toward white until it clears AA body text on the dark canvas, so a
single-colour author cannot produce an unreadable dark palette. Name it
yourself when the derived value no longer matches the brand hue you want.
The light colour is the key: `theme_color_dark` on its own, or beside an
invalid `theme_color`, colours nothing in either mode — the theme warns and
keeps the default palette rather than tint dark mode alone.

A page inside a coloured section can decline the colour with the theme's
bare-boolean idiom: `theme_color: false` in front matter opts that page out —
inherited dark half included — and reverts to the default palette without a
warning. Any other non-hex value (a number, `true`, a named colour) warns.

> [!CAUTION] Contrast is checked, not enforced
> The theme reads your colour against its own canvases and warns when it falls
> below AA body text (4.5:1). The colour still ships: a custom canvas or a
> brand mandate is your call. The warning carries an `ignoreLogs` id that
> silences it, and because publishing builds with `--panicOnWarning`, the gate
> stops until you either darken the colour or silence the check.
>
> The check reads the colour against the page canvas. Some interactive
> surfaces reuse it as both ink and a translucent wash — a linked solid badge,
> for example, uses accent ink over a 12% accent wash — and that pairing is
> tighter than the canvas check. If a colour only just passes, inspect those
> surfaces and go one step darker when needed.

Hugo merges params by key, so a page overriding `theme_color` inside a section
whose cascade also sets `theme_color_dark` inherits that dark value. Override
both, or neither.

## Light and dark mode {#dark-mode}

The theme does **not** show a light/dark control by default. To enable it:

```yaml {title="hugo.yml"}
params:
  ui:
    dark_mode: true
```

A theme control then appears in the navbar: clicking it toggles light and dark,
and hovering or focusing it expands "follow system / light / dark". The reader's
choice is stored locally in the browser, and with no choice it follows
`prefers-color-scheme`. The switching script sets `data-bs-theme` before the
first paint, so there is no theme flash.

For the dark palette without the control, write
`dark_mode: { show_menu: false, enable: true }`; `dark_mode: false` (the
default) enables neither.

Custom components need readable hover, focus, disabled and selected states in
both modes, with at least 4.5:1 contrast for body text and 3:1 for large text.

## Fonts {#fonts}

There are two font presets, decided at build time with no JavaScript involved:

```yaml {title="hugo.yml"}
params:
  ui:
    typography: technical # technical | system
```

- `technical` (the default): interface and body text use the bundled Inter (variable weight, with Latin / Cyrillic / Greek / Vietnamese subsets, while Chinese and emoji fall through to platform fonts), display headings use Chakra Petch, and code uses IBM Plex Mono. All font files are local, and Google Fonts is never requested.
- `system`: the interface, display, metadata, print and monospace roles all fall back to the platform stack, and the browser requests no brand font. The font files still ship with the theme; they are simply not referenced.

An invalid value warns and falls back to `technical`, so an ordinary
`hugo server` stays usable; publishing gates run `--panicOnWarning`, which is
where that warning becomes a hard failure. The chosen value is written to
`<html data-td-typography="…">` and can be confirmed in the browser.

### Custom fonts {#custom-fonts}
The font roles are seven CSS custom properties. Override them rather than
hunting for component selectors:

| Property | Config key | Where it is used |
| --- | --- | --- |
| `--td-ui-font-family` | `ui` | Navigation, controls and interface text |
| `--td-body-font-family` | `body` | Body text and blog posts |
| `--td-heading-font-family` | `heading` | Headings in the body |
| `--td-code-font-family` | `code` | Code and terminals |
| `--td-display-font-family` | `display` | Wordmark and display headings |
| `--td-meta-font-family` | `meta` | Technical labels and metadata |
| `--td-print-font-family` | `print` | Print body text |

`ui` is the main face: `body` resolves through it and `heading` through `body`,
so a single line moves the interface, the prose and the headings together.

#### From configuration {#fonts-in-config}
To swap font families and nothing else, skip SCSS and write
`params.ui.fonts`:

```yaml {title="hugo.yml"}
params:
  ui:
    fonts:
      # The main face: interface, body and headings follow it
      ui: "'Source Han Sans SC', 'PingFang SC', sans-serif"
      # Monospace needs a CJK fallback, or mixed code blocks stop aligning
      code: "'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace"
```

These are **family names, not font files**. The theme never downloads or loads
a font because of this key: a family here must be one the reader already has,
or one the site declared in an `@font-face` of its own. End every list with a
generic family (`sans-serif`, `monospace`, `serif`) — that is where a reader
without your face lands.

Values are gated to plain font family syntax: quoted names, bare identifiers,
a leading hyphen (`-apple-system`), and names spelled in any script (`苹方` is
a family name). Semicolons, braces, parentheses, `url()` and angle brackets do
not pass. An unknown role or an unsafe value warns and is dropped **on its
own**; the rest of the map still ships. A site that sets nothing gets no style
element in `<head>` at all.

The block renders after the stylesheet, which is what lets an authored face
outrank the `typography` preset at equal specificity.

#### From a stylesheet {#fonts-in-css}
To ship a font file of your own, or to change the face for one kind of content
only, use a stylesheet. Put the `.woff2` in the site's `static/webfonts/`,
declare the face in the project stylesheet, then rewrite the roles:

```scss {title="assets/scss/_styles_project.scss"}
@font-face {
  font-family: 'My Sans';
  font-display: swap;
  font-style: normal;
  font-weight: 400 800;
  src: url('../webfonts/my-sans-variable.woff2') format('woff2');
}

:root {
  --td-ui-font-family: 'My Sans', 'Noto Sans SC', sans-serif;
  --td-body-font-family: var(--td-ui-font-family);
  --td-heading-font-family: var(--td-ui-font-family);
  --td-display-font-family: var(--td-heading-font-family);
}
```

Roles inherit by ordinary CSS rules, so changing the font for one kind of
content needs no component selectors either:

```scss {title="assets/scss/_styles_project.scss"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

A monospace stack needs a CJK fallback, or mixed code blocks fail to align:

```scss {title="assets/scss/_styles_project.scss"}
:root {
  --td-code-font-family: 'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

A site migrating from Docsy need not change how it writes this. The old Sass
variables still feed the corresponding roles, still work from
`_variables_project.scss`, and take precedence over the preset defaults:

| Legacy Sass variable | Font role it feeds | Note |
| --- | --- | --- |
| `$td-fonts-serif` | `--td-ui-font-family` / `--td-body-font-family` | Docsy's interface stack, assigned to `$font-family-sans-serif` |
| `$font-family-sans-serif` | `--td-ui-font-family` / `--td-body-font-family` | Once a project supplies its own stack, the `technical` preset stops putting Inter in front of it |
| `$font-family-base` | `--td-ui-font-family` / `--td-body-font-family` | Bootstrap's body variable, reaching the role through `--bs-body-font-family` |
| `$headings-font-family` | `--td-heading-font-family` | Unset, headings inherit the body role |
| `$font-family-code` | `--td-code-font-family` | Code, terminals and `pre` / `code` / `kbd` |
| `$td-font-family-monospace` | `--bs-font-monospace` | Assigned to `$font-family-monospace` |
| `$font-family-monospace` | `--bs-font-monospace` | Under the `system` preset, an explicit project value beats the platform monospace stack |

Docsy's three Google Fonts variables — `$td-enable-google-fonts`,
`$td-google-font-name` and `$td-web-font-path` — are no longer read by the
theme. Leaving them in `_variables_project.scss` breaks nothing and does
nothing: what ships with the theme is Inter, Chakra Petch and IBM Plex Mono, and
neither preset requests anything from Google Fonts. The print role
`--td-print-font-family` follows the body role, and the theme ships no separate
font for paper.

YAML accepts font family names only — neither a remote font URL nor arbitrary
CSS. Font files and styles must both be auditable local inputs, and an ordinary
build makes no network request for a font.

## Page width {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

`page_width` controls the overall shell width and can be overridden per page or
per section by cascade. Book pages additionally have `reading_width` (`slim` /
`normal` / `wide`), which changes the reading measure of the body rather than
the shell. An invalid value in either key fails the build.

## Footer {#footer}

```yaml {title="hugo.yml"}
params:
  ui:
    footer_style: fat # fat | slim | none
  copyright:
    authors: '[The product team](https://example.com/)'
    from_year: 2026
    to_year: present
  footer_center_info: 'Powered by [Oink](https://oink.pgsty.com)'
```

- `fat` (the default): a multi-column link grid plus the copyright line;
- `slim`: the copyright line only;
- `none`: no footer at all.

Page front matter (including a section cascade) can override it; this site's
documentation section uses `footer_style: slim`. An unrecognized value fails the
build.

The grid's data lives in `data/footer/<language>.yaml` — see
[Navigation and menus](/docs/customize/navigation/#footer). With `fat`
configured but no data, it degrades to `slim` automatically, so it can be
enabled before the content exists.

`params.copyright` accepts a Markdown string, or a map of `authors` /
`from_year` / `to_year` (`present` means this year). `footer_center_info` is
inline Markdown in the centre of the footer, and setting it explicitly to an
empty string hides that region.

## SCSS entry points, and what not to do {#scss}

A site's SCSS overrides join the theme's single style bundle, and a production
build still emits one fingerprinted stylesheet with an integrity attribute.
Three entry files go under the site's `assets/scss/`:

| File | When to use it |
| --- | --- |
| `_variables_project.scss` | Sass variables set before Bootstrap and the OINK defaults (`$primary`, the font variables) |
| `_variables_project_after_bs.scss` | Variables or maps that depend on Bootstrap's own definitions |
| `_styles_project.scss` | Selectors and CSS custom properties written after the theme's component styles |

The compilation order is: Bootstrap functions → project variables → OINK
defaults and Bootstrap → post-Bootstrap project variables → OINK components and
the brand layer → project styles.

The CSS interface has a defined boundary. The seven font roles in
[Fonts](#fonts) and the `--td-brand-*` properties are public, and the theme
keeps their names and meanings across minor versions. Component aliases such as
`--td-asciinema-font-family` promise only to work within that component, and
undocumented variables such as the `--td-shell-*` family are implementation
detail that may be renamed or removed at any time.

What not to do:

- Do not edit any file inside the theme directory (`hugo mod` overwrites it);
- Do not `@import` the theme's internal partials individually — they are not a public Sass interface and their import order may change;
- Do not override `baseof.html` to change one colour. Use a design variable where one exists, and otherwise write the narrowest selector that works;
- Do not reference a remote stylesheet or a font CDN.

For additional third-party CSS, publish a local resource through the
`layouts/_partials/hooks/head-end.html` hook rather than writing a `<link>` in
Markdown.

## Verify {#verify}

```bash
hugo --printPathWarnings --panicOnWarning
```

- The build prints `Total in …` with no ERROR and no WARN;
- The page source has `data-td-typography="technical"` (or your chosen preset) on `<html>`;
- In the browser the navbar shows your logo and site name, and the tab shows your favicon;
- Switch to dark mode and look again at body text, tables, callouts, code blocks and focus rings. A colour change is easy to verify in only one mode;
- Switch language and confirm the site name changes with it.

To check whether the font really was replaced, inspect any paragraph's
`font-family` in the browser's developer tools: it should be the face you
declared rather than `Inter`.

## Related {#related}

- [Configuration](/docs/customize/config/#identity) — types and defaults of the brand parameters
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions and footer data
- [Layouts and page types](/docs/customize/layout/) — shell, sidebar and table of contents
- [Images](/docs/components/image/) — images in the body, light/dark pairs and captions
- [Home and landing pages](/docs/customize/home/) — hero, sections and landing data
