---
title: Analytics and SEO
linkTitle: Analytics and SEO
description: Configure an optional analytics service. Check the canonical URLs, hreflang links, social cards, sitemap, and robots output that the theme generates.
weight: 40
search_keywords: [analytics, Google Analytics, GA4, Plausible, Umami, SEO, search engines, sitemap, robots, canonical, hreflang, Open Graph]
aliases:
  - /docs/advanced/analytics/
---

By default, the theme loads no analytics, form, or advertising script. It makes
no outbound request until you configure one. You must explicitly configure each
integration. Document this external data boundary in the site's privacy statement.

The theme automatically generates canonical links, hreflang links, the `robots`
meta tag, Open Graph cards, and Twitter cards for each page. Set `baseURL` and
each page's `description` correctly.

## Connecting Google Analytics {#google-analytics}

Use Hugo's built-in service configuration. Replace `G-YOUR_MEASUREMENT_ID`
with your own GA4 measurement ID before enabling this block:

```yaml {title="hugo.yml"}
services:
  googleAnalytics:
    id: G-YOUR_MEASUREMENT_ID
```

The theme renders this script only in the production environment. A normal
`hugo server` uses development and sends no analytics reports. A `hugo` build
defaults to production, including on a preview host. For PR and staging
deployments, select a non-production environment. Set `PREVIEW_URL` to the
deployment's actual address:

```bash {title="Terminal"}
hugo --environment staging --baseURL "$PREVIEW_URL"
```

See [preview deployment settings](/docs/admin/deploy/#preview-builds).

Do not also set the deprecated top-level `googleAnalytics` key. If you do not
want analytics, delete the block. Do not enter a fake ID.

> [!WARNING] This is incompatible with a network-isolated environment
> When you configure this integration, it sends page views and events to Google.
> A strict same-origin Content Security Policy must also permit it. See
> [Content Security Policy](/docs/admin/deploy/#csp). The site must choose to
> enable this integration. The theme does not enable it by default.

## Connecting another analytics service {#other-analytics}

To connect Plausible, Umami, Matomo, or a similar service, insert its script.
The theme provides two injection points. Create a file with the corresponding
name in the site repository. You do not need to change the theme:

| File | Insertion point | What belongs there |
| --- | --- | --- |
| `layouts/_partials/hooks/head-end.html` | Before `</head>`, ahead of the Google Analytics template | Analytics scripts, cookie consent scripts, meta tags the theme does not provide |
| `layouts/_partials/hooks/body-end.html` | Last among the page scripts | Third-party code that affects interaction instead of the first paint |
{.fields}

For Plausible, replace `your-site.example` with the domain registered in your
own account before adding this hook:

```go-html-template {title="layouts/_partials/hooks/head-end.html"}
{{ if hugo.IsProduction }}
<script defer data-domain="your-site.example"
        src="https://plausible.io/js/script.js"></script>
{{ end }}
```

Do not omit the `hugo.IsProduction` guard. Without it, each local preview sends
reports to your analytics service.

> [!NOTE] head-end runs before Google Analytics
> A cookie consent script must run before the analytics script. This order lets
> the consent script prevent analytics from running.

The "was this page helpful?" feedback widget is separate. It is off by default
and makes no network request. Configure it as described in
[Repository links and page info](/docs/customize/repository/).

## Page descriptions {#description}

`<meta name="description">` takes the first non-empty value of:

1. The page's `description` front matter
1. The page summary Hugo computes (`.Summary`)
1. `params.description` in the site configuration
{.steps}

Authors need only write one `description` per page for SEO. It supplies the
search engine snippet, the card subtitle on a section index, and the result
preview in site search.

```yaml {title="content/docs/admin/analytics.md (this page)"}
---
title: Analytics and SEO
description: Connect an analytics service (or none), and pair up the canonical, hreflang, social cards, sitemap and robots the theme already generates.
---
```

For a multilingual site, write one description per language. Do not copy the
English description to a Chinese page. Set the site-level default per language too:

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

The theme emits one canonical link per page and `hreflang` alternate links for
actual translations. No configuration is required:

```html {title="rendered output (this page)" copy=false}
<link rel="canonical" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="en-US" href="https://oink.pgsty.com/docs/admin/analytics/">
<link rel="alternate" hreflang="zh-CN" href="https://oink.pgsty.com/zh/docs/admin/analytics/">
```

The `hreflang` codes use each language's `locale` (`en-US` / `zh-CN` on this site).
The links use Hugo's translation relationships. In the 1.2.0 implementation, missing translations have no `hreflang` or `og:locale:alternate`
entry. The visible language switcher may still open that language's home page.
This navigation fallback does not represent a translation.

Each paginated Blog index has its own canonical URL. From page 2 onward, the
theme omits language alternates. Pagination does not establish corresponding
translated pages. OINK 1.2.0 includes these corrections; 1.1.0 retains the earlier behavior.

The canonical URL uses `baseURL`. An incorrect `baseURL` directs search engines
to addresses that do not exist. This problem is less visible than a build failure.
Complete the [deployment checklist](/docs/admin/deploy/#checklist) before launch.

Full multilingual configuration is in [Languages](/docs/customize/i18n/).

## Social cards {#social-cards}

The theme calls Hugo's built-in Open Graph and Twitter card templates. They
automatically supply the title, description, URL, language, and site name:

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
title: OINK v0.8.0 released
images: [/images/releasenote.webp]
---
```

For a site-wide fallback, write the same key under `params`:

```yaml {title="hugo.yml"}
params:
  images: [/images/oink.webp]
```

When an image is present, `twitter:card` changes from `summary` to
`summary_large_image`. The output also includes `og:image` and `twitter:image`.
This site sets neither image key, so the output above has no image tags.

## Sitemap {#sitemap}

Hugo automatically generates the sitemap. For a multilingual site, it generates an index:

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

`changefreq` and `priority` are hints. A search engine may ignore them. Before
publishing, confirm that the sitemap excludes drafts, private content, and
non-canonical copies. Confirm that Hugo generated a file for each language.

## robots.txt and staying unindexed {#robots}

Hugo generates `robots.txt` only when the site configuration turns it on:

```yaml {title="hugo.yml"}
enableRobotsTXT: true
```

The theme's template generates one of two results, based on the build
environment. You do not need to write the content:

```text {title="a production build" copy=false}
User-agent: *
Allow: /

Sitemap: https://oink.pgsty.com/sitemap.xml
```

```text {title="a non-production build" copy=false}
User-agent: *
Disallow: /
```

The page's `robots` meta tag uses the same switch. It emits `index, follow` in
production, except in print output. Otherwise, it emits `noindex, nofollow`.
Do not build preview deployments with `--environment production`. A
non-production build automatically requests no indexing.

The theme has no per-page `noindex` switch. To reliably prevent indexing, do
not publish the page. Use `draft: true` or Hugo's `_build` options. If you must
publish it and request no indexing, emit your own tag through the
`head-end.html` hook. The theme already emits one `robots` meta tag. Each search
engine decides how to interpret two tags.

## Checking indexing {#indexing}

One or two weeks after launch, check the following items in order. Confirm that
search engines see the expected site:

1. Crawl permission: open `<baseURL>/robots.txt`. Confirm that it contains `Allow: /` instead of `Disallow: /`.
1. Page inventory: open `<baseURL>/sitemap.xml`. Open a language sitemap from the index and check the page count.
1. Indexed count: search `site:yourdomain`. Check the order of magnitude. You do not need to compare every page.
1. Canonical addresses: confirm that results open the canonical URL. They should not use a `?` parameter or an old domain.
1. Active submission: add the site in Google Search Console / Bing Webmaster Tools. Submit the `sitemap.xml` address to request crawling sooner.
{.steps}

Search metadata cannot improve the content itself. A good `description` does
not correct insufficient, duplicated, or outdated content.

## Verify {#verify}

Run from your site's root. Replace `PAGE` with a generated page on your site,
including any language prefix:

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

In the browser's Network panel, confirm that configured analytics requests use
your measurement ID or registered domain. Repeat this check on a deployment
built with `--environment staging`. It should make no analytics request. If you
configured no analytics, neither environment should make an analytics request.
Other explicitly enabled integrations may still contact their remote services.

## Related {#related}

- [Deploy](/docs/admin/deploy/) — `baseURL`, the checklist, and keeping preview deployments unindexed
- [Repository links and page info](/docs/customize/repository/) — the feedback widget, edit links and last-modified time
- [Languages](/docs/customize/i18n/) — language configuration decides `hreflang` and translation pairing
- [AI-agent support](/docs/customize/agents/) — the `.md` output and `llms.txt` written for models
- [Configuration](/docs/customize/config/) — `services`, `sitemap`, `enableRobotsTXT` and the rest
