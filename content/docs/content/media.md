---
title: Logos and images
weight: 70
description: Configure logos, page icons, favicons, and images.
---

## Add brand marks {#add-your-logo}

Oink uses `assets/icons/logo.svg` as its default brand mark. Override it with
`params.logo`, or set `params.wordmark` when the header should show a complete
wordmark instead of an icon followed by the site title:

```yaml
params:
  logo: icons/product.svg
  wordmark: images/product-wordmark.svg
```

Both parameters can name a Hugo asset or a public path. Prefer `assets/` for
theme-processed files and `static/` when a file must be copied unchanged. Keep
the source SVG tightly cropped so the header, sidebar, and footer can size it
consistently.

For brand typography, dimensions, and project SCSS, see [Look and feel][].

## Use icons {#use-icons}

Oink bundles Font Awesome Free and serves its fonts locally. Set a page's `icon`
in front matter to give the page and its navigation entry a stable visual cue:

```yaml
---
title: Deployment
---
```

Use an icon available in the bundled free set. The exact vendored version is
recorded in the theme's [`VENDOR.json`][]. Menu-specific icon behavior is
covered in [Navigation and menus][].

## Add favicons {#add-your-favicons}

Oink does not impose a product favicon. Instead, it discovers conventionally
named files in the consumer site's `static/` directory and adds the matching
`<link>` elements to every page.

| File                       | Generated link                             |
| -------------------------- | ------------------------------------------ |
| `favicon.ico`              | `rel="icon"`                               |
| `favicon.svg`              | `rel="icon"` and `type="image/svg+xml"`    |
| `favicon-NxN.png`          | `rel="icon"`, PNG type, and `sizes="NxN"`  |
| `apple-touch-icon.png`     | `rel="apple-touch-icon"`                   |
| `apple-touch-icon-NxN.png` | `rel="apple-touch-icon"` and `sizes="NxN"` |

Square numbered variants are emitted in ascending size order. A practical
baseline is `favicon.ico`, `favicon.svg`, and `apple-touch-icon.png`.

For a web app manifest or other head metadata, add markup in
[`layouts/_partials/hooks/head-end.html`][]. To change discovery itself,
override [`layouts/_partials/favicons.html`][] and keep URLs subpath-safe with
`relURL`.

### Generate favicons {#generate-favicons}

Generate the files with a reviewed graphics workflow such as ImageMagick,
[favicon.io][], or [RealFaviconGenerator][]. Oink's production build does not
depend on Node.js or a favicon generator; Hugo only publishes the files already
present in `static/`.

## Add images {#add-images}

Put images beside a page when they belong to that page bundle. This keeps the
source and its media together and lets Hugo process the resource. Use regular
Markdown for simple images — an attribute line such as `{caption="…"}` turns a
standalone image into a figure — or the [`image` shortcode][] when you need
resize, crop, or display options.

### Landing-page covers {#landing-pages}

Landing pages are built with `layout: landing`; the hero section takes its
background image from local page resources or data, as described in [Landing
pages][]. The Docsy `blocks/cover` shortcode is no longer available.

### Static images {#other-pages}

Put files in `static/` when they must retain a fixed public path and do not need
Hugo image processing. Reference them with a root-relative URL, and verify that
the same URL works when the site is built with its production `baseURL`. See
[Adding static content][] for the trade-offs.

[Adding static content]: /docs/content/writing/#adding-static-content
[Landing pages]: /docs/scenarios/landing/
[favicon.io]: https://favicon.io/
[`image` shortcode]: /docs/components/image-zoom/#processed-images
[`layouts/_partials/favicons.html`]:
  https://github.com/pgsty/oink/blob/main/layouts/_partials/favicons.html
[`layouts/_partials/hooks/head-end.html`]:
  https://github.com/pgsty/oink/blob/main/layouts/_partials/hooks/head-end.html
[Look and feel]: /docs/appearance/styling/#styling-your-project-logo-and-name
[Navigation and menus]: /docs/configure/navigation/#adding-icons-to-the-side-nav
[RealFaviconGenerator]: https://realfavicongenerator.net/
[`VENDOR.json`]: https://github.com/pgsty/oink/blob/main/VENDOR.json
