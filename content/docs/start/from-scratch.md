---
title: From scratch and other install methods
linkTitle: From scratch
description: Build a minimal OINK site in an empty directory, and weigh the four install methods — Module, submodule, offline archive, pinned clone.
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
directory: a small `hugo.yml` plus one `hugo mod get` gives a single-language
site you can preview. The cost is that the home page, example content,
deployment workflow, and every component usage are yours to assemble.

An existing Hugo site needs no scaffolding: install the theme module, add the
three Goldmark prerequisites (see [Writing `hugo.yml`](#config)), and leave the
content alone. For an existing Docsy site, see [Upgrade](/docs/admin/upgrade/).

The second half weighs four install methods: Hugo Module, Git submodule,
offline archive, and pinned clone. For the current v0.8.2 release path, use Go
1.26 and Hugo Extended 0.165.0 unless an existing site deliberately targets the
theme's lower declared compatibility floor.

## From an empty directory to the first page {#scaffold}

1. ### Create the skeleton and fetch the theme {#skeleton}

   ```bash
   hugo new site --format yaml my-docs
   cd my-docs
   hugo mod init github.com/example/my-docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   What follows `hugo mod init` is your own site's module path, usually the
   repository address. `hugo mod get` writes `go.mod` and `go.sum`, and both are
   committed.

   The newest version number is on
   [GitHub Releases](https://github.com/pgsty/oink/releases); the
   `{{< param tdVersion.latest >}}` on this page is what this site currently
   pins. A production site pins a release tag rather than following `main`:
   `@latest` is a one-off resolution, not a version policy.

1. ### Writing `hugo.yml` {#config}

   Rename the `hugo.yaml` that `hugo new site` generated to `hugo.yml` (Hugo
   accepts both; this documentation uses the latter throughout) and replace its
   contents with the following, which builds as it stands:

   ```yaml {title="hugo.yml" collapse=30}
   title: Product Docs
   baseURL: https://docs.example.com/
   defaultContentLanguage: en
   # enableGitInfo: true        # the "last modified" time comes from git; run git init before enabling

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

   What each of the five blocks governs:

   | Block | Governs | Consequence of omitting it |
   | --- | --- | --- |
   | Top level + `languages` | Site name, domain, languages and navbar menu | A wrong `baseURL` sends every absolute link astray in production |
   | `markup.goldmark` | The three component prerequisites | An attribute line becomes a literal `{.steps}` in the prose |
   | `params` | Search, repository links, shell switches | Interactive features stay off; the theme does not decide for the site |
   | `outputs` | The per-page `.md`, `llms.txt` and print pages | No "Copy as Markdown" in the page menu, and no print view |
   | `module` | References the theme and declares the Hugo floor | The build cannot find the theme |

   Mathematics additionally needs Goldmark's passthrough extension; see
   [Math](/docs/components/math/). Every key's full meaning and default is in
   [Configuration](/docs/customize/config/).

1. ### Write the first page {#first-page}

   Every top-level directory under `content/` is a section, and the directory
   structure is the sidebar structure. A documentation section needs at least an
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

   Write explicit `{#id}` anchors on headings: when a translation is added
   later, the two languages' anchors have to correspond. How to write a page is
   in [Writing pages](/docs/write/pages/).

1. ### Preview {#preview}

   ```bash
   hugo server
   ```

   Open <http://localhost:1313/> and the sidebar shows Docs → Install. Edits
   hot-reload in milliseconds.
{.steps}

## Other install methods {#install-methods}

The steps above use a Hugo Module. The other three address particular
constraints: network isolation, a platform that requires the build input to
contain the whole theme tree, or an organization that reviews its own copy of
the theme. Apart from `hugo mod vendor`, none of them creates a Go module, and
the site references the theme with `theme: oink` rather than `module.imports`.
The shared cost is that version resolution and integrity checking become your
responsibility.

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

The only method where Hugo resolves the version itself, verifies the checksum,
and leaves an audit record in `go.sum`. `hugo mod graph` shows what actually
resolved and `hugo mod get -u` upgrades. It needs Go on the machine.

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

CI must initialize the submodule before running Hugo, or `themes/oink` is an
empty directory:

```bash
git submodule update --init --recursive
```

### Offline archive {#offline-archive}

For network-isolated environments. Two paths, both prepared on a connected
machine and carried in whole.

**With `hugo mod vendor`**, the resolved theme source is frozen into the site
directory, and later builds need neither the network nor Go.

```bash
hugo mod vendor          # writes _vendor/, holding the theme's full source tree
tar czf my-docs.tgz .    # carry _vendor/ into the isolated environment with everything else
```

When `_vendor/` exists Hugo prefers it (`hugo mod graph` prints `+vendor`), and
`module.imports` in `hugo.yml` stays as it is. This step needs Go; the builds
after it do not. Upgrading the theme means returning to a connected environment
and running `hugo mod get` and `hugo mod vendor` again.

`_vendor/` collects only the directories the theme mounts (`assets`, `data`,
`i18n`, `layouts`, `static`) plus `hugo.yaml` and `theme.toml`. It does not
include `LICENSE`, `NOTICE` or `VENDOR.json`. To redistribute that archive, take
those three files from the theme repository as well.

**With a tag source archive**, no Go module is created; a version of the theme is
simply unpacked into `themes/oink/`.

```bash
curl -L -o oink.tar.gz \
  https://github.com/pgsty/oink/archive/refs/tags/{{< param tdVersion.latest >}}.tar.gz
mkdir -p themes/oink
tar xzf oink.tar.gz -C themes/oink --strip-components=1
```

```yaml {title="hugo.yml"}
theme: oink
```

The theme repository's root is the module root, so unpacking lands directly on
`layouts/`, `assets/`, `i18n/` and `static/` with no further level to descend
into. Redistribution must keep `LICENSE`, `NOTICE` and `VENDOR.json`; the last
records each third-party runtime's version, source, licence path and SHA-256,
and is what an offline audit rests on.

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
Whether a given tag's release page carries an archive and a checksum file varies
by release; verify the checksum independently when using a public attachment.

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

### Pinned clone {#pinned-clone}

For a hosting platform that requires the build input to contain the whole theme
tree:

```bash
git clone https://github.com/pgsty/oink.git themes/oink
git -C themes/oink checkout {{< param tdVersion.latest >}}
```

The difference from a submodule is that the theme files enter your repository
history directly, without the `.gitmodules` indirection. Record the commit that
was finally resolved and the procedure for restoring it.

### The four methods compared {#comparison}

| Method | Needs Go | Version auditable | Theme source in your repository | Use when |
| --- | --- | --- | --- | --- |
| **Hugo Module** | Yes | `go.sum` verifies automatically | No | The default |
| Git submodule | No | The repository records the commit | By reference | The theme source has to be in the repository |
| Offline archive | No | Checksums verified by hand | Yes | Network isolation |
| Pinned clone | No | You record it yourself | Yes | The platform requires a complete tree |

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

The documentation site's `Makefile` is an alias for exactly these commands, and
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
equivalent alternative. Both apply to the local machine only: CI and production
builds use the version in `go.mod`, and `go.work` is never committed.

## Verify {#verify}

```bash
hugo mod graph                                       # which theme version actually resolved
hugo --gc --minify --printPathWarnings --panicOnWarning
```

It passes when the build ends with `Total in …` and no `WARN` or `ERROR`. Then
confirm:

- `/docs/` opens and the sidebar holds the page you wrote
- The navbar has a search box that finds the heading you just wrote
- The light/dark toggle is present, and code block colours follow it (which shows `markup.highlight.noClasses: false` took effect)
- `git status` shows `go.mod` and `go.sum`, and no `public/` or `resources/`

## Related {#related}

- [Get started](/docs/start/) — choose between Starter, an existing Hugo site, and migration
- [OINK Starter](/docs/start/starter/) — the recommended new-site path
- [Starter repository tour](/docs/start/anatomy/) — what each template directory owns
- [Configuration](/docs/customize/config/) — every `hugo.yml` key and its default
- [Writing pages](/docs/write/pages/) — how to keep writing after the first page
- [Upgrade](/docs/admin/upgrade/) — upgrading the theme module, and migrating from Docsy
