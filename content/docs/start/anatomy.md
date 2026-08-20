---
title: Repository tour
linkTitle: Repository tour
description: What every cloned directory is — what must stay, what to replace with your own details, and what belongs to the documentation site and can go entirely.
weight: 10
search_keywords:
  [
    repository structure,
    directory structure,
    anatomy,
    repository tour,
    hugo.yml,
    content,
    static,
    layouts,
    data,
    delete,
  ]
aliases:
  - /docs/about/architecture/
---

This page goes through every file and directory of a `pgsty/oink.pgsty.com`
clone: what must stay, what to replace with your own details, what belongs to
the documentation site and can be deleted whole — plus a safe order to delete
in.

The theme's code is not in this repository. It is a Hugo Module pinned by
`go.mod` and stored in Go's module cache. This repository holds content,
configuration, and a small number of site-level overrides.

## Top-level structure {#layout}

```filetree {title="the cloned my-docs/"}
- my-docs/
  - hugo.yml                # the site's only configuration: identity, languages, menus, params, module imports
  - go.mod                  # pins the theme version
  - go.sum                  # checksums for the theme module
  - content/                # all content; the directory structure is the sidebar structure
    - _index.md             # home page; _index.zh.md is its Chinese counterpart
    - search.md             # results page for Google Programmable Search; delete if unused
    - docs/                 # documentation tree: OINK's own theme documentation
    - blog/                 # blog: engineering notes and release announcements
  - assets/                 # resources that go through Hugo processing
    - scss/                 # site style overrides, three partials
    - images/               # images that need resizing or cropping
    - parts/                # Markdown and YAML fragments pulled in by the include shortcode
  - static/                 # copied to the site root as is, unprocessed
    - logo.svg              # brand lockup; no parameter points at it
    - favicon.svg           # browser tab icon
    - favicon.ico
    - apple-touch-icon.png  # iOS add-to-home-screen
    - images/               # screenshots and diagrams
  - layouts/                # site template overrides: override the narrowest one
    - _shortcodes/          # the site's own shortcodes
  - data/                   # data-driven pages
    - home/                 # home page sections: en.yaml / zh.yaml
    - landing/              # landing page data
    - download/             # release and download page data
  - .github/
    - workflows/            # pages.yml deploys; the other two are this site's regression tests
  - tests/                  # documentation site only: Playwright, goldens, build assertions  {open=false tone=warning}
    - browser/              # Playwright specs
    - hugo-build/           # build assertions
    - md-output/            # Markdown output goldens
    - alt-site/             # alternate-configuration builds
    - favicons/
    - release-pin/
    - fixtures/
  - scripts/                # documentation site only: translation parity and link checks  {open=false tone=warning}
    - check-doc-translations.mjs
    - check-markdown-style.mjs
    - check-rendered-links.mjs
    - check-rendered-markdown.mjs
    - check-release-pin.mjs
  - Makefile                # build / serve call Hugo directly; dev / check point at a sibling ../oink
  - package.json            # the test toolchain; not used to build the site
  - package-lock.json
  - playwright.config.mjs
  - agent-docs.config.yml   # configuration for the agent-documentation scoring tool
  - AGENTS.md               # repository notes for coding agents
  - TRANSLATION.md          # the bilingual translation process
  - CONTRIBUTING.md
  - README.md
  - LICENSE                 # Apache-2.0, for the site code
  - LICENSE-CC-BY-4.0       # content licence
  - NOTICE
```

Not listed above: `.gitignore`, `.gitattributes`, `.nvmrc`, `.npmrc`, and the
generated output excluded by `.gitignore` — `public/` (build output),
`resources/` (Hugo's resource cache) and `node_modules/`. That last group never
enters version control.

There is no `i18n/` in the repository: interface strings ("Previous", "On this
page" and the like) come from the theme's 32 language files. To change one of
them, create `i18n/zh.yaml` at the site root and write only the keys you
override.

## What to do with each entry {#what-to-keep}
| Path | What it is | What to do after forking |
| --- | --- | --- |
| `hugo.yml` | The site's only configuration file — no `config/` directory and no per-environment overrides | Replace with your details: identity, languages, menus, brand |
| `go.mod` `go.sum` | Pin the theme version and record its checksums | Must stay, and both are committed |
| `content/` | All content; the directory structure decides the sidebar structure | Must stay; replace the `docs/` and `blog/` inside it with your own |
| `content/search.md` | A full-page search results page (`layout: search`); it only has content when Google Programmable Search is configured (`params.gcs_engine_id`) | Delete it when using the theme's local search |
| `assets/scss/` | Site style overrides (`_variables_project.scss` and friends) | Keep it to change colours and fonts; empty it if you change neither |
| `assets/images/` | Images that need Hugo processing (resize, crop) | Replace with your own |
| `assets/parts/` | Fragments the `include` shortcode pulls in | Replace or delete with the pages that use them |
| `static/` | Copied to the site root as is | Replace with yours: logo, favicon, screenshots |
| `layouts/_shortcodes/` | This site's four shortcodes, none referenced by current content | Can be deleted |
| `data/home/` | Home page section data (hero, capability panels) | Change to yours; delete it and the home page falls back to an ordinary page |
| `data/landing/` `data/download/` | Data for landing pages and the release/download page | Delete if unused |
| `.github/workflows/pages.yml` | Builds and publishes to GitHub Pages on a push to `main` | Keep, adjusted for your repository |
| `.github/workflows/site-checks.yml` `browser-quality.yml` | This site's regression pipelines | Documentation site only; can be deleted |
| `tests/` `scripts/` `playwright.config.mjs` `package.json` `package-lock.json` | This site's regression tests and check tooling | Documentation site only; can be deleted |
| `Makefile` | Shortcuts for developing the theme and the site together (expects a sibling `../oink`) | Documentation site only; can be deleted |
| `AGENTS.md` `TRANSLATION.md` `CONTRIBUTING.md` `agent-docs.config.yml` | This site's collaboration conventions | Replace with your own, or delete |
| `README.md` `LICENSE` `LICENSE-CC-BY-4.0` `NOTICE` | Description and licences | Replace with your own |
| `.nvmrc` `.npmrc` | Node version and npm configuration | Delete along with `package.json` |

> [!NOTE] Building a site with OINK needs no Node.js
> The `package.json`, `tests/` and `scripts/` in this repository maintain the
> documentation site itself. Building your site is one command:
> `hugo --gc --minify`.

## Deletion order {#deletion-order}

Delete the periphery first, then the content, then the data. Build after each
step so a problem points back at one step.

1. ### Drop the scaffolding {#drop-scaffolding}

   None of this takes part in rendering, and removing it affects no page.

   ```bash
   rm -rf tests scripts node_modules
   rm -f package.json package-lock.json playwright.config.mjs .nvmrc .npmrc
   rm -f AGENTS.md TRANSLATION.md CONTRIBUTING.md agent-docs.config.yml Makefile
   rm -f .github/workflows/site-checks.yml .github/workflows/browser-quality.yml
   ```

   After deleting `scripts/` you must edit `.github/workflows/pages.yml`: remove
   the `Set up Node.js` and `Verify advertised and pinned release match` steps,
   or the deploy fails there.

1. ### Drop the example content {#drop-example-content}

   `content/docs/` is OINK's own theme documentation and `content/blog/` its
   engineering blog; neither has anything to do with your product.

   ```bash
   rm -rf content/docs
   mkdir -p content/docs
   rm -rf content/blog        # if you want no blog; otherwise keep one post as a template
   ```

   Edit `menus.main` under each language in `hugo.yml` at the same time: those
   entries point at paths such as `/docs/tutorial` and `/blog/release` that no
   longer exist. `content/_index.md` is the home page — keep it and replace the
   body with yours.

1. ### Trim the data {#trim-data}

   The three groups under `data/` feed the home page, landing pages and release
   pages. Keep the home page data and edit it; delete the other two if unused.

   ```bash
   rm -rf data/landing data/download
   ```

   `data/home/en.yaml` and `data/home/zh.yaml` decide which sections the home
   page has; each entry is explained in
   [Home and landing pages](/docs/customize/home/). Deleting `data/home/`
   entirely still builds, and the home page falls back to an ordinary content
   page.

1. ### Swap the identity {#swap-identity}

   Finally, change the site name, `params.productionURL`, `params.github_repo`
   and the brand parameters in `hugo.yml` to yours, replace the logo and favicon
   under `static/`, and delete the OINK-specific configuration:
   `services.googleAnalytics`, `params.comments` and the `params.version*` keys.
   The itemized list is in step 3 of [Quick start](/docs/start/).
{.steps}

## Where the theme lives {#where-the-theme-is}
The theme is referenced as a Hugo Module, and two places point at it:

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
  hugoVersion:
    extended: true
    min: '{{< param hugoMinVersion >}}'
```

```go-mod {title="go.mod"}
require github.com/pgsty/oink {{< param tdVersion.latest >}}
```

`hugo.yml` declares which theme to use, `go.mod` pins which version of it, and
`go.sum` records that version's checksums. All three files are committed. The
theme source never enters your repository: Hugo downloads it into Go's module
cache, and `hugo mod graph` shows what actually resolved.

Upgrade to the newest version:

```bash
hugo mod get -u github.com/pgsty/oink
```

Pin to one version:

```bash
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

Both commands rewrite `go.mod` and `go.sum`. A production site pins a release
tag rather than following `main`. What to check before and after an upgrade, and
how to roll back, is in [Upgrade](/docs/admin/upgrade/).

## Site overrides {#site-overrides}
Files under `layouts/` shadow the theme's files of the same name, following
Hugo's template lookup order. This site has only one kind:

- `layouts/_shortcodes/*.html` — the site's own shortcodes. Product documentation that needs a shortcode with business meaning puts it here too.

Self-linking heading anchors come from the theme's own
`_markup/render-heading.html`; a site does not need to build that hook.

To change the shell (sidebar, footer, page end), override the narrowest partial
rather than copying `baseof.html` wholesale — a copy has to be merged by hand at
every theme upgrade.

## Verify {#verify}

Build after each deletion step so an error points at what you just removed:

```bash
hugo --gc --minify --printPathWarnings --panicOnWarning
```

Once the deleting is done, all of this should hold:

- The build ends with `Total in …` and no `WARN` or `ERROR`
- No navbar entry links to a deleted directory
- Headings still have their self-link anchors (the theme's own heading render hook; the site needs no override)
- `git status` shows no `public/` or `resources/`

## Related {#related}

- [Quick start](/docs/start/) — the full clone, configure and deploy path
- [From scratch and other install methods](/docs/start/from-scratch/) — building from an empty directory instead of trimming
- [Organizing content](/docs/write/organize/) — how the `content/` tree becomes the sidebar
- [Configuration](/docs/customize/config/) — every `hugo.yml` key and its default
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme module, and the migration toolkit
