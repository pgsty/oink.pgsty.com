---
title: Use OINK Starter
linkTitle: OINK Starter
description: Turn the official starter into your project site, one controlled layer at a time — identity, languages, home page, content, navigation, brand, integrations, and deployment.
weight: 10
icon: fa-solid fa-wand-magic-sparkles
search_keywords: [OINK Starter, GitHub template, use this template, customize starter, starter repository]
---

[`pgsty/oink-starter`](https://github.com/pgsty/oink-starter) is the supported
starting point for a new OINK site. It is deliberately smaller than
`oink.pgsty.com`: no theme documentation, analytics account, comment
repository, browser regression suite, or PGSTY-specific brand is copied into
your project.

The current template pins OINK {{% param version %}}, Go 1.27, and Hugo
Extended 0.165.0. Its default three-language, English-only, and English–Chinese
profiles have all been built warning-strictly against that release.

## What the template contains {#contents}

| Surface | Included baseline | First decision |
| --- | --- | --- |
| Languages | English, Simplified Chinese, French | Keep all three, or select a supplied single/bilingual profile |
| Content | Docs, Blog, and a short Book tutorial | Rewrite the examples; delete a whole surface only when you do not need it |
| Home | One compact `data/home/<lang>.yaml` per language | Replace the project promise and destinations |
| Brand | Neutral logo and favicon | Keep them until real project artwork exists |
| Integrations | Repository, Giscus, analytics, share, and feedback examples are commented | Enable only complete configurations you intend to operate |
| Deployment | GitHub Pages and Cloudflare Pages Direct Upload workflows | Choose one production path and verify its real URL |

The Starter's own Book at `/book/` is a four-chapter tour from preview to
deployment. This page is the maintainer-grade version: it explains the order of
changes, the boundaries between them, and the checks after each layer.

## Create your repository {#create-repository}

### GitHub template, recommended {#github-template}

Open the [Starter repository](https://github.com/pgsty/oink-starter), select
**Use this template → Create a new repository**, then clone the repository
created under your account or organization:

```bash
git clone https://github.com/OWNER/PROJECT-DOCS.git
cd PROJECT-DOCS
hugo server
```

This gives your site its own Git history and keeps the original Starter as an
upstream reference rather than as a remote you might accidentally push to.

### Clone the original to evaluate it {#clone-original}

For a disposable local evaluation:

```bash
git clone https://github.com/pgsty/oink-starter.git
cd oink-starter
hugo server
```

Do not start a real project by deleting this clone's `.git` directory. GitHub's
template operation already creates the clean project boundary and preserves an
auditable first commit.

## Preview before changing anything {#preview}

Open these routes:

- `/`, `/zh/`, `/fr/` — the three home pages;
- `/docs/`, `/blog/`, `/book/` — the three content surfaces;
- one translated page, then the language switcher;
- search and the light/dark control at a narrow viewport.

Also record the resolved module:

```bash
hugo mod graph | grep github.com/pgsty/oink
```

It should resolve `github.com/pgsty/oink@{{% param version %}}`. This unchanged
preview is the baseline against which every later edit is judged.

## Customize in layers {#customize}

### Layer 1: identity {#identity}

Change the two marked values at the top of `hugo.yaml`:

```yaml {title="hugo.yaml"}
title: &siteTitle Project Name
baseURL: https://example.org/
```

The YAML anchor carries the title to all enabled languages. Then change the
copyright holder and, after the new repository exists, uncomment its links:

```yaml {title="hugo.yaml"}
params:
  copyright:
    authors: '[Project contributors](https://example.org/community/)'
    from_year: 2026
  github_repo: https://github.com/OWNER/PROJECT-DOCS
  github_branch: main
```

Run `hugo server` again and check the browser title, footer, edit/history links,
and canonical URL. Do not change the logo yet unless the project has final
artwork; text identity is easier to review first.

### Layer 2: language profile {#languages}

The root configuration enables English, Chinese, and French. Before making
other configuration edits, choose one of the supplied profiles when that is
not your intended language set:

```bash
cp examples/hugo.single.yaml hugo.yaml     # English only
cp examples/hugo.bilingual.yaml hugo.yaml  # English + Chinese
```

These are complete minimal configurations, not fragments: copying one replaces
the commented integration examples in the root file. Do it at the beginning;
if `hugo.yaml` already contains project changes, merge the `languages` and
`disableLanguages` sections instead of overwriting it.

Disabled languages stay declared so Hugo recognizes `.zh.md` and `.fr.md` as
translations and safely ignores them. If you remove a language permanently,
remove its content and home data only after the selected profile builds.

### Layer 3: home page {#home}

The home page is data rather than an opaque layout override:

```text
data/home/en.yaml
data/home/zh.yaml
data/home/fr.yaml
```

Edit one language first. In each file, `sections` fixes the order; `hero`,
`cards`, and `cta` provide the content. Replace the promise, destination URLs,
and sample card copy while keeping the structure. After the first language is
right, translate the same information into the enabled peers.

For another composition, use the full registry in
[Home and landing pages](/docs/customize/home/); do not copy the Starter home
partial, because there is no site-specific template to copy.

### Layer 4: content and navigation {#content-navigation}

Rewrite or remove sample leaf pages under `content/`. Keep section roots until
you decide whether that whole surface belongs in your project:

```text
content/docs/  reference and task documentation
content/blog/  posts, design records, and release announcements
content/book/  a sequential long-form guide
```

The content tree becomes the sidebar. Top navigation lives in `menus.main` on
the translated `_index` roots, so renaming Docs, Blog, or Book happens beside
the content it names rather than in a second global menu tree. Keep translated
files side by side and give corresponding headings the same explicit IDs:

```text
page.md
page.zh.md
page.fr.md
```

Follow [Organizing content](/docs/write/organize/) before creating a custom
navigation data file; the generated tree is enough for most sites.

### Layer 5: brand and reader features {#brand-features}

Replace `assets/icons/logo.svg` and `static/favicon.svg` when real assets are
ready. Then enable the smallest useful configuration changes, one at a time:

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#245f94'
    typography: system
    image_zoom: true
    share: [mastodon, linkedin, email, copy]
```

For custom local fonts, use `params.ui.fonts` for family names or declare font
files in site CSS. For layout, sidebar, search, and component settings, consult
the [Configuration reference](/docs/customize/config/) rather than copying the
much larger configuration of `oink.pgsty.com`.

### Layer 6: integrations {#integrations}

The Starter leaves repository actions, Giscus, Google Analytics, feedback, and
sharing off or commented. Enable an integration only after all of its required
facts are known:

- repository links need the real owner, repository, and branch;
- Giscus needs its repository/category names and immutable IDs;
- Google Analytics needs a project-owned measurement ID;
- feedback records structured `gtag` events only when analytics is present;
- assistant links send the current URL to a third party and therefore require
  an explicit policy choice.

An incomplete optional block should remain commented. See
[Comments](/docs/admin/comments/), [Analytics and SEO](/docs/admin/analytics/),
and [Repository links](/docs/customize/repository/) for the operating boundary
of each integration.

## Build and deploy {#build-deploy}

### Strict local build {#strict-build}

Before enabling a hosting workflow:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings --panicOnWarning
```

Commit `hugo.yaml`, `go.mod`, and `go.sum`; never commit generated `public/`,
`resources/`, module caches, or a local module replacement.

### GitHub Pages {#github-pages}

The Starter already contains `.github/workflows/github-pages.yaml`. In
**Settings → Pages**, select **GitHub Actions** as the source. A push to `main`
builds with the pinned toolchain, asks GitHub for the correct project subpath,
and publishes `public/` through the Pages deployment API.

### Cloudflare Pages {#cloudflare-pages}

The supplied `.github/workflows/cloudflare-pages.yaml` uses Direct Upload.
Create a Pages Direct Upload project, add `CLOUDFLARE_ACCOUNT_ID` and
`CLOUDFLARE_API_TOKEN`, then run the workflow manually once. Set the repository
variable `CLOUDFLARE_PAGES_ENABLED=true` for automatic deploys, and
`CLOUDFLARE_SITE_URL` when the canonical address is not the default
`pages.dev` domain.

Use either Direct Upload or Cloudflare Git integration for one project, not
both. The complete host comparison and `baseURL` rules are in
[Deploy](/docs/admin/deploy/).

## Verify and remove samples {#verify}

Before calling the site ready:

1. Search for placeholders such as `Project Name`, `example.org`, `OWNER`, and
   `PROJECT`, then decide whether each remaining occurrence is intentional.
1. Open every enabled language root and representative Docs, Blog, and Book
   pages on desktop and mobile.
1. Confirm language switching lands on peers, not the home page.
1. Test search, dark mode, one component, Markdown output, print, 404, canonical
   URLs, and repository actions.
1. Check the deployed workflow and the public URL separately from the local
   build.
{.steps}

Delete the sample Book or Blog only after removing its top-menu root and any
home-page card that links to it. A warning-strict rebuild after each whole
surface is removed keeps failures attributable to one change.

## Next {#next}

Use the [Starter repository tour](/docs/start/anatomy/) as a file-level map,
then continue with [Writing pages](/docs/write/pages/) and
[Configuration](/docs/customize/config/). For an existing site that should not
inherit the Starter's content model, use [From scratch](/docs/start/from-scratch/).
