---
title: API reference pages
linkTitle: API reference
description: Put an OpenAPI specification on the site and render it as a browsable API reference with the bundled Swagger UI or Redoc, without touching a CDN.
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, swagger, spec, specification]
---

An API reference page is one OpenAPI specification plus one shortcode. The
Swagger UI and Redoc runtimes ship with the theme (versions 5.32.13 and 2.5.3
respectively, per the repository's `VENDOR.json`), load only on a page that uses
them, and reach no external service at build time or in the browser.

Three steps: put the specification file under `static/`, create a page with the
shortcode, and change the page `type` to `swagger` if it needs the dedicated
shell.

## Where the specification file goes {#spec-file}
The specification goes under `static/`, is published unchanged at the site root,
and both shortcodes then receive a URL the browser can fetch:

```filetree {title="where the specification lives"}
- static/
  - openapi/
    - docs-demo.yaml    # published as /openapi/docs-demo.yaml
- content/
  - docs/
    - write/
      - openapi.md       # this page
```

Do not put the specification beside the page. `redoc` looks for a file of that
name in the content directory and builds a URL from it, but a `.yaml` in the
content directory is a page resource, and Hugo publishes one only when it is
referenced or processed. `redoc` builds a URL without referencing the resource,
so the browser gets a 404.

A remote specification (starting `https://…`) is accepted by both shortcodes,
but that is a network dependency, and it exposes the reader's metadata to that
host. Intranet deployments and sites with a CSP should use a same-origin
specification.

The examples below use the real `/openapi/docs-demo.yaml`, a demonstration
cluster-management API with no reachable server behind it.

## Swagger UI {#swaggerui}

`swagger` has one named parameter, `src`, whose value is a URL from the site
root. It passes through the theme's URL validation, so a subpath deployment
resolves correctly:

```markdown {title="Source"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

It renders a container with `class="td-swagger-ui"` and initializes it in place.
The container ID is derived from the page address and the shortcode's ordinal
(`td-swagger-<hash>-<n>`), so one page can hold several.

This page shows the source without rendering Swagger UI: the markup it generates
carries three axe WCAG AA violations (the server dropdown has no accessible
name, and the version stamp is a scrollable region without keyboard access), and
this site's accessibility gate requires zero violations per page. The Redoc
below is really rendered.

## Redoc {#redoc}

`redoc` takes exactly one positional parameter, the specification path. A
second parameter fails the build.

```markdown {title="Source"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

Path resolution has three branches, in order: anything starting with `http` is
a remote URL; a file of that name found in the content directory yields
`baseURL + page directory + filename`; otherwise it is `baseURL + the path as
written`. So a `redoc` path must not begin with a slash — `/openapi/…` would
produce a doubled slash such as `https://example.com//openapi/…`. Unlike
`swagger`, it generates an absolute URL based on `baseURL`.

The theme pins five attributes — `hide-hostname`, `hide-logo`,
`suppress-warnings`, `lazy-rendering`, `native-scrollbars` — and hides the
Redocly brand mark with CSS. Redoc's remaining attributes are not exposed to
authors; a site that needs them overrides
`layouts/_shortcodes/redoc.html`.

## The dedicated page shell {#shell}

API reference pages tend to be wide and long, which is what the `swagger` page
type is for:

```yaml {title="content/api/_index.md"}
---
title: Cluster management API
type: swagger
page_width: wide
cascade:
  type: swagger
---
```

`swagger` is one of the theme's default shell types (`params.ui.shell_types`
defaults to `[docs, book, blog, swagger]`, and a site that overrides the list
needs to keep it). It differs from the `docs` shell in exactly two ways: an
extra `td-swagger` class on `<body>` for styling hooks, and no version banner.
Sidebar, table of contents, breadcrumbs, pager and page end all behave normally.

Shells and page width are covered fully in
[Layouts and page types](/docs/customize/layout/).

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | The full interactive Swagger UI / Redoc; the runtime loads on demand from local files, with no CDN |
| Print | An empty container only: both interfaces are built by JavaScript in the browser, so print output has no content |
| Markdown | The container `<div>` / `<redoc>` and the initialization script as they stand; it does not degrade into an endpoint list |
| RSS | As Markdown |

An API reference has content in HTML only. To put endpoint information into
print or agent output as well, describe the key endpoints in prose on the same
page; body text outside the shortcode survives intact in all four outputs.

## Limits {#limits}

- Both components derive their container ID from the page address and the shortcode's ordinal, so several on one page never collide.
- The two can coexist on one page, but the page becomes long and loads both runtimes. Pick one for a production site.
- Swagger UI's markup has axe WCAG AA violations (`select-name`, `scrollable-region-focusable`). They come from the upstream distribution and the theme does not rewrite them. A site with a zero-violation accessibility gate excludes such pages, or uses Redoc instead.
- `redoc` accepts no attribute parameter: a second positional argument fails the build.
- A `redoc` path must not start with `/`, or the URL gains a doubled slash.
- The specification must be fetchable by the browser: put it in `static/` and confirm the file exists under `public/` after a build.
- There is no mock server: Swagger UI's "Try it out" makes a real request to whatever `servers` names, and the address in the sample specification is not reachable.

## Verify {#verify}

1. The build is warning-free: `hugo --printPathWarnings --panicOnWarning`.
2. The specification really was published: `ls public/openapi/docs-demo.yaml`, or open `http://localhost:1313/openapi/docs-demo.yaml`.
3. Endpoints expand on the page and their schemas appear; the browser console shows no 404 and no cross-origin error.
4. Reload once with the network off: the runtimes are local, and with a same-origin specification the interface should still appear.

## Related {#related}

- [Writing pages](/docs/write/pages/) — page front matter and body basics
- [Layouts and page types](/docs/customize/layout/) — `shell_types`, page width and the sidebar
- [AI-agent support](/docs/customize/agents/) — why a component that exists only in HTML needs prose beside it
- [Code Blocks](/docs/components/code/) — the lighter alternative of request / response examples instead of a whole UI
