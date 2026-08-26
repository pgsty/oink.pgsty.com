---
title: Analytics and SEO
linkTitle: Analytics and SEO
description: Connect an analytics service (or none), and pair up the canonical, hreflang, social cards, sitemap and robots the theme already generates.
weight: 40
search_keywords: [analytics, Google Analytics, GA4, Plausible, Umami, SEO, search engines, sitemap, robots, canonical, hreflang, Open Graph]
aliases:
  - /docs/advanced/analytics/
---

The theme loads no analytics, form or advertising script by default, and makes
no outbound request until configured. Connecting one takes explicit
configuration, and that external data boundary belongs in the site's privacy
statement. SEO is the opposite: canonical, hreflang, the `robots` meta, Open
Graph and Twitter cards are generated per page by the theme, and what you have
to get right is `baseURL` and each page's `description`.

## Connecting Google Analytics {#google-analytics}

Use Hugo's built-in service configuration with a GA4 measurement ID:

```yaml {title="hugo.yml"}
services:
  googleAnalytics:
    id: G-6JLQEHYFQG
```

The theme renders that script in the production environment only (a `hugo`
build defaults to production, and `hugo server` to development). Local previews
and preview deployments therefore report nothing, and need no extra switch.

Do not also set the deprecated top-level `googleAnalytics` key. Where analytics
is not wanted, delete the block rather than filling in a fake ID.

> [!WARNING] This is incompatible with a network-isolated environment
> Once configured, page views and events go to Google. A strict same-origin
> Content Security Policy also has to permit it — see
> [Content Security Policy](/docs/admin/deploy/#csp). This is a site decision,
> not a theme default.

## Connecting another analytics service {#other-analytics}

Plausible, Umami, Matomo and the like need only a script inserted. The theme
provides two injection points; create a file of the same name in the site
repository and no theme change is needed:

| File | Insertion point | What belongs there |
| --- | --- | --- |
| `layouts/_partials/hooks/head-end.html` | Before `</head>`, ahead of the Google Analytics template | Analytics scripts, cookie consent scripts, meta tags the theme does not provide |
| `layouts/_partials/hooks/body-end.html` | Last among the page scripts | Third-party code affecting interaction rather than the first paint |
{.fields}

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script defer data-domain="oink.pgsty.com"
        src="https://plausible.io/js/script.js"></script>
{{ end }}
```

Do not omit the `hugo.IsProduction` guard: without it, everyone's local preview
reports into your analytics.

> [!NOTE] head-end runs before Google Analytics
> That is deliberate: a cookie consent script has to run before the analytics
> script to actually hold it back.

The "was this page helpful?" feedback widget is a separate matter: off by
default, making no network request, and configured in
[Repository links and page info](/docs/customize/repository/).

## Page descriptions {#description}

`<meta name="description">` takes the first non-empty value of:

1. The page's `description` front matter
1. The page summary Hugo computes (`.Summary`)
1. `params.description` in the site configuration
{.steps}

Writing one `description` per page is the only SEO action an author has to take.
It serves three purposes at once: the search engine snippet, the card subtitle
on a section index, and the result preview in site search.

```yaml {title="content/docs/admin/analytics.md (this page)"}
---
title: Analytics and SEO
description: Connect an analytics service (or none), and pair up the canonical, hreflang, social cards, sitemap and robots the theme already generates.
---
```

A multilingual site writes one per language; do not copy the English
description onto a Chinese page. The site-level default is per language too:

```yaml {title="hugo.yml"}
languages:
  en:
    params:
      description: A Hugo theme for engineering docs
  zh:
    params:
      description: 为工程而设计的 Hugo 文档主题
```

## canonical and hreflang {#canonical-hreflang}

The theme emits one canonical and a set of `hreflang` alternates per page, with
no configuration:

```html {title="rendered output (this page)" copy=false}
<link rel="canonical" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="en-US" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="zh-CN" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
```

The `hreflang` codes come from each language's `locale` (`en-US` / `zh-CN` on
this site), and the links from Hugo's translation relationships. Where a page
has no counterpart in the other language, Hugo cannot find a translation and
falls back to that language's home page. That is expected behaviour, and it also
tells you whether Hugo recognized the translation pairing.

The canonical is assembled from `baseURL`. A wrong `baseURL` points search
engines at addresses that do not exist, which is harder to notice than a build
failure. Run through the
[deployment checklist](/docs/admin/deploy/#checklist) before launching.

Full multilingual configuration is in [Languages](/docs/customize/i18n/).

## Social cards {#social-cards}

The theme calls Hugo's built-in Open Graph and Twitter card templates, and the
title, description, URL, language and site name are all automatic:

```html {title="rendered output (this page)" copy=false}
<meta property="og:title" content="Analytics and SEO">
<meta property="og:type" content="article">
<meta property="og:url" content="https://oink.pgsty.com/docs/admin/analytics/">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="zh_CN">
<meta name="twitter:card" content="summary">
```

To give a shared link an image, set `images` in front matter:

```yaml {title="any page"}
---
title: OINK v0.7.1 released
images: [/images/releasenote.webp]
---
```

For a site-wide fallback, write the same key under `params`:

```yaml {title="hugo.yml"}
params:
  images: [/images/oink.webp]
```

With an image, `twitter:card` changes from `summary` to `summary_large_image`
and `og:image` and `twitter:image` appear. This site sets neither, which is why
the rendered output above has no image tags.

## Sitemap {#sitemap}

Hugo generates it automatically, and a multilingual site gets an index:

```text {title="the structure under public/" copy=false}
sitemap.xml        ← the index, pointing at the two below
en/sitemap.xml
zh/sitemap.xml
```

Both the site default and per-page overrides are Hugo's own:

```yaml {title="hugo.yml"}
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

```yaml {title="one page"}
---
title: Release notes
sitemap:
  priority: 0.8
---
```

`changefreq` and `priority` are hints rather than promises, and a search engine
may ignore them. What is worth doing before publishing is confirming that
drafts, private content and non-canonical copies stayed out of the sitemap, and
that each language's file was generated.

## robots.txt and staying unindexed {#robots}

Hugo generates `robots.txt` only when the site configuration turns it on:

```yaml {title="hugo.yml"}
enableRobotsTXT: true
```

The template the theme supplies gives two results by build environment, with no
content for you to write:

```text {title="a production build" copy=false}
User-agent: *
Allow: /

Sitemap: https://oink.pgsty.com/sitemap.xml
```

```text {title="a non-production build" copy=false}
User-agent: *
Disallow: /
```

The `robots` meta in the page follows the same switch: `index, follow` in
production and outside print output, `noindex, nofollow` otherwise. Do not build
preview deployments with `--environment production`; a non-production build
declines indexing by itself.

The theme has no per-page `noindex` switch. Where a page should not be indexed,
the reliable answer is not to publish it (`draft: true`, or Hugo's `_build`
options). To publish it and still keep it out, emit your own tag through the
`head-end.html` hook; the theme already emits one `robots` meta, and how a
search engine reconciles two is its own decision.

## Checking indexing {#indexing}

A week or two after launch, confirm in this order that what search engines see
matches what you think:

1. Crawl permission: open `<baseURL>/robots.txt` and confirm `Allow: /` rather than `Disallow: /`.
1. Page inventory: open `<baseURL>/sitemap.xml`, follow into a language sitemap, and check the page count.
1. Indexed count: search `site:yourdomain` and check the order of magnitude; a page-by-page reconciliation is not needed.
1. Canonical addresses: results should land on the canonical URL, not a version with a `?` parameter or an old domain.
1. Active submission: add the site in Google Search Console / Bing Webmaster Tools and submit the `sitemap.xml` address, which is faster than waiting to be crawled.
{.steps}

Search metadata cannot compensate for the content itself: a thin, duplicated or
stale page stays that way however well its `description` is written.

## Verify {#verify}

```bash {title="Terminal"}
hugo --gc --minify --printPathWarnings --panicOnWarning
```

Then check these in the output:

```bash {title="Terminal"}
# the canonical points at the real production address
grep -o '<link rel="canonical"[^>]*>' public/docs/admin/analytics/index.html

# only a production build has index, follow
grep -o '<meta name="robots"[^>]*>' public/docs/admin/analytics/index.html

# robots.txt and the sitemap
cat public/robots.txt
head -5 public/sitemap.xml

# with no analytics connected, the output should have no gtag / analytics request
grep -rl 'googletagmanager\|gtag(' public/ | head
```

Confirm once more in a browser: open a representative page and look at the
network panel — a site with no analytics should make no request to a third-party
domain.

## Related {#related}

- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist, and keeping preview deployments unindexed
- [Repository links and page info](/docs/customize/repository/) — the feedback widget, edit links and last-modified time
- [Languages](/docs/customize/i18n/) — language configuration decides `hreflang` and translation pairing
- [AI-agent support](/docs/customize/agents/) — the `.md` output and `llms.txt` written for models
- [Configuration](/docs/customize/config/) — `services`, `sitemap`, `enableRobotsTXT` and the rest
