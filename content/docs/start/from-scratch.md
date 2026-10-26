---
title: From scratch and other install methods
linkTitle: From scratch
description: "Build a minimal OINK site in an empty directory. Compare four install methods: Module, submodule, offline archive, and pinned source copy."
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

This is the manual alternative to the recommended
[OINK Starter](/docs/start/starter/). It builds a minimal site in an empty
directory. A small `hugo.yml` and one `hugo mod get` command create a
single-language site you can preview. You must assemble the home page, example
content, deployment workflow, and all component usage yourself.

For an existing Hugo site, use the short [integration path](#existing-site)
below. For an existing Docsy site, see [Upgrade](/docs/admin/upgrade/).

The second half compares four install methods: Hugo Module, Git submodule,
offline archive, and pinned source copy. Current development and validation use
Go 1.27.3 and Hugo Extended 0.168.0. The default Hugo version stays pinned; older-Hugo compatibility testing and adaptation are discontinued.

> [!NOTE] OINK 1.4.0 build requirements
> Maintained sites use Hugo Extended 0.168.0 and its built-in LibSass.
> No external Sass installation is required. Keep the upstream LibSass warning
> visible and review it; do not enable `--panicOnWarning` or `HUGO_PANICONWARNING`.

## Add OINK to an existing site {#existing-site}

Work on a branch with the site's current configuration and content preserved.
Skip `hugo new site` and keep the existing configuration filename.

1. If the site has no `go.mod`, run `hugo mod init` with your repository's module
   path. Otherwise keep the existing module declaration.
1. Run `hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}`.
1. Replace the old theme selection with the OINK `module.imports` entry shown
   below. Preserve unrelated imports and configuration. Merge the three
   `markup.goldmark` settings and `markup.highlight.noClasses: false` from
   [the example](#config). Do not replace your whole configuration with it.
1. Review site-owned `layouts/` and assets, old theme shortcodes, and page
   `type`/`layout` values. These overrides and conventions may still select the
   previous theme's behavior. Keep content. Make only the necessary adaptations.
1. Run `hugo`, then open an existing representative page with
   `hugo server`. Check its navigation, images, and code blocks before applying
   optional OINK features. Continue with [verification](#verify).
{.steps}

## From an empty directory to the first page {#scaffold}

1. ### Create the skeleton and fetch the theme {#skeleton}

   ```bash
   hugo new site --format yaml my-docs
   cd my-docs
   git init
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   After `hugo mod init`, specify your site's module path. This is usually its
   repository address. `hugo mod get` writes `go.mod` and `go.sum`. Commit both.

   Before building, create `.gitignore` so generated files stay out of Git.
   Leave `enableGitInfo` off until you have made the first commit:

   ```gitignore {title=".gitignore"}
   /public/
   /resources/
   /.hugo_build.lock
   /.hugo_cache/
   ```

   The newest version number is on
   [GitHub Releases](https://github.com/pgsty/oink/releases). The
   `{{< param tdVersion.latest >}}` on this page is this site's current pin.
   A production site pins a release tag instead of following `main`.
   `@latest` resolves a version once. It is not a version policy.

1. ### Writing `hugo.yml` {#config}

   For this new site only, rename the generated `hugo.yaml` to `hugo.yml`
   (Hugo accepts both) and replace its contents with the following. Existing
   sites should merge the relevant settings instead:

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
       extended: true
       min: '{{< param hugoMinVersion >}}'
   ```

   These five blocks control different parts of the site:

   | Block | Governs | Consequence of omitting it |
   | --- | --- | --- |
   | Top level + `languages` | Site name, domain, languages and navbar menu | An incorrect `baseURL` makes every absolute production link incorrect |
   | `markup.goldmark` | The three component prerequisites | An attribute line becomes a literal `{.steps}` in the prose |
   | `params` | Search, repository links, shell switches | Interactive features stay off. The theme does not select them for the site |
   | `outputs` | The per-page `.md`, `llms.txt` and print pages | No "Copy as Markdown" in the page menu, and no print view |
   | `module` | References the theme and declares the Hugo floor | The build cannot find the theme |

   Mathematics additionally needs Goldmark's passthrough extension; see
   [Math](/docs/components/math/). For each key's meaning and default, see
   [Configuration](/docs/customize/config/).

1. ### Write the first page {#first-page}

   Every top-level directory under `content/` is a section. The directory
   structure determines the sidebar structure. A documentation section needs at least an
   `_index.md`:

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

   Write explicit `{#id}` anchors on headings. When you add a translation,
   the anchors in both languages must correspond. For page-writing instructions,
   see [Writing pages](/docs/write/pages/).

1. ### Preview {#preview}

   ```bash
   hugo server
   ```

   Open <http://localhost:1313/docs/>. The Docs section lists Install. The
   home page is still empty until you add home content. Edit the Install page
   and confirm that the preview updates.
{.steps}

## Other install methods {#install-methods}

The steps above use a Hugo Module. The other three address specific
constraints. These include network isolation, platforms that require the full
theme tree as build input, and organizations that review their own theme copy. Apart from `hugo mod vendor`, none of them creates a Go module, and
the site references the theme with `theme: oink` rather than `module.imports`.
For these methods, you must manage version resolution and integrity checks.

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

This is the only method in which Hugo resolves the version, verifies the
checksum, and records it in `go.sum`. `hugo mod graph` shows the resolved
version. `hugo mod get -u` upgrades it. This method requires Go on the machine.

### Git submodule {#git-submodule}

Record an exact theme commit in the site repository:

```bash
git submodule add https://github.com/pgsty/oink.git themes/oink
git -C themes/oink fetch --tags
git -C themes/oink checkout {{< param tdVersion.latest >}}
git add .gitmodules themes/oink
```

```yaml {title="hugo.yml"}
theme: oink
```

Before CI runs Hugo, it must initialize the submodule. Otherwise, `themes/oink`
is an empty directory:

```bash
git submodule update --init --recursive
```

### Offline archive {#offline-archive}

For network-isolated environments, choose one of two paths. Prepare either
archive on a connected machine. Transfer the complete archive.

**With `hugo mod vendor`**, the resolved theme source is frozen into the site
directory, and later builds need neither the network nor Go.

```bash
hugo mod vendor          # writes _vendor/, holding the theme's full source tree
tar czf ../my-docs.tgz . # put the archive outside the directory being archived
```

If `_vendor/` exists, Hugo prefers it. `hugo mod graph` prints `+vendor`.
Keep `module.imports` in `hugo.yml` unchanged. This step requires Go. Later
builds do not. Upgrading the theme means returning to a connected environment
and running `hugo mod get` and `hugo mod vendor` again.

`_vendor/` collects only the directories the theme mounts (`assets`, `data`,
`i18n`, `layouts`, `static`) plus `hugo.yaml` and `theme.toml`. It does not
include `LICENSE`, `NOTICE` or `VENDOR.json`. To redistribute that archive, take
those three files from the theme repository as well.

**With a tag source archive**, no Go module is created. Unpack the selected
theme version into `themes/oink/`.

```bash
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

The theme repository's root is the module root. Unpacking places
`layouts/`, `assets/`, `i18n/`, and `static/` directly under the target. There
is no additional directory level. Redistribution must keep `LICENSE`, `NOTICE`,
and `VENDOR.json`. The manifest records each third-party runtime's version,
source, license path, and SHA-256. Use it for an offline audit.

When moving between machines, generate the archive and its checksum from an
immutable tag on the connected side:

```bash
git clone --branch {{< param tdVersion.latest >}} --depth 1 \
  https://github.com/pgsty/oink.git oink
git -C oink archive --format=tar.gz --prefix=oink/ \
  --output=../oink-{{< param tdVersion.latest >}}.tar.gz {{< param tdVersion.latest >}}
shasum -a 256 oink-{{< param tdVersion.latest >}}.tar.gz \
  > oink-{{< param tdVersion.latest >}}.tar.gz.sha256
```

Carry the archive and its `.sha256` into the isolated environment, verify, then
unpack:

```bash
shasum -a 256 -c oink-{{< param tdVersion.latest >}}.tar.gz.sha256
mkdir -p themes
tar -xzf oink-{{< param tdVersion.latest >}}.tar.gz -C themes
```

An archive produced this way is your own artifact, not a project release.
Release pages do not all provide an archive and checksum file. If you use a
public attachment, verify its checksum independently.

Before building offline, confirm the archive is complete. All eleven of these
must be present:

```filetree {title="themes/oink/"}
- oink/
  - go.mod              # module path declaration, used when resolving as a Hugo Module
  - hugo.yaml           # theme default parameters and the Hugo version floor
  - theme.toml          # theme metadata, required by the theme: oink method
  - LICENSE             # Apache-2.0
  - NOTICE              # upstream attribution; must be kept on redistribution
  - VENDOR.json         # third-party runtime manifest: version, source, licence path, SHA-256
  - assets/             # SCSS, JS and the third-party runtimes shipped with the theme
  - layouts/            # templates, partials, shortcodes, render hooks
  - static/             # font files, published as is
  - i18n/               # 32 interface language files
  - data/               # the SPDX licence table behind the page-end attribution line
```

### Pinned source copy {#pinned-clone}

When a hosting platform needs the theme files in the site repository, use the
[tag archive procedure above](#offline-archive) and unpack it into
`themes/oink/`. Set `theme: oink` and commit the extracted files together with
the tag and checksum you verified.

A plain `git clone ... themes/oink` leaves a nested `.git` directory. Adding it
to the parent repository records a Git link rather than the theme files.
This does not provide a self-contained source copy. Use a submodule if you want
Git to track the theme by reference.

### The four methods compared {#comparison}

| Method | Needs Go | Version auditable | Theme source in your repository | Use when |
| --- | --- | --- | --- | --- |
| **Hugo Module** | Yes | `go.sum` verifies automatically | No | The default |
| Git submodule | No | The repository records the commit | By reference | The theme source has to be in the repository |
| Offline archive | No | Checksums verified by hand | Yes | Network isolation |
| Pinned source copy | No | Record the tag and checksum | Yes | The platform requires a complete tree |

> [!TIP] A consuming site needs no front-end toolchain
> Bootstrap, Font Awesome, the fonts, and the search and diagram runtimes all
> ship with the theme. A site needs no `node_modules`, no PostCSS, no RTLCSS and
> no CDN. Tutorials that install npm dependencies for a Docsy site describe
> upstream Docsy's process and do not apply to OINK.

## Developing against a local theme checkout {#local-theme-checkout}

This section applies only when changing the theme and the site together. Clone
the two repositories as siblings:

```text {title="sibling directory layout" copy=false}
~/pgsty/
├── oink/            # the theme
└── product-docs/    # your site
```

Use the `HUGO_MODULE_REPLACEMENTS` environment variable to substitute the local
checkout temporarily, leaving `go.mod` untouched:

```bash
cd ~/pgsty/product-docs
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> ../oink' hugo server
```

The documentation site's `Makefile` runs these commands.
`make dev` and `make check` expect the theme checkout at the sibling `../oink`:

```makefile {title="Makefile: as the documentation site writes it"}
build:
	hugo --cleanDestinationDir --minify

check:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' npm test

dev:
	HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> $(abspath ../oink)' hugo server --renderToMemory
```

A Go workspace (`go work init` plus `HUGO_MODULE_WORKSPACE=go.work`) is an
equivalent alternative. Both apply only to the local machine. CI and production
builds use the version in `go.mod`. Never commit `go.work`.

## Verify {#verify}

```bash
hugo mod graph                                       # which theme version actually resolved
hugo --gc --minify --printPathWarnings
```

It passes when the build ends with `Total in …` and no `WARN` or `ERROR`. Then
confirm:

- `/docs/` opens and the sidebar holds the page you wrote
- The navbar has a search box that finds the heading you just wrote
- The light/dark toggle is present. Code block colors change with it, which confirms `markup.highlight.noClasses: false` took effect
- `git status --short` lists only source changes. Git ignores generated output.
  For the Module path, commit both `go.mod` and `go.sum`. Other install methods
  keep their own theme source or submodule record.

## Related {#related}

- [Get started](/docs/start/) — choose between Starter, an existing Hugo site, and migration
- [OINK Starter](/docs/start/starter/) — the recommended new-site path
- [Starter repository tour](/docs/start/anatomy/) — what each template directory owns
- [Configuration](/docs/customize/config/) — every `hugo.yml` key and its default
- [Writing pages](/docs/write/pages/) — how to keep writing after the first page
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme module, and migrating from Docsy
