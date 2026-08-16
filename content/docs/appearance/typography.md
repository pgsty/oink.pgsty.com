---
title: Typography presets
linkTitle: Typography presets
weight: 10
description:
  Change fonts through semantic roles instead of copying the theme's component
  selectors.
---

OINK puts font choices behind **seven semantic CSS custom properties**. A site
overrides those roles to change typography, without needing to know which
selectors the theme uses internally.

Hugo compiles the whole mechanism into the same static stylesheet at build time:
**no JavaScript, no remote font service, and no runtime preset loader**.

## Two built-in presets {#presets}

```yaml {title="hugo.yaml"}
params:
  ui:
    typography:
      preset: technical # technical | system
```

| Preset      | Effect                                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `technical` | The default. Preserves the Chakra Petch and IBM Plex Mono treatment, with all font files bundled locally         |
| `system`    | Resets the display, metadata, print, and monospace roles to platform stacks and **requests no OINK brand fonts** |

The selected value is emitted as `data-td-typography` on `<html>`. An
**unsupported value fails the build** rather than silently changing the site.

> [!NOTE] Under `system`, OINK's brand font files remain static theme assets;
> the browser simply does not request them with the stock configuration.

## The seven semantic roles {#roles}

{{< fields >}} {{< field name="--td-ui-font-family" type="CSS property" >}}
Navigation, controls, and general chrome. Seeded from `--bs-body-font-family`.
{{< /field >}} {{< field name="--td-body-font-family" type="CSS property" >}}
Article and blog prose. Inherits the UI role by default. {{< /field >}}
{{< field name="--td-heading-font-family" type="CSS property" >}} Content
headings. Takes `$headings-font-family`, falling back to the body role.
{{< /field >}} {{< field name="--td-code-font-family" type="CSS property" >}}
Code and terminal content. Takes `$font-family-code`. {{< /field >}}
{{< field name="--td-display-font-family" type="CSS property" >}} Wordmarks and
display titles. Chakra Petch, then the UI role. {{< /field >}}
{{< field name="--td-meta-font-family" type="CSS property" >}} Technical labels
and metadata. IBM Plex Mono, then the code role. {{< /field >}}
{{< field name="--td-print-font-family" type="CSS property" >}} Print-only body
copy. {{< /field >}} {{< /fields >}}

Theme components consume these roles or a component alias such as
`--td-asciinema-font-family`; they **never name a font directly**. The
dependency direction is always:

```text {copy=false}
Bootstrap base variable  →  OINK semantic role  →  component alias
```

The reverse is prohibited — Bootstrap custom properties never reference OINK
ones — which keeps the graph one-way and prevents custom-property cycles.

## Using site-owned fonts {#site-owned-fonts}

Put local `.woff2` files under the site's `static/webfonts/`, declare the faces
in `_styles_project.scss`, and override the roles you need. Hugo loads that file
after the theme styles:

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

> [!IMPORTANT] When the site can contain Chinese text, a custom monospace face
> **must** declare a CJK fallback, or Chinese characters drop to the browser
> default and stop aligning with Latin characters inside code blocks:
>
> ```scss
> :root {
>   --td-code-font-family:
>     'My Mono', 'Sarasa Mono SC', 'Noto Sans Mono CJK SC', monospace;
> }
> ```

**Remote URLs and arbitrary CSS are deliberately not accepted through YAML.**
Font files and stylesheets stay local, reviewable build inputs.

## Per-content typography {#per-content-typography}

Roles inherit normally, so giving one kind of content its own treatment needs
neither a new global preset nor copied component selectors:

```scss {title="assets/scss/_styles_project.scss"}
body.td-blog {
  --td-body-font-family: 'My Serif', 'Noto Serif SC', serif;
  --td-heading-font-family: var(--td-body-font-family);
}
```

## Compatibility with existing configuration {#compatibility}

Existing Sass customization remains the **first input** to this system. OINK
reuses established variables rather than introducing parallel knobs:

| Existing variable                               | OINK interpretation                                      |
| ----------------------------------------------- | -------------------------------------------------------- |
| `$font-family-base` / `$font-family-sans-serif` | Bootstrap body font, then the UI and body roles          |
| `$headings-font-family`                         | The heading role when explicitly configured              |
| `$font-family-monospace`                        | The Bootstrap monospace base                             |
| `$font-family-code`                             | The code role, and ordinary `code`, `pre`, `kbd`, `samp` |
| `$td-google-font-name`                          | The default print face                                   |

Declare these in `assets/scss/_variables_project.scss`, as in Docsy; they
compile into the role defaults.

Custom-property overrides in `_styles_project.scss` run later and therefore stay
available for contextual theming. **Project settings intentionally take
precedence over preset defaults.**

## Scope {#scope}

This is the **first token slice, and it covers typography only**. Semantic
colour, surface, radius, density, and appearance presets are not included; they
should arrive separately, once their Bootstrap and shell-token contracts have
matching regression coverage.

## Next steps {#next-steps}

- [Styling](../styling/): colors and layout
- [Advanced customization](../customize/): template overrides
