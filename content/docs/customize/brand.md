---
title: Brand and appearance
linkTitle: Brand and appearance
description: Change the site name, logo, favicon, accent color, light and dark palettes, and fonts. Use configuration and two SCSS entry points.
weight: 20
search_keywords:
  [brand, appearance, logo, favicon, accent colour, palette, dark mode, fonts, typography, scss]
aliases:
  - /docs/appearance/
  - /docs/appearance/typography/
  - /docs/appearance/styling/
  - /docs/appearance/customize/
---

This page assumes the site already builds ([Quick start](/docs/start/)).
Configure the name, logo, page width, and footer in `hugo.yml`. To select an
existing system or site font, use [`params.ui.fonts`](#fonts-in-config).
[Section accent colors](#theme-color) also have configuration keys.

Add icons under `static/`. Use `assets/scss/_variables_project.scss` for
SCSS variables and `assets/scss/_styles_project.scss` for custom styles or new
`@font-face` declarations only when needed. **Do not edit files inside the
theme directory**. An upgrade replaces them.

## Visual presets {#visual-presets}

OINK 1.2.0 defaults to Paper: warm paper backgrounds,
ink text, blue links, Plex Sans and framed tables. Slate
keeps OINK's existing cool blue-gray identity. Enable reader choice with:

```yaml
params:
  ui:
    preset: paper
    preset_menu: true
    dark_mode: true
```

The theme default for `preset_menu` is `false`. Choose `preset: slate` to keep
the previous appearance. Preset and mode are saved separately; selecting the
site default (identified in its tooltip) restores the site policy. All styles use one stylesheet
and local fonts.

Ink and Terminal are available as explicit opt-ins in OINK 1.2.0:

```yaml
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
```

Ink uses black/white surfaces, red markers, square panels and underlined prose
links. Terminal uses mono controls/headings, teal links, amber accents and
compact desktop navigation; its long-form prose stays sans-serif. Both support
light/dark mode and reuse existing fonts. The menu shows four compact style
buttons in a two-column grid, each with a colored icon and no experiment badge.
`preset_menu: true` offers Paper, Slate and the site default; it does not opt
into every experiment. Set `preset: ink` or `preset: terminal` to make an
experiment the site default, even without a reader menu. See the
[experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/)
for tested scope and remaining design work.

Custom dark brand rules using only `[data-bs-theme='dark']` have lower
specificity than Paper's dark palette. Retain Slate, or scope those rules to
`[data-td-preset='paper'][data-bs-theme='dark']`. Font configuration and section
`theme_color` overrides keep their precedence in every preset. Print remains
light on white paper.

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

The top-level `title` is the fallback. The value of `languages.<lang>.title` takes precedence.

## Logo and wordmark {#logo}

The theme ships `assets/icons/logo.svg` and uses it by default. To replace it,
put the icon file in the site's `assets/` or `static/` and point the
configuration at it.

```yaml {title="hugo.yml"}
params:
  logo: images/product-mark.svg
  wordmark: logo.svg
```

- `params.logo` is the square mark used by the navbar, sidebar, and footer. Under `assets/`, it uses Hugo's resource pipeline and can be fingerprinted. Under `static/`, Hugo publishes it unchanged. The path is relative to the `assets/` or `static/` root.
- `params.wordmark` is the horizontal wordmark. If you set it, the navbar replaces "icon + site name" with it. On a narrow screen, the navbar falls back to `params.logo`. If you do not set it, the navbar retains "icon + site name".

Crop the source SVG closely around the artwork so that sizes align. The SVG
must have a `viewBox`. Its colors should inherit `currentColor` or provide
sufficient contrast in both light and dark modes.

This site sets neither parameter. The navbar combines the theme's
`assets/icons/logo.svg` with the site title in the display font.

## favicon {#favicon}

The favicon has no parameter. The theme scans the site's `static/` directory
for conventional filenames. For each file it finds, it emits the corresponding
`<link>` on every page:

| File | Link generated |
| --- | --- |
| `static/favicon.ico` | `rel="icon"` |
| `static/favicon.svg` | `rel="icon"` `type="image/svg+xml"` |
| `static/favicon-32x32.png` | `rel="icon"` with `sizes`, emitted in ascending size order |
| `static/apple-touch-icon.png` | `rel="apple-touch-icon"` |
| `static/apple-touch-icon-180x180.png` | `rel="apple-touch-icon"` with `sizes` |

The minimum sufficient set is `favicon.ico`, `favicon.svg`, and
`apple-touch-icon.png`. A file with a size suffix must be square (`NxN`).
Otherwise, the theme does not recognize it.

Generate these with any graphics tool. The theme needs no Node.js, and Hugo
simply publishes what is already in `static/`.

The scan does not cover extra head metadata, such as a Web App Manifest.
Emit it through `layouts/_partials/hooks/head-end.html`. To change discovery
rules, such as the directory or accepted filenames, override
`layouts/_partials/favicons.html` in the site's `layouts/`.

## Accent colour and palette {#colors}

Color has two layers. Bootstrap's semantic colors use Sass variables at
compile time. OINK's brand layer uses CSS custom properties at run time.

First change the semantic colors. They determine the colors of buttons, links,
and callouts:

```scss {title="assets/scss/_variables_project.scss"}
$primary: #315f8f;
$secondary: #b4762e;
$success: #2c7a4b;
$warning: #9a6700;
$danger: #b42318;
```

The theme loads this file **before** Bootstrap and the OINK defaults. Override
Sass variables here. If you need a variable or map already defined by Bootstrap,
use `_variables_project_after_bs.scss` instead.

The brand layer uses CSS custom properties. You **must override light and dark
in pairs**. Otherwise, one mode retains the original color:

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

Available brand properties include `--td-brand-elev` for overlay backgrounds
and `--td-brand-silk` for secondary text. The accent and muted accent use
`--td-brand-copper` and `--td-brand-copper-dim`. Rules use `--td-brand-line-strong`,
and the navbar background uses `--td-brand-header-bg`. Shadows use
`--td-brand-shadow-sm` / `--td-brand-shadow-md`. The brand gradient uses
`--td-brand-mark-from` / `--td-brand-mark-to` / `--td-brand-mark-gradient`.

## Section theme colour {#theme-color}

The brand palette above sets the site's overall color. The `theme_color` key
uses one hex color to tint the shell's **accent backgrounds**. This color helps
readers identify their current part of the site.

```yaml {title="hugo.yml"}
params:
  ui:
    theme_color: '#6d28d9'
    theme_color_dark: '#a78bfa' # optional
```

This key is more useful per section than for the entire site. Set it in the
section root's `cascade` to give the section its own color. For example, Docs
can use navy, Blog violet, and Book orange. The site default retains the brand
color:

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

Hugo resolves these cascade values on the section page as well as its
descendants, so the pair is declared once. The same resolved pair drives the
page's accent and that section's mark in the root switcher.

**What it touches:** the selected sidebar row, adjacent rows' gray hover
backgrounds, and hover fills. It colors the outline pill and its moving rail
and dot, Book chapter headings on hover, and tag and chip hover states. It
also colors content card borders and share button fills on hover, text
selection, focus rings, and sidebar switcher root marks.

**What it deliberately does not touch:** prose links, external URLs, and
inline code. These use consistent reading conventions across sections. Readers
should recognize code, prose, and links even on pages with many identifiers.
Therefore, the accent uses its own custom property. It does not change
Bootstrap's link color.

The dark color is optional. If you omit it, the theme lightens the light color
toward white until it meets AA body-text contrast on the dark canvas. This
prevents an unreadable dark palette when you supply only one color. Set the
dark color explicitly if the derived hue does not match your brand.
The light color is required. If `theme_color_dark` is alone or accompanies an
invalid `theme_color`, neither mode changes color. The theme warns and retains
the default palette. It does not tint only dark mode.

To remove the section color from one page, set `theme_color: false` in its
front matter. This removes both the light color and inherited dark color. The
page uses the default palette without a warning. Any other non-hex value,
including a number, `true`, or a named color, produces a warning.

> [!CAUTION] Contrast is checked, not enforced
> The theme checks your color against its own canvases. It warns if contrast
> is below AA body text (4.5:1). The color still appears in the output. You may
> choose it for a custom canvas or brand requirement. The warning includes an
> `ignoreLogs` id that can silence it. Review the contrast on the actual canvas and adjust the color when needed.
>
> The check compares the color with the page canvas. Some interactive surfaces
> use it for both text and a translucent background. For example, a linked
> solid badge uses accent text over a 12% accent background. This combination
> provides less contrast than the canvas check. If a color barely passes,
> inspect these surfaces. Use a darker color when necessary.

Hugo merges params by key. If a section cascade sets `theme_color_dark`, a page
that overrides only `theme_color` still inherits that dark value. Override
both values or neither.

## Light and dark mode {#dark-mode}

The theme does **not** show a light/dark control by default. To enable it:

```yaml {title="hugo.yml"}
params:
  ui:
    dark_mode: true
```

The sun/moon icon shows the current state: sun for light, moon for dark.
Click Appearance in the navbar or footer to open the Light / Dark / System
radio group. It supports touch and keyboard; on phones it opens a bottom
sheet. The preference is saved locally and synchronized across tabs. No saved
choice means follow `prefers-color-scheme`. The inline head script applies the
resolved mode before the stylesheet loads.

To enable the dark palette without the control, set
`dark_mode: { show_menu: false, enable: true }`. The default,
`dark_mode: false`, enables neither.

Custom components need readable hover, focus, disabled and selected states in
both modes, with at least 4.5:1 contrast for body text and 3:1 for large text.

## Fonts {#fonts}

The typography policy is selected at build time; visual preset switching chooses its bundled faces:

```yaml {title="hugo.yml"}
params:
  ui:
    typography: technical # technical | system
```

- `technical` (the default): Paper uses IBM Plex Sans for interface, body and display text; Slate uses Inter for interface/body and Chakra Petch for display. Both use Chakra Petch for the wordmark and IBM Plex Mono for code. Chinese and emoji use platform fallbacks. Plex Sans and Inter include local Latin, Cyrillic, Greek and Vietnamese subsets. No Google Fonts request is made.
- Experimental fonts: Ink uses Inter for UI, prose and headings; Terminal uses IBM Plex Mono for controls/headings and Plex Sans for prose. Both reuse existing code fonts. Explicit `fonts.ui` still supplies the main face; use `fonts.body` for a separate prose face.
- `system`: interface, display, metadata, print, and monospace roles use the platform stack. The browser requests no brand font. Font files remain bundled with the theme, but the output does not reference them.

If the value is invalid, the theme warns and falls back to `technical`. Normal
`hugo server` preview remains usable. The selected value appears in
`<html data-td-typography="…">`. Check it in the browser.

### Custom fonts {#custom-fonts}
Eight CSS custom properties define the font roles. Override these properties
instead of searching for component selectors:

| Property | Config key | Where it is used |
| --- | --- | --- |
| `--td-ui-font-family` | `ui` | Navigation, controls and interface text |
| `--td-body-font-family` | `body` | Body text and blog posts |
| `--td-heading-font-family` | `heading` | Headings in the body |
| `--td-code-font-family` | `code` | Code and terminals |
| `--td-display-font-family` | `display` | Display headings |
| `--td-meta-font-family` | `meta` | Technical labels and metadata |
| `--td-brand-font-family` | `brand` | Wordmark |
| `--td-print-font-family` | `print` | Print body text |

The `ui` role is the main font. The `body` role resolves through it, and
`heading` resolves through `body`. One line can therefore change the interface,
prose, and headings together.

#### From configuration {#fonts-in-config}
To change only font families, use `params.ui.fonts`. You do not need SCSS:

```yaml {title="hugo.yml"}
params:
  ui:
    fonts:
      # The main face: interface, body and headings follow it
      ui: "'Source Han Sans SC', 'PingFang SC', sans-serif"
      # Monospace needs a CJK fallback, or mixed code blocks stop aligning
      code: "'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace"
```

These values are **family names, not font files**. This key never causes the
theme to download or load a font. Each family must already exist on the reader's
system or have a site `@font-face` declaration. End every list with a generic
family (`sans-serif`, `monospace`, `serif`). Readers without your font use this
fallback.

Values accept only plain font family syntax: quoted names, bare identifiers,
a leading hyphen (`-apple-system`), and names in any script (`苹方` is a
family name). They reject semicolons, braces, parentheses, `url()`, and angle
brackets. An unknown role or unsafe value produces a warning. The theme drops
**only that entry** and retains the rest of the map. If the site sets no values,
the theme adds no style element to `<head>`.

The block renders after the stylesheet. At equal specificity, an authored font
therefore takes precedence over the `typography` preset.

#### From a stylesheet {#fonts-in-css}
To bundle your own font file or change the font for one content kind, use a
stylesheet. Put the `.woff2` file in the site's `static/webfonts/`. Declare
the font in the project stylesheet. Then override the roles:

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

Roles inherit through normal CSS rules. To change the font for one content
kind, you do not need component selectors:

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

A site migrating from Docsy can retain its font configuration. The old Sass
variables still supply the corresponding roles from `_variables_project.scss`.
They take precedence over preset defaults:

| Legacy Sass variable | Font role it feeds | Note |
| --- | --- | --- |
| `$td-fonts-serif` | `--td-ui-font-family` / `--td-body-font-family` | Docsy's interface stack, assigned to `$font-family-sans-serif` |
| `$font-family-sans-serif` | `--td-ui-font-family` / `--td-body-font-family` | If a project supplies its own stack, the `technical` preset no longer prepends the preset’s bundled sans face |
| `$font-family-base` | `--td-ui-font-family` / `--td-body-font-family` | Bootstrap's body variable, reaching the role through `--bs-body-font-family` |
| `$headings-font-family` | `--td-heading-font-family` | Unset, headings inherit the body role |
| `$font-family-code` | `--td-code-font-family` | Code, terminals and `pre` / `code` / `kbd` |
| `$td-font-family-monospace` | `--bs-font-monospace` | Assigned to `$font-family-monospace` |
| `$font-family-monospace` | `--bs-font-monospace` | Under the `system` preset, an explicit project value takes precedence over the platform monospace stack |

The theme no longer reads Docsy's three Google Fonts variables:
`$td-enable-google-fonts`, `$td-google-font-name`, and `$td-web-font-path`.
Leaving them in `_variables_project.scss` causes no failure and has no effect.
The theme bundles IBM Plex Sans, Inter, Chakra Petch, and IBM Plex Mono. No preset
requests Google Fonts. The print role `--td-print-font-family` follows the body
role. The theme bundles no separate print font.

YAML accepts only font family names. It accepts neither remote font URLs nor
arbitrary CSS. Font files and styles must be auditable local inputs. A normal
build makes no network request for a font.

## Page width {#page-width}

```yaml {title="hugo.yml"}
params:
  page_width: normal # normal | wide | full
```

The `page_width` key controls the overall shell width. Override it per page or
per section through a cascade. Book pages also support `reading_width` (`slim` /
`normal` / `wide`), which changes the body's reading width instead of the shell.
If either key has an invalid value, the theme warns and uses a fallback.

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

Page front matter, including a section cascade, can override the footer style.
This site's documentation section uses `footer_style: slim`. An unrecognized
value warns and falls back to `fat`.

Store grid data in `data/footer/<language>.yaml`. See
[Navigation and menus](/docs/customize/navigation/#footer). If `fat` is configured
but no data exists, the footer automatically falls back to `slim`. You can
therefore enable it before you write the content.

The `params.copyright` key accepts a Markdown string or a map with `authors` /
`from_year` / `to_year`. The value `present` means this year. The
`footer_center_info` key accepts inline Markdown for the footer's center.
Set it explicitly to an empty string to hide that region.

## SCSS entry points, and what not to do {#scss}

The site's SCSS overrides join the theme's single style bundle. A production
build still emits one fingerprinted stylesheet with an integrity attribute.
Put the three entry files under the site's `assets/scss/`:

| File | When to use it |
| --- | --- |
| `_variables_project.scss` | Sass variables set before Bootstrap and the OINK defaults (`$primary`, the font variables) |
| `_variables_project_after_bs.scss` | Variables or maps that depend on Bootstrap's own definitions |
| `_styles_project.scss` | Selectors and CSS custom properties written after the theme's component styles |

The compilation order is: Bootstrap functions → project variables → OINK
defaults and Bootstrap → post-Bootstrap project variables → OINK components and
the brand layer → project styles.

The CSS interface has a defined boundary. The eight font roles in
[Fonts](#fonts) and the `--td-brand-*` properties are public. The theme preserves
their names and meanings across minor versions. Component aliases such as
`--td-asciinema-font-family` work only within their component. Undocumented
variables, such as `--td-shell-*`, are implementation details. They may be
renamed or removed at any time.

What not to do:

- Do not edit any file inside the theme directory (`hugo mod` overwrites it);
- Do not `@import` the theme's internal partials individually. They are not a public Sass interface, and their import order may change;
- Do not override `baseof.html` to change one color. If a design variable exists, use it. Otherwise, write the narrowest selector that works;
- Do not reference a remote stylesheet or a font CDN.

For additional third-party CSS, publish a local resource through
`layouts/_partials/hooks/head-end.html`. Do not write a `<link>` in Markdown.

## Verify {#verify}

```bash
hugo --printPathWarnings
```

- The build prints `Total in …` with no ERROR;
- The page source has `data-td-typography="technical"` (or your chosen preset) on `<html>`;
- In the browser the navbar shows your logo and site name, and the tab shows your favicon;
- Switch to dark mode. Check body text, tables, callouts, code blocks, and focus rings again. Verify every color change in both modes;
- Switch language and confirm the site name changes with it.

To verify the font change, inspect a paragraph's `font-family` in the browser's
developer tools. It should include your declared family. Check the rendered
font as well to confirm that the local file or system fallback is being used.

## Related {#related}

- [Configuration](/docs/customize/config/#identity) — types and defaults of the brand parameters
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions and footer data
- [Layouts and page types](/docs/customize/layout/) — shell, sidebar and table of contents
- [Images](/docs/components/image/) — images in the body, light/dark pairs and captions
- [Home and landing pages](/docs/customize/home/) — hero, sections and landing data
