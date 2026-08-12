---
downstream_modified: true
title: Upgrade
description: Upgrade Oink, Hugo Extended, or an existing Docsy site safely.
aliases: [/upgrade/, /docs/update/, /docs/updating/]
weight: 80
icon: fa-solid fa-arrow-up-right-dots
---

These pages describe the OINK update contract. A **target release** is the
version that you are moving the site to. Read its release note before starting:
it records breaking changes, required actions, and the validated Hugo range.

<a id="update-node"></a>

OINK consumer builds do not install Node.js packages. npm remains repository
tooling for theme maintainers, not a site-update step.

## Before you update

- Work from a Git branch or another recoverable copy of the site.
- Record the currently pinned theme revision and Hugo Extended version.
- Build the current production site once so that new failures can be separated
  from pre-existing ones.
- Read every release note between the current and target versions; do not skip
  intermediate migration actions.

## Order of steps {#update-order}

Perform the update in this order:

1. [Update Hugo](#update-hugo) if the target release changes its supported
   range.
2. [Update the theme](#update-theme) using the site's installation mode.
3. [Review theme overrides](#update-overrides).
4. [Check the site](#check) in development and production builds.

## Update Hugo {#update-hugo}

Install a Hugo Extended version supported by the target release. Update the same
version in local developer setup, CI, Cloudflare Pages, Netlify, container
images, and any cache keys. Verify the selected binary before building:

```sh
hugo version
```

The current validation baseline is Hugo Extended `0.164.0`; the theme's current
minimum is `0.160.1`. A release note takes precedence if it changes either
value.

## Update the theme {#update-theme}

Use the page matching the site's installation mode:

- [Upgrade OINK](upgrade/)
- [Migrate from Docsy](from-docsy/)

For a released archive, replace the existing theme directory with the target
archive only after preserving site-owned overrides. Verify its checksum and keep
`LICENSE`, `NOTICE`, and `VENDOR.json` with the distribution.

## Review theme overrides {#update-overrides}

If the site overrides theme files, compare each override with its new theme
counterpart and port relevant changes. Check these directories:

- `assets/`
- `i18n/`
- `layouts/`
- `static/`

Remove an override when the theme now provides the same behavior. Keep site
business components, product pages, and brand assets at the site layer.

## Check your site {#check}

Run both a development preview and the exact production command. For the
Hugo-only contract, the production build is:

```sh
hugo --gc --minify
```

Verify at least the following:

- [ ] The build completes without errors, warnings, or deprecation notices.
- [ ] English and Chinese home, documentation, ordinary blog, and release-note
      pages render.
- [ ] Navigation, breadcrumbs, table of contents, stable heading links, and
      language switching resolve correctly.
- [ ] Local search returns results in both languages.
- [ ] Dark and light modes, mobile navigation, and print output remain usable.
- [ ] Pages load only the local runtimes they use; default pages make no
      theme-owned third-party subresource requests.
- [ ] Mermaid, KaTeX, Markmap, Swagger UI, Redoc, and any used content
      components still render.
- [ ] Site-owned shortcodes and business pages remain intact.

Finally, run every release-specific check from the target release note.
