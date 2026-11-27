---
title: Comments
linkTitle: Comments
description: Add a comment thread to each page with giscus and GitHub Discussions, choose which pages carry one, and match it to the site's colors.
weight: 30
search_keywords: [comments, giscus, GitHub Discussions, discussion, Disqus]
aliases:
  - /docs/advanced/comments/
---

Comments give every page its own discussion thread at the end, with no
comment server to run. OINK uses [giscus](https://giscus.app/), which stores
each page's thread as a GitHub Discussion in a repository you choose: readers
sign in with GitHub to post, and you moderate in GitHub Discussions like any
other discussion. The theme has no comment backend of its own and bundles no
other provider.

The repository must be public, because visitors cannot read the Discussions
of a private one.

> [!IMPORTANT] Comments load a third-party service
> A page with comments loads a script and an iframe from `https://giscus.app`,
> so they cannot work in a network-isolated environment. Comments stay off
> until you configure them; once on, mention giscus and GitHub in the site's
> privacy policy if it has one.

## Enabling it site-wide {#enable}

The whole configuration lives under `params.comments`. Replace the four
placeholders with the values giscus.app generates for your repository, as the
next two sections describe:

```yaml {title="hugo.yml"}
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: YOUR_OWNER/YOUR_REPO
      repoId: YOUR_REPO_ID
      category: YOUR_CATEGORY
      categoryId: YOUR_CATEGORY_ID
      mapping: pathname
      inputPosition: bottom
      theme: auto
      loading: lazy
```

`repo`, `repoId`, `category` and `categoryId` are required and must all
describe the same repository and Discussion category. If any of them is
missing or blank, the build prints one warning and renders no comments, so
read the build log before you publish. `type` accepts only `giscus`; any other
value also warns and renders nothing. The key names match Hextra's
`params.comments`, so a configuration moved from Hextra works unchanged.

Every other key has a default, listed in
[Configuration](/docs/customize/config/#comments-feedback): `mapping`
(`pathname`), `inputPosition` (`top`), `theme` (`auto`), `loading` (`lazy`),
`strict`, `reactionsEnabled`, `emitMetadata`, `term`, `lang`, `lightTheme`,
`darkTheme`, `ariaLabel` and `errorMessage`. The giscus switches accept a YAML
boolean or giscus's own `0` / `1`.

## Preparing the GitHub repository {#prepare-github}

1. Choose a public repository to hold the threads. The site's own source repository works.

1. Under the repository's Settings → General → Features, turn on Discussions.

1. Install the [giscus GitHub App](https://github.com/apps/giscus) on that repository. Without it, visitors can neither comment nor react.

1. Pick a Discussion category. giscus recommends one of the Announcements type, where only maintainers and the giscus bot can open a Discussion, so readers cannot start stray threads.
{.steps}

The repository ID and category ID are public identifiers, not credentials.
Never put a personal access token, an OAuth secret or a password in the Hugo
configuration: it is published with the site's source.

## Generating the configuration {#generate}

Open [giscus.app](https://giscus.app/), enter the repository, the mapping and
the category, and the page generates a `<script>` block. Copy four of its
attributes into the OINK configuration:

| Attribute giscus.app generates | OINK configuration key |
| --- | --- |
| `data-repo` | `repo` |
| `data-repo-id` | `repoId` |
| `data-category` | `category` |
| `data-category-id` | `categoryId` |
{.fields}

`mapping` decides which Discussion belongs to which page. OINK's default,
`pathname`, suits a site whose published paths are stable, and lets one
repository serve several domains or preview environments.

Settle the mapping before launch. If you change it, or move a page, after
comments exist, giscus looks for a different Discussion: the old comments are
not deleted, but the page no longer finds them. When a URL has to change,
keep a redirect or rename the Discussion at the same time.

## Per-page control {#per-page}

A page's `comments` front matter overrides the site switch in either
direction, and the value nearest the page wins.

To allow comments on a few pages only, set `enable: false` site-wide but keep
the rest of the configuration, then turn comments on per page:

```yaml {title="content/blog/2026-roadmap.md"}
---
title: 2026 roadmap
comments: true
---
```

To keep comments everywhere except a few pages, leave the site switch on and
turn them off where discussion does not belong:

```yaml {title="content/about/security.md"}
---
title: Security policy
comments: false
---
```

For a whole section, use a cascade. This site sets `comments: true` in the
cascade of `content/docs/_index.md`, which is why a giscus thread appears at
the end of this page:

```yaml {title="content/docs/_index.md"}
---
title: OINK Documentation
cascade:
  type: docs
  comments: true
---
```

If the site also sets `services.disqus.shortname`, a working giscus
configuration takes precedence and Disqus does not load, and `comments: false`
on a page turns off both. When a required giscus key is missing, giscus is
skipped with a warning and Disqus loads instead.

## Multilingual text {#i18n}

The giscus interface follows the page's language. Simplified, Traditional and
Hong Kong Traditional Chinese each map to their own giscus locale, and
languages giscus does not support fall back to English. Set `lang` only when
the automatic choice is wrong.

OINK adds two strings of its own, the comment section's accessible label and
the message shown when loading fails, and translates both in every interface
language it ships. To change their wording, set `ariaLabel` and
`errorMessage` per language; a language layer needs only the values that
differ, and the repository keys stay in `params.comments`:

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      comments:
        giscus:
          ariaLabel: Discussion
          errorMessage: The discussion could not be loaded. Please try again later.
  zh:
    params:
      comments:
        giscus:
          ariaLabel: 讨论
          errorMessage: 讨论区加载失败，请稍后重试。
```

## Following light and dark {#theme}

With `theme: auto`, the comment frame follows the reader's light/dark choice
and visual preset, using stylesheets the theme ships to match each preset the
site offers.

To use other colors, set `lightTheme` and `darkTheme`, each to a giscus
built-in theme name or to the URL of a stylesheet on your site, such as
`/css/giscus-brand-dark.css` served from `static/`. They then apply under
every preset. A fixed theme name in `theme` stops the frame from following
the toggle at all.

```yaml {title="hugo.yml"}
params:
  comments:
    giscus:
      theme: auto
      lightTheme: light
      darkTheme: dark_dimmed
```

> [!NOTE]- Site-hosted giscus stylesheets must be readable cross-origin
> The giscus frame runs on `giscus.app` and reads its stylesheet from your
> site, the theme's own or yours, so the response must allow cross-origin
> reads. Configure `Access-Control-Allow-Origin` on the production host. For
> `hugo server`, this site adds `Access-Control-Allow-Origin: '*'` under
> `server.headers` in `hugo.yml`.

## Privacy and CSP {#privacy}

- OINK never asks for or stores a reader's GitHub password or token; signing in and posting happen entirely on giscus and GitHub.
- The comment loader is a same-origin script that the theme adds only to pages with comments enabled.
- The giscus script is requested when the reader comes within a scroll of the comment section, or is already past it; with `loading: lazy` the iframe waits the same way. A visit returning from GitHub sign-in, and a site that sets `loading: eager`, request it at once.
- Under a strict Content Security Policy, allow giscus in both `script-src` and `frame-src`. Merge these into your existing policy rather than replacing it; the general rules are in [Content Security Policy](/docs/admin/deploy/#csp).

```text {title="CSP fragment"}
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

If the script fails to load or never creates its iframe, OINK ends the
loading state and shows `errorMessage` in a live status region, so the page
never hangs on "loading".

## Verify {#verify}

```bash {title="Terminal"}
hugo --minify # a missing required key prints a warning and disables comments
hugo server --disableFastRender
```

1. Open a page that should have comments. giscus appears at the end with "Sign in with GitHub", in the page's language.
1. Switch between light and dark. With `theme: auto`, the comment section follows.
1. Open a page with `comments: false` and confirm that no comment section appears there.
1. Post a test comment, then check on GitHub that a Discussion appeared in the chosen category and that you can manage it.
{.steps}

Until the first comment or reaction creates a page's Discussion, a "discussion
not found" message in the browser console is expected.

When comments do not appear, check in this order: build warnings about the
four required keys; `params.comments.enable` and `type`; the page's `comments`
front matter; whether the repository is public, has Discussions on and has
the giscus App installed; and the browser console and response headers for a
CSP block on `giscus.app`. When existing threads go missing, restore the
original `mapping` and page path first.

## Related {#related}

- [Repository links and page info](/docs/customize/repository/) — edit links, issue links, contributors and the "was this helpful?" widget
- [Analytics and SEO](/docs/admin/analytics/) — the other integration that calls an external service
- [Deploy](/docs/admin/deploy/) — Content Security Policy and preview deployments
- [Configuration](/docs/customize/config/) — every `params.comments.*` key
- [Page parameters](/docs/write/frontmatter/) — `comments` in front matter
