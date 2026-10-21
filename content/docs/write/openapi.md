---
title: API reference pages
linkTitle: API reference
description: Add an OpenAPI specification to the site. Use bundled Swagger UI or Redoc to render a browsable API reference without a CDN.
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, swagger, spec, specification]
---

An API reference page is one OpenAPI specification plus one shortcode. Choose
Swagger UI when readers need to try requests, or Redoc for browsing endpoint
descriptions and schemas. Both runtimes ship with the theme and load only on
pages that use them in HTML output, without a CDN. Swagger UI's online validator
is disabled. Remote specifications and API requests still contact their
configured hosts.

Put the specification file under `static/`. Create a page with the shortcode.
If the page needs the dedicated shell, change its `type` to `swagger`.

## Where the specification file goes {#spec-file}
Put the specification under `static/`. Hugo publishes it unchanged at the site
root. Both shortcodes then receive a URL that the browser can fetch:

```filetree {title="where the specification lives"}
- static/
  - openapi/
    - docs-demo.yaml    # published as /openapi/docs-demo.yaml
- content/
  - docs/
    - write/
      - openapi.md       # this page
```

Do not put the specification beside the page. Both shortcodes treat a local
value as a path under `static/`. Neither resolves page resources. A `.yaml`
file beside a content page is a page resource. A shortcode reference to its
name does not publish it. The browser therefore receives a 404.

Both shortcodes accept a remote specification starting `https://…`. This
creates a network dependency and exposes the reader's metadata to that host. Intranet deployments and sites with a CSP should use a same-origin
specification. Only `http` and `https` are accepted. Any other scheme, a
protocol-relative `//host`, or an empty value warns. The shortcode then renders
nothing.

To try the examples, download [docs-demo.yaml](/openapi/docs-demo.yaml) and save
it as `static/openapi/docs-demo.yaml` in your site. It describes a demonstration
cluster-management API with no reachable server behind it.

## Swagger UI {#swaggerui}

`swagger` has one named parameter, `src`, whose value is a URL from the site
root. It passes through the theme's URL validation, so a subpath deployment
resolves correctly:

```markdown {title="Source"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

In your local preview, this displays expandable API operations, request
parameters and response schemas. "Try it out" sends requests to the
specification's `servers` address. The sample has no working backend.

This page shows Swagger UI source and a live Redoc example below. Both widgets
have known accessibility limitations. See [Limits](#limits).

## Redoc {#redoc}

`redoc` takes exactly one positional parameter, the specification path. A
second parameter warns and the shortcode renders nothing.

```markdown {title="Source"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

An `http` or `https` URL remains remote. Any other accepted value is a path
under `static/`. Leading and non-leading slash forms are equivalent. For
example, `openapi/docs-demo.yaml` and `/openapi/docs-demo.yaml` both become
`https://example.com/preview/openapi/docs-demo.yaml` when the site `baseURL` is
`https://example.com/preview/`. Unlike `swagger`, Redoc receives this absolute
URL based on `baseURL`.

The theme pins five attributes — `hide-hostname`, `hide-logo`,
`suppress-warnings`, `lazy-rendering`, `native-scrollbars` — and hides the
Redocly brand mark with CSS. Redoc's remaining attributes are not exposed to
authors. If a site needs them, override
`layouts/_shortcodes/redoc.html`.

## The dedicated page shell {#shell}

API reference pages are often wide and long. Use the `swagger` page type for
this layout:

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
needs to keep it). It differs from the `docs` shell in exactly two ways. It
adds a `td-swagger` class to `<body>` for styling hooks. It omits the version banner.
Sidebar, table of contents, breadcrumbs, pager and page end all behave normally.

Shells and page width are covered fully in
[Layouts and page types](/docs/customize/layout/).

## Output {#outputs}

| Output | What appears |
| --- | --- |
| HTML | The full interactive Swagger UI / Redoc. Only HTML loads the runtime, on demand from local files without a CDN |
| Print | A labeled static link showing the specification's address. Neither runtime loads |
| Markdown | A plain Markdown link, `[OpenAPI specification](/openapi/example.yaml)`. It does not become an endpoint list |
| RSS | The same plain link |

Outside HTML, the API reference contains only a link to the specification.
To include endpoint information in print or agent output, describe key
endpoints in prose on the same page. Body text outside the shortcode remains
intact in all four outputs.

## Limits {#limits}

- Both components derive their container ID from the page address and the shortcode's ordinal, so several on one page never collide.
- The two can coexist on one page, but the page becomes long and its HTML output loads both runtimes. Pick one for a production site.
- Neither interface is fully accessible. Swagger UI has unnamed server controls and scrollable regions without keyboard access. Redoc's operation descriptions have insufficient color contrast. Assess these limitations against your site's accessibility requirements. Excluding a widget from an automated check does not make it conformant. If an embedded widget is unsuitable, provide readable endpoint documentation.
- `redoc` accepts no attribute parameter. A second positional argument warns and the shortcode renders nothing.
- A local `redoc` path starts under `static/`. A leading `/` is optional. Page resources are not resolved.
- The browser must be able to fetch the specification. Put it in `static/`. After a build, confirm that the file exists under `public/`.
- There is no mock server. Swagger UI's "Try it out" sends a real request to the address in `servers`. The sample specification's address is unreachable.

## Verify {#verify}

1. Build with visible diagnostics: `hugo --printPathWarnings`.
2. The specification really was published: `ls public/openapi/docs-demo.yaml`, or open `http://localhost:1313/openapi/docs-demo.yaml`.
3. Expand endpoints on the page and confirm that their schemas appear. The browser console must show no 404 or cross-origin error.
4. Disconnect from the external network while keeping the local preview server reachable, then reload. Local runtimes and a same-origin specification should still appear.

## Related {#related}

- [Writing pages](/docs/write/pages/) — page front matter and body basics
- [Layouts and page types](/docs/customize/layout/) — `shell_types`, page width and the sidebar
- [AI-agent support](/docs/customize/agents/) — why a component that is interactive only in HTML needs prose beside it
- [Code Blocks](/docs/components/code/) — the lighter alternative of request / response examples instead of a whole UI
