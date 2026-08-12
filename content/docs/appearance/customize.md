---
title: Advanced customization
weight: 30
description:
  Customize typography and scoped visual styles through Docsy-compatible Sass
  inputs and OINK semantic tokens.
cSpell:ignore: Cascadia Chakra Petch PingFang Sarasa
---

OINK provides a small, layered customization contract instead of requiring a
site to copy component selectors or fork the theme. Everything still passes
through Hugo Extended and Hugo Pipes: no Node.js, npm, PostCSS, remote font
service, or client-side preset loader is required.

This page documents the supported extension points and the first public
semantic-token slice: typography. For general color-mode, code-highlighting,
navbar, and template examples, see [Look and feel](/docs/appearance/styling/).

## Choose the right layer

Use the highest-level interface that can express the change:

| Layer                | Extension point                                | Best for                                                            |
| -------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| Hugo configuration   | `hugo.yaml` or page front matter               | Supported choices such as typography preset and page width          |
| Sass foundation      | `assets/scss/_variables_project.scss`          | Existing Docsy and Bootstrap variables that affect the whole bundle |
| Sass after Bootstrap | `assets/scss/_variables_project_after_bs.scss` | Rare overrides that depend on Bootstrap variables or maps           |
| Semantic CSS         | `assets/scss/_styles_project.scss`             | Role tokens, a content type, one page family, or one component      |
| Hugo templates       | `layouts/` and partial hooks                   | Structural or DOM changes that CSS cannot represent                 |

Start with configuration or an established Sass variable. Use a semantic CSS
property when a decision needs a narrower scope. Override a selector only when
there is no suitable token, and override a template only when the structure
itself must change.

Do not edit files inside the theme, Bootstrap, Font Awesome, or bundled font
directories for site branding. Those edits are difficult to audit and will be
lost or conflict during an upgrade.

## How the CSS contract is layered

OINK keeps the dependency direction one-way:

```text
Docsy / Bootstrap Sass variables
              ↓
Bootstrap --bs-* properties
              ↓
OINK semantic --td-* roles
              ↓
component aliases and selectors
```

Existing Docsy and Bootstrap variables remain the foundation. OINK adds a
semantic role only where components need a shared meaning, such as “article
body” or “technical metadata”. Bootstrap properties never point back to OINK
roles, which avoids custom-property cycles.

The following API status is intentional:

- Established Docsy and Bootstrap variables remain compatible inputs where
  practical.
- The typography roles documented below are public site-customization APIs.
- A documented component alias, such as `--td-asciinema-font-family`, has a
  narrower component-specific contract.
- Undocumented `--td-shell-*` and selector-local properties are implementation
  details. Do not assume every property with a `--td-*` prefix is public.

## Typography presets

Choose a built-in site-wide preset in `hugo.yaml`:

```yaml
params:
  ui:
    typography:
      preset: technical # technical | system
```

| Preset      | Result                                                                                              | Font requests                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `technical` | Default OINK treatment, including Chakra Petch display text and IBM Plex Mono technical text        | Uses locally bundled files only                                                         |
| `system`    | Platform sans and monospace stacks, suitable for a neutral base or the smallest text-font footprint | Does not request OINK's bundled text faces unless project CSS explicitly references one |

OINK writes the resolved value to `data-td-typography` on the `<html>` element.
An unsupported value stops the Hugo build instead of silently falling back. This
is a build-time site choice, not a JavaScript-powered reader preference.

The preset selects defaults; project Sass and CSS remain authoritative. For
example, a site that explicitly references IBM Plex Mono can still request it
while using the `system` preset.

## Public font roles

Components consume roles rather than naming a brand font directly:

| CSS property               | Controls                                           | Default source                                   |
| -------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `--td-ui-font-family`      | Navigation, controls, search, and general chrome   | Bootstrap body font                              |
| `--td-body-font-family`    | Documentation and blog prose                       | UI role                                          |
| `--td-heading-font-family` | Article headings                                   | `$headings-font-family`, or body role            |
| `--td-code-font-family`    | `code`, `pre`, `kbd`, `samp`, and terminal content | `$font-family-code`                              |
| `--td-display-font-family` | Wordmarks and display titles                       | Chakra Petch, then UI role                       |
| `--td-meta-font-family`    | Technical labels and metadata                      | IBM Plex Mono, then code role                    |
| `--td-print-font-family`   | Printed body copy and default print headings       | `$td-google-font-name`, then Bootstrap body font |

Change the broad semantic role in most cases. For example, Asciinema consumes
`--td-asciinema-font-family`, which defaults to `--td-code-font-family`.
Override the component alias only when terminal playback should deliberately
differ from all other code.

## Reuse Docsy and Bootstrap Sass variables

OINK interprets established names instead of adding parallel Sass knobs:

| Existing variable                                                 | OINK interpretation                         |
| ----------------------------------------------------------------- | ------------------------------------------- |
| `$td-fonts-serif`, `$font-family-sans-serif`, `$font-family-base` | Bootstrap body font, then UI and body roles |
| `$headings-font-family`                                           | Heading role when explicitly set            |
| `$td-font-family-monospace`, `$font-family-monospace`             | Bootstrap monospace foundation              |
| `$font-family-code`                                               | Code role and ordinary code elements        |
| `$td-google-font-name`                                            | Default print face                          |

Put these compile-time overrides in `_variables_project.scss`, just as in Docsy:

```scss
// assets/scss/_variables_project.scss
$font-family-sans-serif: 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
$headings-font-family: $font-family-sans-serif;
$font-family-monospace:
  'Sarasa Mono SC', 'Cascadia Code', ui-monospace, monospace;
$font-family-code: $font-family-monospace;
```

This changes the compiled defaults. Use semantic CSS properties in
`_styles_project.scss` when different areas of one site need different
treatments.

## Add a site-owned font

Store reviewed `.woff2` files under the consuming site's `static/webfonts/`
directory, then declare and assign the face in `_styles_project.scss`:

```scss
// assets/scss/_styles_project.scss
@font-face {
  font-family: 'My Sans';
  font-display: swap;
  font-style: normal;
  font-weight: 400 800;
  src: url('../webfonts/my-sans-variable.woff2') format('woff2');
}

:root {
  --td-ui-font-family:
    'My Sans', 'Noto Sans SC', 'PingFang SC', system-ui, sans-serif;
  --td-body-font-family: var(--td-ui-font-family);
  --td-heading-font-family: var(--td-ui-font-family);
  --td-display-font-family: var(--td-heading-font-family);
}
```

For code, include an explicit CJK fallback when content can contain Chinese:

```scss
:root {
  --td-code-font-family:
    'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
}
```

Subset and self-host fonts, include every script the site needs, use
`font-display: swap`, and record the license. OINK intentionally does not accept
arbitrary font URLs or CSS strings through YAML.

## Scope styles by content type

Semantic properties inherit, so a content-specific treatment does not require a
second stylesheet or copied component rules. Blog pages already carry the
`td-blog` body class:

```scss
// assets/scss/_styles_project.scss
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

OINK also adds `td-swagger` to Swagger/OpenAPI pages. For a project-defined page
family, set `body_class` in front matter or a section cascade:

```yaml
---
body_class: code-reference
page_width: wide
---
```

```scss
body.code-reference {
  --td-meta-font-family: var(--td-code-font-family);
}
```

Use a semantic, site-owned class. Never put untrusted content in `body_class`.

## Keep layout and typography independent

Typography, article width, and component structure are separate axes. OINK's
existing `page_width` parameter supports `normal`, `wide`, and `full`, globally
or in page front matter:

```yaml
params:
  page_width: normal
```

This provides a clean foundation for distinct experiences without one
all-purpose preset:

| Experience                | Recommended composition                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Standard documentation    | `page_width: normal` plus the site typography preset                                |
| Full-width canvas         | `page_width: full` plus a page-specific `body_class` if needed                      |
| Blog or editorial reading | `td-blog` scoped body and heading roles, usually with `normal` width                |
| Code-heavy reference      | A project body class that adjusts code and metadata roles                           |
| OpenAPI reference         | The Swagger layout and `td-swagger`; keep renderer-specific structure in its layout |

Keeping these concerns independent prevents preset multiplication and lets a
future editorial, API, or code treatment reuse the same roles.

## Colors and component surfaces

Use Bootstrap variables such as `$primary`, `$secondary`, and `$danger` for the
compiled palette. At runtime, prefer Bootstrap semantic properties such as
`--bs-body-bg`, `--bs-body-color`, `--bs-link-color`, and `--bs-border-color`.

OINK also documents a small brand layer, including `--td-brand-elev`,
`--td-brand-silk`, `--td-brand-copper`, `--td-brand-header-bg`, and
`--td-brand-mark-gradient`. Override light and dark values as a pair. The
[Look and feel](/docs/appearance/styling/#colors-and-color-themes) page shows
the complete pattern.

Do not globally override a shell or component token merely because its current
name looks convenient. First change its Bootstrap or documented semantic source;
use a component alias only when that component must diverge.

## Review checklist

Before shipping a customization:

1. Build with the oldest and newest supported Hugo Extended versions.
2. Check light, dark, print, forced-colors, and reduced-motion behavior.
3. Review documentation, blog, code, search, and any OpenAPI pages in scope.
4. Test narrow and wide viewports, including long CJK text and code lines.
5. Confirm font requests are local, intentional, licensed, and no larger than
   necessary.
6. Prefer one semantic override over repeated selector patches.

These rules preserve OINK's central constraint: a customized site remains a
single-Hugo-binary project with no additional build or runtime dependency.
