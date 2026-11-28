---
title: Add docs to a project
linkTitle: Add docs to a project
description: Add a self-contained OINK documentation site inside an existing open-source repository's docs/ directory, keep build outputs out of Git, and wire GitHub Pages and Cloudflare Pages auto-builds.
weight: 30
search_keywords:
  [
    add docs,
    docs directory,
    monorepo,
    open-source project,
    gitignore,
    GitHub Pages,
    Cloudflare Pages,
    auto-build,
    github_subdir,
    CI,
  ]
---

You already have an open-source repository with application code—a Go service, a
Rust CLI, a Python package, or a database extension—and you want real
documentation to live right beside the code so pull requests update code and
docs together. Putting a self-contained OINK site inside `docs/` keeps Hugo
isolated from your main build while publishing cleanly on every push.

For a real production example of this layout, see [AGW](/case/agw/), which
hosts its bilingual documentation and landing page inside a subfolder of its
application repository.

## Repository layout {#layout}

Keep the Hugo configuration, module pin, and content completely inside `docs/`:

```filetree {title="my-project/"}
- my-project/
  - cmd/                     # your project's own source code
  - internal/
  - go.mod                   # your project's own Go module (if it is a Go project)
  - README.md
  - .gitignore               # excludes docs/ build outputs without hiding app files
  - .github/
    - workflows/
      - ci.yaml              # existing application tests
      - docs.yaml            # builds and deploys docs/ only when docs/ changes
  - docs/                    # self-contained OINK sub-project
    - hugo.yml               # site config with github_subdir: docs
    - go.mod                 # pins github.com/pgsty/oink@vX.Y.Z
    - go.sum                 # verifies the pinned OINK release
    - content/
      - _index.md
      - docs/
        - _index.md
        - install.md
    - data/
      - home/
        - en.yaml
    - assets/
      - icons/logo.svg
    - static/
      - favicon.svg
```

Giving `docs/` its own `go.mod` is deliberate: even if your project itself is
written in Go and already has a `go.mod` at the repository root, the two module
graphs stay completely separate so the documentation theme never enters your
application's dependency tree.

## Initialize the `docs/` sub-project {#init}

Install Git, Go and Hugo per [Prerequisites](/docs/start/#tools), then run
these steps from your project's repository root:

1. ### Create `docs/` and pin OINK {#init-module}

   ```bash {title="Terminal"}
   mkdir -p docs/content/docs
   cd docs
   hugo mod init github.com/OWNER/PROJECT/docs
   hugo mod get github.com/pgsty/oink@{{< param tdVersion.latest >}}
   ```

   Ending the module path in `/docs` keeps it distinct from the root module.
   Commit both `docs/go.mod` and `docs/go.sum` so CI resolves the exact same
   theme tag you tested locally.

1. ### Write `docs/hugo.yml` with `github_subdir` {#init-config}

   Create `docs/hugo.yml`. Compared to a standalone site, the crucial extra
   setting is `params.github_subdir: docs`: without it, every **Edit this
   page** and history link points to `/content/...` at the repository root and
   returns 404 on GitHub.

   ```yaml {title="docs/hugo.yml" collapse=30}
   title: My Project
   baseURL: https://OWNER.github.io/PROJECT/
   defaultContentLanguage: en
   enableGitInfo: true

   languages:
     en:
       label: English
       locale: en-US
       weight: 1
       title: My Project
       params:
         description: Documentation for My Project
       menus:
         main:
           - { name: Docs, pageRef: /docs, weight: 20 }

   markup:
     goldmark:
       renderer:
         unsafe: true
       parser:
         attribute:
           block: true
         wrapStandAloneImageWithinParagraph: false
     highlight:
       noClasses: false

   params:
     offline_search: true
     github_repo: https://github.com/OWNER/PROJECT
     github_branch: main
     github_subdir: docs # required when the Hugo site lives in docs/
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

1. ### Add your first page and preview {#init-preview}

   Write `docs/content/docs/_index.md` and `docs/content/docs/install.md` (see
   [From scratch](/docs/start/from-scratch/#first-page) for minimal examples),
   then preview from the repository root with `-s docs` (or `cd docs && hugo serve`):

   ```bash {title="Terminal (from repository root)"}
   hugo serve -s docs
   ```

   Open <http://localhost:1313/docs/> and verify that the **Edit this page**
   entry in the page-actions menu beside the title opens
   `docs/content/docs/...` in your repository.
{.steps}

## Manage `.gitignore` cleanly {#gitignore}

Hugo writes generated HTML, processed images, lock files and module caches into
the site directory. Add explicit `docs/`-prefixed ignore rules to your
repository's `.gitignore` before running your first build, so generated output
never bloats Git history or creates merge conflicts—and so you never
accidentally ignore a `public/` or `resources/` directory used by your main
application:

```gitignore {title=".gitignore (repository root)"}
# OINK / Hugo documentation build outputs and local caches
docs/public/
docs/resources/
docs/.hugo_build.lock
docs/.hugo_cache/
go.work
go.work.sum
```

Know which files stay out of Git and which ones CI requires:

| Path | Track in Git? | Why |
| --- | --- | --- |
| `docs/public/` | **Ignore** | Built HTML/CSS/JS output; regenerated cleanly by CI on every deploy |
| `docs/resources/` | **Ignore** | Cached processed images (`_gen/`); stale copies bloat diffs |
| `docs/.hugo_build.lock` | **Ignore** | Ephemeral Hugo build lock file |
| `docs/.hugo_cache/` | **Ignore** | Local or CI Hugo cache directory |
| `go.work`, `go.work.sum` | **Ignore** | Machine-local Go workspace paths break other contributors and CI |
| `docs/hugo.yml`, `docs/go.mod`, `docs/go.sum` | **Commit** | Site configuration and exact checksum-verified OINK release |
| `docs/content/`, `docs/data/`, `docs/assets/`, `docs/static/` | **Commit** | Authored Markdown, landing data, logos, CSS and static files |
{.wide}

Run a production build once and check `git status --short` to verify that zero
generated files show up as untracked:

```bash {title="Terminal"}
hugo -s docs --cleanDestinationDir --gc --minify --environment production --printPathWarnings
git status --short
```

## Auto-build on GitHub Pages {#github-pages}

Add one GitHub Actions workflow at `.github/workflows/docs.yaml`. Two details
differ from a standalone docs repository: every build step runs inside
`working-directory: docs` (with `cache-dependency-path: docs/go.sum` and
artifact path `docs/public`), and the `paths:` filter ensures code-only commits
do not waste runner minutes rebuilding unchanged docs.

```yaml {title=".github/workflows/docs.yaml" lineNos="inline" collapse=30}
name: Deploy Docs to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/docs.yaml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: github-pages
  cancel-in-progress: false

env:
  # Never let a workspace override the release pinned in docs/go.mod.
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/docs/.hugo_cache

jobs:
  build:
    name: Build docs
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs
    steps:
      - name: Check out repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0 # required for enableGitInfo last-modified dates

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version: stable
          cache-dependency-path: docs/go.sum

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v6

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Download OINK module
        run: go mod download github.com/pgsty/oink

      - name: Build production site
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: docs/public

  deploy:
    name: Deploy
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Publish
        id: deployment
        uses: actions/deploy-pages@v5
```

How the build logic hangs together:

- **`paths: ['docs/**', '.github/workflows/docs.yaml']`** triggers automatic
  deploys only when documentation or the workflow itself changes;
  `workflow_dispatch` still lets you trigger a deploy manually at any time.
- **`defaults.run.working-directory: docs`** makes `go mod download` and `hugo`
  operate strictly on `docs/go.mod` and `docs/hugo.yml` without touching a
  root-level `go.mod`.
- **`--baseURL "${{ steps.pages.outputs.base_url }}/"`** injects the exact URL
  GitHub Pages serves—including the `/<PROJECT>/` subpath—so search indexes,
  stylesheets and canonical links never 404.
- **`--printPathWarnings` without `--panicOnWarning`** keeps OINK's warnings
  readable in the log without aborting on non-fatal diagnostics.

In GitHub, open **Settings → Pages → Build and deployment → Source**, choose
**GitHub Actions**, and push to `main`.

## Auto-build on Cloudflare Pages {#cloudflare-pages}

Cloudflare Pages supports two deployment models for a `docs/` sub-project. Pick
**one** per Cloudflare Pages project—never connect both Git integration and
Direct Upload to the same project:

{{< tabs group="cf-mode" default="cf-actions" label="Cloudflare deploy mode" >}}
{{< tab label="GitHub Actions Direct Upload (recommended)" value="cf-actions" >}}

Building in GitHub Actions and uploading `docs/public` via Wrangler lets you
run the latest Hugo release (even when Cloudflare's default build image ships
an older Hugo), plus native `paths:` filtering so application-only pushes skip
doc deploys.

```yaml {title=".github/workflows/docs-cloudflare.yaml" lineNos="inline" collapse=30}
name: Deploy Docs to Cloudflare Pages

on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '.github/workflows/docs-cloudflare.yaml'
  workflow_dispatch:

permissions:
  contents: read
  deployments: write

concurrency:
  group: cloudflare-docs-${{ github.ref }}
  cancel-in-progress: true

env:
  GOWORK: off
  HUGO_MODULE_WORKSPACE: off
  HUGO_CACHEDIR: ${{ github.workspace }}/docs/.hugo_cache

jobs:
  deploy:
    name: Build and upload docs
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: docs
    steps:
      - name: Check out repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0

      - name: Set up Go
        uses: actions/setup-go@v7
        with:
          go-version: stable
          cache-dependency-path: docs/go.sum

      - name: Install Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: latest

      - name: Download OINK module
        run: go mod download github.com/pgsty/oink

      - name: Build production site
        env:
          SITE_URL: ${{ vars.CLOUDFLARE_SITE_URL || 'https://my-project.pages.dev/' }}
        run: |
          hugo --cleanDestinationDir --gc --minify --environment production \
            --printPathWarnings \
            --baseURL "${SITE_URL}"

      - name: Upload to Cloudflare Pages
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy docs/public --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME || github.event.repository.name }} --branch=${{ github.ref_name }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

Set up Cloudflare once:

1. In the Cloudflare dashboard, create a **Direct Upload** Pages project.
1. Add repository secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`
   (scoped to **Account → Cloudflare Pages → Edit**).
1. Set optional repository variables `CLOUDFLARE_PROJECT_NAME` (defaults to the
   repository name) and `CLOUDFLARE_SITE_URL` once you attach a custom domain
   such as `https://docs.example.com/`.
{.steps}

{{< /tab >}}
{{< tab label="Cloudflare Git integration" value="cf-git" >}}

If you prefer Cloudflare to run Hugo directly with no GitHub Actions workflow,
connect the repository in **Workers & Pages → Create → Pages → Connect to Git**
and configure these build settings:

| Setting | Value | Why |
| --- | --- | --- |
| Root directory (path) | `docs` | Runs `hugo` inside `docs/` so it reads `docs/hugo.yml` and `docs/go.mod` |
| Build command | `hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings` | Matches OINK's production build flags |
| Build output directory | `public` | Relative to Root directory (`docs`), publishing `docs/public` |
| Include watch paths | `docs/*` | Skips doc builds on commits that only touch application source code |
| `HUGO_VERSION` | `0.170.1` (or current release) | Overrides Cloudflare's older default Hugo (OINK is tested on `0.170+`) |
| `GOWORK` / `HUGO_MODULE_WORKSPACE` | `off` | Prevents workspaces from overriding `docs/go.mod` |

For branch preview builds, override the preview build command with
`--environment staging --baseURL "$CF_PAGES_URL"` so Cloudflare preview URLs
emit `noindex` and never compete with your production domain in search engines.

{{< /tab >}}
{{< /tabs >}}

## Verify before you merge {#verify}

1. Run `hugo -s docs --cleanDestinationDir --gc --minify --environment production --printPathWarnings`
   and confirm the log ends with `Total in …` and no unexpected warnings.
1. Run `git status --short`: `docs/public/`, `docs/resources/` and
   `docs/.hugo_build.lock` must not appear.
1. Commit `docs/hugo.yml`, `docs/go.mod`, `docs/go.sum`, `docs/content/`,
   `.gitignore` and your workflow file.
1. After the workflow turns green, open the live URL and check search, dark
   mode, canonical links, and **Edit this page** (it must open the file under
   `docs/content/`).
{.steps}

## Related {#related}

- [Deploy](/docs/admin/deploy/) — custom domains, `baseURL`, CSP headers, preview indexing, and rollback
- [Browse locally](/docs/start/local/) — run `hugo serve -s docs` while writing code and docs side by side
- [From scratch](/docs/start/from-scratch/) — standalone OINK setup and offline / submodule install methods
- [Configuration](/docs/customize/config/) — full `hugo.yml` reference, including `github_subdir`
