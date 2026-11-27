---
title: Use OINK Starter
linkTitle: OINK Starter
description: "Turn the OINK Starter into your project's site one layer at a time: languages, identity, home page, content, brand, integrations, and deployment."
weight: 10
icon: fa-solid fa-wand-magic-sparkles
search_keywords: [OINK Starter, GitHub template, use this template, customize starter, starter repository]
---

[Get started](/docs/start/) ends with the Starter running on your machine and
one visible change made. This page turns that sample site into your project's
own, one layer at a time: languages first, because they decide how many copies
of everything else you edit, then identity, home page, content, brand,
integrations and deployment. Preview after each layer and commit after each
one, so that when something breaks you know which change did it.

## What the template contains {#contents}

| Part | What the Starter ships | Your first decision |
| --- | --- | --- |
| Languages | English, Simplified Chinese and French | Keep all three, or switch one or two off |
| Content | Docs in four sections, a Blog, and a four-chapter Book | Rewrite the samples; delete a whole part only when your project has no use for it |
| Home page | One short `data/home/<lang>.yaml` per language | Replace the tagline and the links |
| Brand | A neutral logo and favicon | Keep them until you have final artwork |
| Integrations | Repository links, Giscus, Google Analytics, sharing and feedback, all commented out | Enable only what you are ready to operate |
| Deployment | GitHub Pages and Cloudflare Pages Direct Upload workflows | Choose one host and check its public URL |

The Starter's own Book, at `/book/`, covers the same ground in four short
chapters. Read it once, then replace it with the long-form guide your project
needs.

## Create your repository {#create-repository}

Build your site in a repository of your own rather than in a clone of
`pgsty/oink-starter`. Open the
[Starter on GitHub](https://github.com/pgsty/oink-starter), choose
**Use this template → Create a new repository**, then clone what GitHub
creates:

```bash
git clone https://github.com/OWNER/PROJECT-DOCS.git
cd PROJECT-DOCS
hugo server
```

The new repository starts its own history from a single commit, and GitHub
marks it as generated from the Starter. If you cloned the original to try it,
start again from the template instead of deleting that clone's `.git`
directory; you get the same files with a clean, traceable starting point.

## Customize in layers {#customize}

Work through the layers in order with `hugo server` running. Each one ends with
something to check in the browser.

### Layer 1: language profile {#languages}

The Starter publishes English at `/`, Chinese at `/zh/` and French at `/fr/`.
To publish fewer languages, add `disableLanguages` to the top level of
`hugo.yaml`. This keeps every other setting you have already changed:

```yaml {title="hugo.yaml"}
disableLanguages: [fr]        # English and Chinese
# disableLanguages: [zh, fr]  # English only
```

Leave the disabled languages declared under `languages`. Hugo then still
recognizes `.zh.md` and `.fr.md` files as translations and skips them; without
the declaration it would treat them as duplicate English pages.

If you have not edited `hugo.yaml` yet, you can copy one of the two complete
profiles over it instead:

```bash
cp examples/hugo.single.yaml hugo.yaml     # English only
cp examples/hugo.bilingual.yaml hugo.yaml  # English + Chinese
```

A profile replaces the whole file, including the commented examples that layers
5 and 6 uncomment, so copy it before anything else. Restore the three-language
`hugo.yaml` from Git before you switch to the other profile.

Check that the language menu no longer offers the languages you switched off.
To drop a language for good, delete its content files and its
`data/home/<lang>.yaml` once the site builds without it.

### Layer 2: identity {#identity}

The two values marked `CHANGE ME` at the top of `hugo.yaml` are the site name
and its production address. If you made the visible change in Get started,
they are already done. The `&siteTitle` anchor hands the one title to every
language:

```yaml {title="hugo.yaml"}
title: &siteTitle Project Name # CHANGE ME: one shared title for every language
baseURL: https://example.org/ # CHANGE ME: canonical production URL
```

The supplied workflows pass the host's real address as `baseURL` at build time;
[Getting baseURL right](/docs/admin/deploy/#baseurl) explains why the value
matters. Next, set the copyright holder and, once your repository exists on
GitHub, uncomment the repository links:

```yaml {title="hugo.yaml"}
params:
  copyright:
    authors: '[Project contributors](https://example.org/community/)'
    from_year: 2026
  github_repo: https://github.com/OWNER/PROJECT-DOCS
  github_branch: main
```

`github_repo` adds edit, history and issue links to every page, so leave it
commented until the repository is real; until then those links lead nowhere.

Check the browser tab, the footer, and the canonical link in the page source,
then follow **Edit this page** to confirm it opens the right file.

### Layer 3: home page {#home}

The home page is data, not a template. Each language has one file under
`data/home/`, and the theme renders it directly:

```text
data/home/en.yaml
data/home/zh.yaml
data/home/fr.yaml
```

In each file, `sections` lists the blocks in display order (`[hero, cards, cta]`
in the Starter), and the `hero`, `cards` and `cta` keys hold their text and
links. Rewrite one language completely, keeping the structure, then translate
it into the others. [Home and landing pages](/docs/customize/home/) lists the
other section types you can add.

Check that the home page shows your tagline and that every button and card
opens a page that exists.

### Layer 4: content and navigation {#content-navigation}

The sample content lives in three trees:

```text
content/docs/  Introduction, Get Started, Tutorial and Reference sections
content/blog/  posts, design notes and release announcements
content/book/  a four-chapter guide to the Starter
```

Rewrite or delete the sample pages inside them, but keep each tree's
`_index.md` until you have decided whether your project needs that part at
all. Removing a whole part takes a few more steps, listed under
[Optional surfaces](/docs/start/anatomy/#optional).

The folder tree becomes the sidebar, ordered by `weight`; see
[Organizing content](/docs/write/organize/). The navbar comes from `menus.main`
in each section's `_index.md`, so to rename **Docs** you change `title` (or
`linkTitle`, where the file has one) in `content/docs/_index.md` and its
translations. There is no separate menu file to keep in step. Keep translations
beside their originals, with the same explicit heading IDs:

```text
page.md
page.zh.md
page.fr.md
```

Check that the sidebar and the navbar show your sections in the order you
intended, in every language.

### Layer 5: brand and reader features {#brand-features}

Replace `assets/icons/logo.svg` and `static/favicon.svg` once you have final
artwork; the neutral files look deliberate until then. The Starter already uses
the `paper` preset, offers readers `paper`, `slate`, `ink` and `terminal`, and
has dark mode on. The commented lines under `params.ui` are what most sites add
next. Uncomment them one at a time and reload after each:

```yaml {title="hugo.yaml"}
params:
  ui:
    theme_color: '#245f94'
    typography: system
    image_zoom: true
    share: [mastodon, linkedin, email, copy]
```

For your own fonts, name the families in `params.ui.fonts` or declare the font
files in site CSS; see [Fonts](/docs/customize/brand/#fonts). Page width,
sidebar, search and component settings are in the
[Configuration reference](/docs/customize/config/). Add keys from there rather
than copying the much larger configuration of `oink.pgsty.com`, which carries
settings your site does not need.

Check the accent color and fonts in both light and dark mode.

### Layer 6: integrations {#integrations}

Every integration in the Starter is off or commented out, because each needs
facts only you have. Uncomment a block when all of its values are real; an
incomplete one only warns and stays off.

- Repository links need the real owner, repository and branch (layer 2).
- Giscus comments need the repository and category names and their IDs; see
  [Comments](/docs/admin/comments/).
- Google Analytics needs a measurement ID your project owns, and it only runs
  in production builds; see [Analytics and SEO](/docs/admin/analytics/).
- The feedback buttons send their events through Google Analytics, so they
  record nothing without it; see
  [Repository links and page info](/docs/customize/repository/#feedback).
- Assistant links (`params.ui.page_context_menu.assistant_links`) send the page
  URL to ChatGPT or Claude when a reader uses them. They are off by default;
  turning them on is a privacy decision for your project.

Check that each integration you enabled appears on the page and that the build
prints no warning about it.

## Build and deploy {#build-deploy}

### Local production build {#strict-build}

Run the build the workflows run before you enable one. `make build` runs the
same command with any local theme replacement switched off:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

Read the warnings. OINK reports a mistyped key or an incomplete integration as
a warning and builds on with a safe default, so a warning usually means a
feature you expect is off. [Build settings for CI](/docs/admin/deploy/#ci)
lists the flags the workflows use.

Commit `hugo.yaml`, `go.mod` and `go.sum`. `.gitignore` already excludes
`public/`, `resources/` and the Hugo caches. Never commit a local module
replacement: the host's build would look for a theme path that exists only on
your machine.

### GitHub Pages {#github-pages}

In your repository's **Settings → Pages**, set **Source** to
**GitHub Actions**. Every push to `main` then runs
`.github/workflows/github-pages.yaml`, which builds with Go 1.27.4 and the
latest Hugo, passes GitHub's Pages address (project subpath included) as
`baseURL`, and publishes `public/` through the Pages deployment API. You can
also start it by hand from the Actions tab.

### Cloudflare Pages {#cloudflare-pages}

`.github/workflows/cloudflare-pages.yaml` builds in GitHub Actions and uploads
the result with Cloudflare's Direct Upload:

1. Create a Cloudflare Pages project of the **Direct Upload** kind. Name it
   after the repository, or set the repository variable
   `CLOUDFLARE_PROJECT_NAME`.
1. Add the repository secrets `CLOUDFLARE_ACCOUNT_ID` and
   `CLOUDFLARE_API_TOKEN`. The token needs **Account → Cloudflare Pages → Edit**.
1. Run **Deploy to Cloudflare Pages** once from the Actions tab.
1. To deploy every push to `main`, set the repository variable
   `CLOUDFLARE_PAGES_ENABLED=true`.

The site address defaults to `https://<project>.pages.dev/`; set the variable
`CLOUDFLARE_SITE_URL` when you attach your own domain. A Pages project is set
up for either Direct Upload or Cloudflare's Git integration, so use this
workflow or the Git integration for a project, not both. Other hosts and the
`baseURL` rules are in [Deploy](/docs/admin/deploy/).

## Verify and remove samples {#verify}

Before you announce the site:

1. Search for the Starter's placeholders and decide about each remaining hit:
   `grep -rnE "Project Name|example\.org|OWNER|REPOSITORY" hugo.yaml data content`.
1. On a desktop and on a phone, open each language's home page and a few Docs,
   Blog and Book pages.
1. Switch language on a translated page. You should land on its translation,
   not on the home page.
1. Try search, dark mode, one component, the Markdown and print views, a
   missing URL (the 404 page), the canonical link and the page actions.
1. Open the deployed site at its public URL. A green local build says nothing
   about the host's settings.
{.steps}

To delete the sample Blog or Book, follow
[Optional surfaces](/docs/start/anatomy/#optional), which also covers its menu
entry and the home-page links that point to it. Rebuild after each part you
remove, so a failure points at one change.

## Next {#next}

The [Starter repository tour](/docs/start/anatomy/) maps every file in the
template. [Writing pages](/docs/write/pages/) is the next step for real
content, and [Configuration](/docs/customize/config/) lists every key. If your
project already has a Hugo site, [From scratch](/docs/start/from-scratch/) adds
OINK to it instead.
