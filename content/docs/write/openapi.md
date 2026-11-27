---
title: API reference pages
linkTitle: API reference
description: Render an OpenAPI specification as a browsable API reference with the bundled Swagger UI or Redoc, without a CDN.
weight: 70
search_keywords: [API, OpenAPI, Swagger, Swagger UI, Redoc, swagger, spec, specification]
---

Publish an API reference straight from the OpenAPI file your service already
has: save the file under `static/` and add one shortcode to a page. Choose
Swagger UI when readers should try requests from the page, or Redoc when they
mainly read endpoint descriptions and schemas. Both runtimes ship with the
theme and load only on pages that use them, so the site needs no CDN, and
Swagger UI's online validator is turned off. Remote specifications, and the
requests readers send to your API, still reach their own hosts.

## Where the specification file goes {#spec-file}

Put the specification under `static/`. Hugo publishes that folder unchanged at
the site root, so both shortcodes get a URL the browser can fetch:

```filetree {title="where the specification lives"}
- static/
  - openapi/
    - docs-demo.yaml    # published as /openapi/docs-demo.yaml
- content/
  - docs/
    - write/
      - openapi.md       # this page
```

Do not keep the file beside the page. Neither shortcode resolves page
resources: a `.yaml` file in a page bundle is published only when a template
asks for it, and naming it in a shortcode does not, so the browser gets a 404.

Both shortcodes also accept a remote `https://…` specification. Every page
view then depends on that host and reveals the reader's address and browser
details to it, so intranet sites and sites with a Content Security Policy
should serve a same-origin copy. Only `http` and `https` are accepted: any
other scheme, a protocol-relative `//host` or an empty value warns, and the
shortcode renders nothing.

To try the examples on your own site, save
[docs-demo.yaml](/openapi/docs-demo.yaml) as `static/openapi/docs-demo.yaml`.
It describes a demonstration cluster-management API with no server behind it.

## Swagger UI {#swaggerui}

`swagger` takes one named parameter, `src`: the specification's URL from the
site root. The theme resolves it like any other site URL, so it stays correct
when the site is deployed under a subpath:

```markdown {title="Source"}
{{</* swagger src="/openapi/docs-demo.yaml" */>}}
```

The page lists every operation as an expandable row with its request
parameters and response schemas. "Try it out" sends a real request to the
address in the specification's `servers` list; the demonstration file's
address does not answer.

## Redoc {#redoc}

`redoc` takes exactly one positional parameter, the specification path. A
second parameter warns, and the shortcode renders nothing.

```markdown {title="Source"}
{{</* redoc "openapi/docs-demo.yaml" */>}}
```

{{< redoc "openapi/docs-demo.yaml" >}}

A path is relative to `static/`, with or without a leading slash, and the
shortcode turns it into an absolute URL based on `baseURL`: with
`baseURL: https://example.com/preview/`, both `openapi/docs-demo.yaml` and
`/openapi/docs-demo.yaml` become
`https://example.com/preview/openapi/docs-demo.yaml`. An `http` or `https` URL
is used as given.

Each `redoc` shortcode runs ReDoc 3.1.0 from the theme's local files in a frame
of its own. The frame keeps its navigation in its own URL fragment, so it never
disturbs the article's anchors or another reader on the same page. It uses
ReDoc's light palette, scrolls independently, and has a plain link to the
specification below it. Telemetry is off and ReDoc's two brand images are
inlined, so the reader requests nothing from a CDN; a remote specification,
and images the specification itself references, are still fetched from their
hosts. Opened directly, the frame accepts only same-origin specifications. If
your [Content Security Policy](/docs/admin/deploy/#csp) restricts frames, allow
the reader with `frame-src 'self'`.

ReDoc reads OpenAPI, AsyncAPI and GraphQL descriptions. Put code samples in
the `x-codeSamples` extension; rename any `x-code-samples` left in an older
specification. A site that customized the Redoc shortcode or its styles before
OINK 1.6.0 should read [Upgrade to 1.6.0](/docs/admin/upgrade/#preparing-1-6).

## The dedicated page shell {#shell}

API references tend to be wide and long, so give them the `swagger` page type
and a wide page:

```yaml {title="content/api/_index.md"}
---
title: Cluster management API
type: swagger
page_width: wide
cascade:
  type: swagger
---
```

The `swagger` shell is the `docs` shell with one addition, a `td-swagger` class
on `<body>` that lets site CSS target API pages. The sidebar, table of
contents, breadcrumbs, pager and page end all behave as usual. `swagger` is in
the default `params.ui.shell_types`; keep it there if your site overrides the
list. Shells and page width are covered in
[Layouts and page types](/docs/customize/layout/).

## Output {#outputs}

Only the HTML page loads the interactive widgets. Print, Markdown and RSS
replace each shortcode with a plain link to the specification; in Markdown it
reads `[OpenAPI specification](/openapi/example.yaml)`, not an endpoint list.
A printed page or an agent reading the Markdown therefore sees no endpoints.
If those readers need the important ones, describe them in prose on the same
page, because text outside the shortcode appears in every output.

## Limits {#limits}

- Both widgets have upstream accessibility limitations: Swagger UI renders unnamed server controls and scrollable regions without keyboard access, and Redoc's operation descriptions fall below AA contrast ratios. If your site must meet strict accessibility requirements, document the key endpoints in Markdown prose as well.
- Swagger UI and Redoc can share a page, but the page gets long and loads both runtimes. Choose one for a production site.
- Several shortcodes on one page never collide: each container ID derives from the page address and the shortcode's position.
- There is no mock server. "Try it out" sends a real request to the address in `servers`.

## Verify {#verify}

1. Build with `hugo --printPathWarnings` and read the warnings.
2. Confirm the specification was published: `ls public/openapi/docs-demo.yaml`, or open `http://localhost:1313/openapi/docs-demo.yaml`.
3. Expand a few endpoints on the page and check that their schemas appear and that the browser console shows no 404 or cross-origin error.
4. Cut the machine off from the outside network while keeping the local preview server reachable, then reload. With local runtimes and a same-origin specification, the reference still appears.

## Related {#related}

- [Writing pages](/docs/write/pages/) — page front matter and body basics
- [Layouts and page types](/docs/customize/layout/) — `shell_types`, page width and the sidebar
- [AI-agent support](/docs/customize/agents/) — why a component that is interactive only in HTML needs prose beside it
- [Code Blocks](/docs/components/code/) — the lighter alternative of request / response examples instead of a whole UI
