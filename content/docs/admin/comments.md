---
title: Comments
linkTitle: Comments
description: Use giscus for page comments through GitHub Discussions. Control comments for the site or a page, and match light and dark themes.
weight: 30
search_keywords: [comments, giscus, GitHub Discussions, discussion, Disqus]
aliases:
  - /docs/advanced/comments/
---

OINK uses [giscus](https://giscus.app/) for comments. Each page maps to one
GitHub Discussion. Readers sign in with a GitHub account to post comments.
Maintainers moderate comments in GitHub Discussions. The theme has no comment
backend of its own. It bundles only giscus.

You must use a public GitHub repository. Visitors cannot read a private
repository's Discussions.

> [!IMPORTANT] This is one of the few features in the theme that makes an outbound request
> A page with comments enabled loads a script and an iframe from
> `https://giscus.app`, which does not work in a network-isolated environment.
> Comments are off by default. They load only when you explicitly enable them.
> If the site has a privacy policy, document this external data boundary in it.

## Preparing the GitHub repository {#prepare-github}

1. Choose a public repository for the comment threads. You can use the site's source repository.

1. In the repository's Settings → General → Features, select Discussions.

1. Install the [giscus GitHub App](https://github.com/apps/giscus) for that repository. Without the App, visitors cannot comment or react.

1. Choose a Discussion category. giscus recommends the Announcements type. Only maintainers and the giscus bot can open a Discussion there. Readers cannot start one accidentally.
{.steps}

The repository ID and category ID are public identifiers, not credentials. Never
put a personal access token, an OAuth secret or a password in Hugo
configuration.

## Generating the configuration {#generate}

Open [giscus.app](https://giscus.app/). Enter the repository, mapping, and
category. The page generates a `<script>` block below. Copy four attributes
from that block to the OINK configuration:

| Attribute giscus.app generates | OINK configuration key |
| --- | --- |
| `data-repo` | `repo` |
| `data-repo-id` | `repoId` |
| `data-category` | `category` |
| `data-category-id` | `categoryId` |
{.fields}

The `mapping` determines which Discussion corresponds to each page. OINK
defaults to `pathname`. This suits stable published paths and one repository
that serves several domains or preview environments.

If you change `mapping` or move a page after comments exist, giscus searches
for a different Discussion. It does not delete existing comments, but the page
can no longer find them. Choose the mapping before launch. If a URL must
change, retain a redirect or rename the Discussion at the same time.

## Enabling it site-wide {#enable}

Copy all four repository/category fields from the configuration generated for
your repository. Before you enable comments, replace every placeholder below:

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

The required fields `repo`, `repoId`, `category`, and `categoryId` must describe
the same repository and its selected Discussion category. If a field is missing
or contains only whitespace, Hugo prints one WARNING and skips giscus. The
build succeeds with a warning. Review production build diagnostics and correct
missing values before publication.

Currently, `type` accepts only `giscus`. Any other value also produces a warning
and skips giscus. The `params.comments` key names match Hextra's. A configuration
migrated from Hextra can therefore remain unchanged.

The remaining keys (`strict`, `reactionsEnabled`, `emitMetadata`, `term`,
`lang`, `lightTheme`, `darkTheme`, `ariaLabel`, `errorMessage`) all have
defaults, defined fully in [Configuration](/docs/customize/config/). A feature
switch takes either a YAML boolean or giscus-style `0` / `1`.

## Per-page control {#per-page}

The front matter `comments` value can enable or disable comments regardless of
the site switch. The value nearest the page takes precedence.

To enable comments only on selected pages, disable the site switch. Keep the
complete repository configuration. Then enable comments on each selected page:

```yaml {title="content/blog/2026-roadmap.md"}
---
title: 2026 roadmap
comments: true
---
```

To disable comments on selected pages, keep the site switch enabled. Then
disable comments on each selected page:

```yaml {title="content/about/security.md"}
---
title: Security policy
comments: false
---
```

Use a cascade to configure an entire section. This site sets `comments: true`
in the cascade of `content/docs/_index.md`. Therefore, a giscus section appears
at the end of this page.

```yaml {title="content/docs/_index.md"}
---
title: OINK Documentation
cascade:
  type: docs
  comments: true
---
```

If the site also configures `services.disqus.shortname`, active giscus suppresses
Disqus. The setting `comments: false` disables both. If a required giscus key is
missing, the theme warns and skips giscus. Disqus can then load.

## Multilingual text {#i18n}

The giscus interface automatically uses the current Hugo language. Simplified,
Traditional, and Hong Kong Traditional Chinese each use the corresponding
giscus locale. Unsupported languages fall back to English. Set `lang` explicitly
only if the automatic choice is incorrect.

Translate OINK's two comment strings: the section's accessible label and the
loading-failure message. Configure them per language. The theme merges them with
the global repository configuration:

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

A language layer needs only the values that differ. Keep `repo` / `repoId` /
`category` / `categoryId` in `params.comments`.

## Following light and dark {#theme}

With `theme: auto`, the giscus iframe follows OINK's light/dark control and the
browser's `prefers-color-scheme`. The comment section changes with the page.

To match the site's palette more closely, set two giscus themes with
`lightTheme` / `darkTheme`. Each value can be a built-in giscus theme name or
CSS hosted by the site. This site uses hosted CSS:

```yaml {title="hugo.yml"}
params:
  comments:
    giscus:
      theme: auto
      lightTheme: /css/giscus-oink-light.css?v=0.4.0
      darkTheme: /css/giscus-oink-dark.css?v=0.4.0
```

If you set a fixed theme name in `theme`, giscus no longer follows the toggle.

> [!NOTE]- A custom giscus theme has to be readable cross-origin
> The giscus iframe loads from `giscus.app`. CORS must permit it to read a CSS
> file from your site. For local preview, this site adds
> `Access-Control-Allow-Origin: '*'` under `server.headers` in `hugo.yml`.
> For production, configure this response header on the host.

## Privacy and CSP {#privacy}

- OINK never requests or stores a reader's GitHub password or access token. All sign-in and posting operations occur on giscus / GitHub.
- The theme ships the comment initialization script as a same-origin asset. It adds the script only to pages with comments enabled.
- With `loading: lazy`, the iframe loads only as the reader scrolls near the comment section.
- If the site has a strict Content Security Policy, both `script-src` and `frame-src` must permit giscus. Merge these permissions into the existing policy. Do not replace other directives. See [Content Security Policy](/docs/admin/deploy/#csp) for the general rules:

```text {title="CSP fragment"}
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

If the external script fails to load or creates no iframe, OINK ends the loading
state. It shows `errorMessage` in a live status region. The page does not remain
on "loading".

## Verify {#verify}

```bash {title="Terminal"}
hugo --minify # a missing required key warns and disables comments
hugo server --disableFastRender
```

Then check the following items:

1. Open a page that should have comments. Confirm that giscus appears at the end with "Sign in with GitHub". Its interface must use the current page's language.
1. Toggle OINK's light/dark control. With `theme: auto`, confirm that the comment section follows it.
1. Open a page with `comments: false`. Confirm that neither giscus nor another comment component appears.
1. Post a test comment. Return to GitHub. Confirm that a Discussion appears in the selected category and that you can manage it there.
{.steps}

Before the first comment or reaction creates a Discussion, a browser console
message saying the Discussion was not found is expected.

If comments do not work, check WARNINGs in the build log for the four required
keys. Then check `params.comments.enable` and `type`, followed by the page's
`comments` front matter. Confirm that the repository is public, Discussions are
enabled, and the giscus App is installed. Finally, check the browser console
and response headers for a CSP block on `giscus.app`. If existing threads are
missing, first restore the original `mapping` and page path.

## Related {#related}

- [Repository links and page info](/docs/customize/repository/) — edit this page, open an issue, contributors and the "was this helpful?" widget
- [Analytics and SEO](/docs/admin/analytics/) — the other capability needing an external service
- [Deploy](/docs/admin/deploy/) — Content Security Policy and external integrations in preview deployments
- [Configuration](/docs/customize/config/) — every `params.comments.*` key
- [Page parameters](/docs/write/frontmatter/) — `comments` in front matter
