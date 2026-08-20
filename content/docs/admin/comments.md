---
title: Comments
linkTitle: Comments
description: Wire GitHub Discussions into a comment section at the bottom of a page with giscus — on site-wide, off per page, following light and dark.
weight: 30
search_keywords: [comments, giscus, GitHub Discussions, discussion, Disqus]
aliases:
  - /docs/advanced/comments/
---

OINK's comments run on [giscus](https://giscus.app/): each page maps to one
GitHub Discussion, readers sign in with a GitHub account to post, and
maintainers moderate in GitHub Discussions. The theme provides no comment
backend of its own and bundles no provider other than giscus.

The prerequisite is a public GitHub repository; a visitor cannot read a private
repository's Discussions.

> [!IMPORTANT] This is one of the few features in the theme that makes an outbound request
> A page with comments enabled loads a script and an iframe from
> `https://giscus.app`, which does not work in a network-isolated environment.
> It is off by default and loads only when explicitly enabled. Where a site has
> a privacy policy, this external data boundary belongs in it.

## Preparing the GitHub repository {#prepare-github}

1. Choose a public repository to hold the comment threads; the site's source repository works.

1. In the repository's Settings → General → Features, tick Discussions.

1. Install the [giscus GitHub App](https://github.com/apps/giscus) for that repository. Without the App, visitors cannot comment or react.

1. Choose a Discussion category. giscus recommends the Announcements type: only maintainers and the giscus bot can open a Discussion there, so readers cannot start one by accident.
{.steps}

The repository ID and category ID are public identifiers, not credentials. Never
put a personal access token, an OAuth secret or a password in Hugo
configuration.

## Generating the configuration {#generate}

Open [giscus.app](https://giscus.app/), fill in the repository, mapping and
category, and the page generates a `<script>` block below. Copy four of its
attributes into the OINK configuration:

| Attribute giscus.app generates | OINK configuration key |
| --- | --- |
| `data-repo` | `repo` |
| `data-repo-id` | `repoId` |
| `data-category` | `category` |
| `data-category-id` | `categoryId` |
{.fields}

The `mapping` decides which page corresponds to which Discussion. OINK defaults
to `pathname`, which suits a site with stable published paths and one repository
serving several domains or preview environments. Changing `mapping` or moving a
page after comments have accumulated makes giscus look for a different
Discussion: the existing comments are not deleted, but the page can no longer
find them. Settle the mapping before launch; where a URL really must change,
keep a redirect or rename the Discussion at the same time.

## Enabling it site-wide {#enable}

Write the generated identifiers into the site configuration:

```yaml {title="hugo.yml"}
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: pgsty/oink.pgsty.com
      repoId: R_kgDOTzFZAg
      category: Announcements
      categoryId: DIC_kwDOTzFZAs4DDCm-
      mapping: pathname
      inputPosition: bottom
      theme: auto
      loading: lazy
```

That is this site's live configuration. All four of `repo`, `repoId`,
`category` and `categoryId` are required: if any is missing or only whitespace,
Hugo prints one WARNING and skips giscus without failing the build — which is
why a production build carries `--panicOnWarning`. `type` accepts only `giscus`
today, and any other value likewise warns and skips. The `params.comments` key
names match Hextra's, so a configuration migrated from Hextra transfers as it
stands.

The remaining keys (`strict`, `reactionsEnabled`, `emitMetadata`, `term`,
`lang`, `lightTheme`, `darkTheme`, `ariaLabel`, `errorMessage`) all have
defaults, defined fully in [Configuration](/docs/customize/config/). A feature
switch takes either a YAML boolean or giscus-style `0` / `1`.

## Per-page control {#per-page}

`comments` in front matter overrides the site switch in either direction, and
the value nearest the page wins.

To enable comments on selected pages only, turn the site switch off while
keeping the full repository configuration, then let chosen pages opt in:

```yaml {title="content/blog/2026-roadmap.md"}
---
title: 2026 roadmap
comments: true
---
```

To disable them on selected pages, leave the site switch on and let unsuitable
pages opt out:

```yaml {title="content/about/security.md"}
---
title: Security policy
comments: false
---
```

Use a cascade to set a whole section at once. This site writes `comments: true`
in the cascade of `content/docs/_index.md`, which is why a real giscus section
sits at the bottom of this page.

```yaml {title="content/docs/_index.md"}
---
title: OINK Documentation
cascade:
  type: docs
  comments: true
---
```

Where a site also configures `services.disqus.shortname`, giscus wins: an active
giscus suppresses Disqus, `comments: false` turns off both, and if a required
giscus key is missing it warns, skips, and lets Disqus take over.

## Multilingual text {#i18n}

giscus's interface language follows the current Hugo language automatically:
Simplified, Traditional and Hong Kong Traditional Chinese each map to the
corresponding giscus locale, and an unsupported language falls back to English.
Set `lang` explicitly only where the automatic choice is wrong.

What does need translating is the two strings on OINK's side: the comment
section's accessible label and the loading-failure message. They are configured
per language and merged with the global repository configuration:

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      comments:
        giscus:
          ariaLabel: Comments
          errorMessage: Comments could not be loaded. Please try again later.
  zh:
    params:
      comments:
        giscus:
          ariaLabel: 评论
          errorMessage: 评论加载失败，请稍后重试。
```

A language layer only needs the differences; `repo` / `repoId` / `category` /
`categoryId` stay in `params.comments`.

## Following light and dark {#theme}

With `theme: auto`, the giscus iframe follows OINK's light/dark control and the
browser's `prefers-color-scheme`, so the comment section changes with the rest
of the page.

For a closer match to the site's palette, give `lightTheme` / `darkTheme` two
giscus themes; each value is a built-in giscus theme name or CSS hosted by the
site. This site does the latter:

```yaml {title="hugo.yml"}
params:
  comments:
    giscus:
      theme: auto
      lightTheme: /css/giscus-oink-light.css?v=0.4.0
      darkTheme: /css/giscus-oink-dark.css?v=0.4.0
```

A fixed theme name in `theme` stops it following the toggle.

> [!NOTE]- A custom giscus theme has to be readable cross-origin
> The giscus iframe loads from `giscus.app`, so reading a CSS file on your site
> requires CORS to allow it. This site adds
> `Access-Control-Allow-Origin: '*'` under `server.headers` in `hugo.yml` for
> local preview; in production it is the host's response header configuration.

## Privacy and CSP {#privacy}

- OINK never asks for or stores a reader's GitHub password or access token; signing in and posting happen entirely on the giscus / GitHub side.
- The comment initialization script is a same-origin asset shipped with the theme, added only to pages with comments enabled; a page without them has no such script.
- With `loading: lazy`, the iframe loads only as the reader scrolls near the comment section.
- Where a site has a strict Content Security Policy, both `script-src` and `frame-src` must permit giscus — merged into the existing policy rather than replacing other directives (the general rules are in [Content Security Policy](/docs/admin/deploy/#csp)):

```text {title="CSP fragment"}
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

When the external script fails to load or no iframe is created, OINK ends the
loading state and shows `errorMessage` in a live status region rather than
leaving the page on "loading".

## Verify {#verify}

```bash {title="Terminal"}
hugo --minify --panicOnWarning     # a missing required key fails here
hugo server --disableFastRender
```

Then confirm each of these:

1. Open a page that should have comments: giscus appears at the bottom, showing "Sign in with GitHub", with its interface in the current page's language.
1. Toggle OINK's light/dark control and the comment section follows (with `theme: auto`).
1. Open a page with `comments: false` and confirm there is neither giscus nor any other comment component.
1. Post a test comment, return to GitHub, and confirm a Discussion appeared in the chosen category and can be managed there.
{.steps}

Before the first comment or reaction creates a Discussion, a browser console
message saying the Discussion was not found is expected.

When something is wrong, check in this order: WARNINGs in the build log (the
four required keys) → `params.comments.enable` and `type` → the page's
`comments` front matter → whether the repository is public, Discussions are
enabled and the giscus App is installed → the browser console and response
headers (whether a CSP blocked `giscus.app`). If existing threads have gone
missing, restore the original `mapping` and page path first.

## Related {#related}

- [Repository links and page info](/docs/customize/repository/) — edit this page, open an issue, contributors and the "was this helpful?" widget
- [Analytics and SEO](/docs/admin/analytics/) — the other capability needing an external service
- [Deploy](/docs/admin/deploy/) — Content Security Policy and external integrations in preview deployments
- [Configuration](/docs/customize/config/) — every `params.comments.*` key
- [Page parameters](/docs/write/frontmatter/) — `comments` in front matter
