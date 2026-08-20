---
title: Quick start
linkTitle: Get started
description: Clone the OINK documentation site, preview it locally, replace the site details, and deploy to GitHub Pages.
weight: 20
icon: fa-solid fa-rocket
no_list: true
search_keywords:
  [
    quick start,
    get started,
    install,
    clone,
    hugo server,
    GitHub Pages,
    fork,
  ]
cascade:
  categories: [Get started]
aliases:
  - /docs/tutorial/
  - /docs/tutorial/prerequisites/
  - /docs/tutorial/project-site/
---

This path does not start from an empty directory. It starts by cloning the site
you are reading, deleting what you do not need, and replacing the rest with your
own details. This site is OINK's regression site: it contains every component
and every page type, and it tracks the theme version. Trimming it down is less
writing than adding configuration and examples one at a time to an empty
directory.

Prerequisites: a machine that can install Hugo Extended and Go, a GitHub
account, and ten minutes. No Node.js and no other front-end toolchain.

## What you end up with {#what-you-get}

A bilingual documentation site: your directory tree in the left sidebar, this
page's outline on the right, full-text search and a command palette in the
navbar, and light or dark following the system. One Markdown source produces the
web page, the print page, plain Markdown and RSS. Hosted on GitHub Pages.

![How content, configuration and the theme combine into a static site at build time](/images/hero-light.webp)
{width="720" height="480" caption="One source, four outputs: HTML, print, Markdown, RSS"}

## Walkthrough {#walkthrough}

1. ### Install Hugo Extended and Go {#install-tools}

   Besides Git you need two things. Hugo Extended must be
   `{{< param hugoMinVersion >}}` or newer: the standard Hugo build has no
   embedded Sass compiler, cannot compile the theme's styles, and fails the
   build. Go resolves modules: OINK is published as a Hugo Module, and Hugo uses
   Go's module machinery to download and verify `github.com/pgsty/oink`.

   ```bash {tab="macOS" group="os" value="macos"}
   brew install hugo go git
   ```

   ```bash {tab="Linux" value="linux"}
   # Distribution repositories often carry a Hugo that is too old; use the official deb (this site's CI does the same)
   curl -LO https://github.com/gohugoio/hugo/releases/download/v0.164.0/hugo_extended_0.164.0_linux-amd64.deb
   sudo dpkg -i hugo_extended_0.164.0_linux-amd64.deb
   sudo apt install -y golang-go git
   ```

   ```powershell {tab="Windows" value="windows"}
   winget install Hugo.Hugo.Extended
   winget install GoLang.Go
   winget install Git.Git
   ```

   Check once afterwards; the output must contain `extended`:

   ```console
   $ hugo version
   hugo v0.164.0+extended+withdeploy darwin/arm64 BuildDate=2026-07-06T16:39:30Z
   $ go version
   go version go1.26.6 darwin/arm64
   ```

   On other platforms follow the [Hugo installation guide](https://gohugo.io/installation/)
   and [go.dev/dl](https://go.dev/dl/), taking care to pick the extended build.

1. ### Clone the documentation site and preview it {#clone-and-preview}

   ```bash
   git clone https://github.com/pgsty/oink.pgsty.com my-docs
   cd my-docs
   hugo server
   ```

   Open <http://localhost:1313/>; the Chinese site is at
   <http://localhost:1313/zh/>. The first start downloads the theme module (a few
   seconds to a minute, depending on the network); after that, edits hot-reload
   in milliseconds.

   The committed `go.mod` pins the theme version, so the clone builds as it is,
   with no extra install script.

   > [!NOTE]
   > The `Makefile` in the repository is only a set of command aliases. `make dev`
   > and `make check` use a sibling `../oink` theme checkout through
   > `HUGO_MODULE_REPLACEMENTS`; `make build` and `make serve` always use the
   > published version pinned in `go.mod`. For a new site, `hugo server` is enough.

1. ### Replace the site details {#make-it-yours}

   **Site identity** lives entirely in `hugo.yml`. `baseURL` is a YAML anchor —
   the real address is written on `params.productionURL`, and that is the only
   place to change it:

   ```yaml {title="hugo.yml"}
   title: Product Docs # navbar site name and <title>

   params:
     productionURL: &productionURL https://docs.example.com/
     github_repo: https://github.com/example/product-docs # where "Edit this page" points
     copyright:
       authors: '[Example Inc.](https://example.com/)'
       from_year: 2026
     footer_center_info: ''

   baseURL: *productionURL
   ```

   `languages.en.title` and `languages.zh.title` override the top-level `title`,
   so change both. Every parameter's meaning and default is in
   [Configuration](/docs/customize/config/).

   **Delete the configuration specific to this site.** Keeping it points your
   site at OINK's repositories and accounts.

   | Key in `hugo.yml` | What to do |
   | --- | --- |
   | `services.googleAnalytics.id` | OINK's analytics ID. Delete it, or replace it with your own when you want analytics |
   | `params.comments` | giscus pointing at discussions in `pgsty/oink.pgsty.com`. Delete the block or point it at your repository |
   | `params.tdVersion` `params.version` `params.version_menu` `params.versions` | OINK's version menu. Delete |
   | `params.github_project_repo` | A link to the theme repository. Delete |
   | `languages.<lang>.menus.main` | Navbar entries pointing at this site's sections such as `/docs/tutorial`. Rewrite for your tree |

   **Replace the logo and icons.** Replace these three files, keeping the
   filenames — the theme mounts them by name:

   ```text {title="static/" copy=false}
   static/favicon.svg           # browser tab icon
   static/favicon.ico
   static/apple-touch-icon.png  # iOS add-to-home-screen
   ```

   `static/logo.svg` is this site's own brand lockup and no parameter points at
   it. Delete it, or replace it with a horizontal wordmark and set
   `params.wordmark`.

   **Replace the content.** `content/docs/` is OINK's own theme documentation;
   delete the whole tree and write your first page:

   ```bash
   rm -rf content/docs && mkdir -p content/docs
   ```

   ```markdown {title="content/docs/_index.md"}
   ---
   title: Docs
   linkTitle: Docs
   description: Product documentation.
   weight: 20
   ---

   Everything about running Product in production.
   ```

   `content/blog/` can keep one post as a template or be deleted entirely (if you
   delete it, remove the `blog` entry from `menus.main` as well). Which
   directories must stay and which belong to the documentation site itself is in
   [Repository tour](/docs/start/anatomy/).

   **For an English-only site**, delete the whole `languages.zh` block and every
   `.zh.md` file, leaving one language:

   ```yaml {title="hugo.yml"}
   defaultContentLanguage: en
   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: Product Docs
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }
   ```

   ```bash
   find content -name '*.zh.md' -delete
   ```

   To keep both languages or swap in a different pair, see
   [Languages](/docs/customize/i18n/).

1. ### Deploy {#publish}

   Create an empty repository on GitHub and replace the local history with your
   own:

   ```bash
   rm -rf .git && git init -b main
   git add . && git commit -m "Initial documentation site"
   git remote add origin git@github.com:example/product-docs.git
   git push -u origin main
   ```

   The repository ships with `.github/workflows/pages.yml`: a push to `main`
   builds and publishes, and it can also be triggered by hand from the Actions
   page (`workflow_dispatch`). It pins the Hugo Extended and Go versions, builds
   with `--printPathWarnings --panicOnWarning`, and takes `baseURL` from GitHub
   Pages, so publishing to a subpath such as
   `example.github.io/product-docs/` needs no configuration change.

   In the repository, go to Settings → Pages → Build and deployment → Source and
   choose **GitHub Actions**. The default is `Deploy from a branch`, and leaving
   it will make the workflow fail at the deploy step.

   > [!IMPORTANT] Deleting `scripts/` means editing the workflow
   > The `Verify advertised and pinned release match` step in `pages.yml` runs
   > `node scripts/check-release-pin.mjs` to check that the version the site
   > advertises matches the one pinned in `go.mod`. Once `scripts/` is gone,
   > remove that step and `Set up Node.js` from `pages.yml`.

   For Cloudflare Pages, Netlify, Nginx and offline packaging, see
   [Deploy](/docs/admin/deploy/): the build command is always
   `hugo --gc --minify`, and only `baseURL` and the environment variables differ.
{.steps}

## Verify {#verify}

Run a production build locally. It is stricter than the development server, and
path warnings fail the build:

```bash
hugo --gc --minify --printPathWarnings --panicOnWarning
```

It passes when it prints `Total in …` with no `WARN` or `ERROR`. Then check
against the preview:

- The navbar shows your site name and logo, and the browser tab shows your favicon
- The sidebar is your own tree, and every page opens
- {{< kbd "Ctrl" "K" >}} (or {{< kbd "⌘" "K" >}} on macOS) opens the command palette and finds the page you just wrote
- In the menu beside the page title, "Edit this page" points at your repository, not `pgsty/oink.pgsty.com`
- After deploying, `Deploy Oink site to GitHub Pages` is green on the repository's Actions page

For build errors, see [Troubleshooting](/docs/admin/troubleshooting/).

## Next steps {#next-steps}

- [Repository tour](/docs/start/anatomy/) — what each cloned directory is, and what can go.
- [Writing pages](/docs/write/pages/) — what a documentation page is made of: front matter, heading anchors, links and images.
- [Components](/docs/components/) — callouts, tabs, field lists, file trees and the rest, one page each.
- [Brand and appearance](/docs/customize/brand/) — accent colour, font preset, page width and custom styles.
- [Deploy](/docs/admin/deploy/) — hosting beyond GitHub Pages, and the acceptance checklist.
{.cards}

## Instructions for a coding assistant {#for-agents}

The four steps above can be handed to a coding assistant (Claude Code, Codex and
the like). Copy the block below and replace the three bracketed items with your
own details:

> [!DETAILS] Instructions to copy wholesale
>
> ```text
> Please set up a documentation site for me with the OINK theme, following the process
> below. Where something is unclear, apply "only ask when information is missing".
>
> 1. Check the environment: run `hugo version` and require the output to contain `extended`
>    with a version >= 0.160.1; run `go version` and require a version number. If either
>    fails, install it per the official documentation first — `brew install hugo go` on
>    macOS, the hugo_extended deb from GitHub Releases on Debian/Ubuntu.
> 2. Clone the site template: `git clone https://github.com/pgsty/oink.pgsty.com [target directory]`
>    and change into it.
> 3. Change three things in hugo.yml: the top-level `title` and `languages.<lang>.title` to
>    [site name]; `params.productionURL` to [site domain] (baseURL is a YAML anchor pointing
>    at it, so do not change baseURL separately); `params.github_repo` to the repository this
>    site will live in. Also delete this site-specific configuration:
>    `services.googleAnalytics`, `params.comments`, `params.tdVersion`, `params.version`,
>    `params.version_menu`, `params.versions`, `params.github_project_repo`, and reduce
>    `menus.main` to /docs and /blog only.
> 4. Clear the example content: delete the whole `content/docs/` tree and create a new
>    `content/docs/_index.md` (front matter with at least title / description / weight);
>    keep one post under `content/blog/` as a template. Delete the scaffolding that belongs
>    to the documentation site itself: `tests/`, `scripts/`, `playwright.config.mjs`,
>    `package.json`, `package-lock.json`, `AGENTS.md`, `TRANSLATION.md`, `CONTRIBUTING.md`,
>    `agent-docs.config.yml`; delete every workflow under `.github/workflows/` except
>    `pages.yml`; and remove the `Set up Node.js` and
>    `Verify advertised and pinned release match` steps from `pages.yml`.
> 5. Start `hugo server` in the background and confirm http://localhost:1313/ returns 200
>    and the page title is the new site name.
> 6. Validate: run `hugo --gc --minify --printPathWarnings --panicOnWarning` and require it
>    to end with `Total in ...` and no WARN/ERROR. Fix any error rather than working around
>    it by suppressing warnings.
> 7. Only ask me when [site name], [site domain] or the repository address is missing;
>    otherwise proceed with the defaults above.
> ```

The resulting site is easy for an assistant to read: every page has a `.md`
plain-text output, the site root has `llms.txt`, and the menu beside the page
title offers "Copy as Markdown" and "Open in Claude". See
[AI-agent support](/docs/customize/agents/).

To start from an empty directory instead of this repository, see
[From scratch and other install methods](/docs/start/from-scratch/).

## Related {#related}

- [Repository tour](/docs/start/anatomy/) — what each directory is, and the order to delete in
- [From scratch and other install methods](/docs/start/from-scratch/) — starting with `hugo mod init`, submodules and offline installation
- [Local preview](/docs/admin/preview/) — the `hugo server` switches worth knowing, and previewing drafts
- [Deploy](/docs/admin/deploy/) — configuration per host, and the acceptance checklist
- [Troubleshooting](/docs/admin/troubleshooting/) — the four common classes of error: build, language, search, platform
