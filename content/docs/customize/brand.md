---
title: Brand and appearance
linkTitle: Brand and appearance
description: Give the site your name, logo, favicon, accent color and fonts, choose a visual preset, and add your own CSS.
weight: 20
search_keywords:
  [brand, appearance, logo, favicon, accent colour, palette, dark mode, fonts, typography, scss]
aliases:
  - /docs/appearance/
  - /docs/appearance/typography/
  - /docs/appearance/styling/
  - /docs/appearance/customize/
---

A site starts to look like your own once it carries your name, your logo and
your color. All three are settings in `hugo.yml`, so a first pass at a brand is
one edit and a reload:

```yaml {title="hugo.yml"}
title: Acme DB Docs

params:
  logo: images/acme-mark.svg # under assets/ or static/
  ui:
    theme_color: '#0f766e'
    dark_mode: true
```

Fonts, the overall look and the footer are settings too. For anything a
setting cannot reach, write plain CSS in
[`assets/css/project.css`](#scss), which loads after the theme's stylesheet.
Leave the theme's own files alone, because the next `hugo mod get` replaces
them.

## Site name {#site-title}

The site name appears in the navbar, the browser tab and the footer. On a
multilingual site, give each language its own under `languages.<lang>.title`;
the top-level `title` is the fallback for a language that sets none.

```yaml {title="hugo.yml"}
title: Acme DB Docs

languages:
  en:
    title: Acme DB Docs
    label: English
    locale: en-US
    weight: 1
  zh:
    title: Acme DB 文档
    label: 简体中文
    locale: zh-CN
    weight: 2
```

## Logo and wordmark {#logo}

Out of the box the navbar shows the theme's mark, `assets/icons/logo.svg`,
beside the site name. Replace either half by putting an image in the site's
`assets/` or `static/` directory and naming its path relative to that
directory:

```yaml {title="hugo.yml"}
params:
  logo: images/acme-mark.svg
  wordmark: images/acme-wordmark.svg # optional
```

- `params.logo` is the square mark in the navbar, the sidebar header and the
  footer. A file under `assets/` goes through Hugo's resource pipeline; a file
  under `static/` is published unchanged.
- `params.wordmark` is an image of the name that takes the place of the site
  name text next to the mark. The navbar draws it 16px tall and, like the site
  name, hides it below 992px, leaving the mark alone, so the wordmark should
  contain the name only. The footer shows it on its own unless the
  [footer data](/docs/customize/navigation/#footer) names a logo.

Crop the SVG tightly around the artwork and give it a `viewBox`, or it will not
line up with the text beside it. The theme places both images with `<img>`,
which page CSS cannot recolor and in which `currentColor` resolves to black.
Choose colors that read on both the light and the dark canvas, or do what the
theme's own mark does: put a `<style>` inside the SVG with a
`@media (prefers-color-scheme: dark)` rule. That rule follows the reader's
system setting, not the site's light/dark toggle.

## Favicon {#favicon}

There is no favicon setting. The theme looks in the site's `static/` directory
for the conventional file names and adds a `<link>` to every page for each one
it finds:

| File | Link generated |
| --- | --- |
| `static/favicon.ico` | `rel="icon"` |
| `static/favicon.svg` | `rel="icon"` `type="image/svg+xml"` |
| `static/favicon-32x32.png` | `rel="icon"` `type="image/png"` with `sizes`; several sizes are linked smallest first |
| `static/apple-touch-icon.png` | `rel="apple-touch-icon"` |
| `static/apple-touch-icon-180x180.png` | `rel="apple-touch-icon"` with `sizes` |
{.fields}

`favicon.ico`, `favicon.svg` and `apple-touch-icon.png` are enough for every
browser. A file with a size in its name must be square (`NxN`); the theme
ignores any other.

Other head metadata, such as a Web App Manifest, goes in
`layouts/_partials/hooks/head-end.html`. To look in another directory or
accept other names, override `layouts/_partials/favicons.html` in the site.

## Accent color {#theme-color}

The accent color marks where the reader is: the selected sidebar row and hover
backgrounds, the outline's current-section marker and its rail, tag and chip
hovers, card borders and share buttons on hover, text selection, focus rings,
and each section's mark in the sidebar switcher. Set it with one hex value:

```yaml {title="hugo.yml"}
params:
  ui:
    theme_color: '#0f766e'
    theme_color_dark: '#5eead4' # optional
```

It is most useful per section. Put the pair in a section root's `cascade` and
the whole section, its index page included, takes that color, so readers can
tell Docs from Blog at a glance while the rest of the site keeps the default:

```yaml {title="content/blog/_index.md"}
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
```

Prose links, external URLs and inline code keep the preset's colors in every
section, because a reader should recognize a link or an identifier the same
way everywhere. To change those, override the [palette](#colors).

`theme_color_dark` is optional. Without it, the theme lightens the light color
toward white until it reaches AA contrast for body text on the dark canvas;
set it yourself when the derived shade drifts from your brand. The light color
is required: a `theme_color_dark` on its own, or next to an invalid
`theme_color`, is ignored with a warning, so a page is colored in both modes or
in neither.

To return one page to the default palette, set `theme_color: false` in its
front matter; that drops the inherited dark color too, without a warning. Any
other value that is not a `#rgb` or `#rrggbb` hex, such as a number, `true` or
a color name, warns and keeps the default. Hugo merges parameters key by key,
so a page that overrides only `theme_color` still inherits the section's
`theme_color_dark`: override both or neither.

The theme checks each color you write against its own canvases and warns when
contrast falls below 4.5:1, the AA level for body text. The color is still
applied, since a custom canvas or a fixed brand color may justify it, and the
warning carries an ID you can add to Hugo's `ignoreLogs` once you have checked
it on the real background. A color that only just passes deserves a second
look on interactive surfaces that use it for text over a 12% wash of itself,
such as a linked badge; pick a darker shade if those read poorly.

## Fonts {#fonts}

OINK bundles its Latin typefaces as local fonts served from your own site, so
no page requests Google Fonts or any other font service. Chinese uses fonts already on
the reader's system, and the theme ships no Chinese font file. Each
[visual preset](#visual-presets) arranges the faces its own way:

| Preset | Interface and body text | Headings | Chinese |
| --- | --- | --- | --- |
| Paper | IBM Plex Sans | A system serif | Song headings over Hei text |
| Slate | Inter | Inter; Chakra Petch for display titles | Hei throughout |
| Ink | Inter for the interface, a system serif for prose | Inter | Hei headings over Song text |
| Terminal | IBM Plex Mono, IBM Plex Sans in print | IBM Plex Mono | Hei throughout |

Code is IBM Plex Mono and the wordmark Chakra Petch in Paper and Slate. Plex
Sans and Inter include Latin, Cyrillic, Greek and Vietnamese. Chinese emphasis
and quotations switch to Kai where the reader has it installed, so Han is never
slanted; Terminal colors emphasis instead.

To use the platform's own fonts and load none of the bundled ones, switch the
typography policy:

```yaml {title="hugo.yml"}
params:
  ui:
    typography: system # technical (default) | system
```

With `system`, every role uses the platform font stack. An invalid value warns
and falls back to `technical`. The policy in effect is written to
`<html data-td-typography="…">`.

### Use fonts readers already have {#fonts-in-config}

To change a family without writing CSS, set `params.ui.fonts`:

```yaml {title="hugo.yml"}
params:
  ui:
    fonts:
      # Body text and headings follow this face in every preset
      ui: "'Source Han Sans SC', 'PingFang SC', sans-serif"
      # Give monospace a CJK fallback, or mixed code blocks stop aligning
      code: "'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace"
```

Setting `ui` changes body text and headings in all four presets. Set
`heading` to choose a separate face for headings. The other keys are listed under
[Font roles](#custom-fonts).

These values are family names, not files: the theme never downloads or loads a
font because of this key. A family must already be on the reader's system or
declared by your own [`@font-face`](#fonts-in-css), so end every list with a
generic family (`sans-serif`, `serif`, `monospace`) for readers who have
neither.

A value may contain only font family syntax: quoted names, bare identifiers,
a leading hyphen as in `-apple-system`, and names in any script (`苹方` is a
family name). Semicolons, braces, parentheses, `url()` and angle brackets are
rejected. An unknown role or an unsafe value warns and drops that one entry;
the rest of the map still applies. The theme writes these values after its
stylesheet, so they win over both the preset and `typography: system`.

### Bundle your own font {#fonts-in-css}

To ship a font file, or to give one kind of content its own face, use the
project stylesheet. Put the `.woff2` file in the site's `static/webfonts/`,
declare it, and point the roles at it:

```css {title="assets/css/project.css"}
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

Roles are ordinary inherited custom properties, so scoping one to a body class
changes the face for that kind of page without touching component selectors:

```css {title="assets/css/project.css"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

A monospace stack needs a CJK fallback, or code that mixes Latin and Chinese
stops aligning:

```css {title="assets/css/project.css"}
:root {
  --td-code-font-family: 'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

### Font roles {#custom-fonts}

Eight CSS custom properties carry the font roles, and each can also be set by
its key under `params.ui.fonts`:

| Property | Config key | Where it is used |
| --- | --- | --- |
| `--td-ui-font-family` | `ui` | Navigation, controls and interface text |
| `--td-body-font-family` | `body` | Body text and blog posts |
| `--td-heading-font-family` | `heading` | Headings in the body |
| `--td-code-font-family` | `code` | Code and terminals |
| `--td-display-font-family` | `display` | Display headings |
| `--td-meta-font-family` | `meta` | Technical labels and metadata |
| `--td-brand-font-family` | `brand` | Wordmark |
| `--td-print-font-family` | `print` | Print body text; follows `body` unless set |

## Visual presets {#visual-presets}

A preset is a complete look: palette, fonts, link style and table style, in
light and dark. Pick the one closest to your brand before adjusting colors by
hand.

| Preset | Look |
| --- | --- |
| `paper` (default) | Ivory paper, ink text, underlined blue links, a clay accent, Plex Sans and framed tables |
| `slate` | A cool blue-gray technical look |
| `ink` (experimental) | Black and white surfaces, red markers, square panels and underlined prose links |
| `terminal` (experimental) | Monospace controls, headings and prose, teal links, amber accents and compact desktop navigation |

`params.ui.preset` sets the site's look. `params.ui.preset_menu` decides
whether readers may choose another in the Appearance menu:

```yaml {title="hugo.yml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    dark_mode: true
```

| `preset_menu` | Readers can choose |
| --- | --- |
| `false` (default) | Nothing; every page uses `preset` |
| `true` | Paper, Slate and the site's own preset |
| A list | Exactly the listed presets; the site's preset is added with a warning if missing |

Ink and Terminal appear only when you name them, as `preset` or in the list.
The [experiment record](/docs/design/research/2026-10-05-ink-terminal-experiment/)
lists what has been tested on them. A reader's style and light/dark choice are
saved separately in the browser, and choosing the entry marked as the site
default goes back to following the site. Print always uses a light palette on
white paper.

Font settings and `theme_color` win in every preset. Dark palette overrides in
your own CSS do not automatically: Paper scopes its dark palette to
`[data-td-preset='paper'][data-bs-theme='dark']`, which outranks a bare
`[data-bs-theme='dark']`. Write dark overrides as shown under
[Palette colors](#colors).

## Light and dark mode {#dark-mode}

Sites are light-only until you turn dark mode on:

```yaml {title="hugo.yml"}
params:
  ui:
    dark_mode: true
```

This adds the dark palette and a Light / Dark / System choice to the
Appearance control in the navbar and footer, whose sun or moon icon shows the
current mode. The control works with touch and keyboard and opens as a bottom
sheet on phones. A reader's choice is saved in the browser and shared across
tabs; with no saved choice the page follows the system's
`prefers-color-scheme`. A small inline script applies the mode before the
stylesheet loads, so pages never flash the wrong palette.

To support the dark palette for readers whose system asks for it, without
showing the control, write `dark_mode: { enable: true, show_menu: false }`.

## Footer {#footer}

```yaml {title="hugo.yml"}
params:
  ui:
    footer_style: fat # fat | slim | none
  copyright:
    authors: '[The Acme DB team](https://example.com/)'
    from_year: 2026
    to_year: present
  footer_center_info: 'Powered by [Oink](https://oink.pgsty.com)'
```

| `footer_style` | Footer |
| --- | --- |
| `fat` (default) | A grid of link columns above the copyright line |
| `slim` | The copyright line only |
| `none` | No footer |

The link columns come from `data/footer/<language>.yaml`, described in
[Navigation and menus](/docs/customize/navigation/#footer). Until that file
exists, a `fat` footer renders as `slim`, so you can switch it on before you
write the links. Front matter, or a section's `cascade`, can set a different
style (for example, `slim` on a focused reading section while keeping `fat`
elsewhere). An unknown value warns and uses `fat`.

`params.copyright` is either a Markdown string or a map of `authors`,
`from_year` and `to_year`, where `present` means the current year.
`footer_center_info` is inline Markdown for the middle of the copyright line;
set it to an empty string to leave that space blank.

## Project stylesheet {#scss}

Anything the settings above cannot reach is plain CSS in the site's
`assets/css/`:

| File | Use |
| --- | --- |
| `project.css` | Your selectors and custom property overrides |
| `project/*.css` | Optional further files, appended to `project.css` in path order |

The theme publishes them as one stylesheet that loads after its own, minified,
fingerprinted and with an integrity attribute in production. Because it is a
separate file, editing your styles leaves the theme's stylesheet, and the copy
in readers' caches, untouched.

Hugo minifies this file but does not compile it, so write CSS, not SCSS:
`//` comments, Sass variables, mixins, `@extend` and `&-suffix` selectors do not
work, and native CSS nesting reaches the browser as written. Relative URLs
resolve from `/css/`, so `../webfonts/my-font.woff2` is the site's
`static/webfonts/my-font.woff2`. A site upgraded from an older OINK or from
Docsy may still have files under `assets/scss/`; the build warns and ignores
them until you convert them as described in
[Retired SCSS hooks](/docs/admin/upgrade/#sass-hooks).

Rely only on the public part of the theme's CSS: the eight
[font roles](#custom-fonts) and the `--td-brand-*` properties keep their names
and meanings across minor releases. Component aliases such as
`--td-asciinema-font-family` work only inside their component, and other
variables, such as `--td-shell-*`, can change in any release. Use a variable
where one exists, and otherwise the narrowest selector that works; overriding
`baseof.html` to change a color makes every theme upgrade a merge.

To add a third-party stylesheet, copy it into the site and publish it as a
local resource from `layouts/_partials/hooks/head-end.html`, not with a
`<link>` in Markdown. Keep stylesheets and fonts local rather than pointing at
a CDN, so the site keeps working when that host does not.

### Palette colors {#colors}

Colors other than the accent are CSS custom properties that you override in
the project stylesheet. Each preset sets them in light and dark, so override
both modes together, or one mode keeps the preset's color.

Links use Bootstrap's link tokens, `--bs-link-color` and
`--bs-link-hover-color` with their `-rgb` twins. Bootstrap components such as
buttons use the semantic colors; override the property, and the button
variables that hold the color as a fixed value:

```css {title="assets/css/project.css"}
:root,
[data-bs-theme='light'] {
  --bs-primary: #315f8f;
  --bs-primary-rgb: 49, 95, 143;
}

.btn-primary {
  --bs-btn-bg: #315f8f;
  --bs-btn-border-color: #315f8f;
  --bs-btn-hover-bg: #2a5179;
  --bs-btn-hover-border-color: #274c72;
}
```

The theme's brand layer works the same way. Write the dark block with both
selectors below: the bare one covers Slate, and the preset-scoped one is needed
to outrank Paper's dark palette.

```css {title="assets/css/project.css"}
:root {
  --td-brand-copper: #a66722;
  --td-brand-mark-from: #1d588c;
  --td-brand-mark-to: #a66722;
}

[data-bs-theme='dark'],
[data-td-preset='paper'][data-bs-theme='dark'] {
  --td-brand-copper: #e0a35c;
  --td-brand-mark-from: #7fb8e8;
  --td-brand-mark-to: #e0a35c;
}
```

| Property | Used for |
| --- | --- |
| `--td-brand-copper`, `--td-brand-copper-dim` | A warm secondary accent, used in the footer and Landing sections, and its muted form |
| `--td-brand-mark-from`, `--td-brand-mark-to`, `--td-brand-mark-gradient` | The brand gradient, for example on the site name in the navbar |
| `--td-brand-header-bg` | Navbar background |
| `--td-brand-elev` | Overlay backgrounds |
| `--td-brand-silk` | Secondary text |
| `--td-brand-line-strong` | Strong rules |
| `--td-brand-shadow-sm`, `--td-brand-shadow-md` | Shadows |
{.wide}

Whatever you recolor, check hover, focus, disabled and selected states in both
modes: body text needs 4.5:1 contrast and large text 3:1.

### Styles for a site-owned shell {#bundles}

A page with its own layout, such as a hand-built home page, can use parts of
the theme's styling without the reading shell. Instead of `main`, the
stylesheet every OINK page loads, such a layout asks for a smaller stylesheet
by name:

| Name | Contents |
| --- | --- |
| `chrome` | Tokens, typography, the four palettes, the site navbar, and the language, theme and appearance controls |
| `landing` | The Landing sections; load it after `chrome` |
| `search` | The command palette and local search |
| `compare` | Duo View |

```go-html-template {title="layouts/_partials/my-head.html"}
{{ with partial "css/bundle.html" "chrome" }}
  <link rel="stylesheet" href="{{ (. | minify | fingerprint).RelPermalink }}">
{{ end }}
```

The partial returns a Hugo resource published as `css/<name>.css`, one
directory below the site root, where its `../webfonts/…` references resolve;
your layout minifies and fingerprints it. An unknown name warns. These
stylesheets follow the pinned theme version, so ask for them by name rather
than copying them into the site, and do not read the layer files under the
theme's `assets/css/td/`, which can change in any release.

## Verify {#verify}

```bash
hugo --printPathWarnings
```

- The build ends with `Total in …` and reports no ERROR. Read any warnings: a
  rejected color, font value or preset name is reported there and replaced by
  the default.
- The navbar shows your logo and site name, the browser tab shows your
  favicon, and switching language switches the site name.
- `<html>` carries the `data-td-typography` and `data-td-preset` values you
  set.
- In dark mode, body text, tables, callouts, code blocks and focus rings are
  still readable. Check every color change in both modes and in each preset
  you offer.
- In the browser's developer tools, a paragraph's `font-family` lists your
  family, and the rendered font is the file or system font you expect.

## Related {#related}

- [Configuration](/docs/customize/config/#identity) — types and defaults of the brand settings
- [Navigation and menus](/docs/customize/navigation/) — navbar menu, page actions and footer data
- [Layouts and page types](/docs/customize/layout/) — shells, sidebar, table of contents and page width
- [Images](/docs/components/image/) — images in the body, light/dark pairs and captions
- [Home and landing pages](/docs/customize/home/) — hero, sections and landing data
