---
title: From scratch
linkTitle: From scratch
description: See what a minimal standalone OINK project looks like, build one from an empty directory, add OINK to an existing Hugo site, or install it without Go modules.
weight: 20
search_keywords:
  [
    from scratch,
    project anatomy,
    install,
    hugo mod init,
    hugo mod get,
    submodule,
    offline,
    vendor,
    go.work,
    Hugo Module,
    oink-starter,
  ]
aliases:
  - /docs/start/anatomy/
  - /docs/about/architecture/
  - /docs/tutorial/install/
  - /docs/tutorial/create-site/
  - /docs/tutorial/configuration/
---

When you want a clean standalone OINK site and want to understand every file in
it—rather than letting an agent scaffold it or cloning a large template—a
working project takes only a handful of files. This guide walks from an empty
folder to a live site, shows how to switch an existing Hugo site to OINK, and
covers offline and non-Go install methods.

If you want to add documentation inside an existing code repository's `docs/`
directory instead of creating a separate repository, read
[Add docs to a project](/docs/start/add-docs/). If you prefer a pre-built
three-language Docs, Blog and Book template with GitHub Pages and Cloudflare
Pages workflows ready to edit, you can also start from the
[OINK Starter](https://github.com/pgsty/oink-starter). For Docsy sites, follow
[Migrating from Docsy](/docs/admin/upgrade/#from-docsy).

## What a minimal OINK project looks like {#anatomy}

An OINK site is an ordinary Hugo repository. The theme itself does not live in
your Git tree: `go.mod` pins the exact OINK tag, and Hugo downloads it into the
module cache on the first build.

```filetree {title="my-docs/"}
- my-docs/
  - hugo.yml                # single site config: title, baseURL, languages, Goldmark, params, theme import
  - go.mod                  # pins github.com/pgsty/oink@vX.Y.Z
  - go.sum                  # checksums that verify the pinned release
  - .gitignore              # keeps public/, resources/ and Hugo caches out of Git
  - content/
    - _index.md             # home page entry (optional when data/home/ drives the home page)
    - docs/
      - _index.md           # Docs section root: title, weight, sidebar root
      - install.md          # your first documentation page
  - data/
    - home/
      - en.yaml             # optional data-driven landing page (one file per language)
  - assets/
    - icons/logo.svg        # optional navbar logo, processed by Hugo
    - css/project.css       # optional plain-CSS overrides (no Sass needed)
  - static/
    - favicon.svg           # optional browser icon, copied unchanged
```

Everything else—stylesheets, scripts, fonts, Font Awesome icons, search,
diagrams, and layouts—comes from the theme module. Commit source files plus
`go.mod` and `go.sum`; keep `public/`, `resources/`, `.hugo_build.lock` and
`.hugo_cache/` ignored.

## From an empty directory to the first page {#scaffold}

Make sure Git, Go and Hugo are installed per
[Prerequisites](/docs/start/#tools), then run these four steps.

1. ### Create the skeleton and fetch the theme {#skeleton}

   ```bash {title="Terminal"}
   hugo new site --format yaml my-docs
   cd my-docs
   git init
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   Replace `github.com/example/my-docs` with your repository's module path.
   `hugo mod get` creates `go.mod` and `go.sum`; commit both so every machine
   and CI run builds against the exact same verified theme release. Pin a tag
   rather than `main` so the site changes only when you deliberately upgrade;
   [GitHub Releases](https://github.com/pgsty/oink/releases) lists every tag.

   Create `.gitignore` before your first build so generated artifacts never
   enter Git:

   ```gitignore {title=".gitignore"}
   /public/
   /resources/
   /.hugo_build.lock
   /.hugo_cache/
   go.work
   go.work.sum
   ```

1. ### Write `hugo.yml` {#config}

   Rename the generated `hugo.yaml` to `hugo.yml` (Hugo accepts either name;
   keep only one configuration file at the root) and replace its contents with
   the baseline below:

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true # enable after your first Git commit so pages show last-modified dates

   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: Product Docs
       params:
         description: Everything about running Product in production
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }
           - { name: Blog, pageRef: /blog, weight: 50 }

   # The three Goldmark prerequisites: OINK's Markdown components depend on them
   markup:
     goldmark:
       renderer:
         unsafe: true # allow inline HTML in content
       parser:
         attribute:
           block: true # attribute lines such as {.steps} {.cards} {caption=}
         wrapStandAloneImageWithinParagraph: false # block images carry attribute lines
     highlight:
       noClasses: false # code colors follow light and dark mode

   params:
     offline_search: true
     github_repo: https://github.com/example/my-docs
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     ui:
       preset: paper
       preset_menu: [paper, slate, ink, terminal]
       dark_mode: true
       sidebar_menu_foldable: true
       section_index: cards

   outputs:
     home: [HTML, markdown, LLMS]
     page: [HTML, markdown]
     section: [HTML, RSS, print, markdown]

   module:
     imports:
       - path: github.com/pgsty/oink
   ```

   Each block has one job:

   | Block | Controls | Without it |
   | --- | --- | --- |
   | Top level + `languages` | Site name, canonical `baseURL`, languages and navbar | A wrong `baseURL` breaks absolute links and search in production |
   | `markup.goldmark` | The three parser settings OINK components need | Attribute lines render as literal `{.steps}` text |
   | `params` | Local search, repository links, presets and shell switches | Optional features stay off by design |
   | `outputs` | Per-page `.md` copies, `llms.txt` and print views | No "Copy as Markdown" or print view |
   | `module` | Theme import | Hugo cannot locate OINK |

   For math equations, also add Goldmark's passthrough extension from
   [Math](/docs/components/math/). Every site parameter and its default lives
   in [Configuration](/docs/customize/config/).

1. ### Write the first section and page {#first-page}

   Each top-level directory under `content/` becomes a section, and nested
   folders build the sidebar ordered by `weight`. Give the section an
   `_index.md` and add your first page:

   ```markdown {title="content/docs/_index.md"}
   ---
   title: Docs
   linkTitle: Docs
   description: Everything about running Product in production.
   weight: 20
   ---

   Start with [Install](/docs/install/).
   ```

   ````markdown {title="content/docs/install.md"}
   ---
   title: Install
   description: Install Product on a fresh machine.
   weight: 10
   ---

   ## Prerequisites {#prerequisites}

   > [!IMPORTANT]
   > Product requires PostgreSQL 18 or newer.

   ## Install {#install}

   ```bash
   curl -fsSL https://get.example.com | bash
   ```
   ````

   Add explicit `{#id}` anchors to headings from day one: if you add a second
   language later, both languages share identical section links. See
   [Writing pages](/docs/write/pages/) and
   [Organizing content](/docs/write/organize/) for the full authoring model.

1. ### Preview locally {#preview}

   ```bash {title="Terminal"}
   hugo serve
   ```

   Open <http://localhost:1313/docs/>. You should see the Docs sidebar listing
   **Install**, working search, and the appearance switcher. The site root
   stays minimal until you add a landing page in `data/home/`; see
   [Home and landing pages](/docs/customize/home/).
{.steps}

## Add OINK to an existing Hugo site {#existing-site}

If you already have a Hugo site with content, work on a Git branch and keep
your existing `content/` tree intact; you do not need `hugo new site`:

1. If the site lacks `go.mod`, run `hugo mod init` with your repository's
   module path; if it already has one, keep it.
1. Run `hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}`.
1. Replace the old theme selection in your configuration with `module.imports`
   pointing to `github.com/pgsty/oink` (keeping unrelated module imports), and
   merge the three `markup.goldmark` settings plus
   `markup.highlight.noClasses: false` from [Write `hugo.yml`](#config).
1. Review custom templates under `layouts/`, stylesheets under `assets/`,
   old-theme shortcodes, and front-matter `type` or `layout` values that
   depended on the previous theme.
1. Run `hugo serve`, check representative pages across light and dark modes,
   then turn on optional OINK features one by one and finish with
   [Verify](#verify).
{.steps}

## Other install methods {#install-methods}

A Hugo Module is the default because Hugo resolves the version and verifies its
checksum in `go.sum`. The other three methods serve specific constraints: an
isolated network without Go proxy access, a host without Go installed, or an
organization that audits a vendored copy inside its repository. Apart from
`hugo mod vendor`, they replace `module.imports` with `theme: oink`, making
version tracking and integrity checks your responsibility.

### The four methods compared {#comparison}

| Method | Needs Go | Version auditable | Theme source in your repo | Use when |
| --- | --- | --- | --- | --- |
| **Hugo Module** | Yes | `go.sum` verifies automatically | No | The default |
| Git submodule | No | Repository records the commit | By reference | Theme must be referenced inside Git without Go |
| Offline archive | No | Checksums verified by hand | Yes | Air-gapped or offline build environments |
| Pinned source copy | No | Record the tag and checksum | Yes | Host requires a complete committed tree |

### Hugo Module (recommended) {#hugo-module}

```bash {title="Terminal"}
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

Run `hugo mod graph` to verify the resolved version and `hugo mod get -u` to
upgrade. Every machine that builds the site needs Go.

### Git submodule {#git-submodule}

The site repository pins an exact theme commit:

```bash {title="Terminal"}
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{< param tdVersion.latest >}}
git add .gitmodules themes/oink
```

```yaml {title="hugo.yml"}
theme: oink
```

CI must initialize submodules before running Hugo, otherwise `themes/oink` is
empty:

```bash {title="CI checkout step"}
git submodule update --init --recursive
```

### Offline archive {#offline-archive}

For an isolated network without internet access, prepare the theme on a
connected machine and move the complete package across. There are two routes.

**`hugo mod vendor`** freezes the resolved module into `_vendor/`, so later
builds need neither network access nor Go:

```bash {title="Terminal"}
hugo mod vendor          # writes _vendor/ with the theme's mounted tree
tar czf ../my-docs.tgz . # place the archive outside the directory being packed
```

Whenever `_vendor/` exists, Hugo reads it automatically (`hugo mod graph` shows
`+vendor`) and `module.imports` stays unchanged. Only the vendoring step needs
Go; to upgrade, re-run `hugo mod get` and `hugo mod vendor` on a connected
machine. Because `_vendor/` omits `LICENSE`, `NOTICE` and `VENDOR.json`, copy
those three files from the theme repository if you redistribute the archive.

**A release tag archive** avoids Go modules completely. Download a tagged
archive and unpack it into `themes/oink/`:

```bash {title="Terminal"}
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

Because the repository root is the theme root, `layouts/`, `assets/`, `i18n/`
and `static/` unpack straight under `themes/oink/`. To transfer the archive
with a checksum, create both on the connected machine:

```bash {title="Connected machine"}
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

Verify and unpack on the isolated machine:

```bash {title="Isolated machine"}
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

Confirm these eleven top-level entries exist before your first offline build,
and keep `LICENSE`, `NOTICE` and `VENDOR.json` when redistributing:

```filetree {title="themes/oink/"}
- oink/
  - go.mod        # module path declaration
  - hugo.yaml     # theme default parameters and mounts
  - theme.toml    # theme metadata required by theme: oink
  - LICENSE       # Apache-2.0
  - NOTICE        # upstream attribution
  - VENDOR.json   # third-party runtime manifest: version, source, license, SHA-256
  - assets/       # stylesheets, JS and bundled third-party runtimes
  - layouts/      # templates, partials, shortcodes, render hooks
  - static/       # bundled font files
  - i18n/         # 32 interface language catalogs
  - data/         # SPDX license table for page-end attribution
```

Bootstrap, Font Awesome, fonts, search, and diagram runtimes all ship inside
the theme, so an offline deployment needs no `node_modules`, PostCSS or CDN.

### Pinned source copy {#pinned-clone}

If your host requires theme source files inside the site repository, unpack a
verified tag archive into `themes/oink/` as [above](#offline-archive), set
`theme: oink`, and commit the files alongside a note of the tag and SHA-256
checksum.

Do not run `git clone` into `themes/oink` and commit that folder: the nested
`.git` directory makes Git record an uninitialized gitlink instead of the files.
To track by reference, use a [Git submodule](#git-submodule).

## Developing against a local theme checkout {#local-theme-checkout}

Only needed when editing the OINK theme and a site together. Place both
checkouts side by side:

```text {title="Sibling directory layout" copy=false}
~/pgsty/
├── oink/            # the theme
└── product-docs/    # your site
```

Point Hugo at the sibling checkout for a single command without touching
`go.mod`:

```bash {title="Terminal"}
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo serve
```

A Go workspace (`go work init` with `HUGO_MODULE_WORKSPACE=go.work`) works the
same way. Neither should ever enter Git; CI must build the release pinned in
`go.mod`. See [Previewing against a theme checkout](/docs/admin/preview/#theme-workspace)
for verifying which theme release actually resolved.

## Verify {#verify}

```bash {title="Terminal"}
hugo mod graph                                                  # confirm the resolved OINK tag
hugo --cleanDestinationDir --gc --minify --printPathWarnings
```

The build succeeds when it finishes with `Total in …` and prints no unexpected
warnings. Check that `/docs/` opens with your sidebar, search finds a heading
from your page, dark mode changes code-block colors (`noClasses: false`), and
`git status --short` lists only source files (`hugo.yml`, `go.mod`, `go.sum`,
`content/`).

## Related {#related}

- [Get started](/docs/start/) — run the docs site locally and try the AI agent prompt
- [Browse locally](/docs/start/local/) — daily reading, live editing, and watching AI agent reports
- [Add docs to a project](/docs/start/add-docs/) — embed an OINK site inside a repo's `docs/` directory
- [Configuration](/docs/customize/config/) — every `hugo.yml` key and default
- [Deploy](/docs/admin/deploy/) — publishing `public/` to GitHub Pages, Cloudflare Pages, or your own host
- [Upgrade](/docs/admin/upgrade/) — upgrading OINK releases and migrating from Docsy
