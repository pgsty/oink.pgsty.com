---
title: Analytics and SEO
linkTitle: Analytics and SEO
description: Connect Google Analytics or another service if you want visit counts, and check the canonical, hreflang, social-card, sitemap and robots output search engines read.
weight: 40
search_keywords: [analytics, Google Analytics, GA4, Plausible, Umami, SEO, search engines, sitemap, robots, canonical, hreflang, Open Graph]
aliases:
  - /docs/advanced/analytics/
---

An OINK site reports nothing to anyone until you connect an analytics
service: Google Analytics through one Hugo setting, anything else through a
one-file hook. The theme loads no analytics, form or advertising script of
its own, so the decision, and the line in your privacy statement, are yours.

Search-engine metadata, by contrast, needs no setup. Every page gets a
canonical link, `hreflang` links to its translations, a `robots` meta tag and
Open Graph and Twitter cards; your part is a correct `baseURL` and a
`description` on each page.

## Connecting Google Analytics {#google-analytics}

Put your GA4 measurement ID in Hugo's service configuration:

```yaml {title="hugo.yml"}
services:
  googleAnalytics:
    id: G-YOUR_MEASUREMENT_ID
```

The snippet loads only in production builds, so `hugo server` reports
nothing. `hugo` builds for production by default, even on a preview host, so
build pull-request and staging deployments with another environment, as
[Keeping preview deployments unindexed](/docs/admin/deploy/#preview-builds)
shows. Without an ID nothing loads, and a Universal Analytics `UA-` ID is no
longer accepted: it produces a build warning instead of a snippet.

Use only this key; the top-level `googleAnalytics` key is deprecated. If you
do not want analytics, delete the block rather than leaving a placeholder,
because a placeholder ID still loads Google's script.

> [!WARNING] Google Analytics leaves your network
> Once configured, page views and events go to Google, which rules it out for
> a network-isolated site, and a strict Content Security Policy has to allow
> it; see [Content Security Policy](/docs/admin/deploy/#csp).

## Connecting another analytics service {#other-analytics}

Plausible, Umami, Matomo and similar services need only their script on the
page. The theme renders two hook partials for exactly this, so you add a file
to your site and leave the theme untouched:

| File | Inserted | Use it for |
| --- | --- | --- |
| `layouts/_partials/hooks/head-end.html` | Before `</head>`, ahead of the Google Analytics snippet | Analytics scripts, cookie-consent scripts, meta tags the theme does not write |
| `layouts/_partials/hooks/body-end.html` | After all the page's other scripts | Third-party code that affects interaction rather than the first paint |
{.fields}

For Plausible, use the domain registered in your own account:

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script defer data-domain="your-site.example"
        src="https://plausible.io/js/script.js"></script>
{{ end }}
```

Keep the `hugo.IsProduction` guard. Without it, every local preview by every
author reports visits to your analytics account.

> [!NOTE] head-end runs before Google Analytics
> A cookie-consent script placed in `head-end.html` therefore runs first and
> can stop analytics from starting.

The "was this page helpful?" widget is separate and off by default. It makes
no request of its own and records answers through your Google Analytics
integration when one exists; see
[Repository links and page info](/docs/customize/repository/).

## Duo view panes {#bilingual-view}

If you enable [Duo view](/docs/customize/i18n/#bilingual-view)
(`params.ui.compare`), opening it loads both pages in same-origin frames. The
Google Analytics integration (`services.googleAnalytics.id`) skips those
panes, so opening the reader does not count two extra page views. To do that,
OINK renders the snippet from its own pane-aware template instead of Hugo's
built-in one, so an override at `layouts/_partials/google_analytics.html` has
no effect while Duo view is on.

Scripts in `head-end.html` still run in every pane. Check
`window.OinkComparePane` before recording a page view:

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script>
  if (!window.OinkComparePane) {
    var script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = 'your-site.example';
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }
</script>
{{ end }}
```

Server and CDN logs see the pane requests too; they carry the query
`oink_compare_pane=1`, which you can filter on.

## Page descriptions {#description}

`<meta name="description">` takes the first non-empty value of:

1. The page's `description` front matter
1. The page summary Hugo computes (`.Summary`)
1. `params.description` in the site configuration
{.steps}

So one `description` per page is the only SEO work an author has to do, and
it pays three times: as the snippet under the search-engine result, as the
card subtitle on its section's index, and as the preview in site search.

```yaml {title="content/docs/install.md"}
---
title: Install PostgreSQL
description: Install PostgreSQL 18 from the official packages on Debian, Ubuntu or RHEL and start the first cluster.
---
```

On a multilingual site, write the description in each language instead of
copying the English one, and set the site-wide fallback per language too:

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

Every page gets one canonical link, plus an `hreflang` alternate for each
translation that actually exists. Nothing needs configuring:

```html {title="rendered output (this page)" copy=false}
<link rel="canonical" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="en-US" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="zh-CN" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
```

The `hreflang` codes come from each language's `locale` (`en-US` and `zh-CN`
on this site), and the links follow Hugo's translation pairing. A page
without a translation gets no `hreflang` or `og:locale:alternate` for the
missing language, even though the language switcher still offers that
language's home page.

Each page of a paginated blog index has its own canonical URL. From page 2
on, it carries no `hreflang` alternates, because the languages can have
different numbers of posts and their page boundaries do not line up.

Canonical links are built from `baseURL`. A wrong `baseURL` sends search
engines to addresses that do not exist, which is harder to notice than a
failed build, so go through the
[deployment checklist](/docs/admin/deploy/#checklist) before launch. Language
configuration itself is covered in [Languages](/docs/customize/i18n/).

## Social cards {#social-cards}

The theme calls Hugo's built-in Open Graph and Twitter card templates, which
fill in the title, description, URL, language and site name:

```html {title="rendered output (this page)" copy=false}
<meta property="og:title" content="Analytics and SEO">
<meta property="og:type" content="article">
<meta property="og:url" content="https://oink.pgsty.com/docs/admin/analytics/">
<meta property="og:locale" content="en_US">
<meta property="og:locale:alternate" content="zh_CN">
<meta name="twitter:card" content="summary">
```

To show an image when the link is shared, set `images` in the page's front
matter:

```yaml {title="content/blog/release-3.0.md"}
---
title: Version 3.0 released
images: [/images/release-3.0.webp]
---
```

For a site-wide fallback image, set the same key under `params`:

```yaml {title="hugo.yml"}
params:
  images: [/images/social-card.webp]
```

With an image, `twitter:card` becomes `summary_large_image` and the output
gains `og:image` and `twitter:image`. This site sets neither key, which is why
the output above has no image tags.

## Sitemap {#sitemap}

Hugo writes the sitemap itself; on a multilingual site it writes an index
that points at one sitemap per language:

```text {title="the structure under public/" copy=false}
sitemap.xml        ← the index, pointing at the two below
en/sitemap.xml
zh/sitemap.xml
```

The site default and the per-page override are both Hugo's own keys:

```yaml {title="hugo.yml"}
sitemap:
  changefreq: monthly
  filename: sitemap.xml
  priority: 0.5
```

```yaml {title="content/release/notes.md"}
---
title: Release notes
sitemap:
  priority: 0.8
---
```

Search engines treat `changefreq` and `priority` as hints and may ignore
them. What matters more is checking before launch that drafts, private
content and non-canonical copies stay out of the sitemap, and that every
language has its own.

## robots.txt and staying unindexed {#robots}

Hugo writes `robots.txt` only when the site asks for it:

```yaml {title="hugo.yml"}
enableRobotsTXT: true
```

The theme supplies the content, which depends on the
[build environment](/docs/admin/deploy/#preview-builds):

```text {title="a production build" copy=false}
User-agent: *
Allow: /

Sitemap: https://oink.pgsty.com/sitemap.xml
```

```text {title="a non-production build" copy=false}
User-agent: *
Disallow: /
```

The page's `robots` meta tag follows the same rule: `index, follow` in a
production build, `noindex, nofollow` otherwise and always in print output.

The theme has no per-page `noindex` switch. To keep a page out of search
engines reliably, do not publish it: use `draft: true` or Hugo's `build`
options. If the page must be published yet unindexed, write your own tag in
the `head-end.html` hook; the page then carries two `robots` tags, and each
search engine decides how to combine them.

## Checking indexing {#indexing}

A week or two after launch, confirm that search engines see the site you
think you published:

1. Crawl permission: `<baseURL>/robots.txt` reads `Allow: /`, not `Disallow: /`.
1. Page inventory: `<baseURL>/sitemap.xml` opens; follow it to a language sitemap and check the page count.
1. Indexed pages: a `site:yourdomain` search returns about the right number. The order of magnitude is enough.
1. Canonical addresses: results open the canonical URL, not a version with `?` parameters or an old domain.
1. Submission: add the site to Google Search Console and Bing Webmaster Tools and submit the `sitemap.xml` address, which gets it crawled sooner than waiting.
{.steps}

## Verify {#verify}

Run this from the site root, with `PAGE` set to a page your site generates
(including any language prefix):

```bash {title="Terminal"}
hugo --gc --minify --printPathWarnings
PAGE=public/docs/getting-started/index.html
test -f "$PAGE"

# Canonical should use the real production address; production robots allow indexing.
grep -o '<link[^>]*canonical[^>]*>' "$PAGE"
grep -o '<meta[^>]*robots[^>]*>' "$PAGE"
cat public/robots.txt
head -5 public/sitemap.xml

# No match is expected when Google Analytics is not configured.
grep -o '<script[^>]*googletagmanager[^>]*>' "$PAGE"
```

In the browser's Network panel, confirm that analytics requests carry your
measurement ID or registered domain. A deployment built with
`--environment staging` must make no analytics request, and a site with no
analytics configured makes none in either environment, though other
integrations you enabled still contact their own services.

## Related {#related}

- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist and unindexed preview deployments
- [Repository links and page info](/docs/customize/repository/) — the feedback widget, edit links and last-modified dates
- [Languages](/docs/customize/i18n/) — language configuration decides `hreflang` and translation pairing
- [AI-agent support](/docs/customize/agents/) — the `.md` output and `llms.txt` written for models
- [Configuration](/docs/customize/config/) — `services`, `sitemap`, `enableRobotsTXT` and the rest
