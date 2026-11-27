---
title: From scratch and other install methods
linkTitle: From scratch
description: "Add OINK to an existing Hugo site or build a minimal one by hand, and install the theme as a Module, submodule, offline archive, or source copy."
weight: 30
search_keywords:
  [
    from scratch,
    install,
    hugo mod init,
    hugo mod get,
    submodule,
    offline,
    vendor,
    go.work,
    Hugo Module,
  ]
aliases:
  - /docs/tutorial/install/
  - /docs/tutorial/create-site/
  - /docs/tutorial/configuration/
---

Use this page when you already have a Hugo site and want OINK to render it, or
when you want to assemble a site file by file instead of starting from the
[Starter](/docs/start/starter/). Either way, the theme arrives as a Hugo Module
together with three Goldmark settings its Markdown components need, and you
need the tools listed in [Get started](/docs/start/#tools). A Docsy site has
its own route, which also migrates Docsy syntax:
[Migrating from Docsy](/docs/admin/upgrade/#from-docsy).

When Go modules are not an option, for example on an isolated network or with
a host that wants the theme files inside the repository,
[Other install methods](#install-methods) covers a Git submodule, an offline
archive and a source copy.

## Add OINK to an existing site {#existing-site}

Work on a branch and keep your configuration file and content as they are; you
do not need `hugo new site`.

1. If the site has no `go.mod`, run `hugo mod init` with your repository's
   module path. If it has one, keep it.
1. Run `hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}`.
1. In your configuration, replace the old theme selection with the OINK entry
   under `module.imports` and keep unrelated imports. Then merge the three
   `markup.goldmark` settings and `markup.highlight.noClasses: false` from
   [the example below](#config). Merge them rather than copying the whole
   example, which is a complete new site and would drop your own settings.
1. Look for anything that still selects the old theme's behavior: templates and
   assets in the site's own `layouts/` and `assets/`, the old theme's
   shortcodes, and `type` or `layout` values in front matter. Adapt what
   breaks and leave the content alone.
1. Run `hugo`, then open a representative existing page with `hugo server` and
   check its navigation, images and code blocks. Turn on optional OINK features
   after that, and finish with [Verify](#verify).
{.steps}

## From an empty directory to the first page {#scaffold}

These four steps produce a one-language site with a Docs section and one page.
The [Starter](/docs/start/starter/) gives you far more (three languages, a home
page, Blog, Book and deployment workflows), so build from scratch when you
want to choose every file yourself.

1. ### Create the skeleton and fetch the theme {#skeleton}

   ```bash
   hugo new site --format yaml my-docs
   cd my-docs
   git init
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   Replace `github.com/example/my-docs` with your site's own module path,
   usually its repository address. `hugo mod get` writes `go.mod` and
   `go.sum`; commit both, because together they pin and verify the theme
   release.

   Create `.gitignore` before the first build, so generated files never reach
   Git:

   ```gitignore {title=".gitignore"}
   /public/
   /resources/
   /.hugo_build.lock
   /.hugo_cache/
   ```

   Pin a release tag rather than `main`, so the site changes only when you
   upgrade it. `{{< param tdVersion.latest >}}` is the release this
   documentation describes; [GitHub Releases](https://github.com/pgsty/oink/releases)
   lists every tag.

1. ### Writing `hugo.yml` {#config}

   Rename the generated `hugo.yaml` to `hugo.yml`, the name the examples in
   these docs use, and replace its contents with the configuration below.
   Hugo accepts either name; keep a single configuration file. An existing site
   merges the settings it needs instead.

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true        # the "last modified" time comes from git; make the first Git commit before enabling

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

   # The three Goldmark prerequisites: OINK's native Markdown components depend on them
   markup:
     goldmark:
       renderer:
         unsafe: true # allow inline HTML in content
       parser:
         attribute:
           block: true # attribute lines such as {.steps} {.cards} {caption=}
         wrapStandAloneImageWithinParagraph: false # only a block-level image can carry an attribute line
     highlight:
       noClasses: false # code colours follow light and dark mode

   params:
     offline_search: true
     github_repo: https://github.com/example/product-docs
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     ui:
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
     hugoVersion:
       min: '{{< param hugoMinVersion >}}'
   ```

   Each block controls a different part of the site:

   | Block | Controls | Without it |
   | --- | --- | --- |
   | Top level + `languages` | Site name, address, languages and the navbar menu | A wrong `baseURL` breaks every absolute link in production |
   | `markup.goldmark` | The three settings OINK's components need | An attribute line shows up as a literal `{.steps}` in the text |
   | `params` | Search, repository links and shell switches | Interactive features stay off; the theme does not turn them on for you |
   | `outputs` | Each page's `.md` version, `llms.txt` and print pages | No "Copy as Markdown" in the page menu and no print view |
   | `module` | The theme import and the minimum Hugo version | The build cannot find the theme |

   Mathematics also needs Goldmark's passthrough extension; see
   [Math](/docs/components/math/). Every key and its default is in
   [Configuration](/docs/customize/config/).

1. ### Write the first page {#first-page}

   Each top-level folder under `content/` is a section, and the folder tree
   becomes the sidebar. A section needs an `_index.md`, which gives it a title,
   a description and its position:

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
   > Product needs PostgreSQL 18 or newer.

   ## Install {#install}

   ```bash
   curl -fsSL https://get.example.com | bash
   ```
   ````

   Give each heading an explicit `{#id}` from the start: when you add a
   translation later, both languages then share the same anchors.
   [Writing pages](/docs/write/pages/) covers the rest.

1. ### Preview {#preview}

   ```bash
   hugo server
   ```

   Open <http://localhost:1313/docs/>. The Docs section lists Install, and the
   preview updates each time you save the page. The site root stays empty
   until you add a home page; see [Home and landing pages](/docs/customize/home/).
{.steps}

## Other install methods {#install-methods}

A Hugo Module is the default because Hugo itself resolves the version, checks
its checksum and records it in `go.sum`. The other three methods serve
specific constraints: a network with no route to the Go module proxy, a host
that needs the theme files inside the repository, or an organization that
reviews its own copy of the theme. Apart from `hugo mod vendor`, they bypass
the Go module system: the site names the theme with `theme: oink` instead of
`module.imports`, and version tracking and integrity checks become your job.

### The four methods compared {#comparison}

| Method | Needs Go | Version auditable | Theme source in your repository | Use when |
| --- | --- | --- | --- | --- |
| **Hugo Module** | Yes | `go.sum` verifies automatically | No | The default |
| Git submodule | No | The repository records the commit | By reference | The theme source has to be in the repository |
| Offline archive | No | Checksums verified by hand | Yes | Network isolation |
| Pinned source copy | No | Record the tag and checksum | Yes | The platform requires a complete tree |

### Hugo Module (recommended) {#hugo-module}

```bash
hugo mod init github.com/example/product-docs
hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
```

```yaml {title="hugo.yml"}
module:
  imports:
    - path: github.com/pgsty/oink
```

This is what the Starter uses. `hugo mod graph` shows the resolved version and
`hugo mod get -u` upgrades it. Every machine that builds the site needs Go.

### Git submodule {#git-submodule}

The site repository records the exact theme commit:

```bash
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{< param tdVersion.latest >}}
git add .gitmodules themes/oink
```

```yaml {title="hugo.yml"}
theme: oink
```

CI has to initialize the submodule before it runs Hugo; otherwise
`themes/oink` is an empty directory:

```bash
git submodule update --init --recursive
```

### Offline archive {#offline-archive}

For a network-isolated environment, prepare the theme on a connected machine
and carry the complete result across. There are two routes.

**`hugo mod vendor`** freezes the resolved theme into the site directory, so
later builds need neither the network nor Go:

```bash
hugo mod vendor          # writes _vendor/, holding the theme's full source tree
tar czf ../my-docs.tgz . # put the archive outside the directory being archived
```

Hugo prefers `_vendor/` whenever it exists (`hugo mod graph` then prints
`+vendor`), and `module.imports` in `hugo.yml` stays as it is. Only the
vendoring step needs Go; to upgrade the theme, return to a connected machine
and run `hugo mod get` and `hugo mod vendor` again. `_vendor/` holds only the
directories the theme mounts (`assets`, `data`, `i18n`, `layouts`, `static`)
plus `hugo.yaml` and `theme.toml`. It leaves out `LICENSE`, `NOTICE` and
`VENDOR.json`, so take those three from the theme repository if you
redistribute the archive.

**A release tag archive** needs no Go module at all. Download the tag and
unpack it into `themes/oink/`:

```bash
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

The repository root is the theme root, so `layouts/`, `assets/`, `i18n/` and
`static/` land directly under `themes/oink/` with no extra directory level.

To move the archive between machines with an integrity check, build it and its
checksum from the immutable tag on the connected side:

```bash
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

Carry both files into the isolated environment, then verify the checksum and
unpack:

```bash
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

Before the first offline build, confirm that these eleven top-level entries are
present. Keep `LICENSE`, `NOTICE` and `VENDOR.json` when you redistribute the
theme; `VENDOR.json` records each third-party runtime's version, source,
license path and SHA-256, which is what an offline audit checks against.

```filetree {title="themes/oink/"}
- oink/
  - go.mod              # module path declaration, used when resolving as a Hugo Module
  - hugo.yaml           # theme default parameters and the Hugo version floor
  - theme.toml          # theme metadata, required by the theme: oink method
  - LICENSE             # Apache-2.0
  - NOTICE              # upstream attribution; must be kept on redistribution
  - VENDOR.json         # third-party runtime manifest: version, source, licence path, SHA-256
  - assets/             # stylesheets, JS, and the third-party runtimes shipped with the theme
  - layouts/            # templates, partials, shortcodes, render hooks
  - static/             # font files, published as is
  - i18n/               # 32 interface language files
  - data/               # the SPDX licence table behind the page-end attribution line
```

Nothing else has to be downloaded. Bootstrap, Font Awesome, the fonts, and the
search and diagram runtimes all ship with the theme, so the site needs no
`node_modules`, PostCSS, RTLCSS or CDN. Docsy guides that install npm packages
describe Docsy's own build and do not apply to OINK.

### Pinned source copy {#pinned-clone}

When a host needs the theme files inside the site repository, prepare a tag
archive as [above](#offline-archive), unpack it into `themes/oink/`, set
`theme: oink`, and commit the files together with a record of the tag and
checksum you verified.

Do not `git clone` the theme into `themes/oink` and commit that. The nested
`.git` directory makes Git record a link to a commit instead of the files, so
the repository does not contain the theme after all. To track the theme by
reference, use a [submodule](#git-submodule).

## Developing against a local theme checkout {#local-theme-checkout}

You need this only when you change the theme and a site together. Clone the two
repositories side by side:

```text {title="sibling directory layout" copy=false}
~/pgsty/
├── oink/            # the theme
└── product-docs/    # your site
```

`HUGO_MODULE_REPLACEMENTS` points Hugo at the local checkout for one command
and leaves `go.mod` untouched:

```bash
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo server
```

A site created from the Starter already has this as `make dev` (set
`THEME_DIR` when the checkout is not at `../oink`), while `make serve` and
`make build` keep using the published release. A Go workspace
(`go work init` plus `HUGO_MODULE_WORKSPACE=go.work`) does the same job.

Both affect only your machine; CI and production build the release in
`go.mod`. Never commit `go.work`, because the paths in it exist only on your
machine. To confirm which release a build really uses, see
[Working on the theme alongside](/docs/admin/preview/#theme-workspace).

## Verify {#verify}

```bash
hugo mod graph                                       # which theme version actually resolved
hugo --gc --minify --printPathWarnings
```

The build passes when it ends with `Total in …` and prints no `WARN` or
`ERROR` you did not expect. Then check:

- `/docs/` opens, and the sidebar lists the page you wrote.
- The search box in the navbar finds a heading from that page.
- The light/dark toggle also changes the code block colors, which shows that
  `markup.highlight.noClasses: false` took effect.
- `git status --short` lists only source files. With a Hugo Module, `go.mod`
  and `go.sum` are among them; with the other methods, the theme files or the
  submodule entry.

## Related {#related}

- [Get started](/docs/start/) — choose between the Starter, an existing Hugo site and migration
- [OINK Starter](/docs/start/starter/) — the recommended path for a new site
- [Starter repository tour](/docs/start/anatomy/) — what each template file controls
- [Configuration](/docs/customize/config/) — every `hugo.yml` key and its default
- [Writing pages](/docs/write/pages/) — how to keep writing after the first page
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme module, and migrating from Docsy
