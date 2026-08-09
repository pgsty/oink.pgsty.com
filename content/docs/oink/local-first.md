---
title: Local-first operation
weight: 30
description:
  Build and browse core OINK features without hidden network dependencies
---

OINK's local-first rule is simple: a feature owned by the theme must not
silently depend on a public CDN, a build-time download, or an unconfigured
public service. A complete distribution can be built and its core pages browsed
inside a network-isolated environment.

## What local-first covers

The theme serves these dependencies from the generated site:

| Capability              | Local delivery                                              |
| ----------------------- | ----------------------------------------------------------- |
| Shell and responsive UI | Bootstrap and OINK CSS/JavaScript                           |
| Icons and fonts         | Font Awesome, Open Sans, Chakra Petch, IBM Plex Mono        |
| Search                  | Lunr plus a CJK substring fallback and per-language indexes |
| Diagrams and formulae   | Mermaid, KaTeX, and Markmap                                 |
| API documentation       | Swagger UI and Redoc                                        |
| Rich content            | Asciinema, ECharts, Infographic, and carousel runtime       |

Assets are committed under `assets/` or `static/`. Hugo publishes them under the
site's `baseURL`, including subpath deployments.

## What local-first does not cover

OINK cannot make arbitrary authored content offline. The following remain
explicit network choices:

- external links, remote images, video, iframes, and API specifications;
- hosted search such as Algolia or Google CSE;
- analytics, comments, identity providers, and other SaaS integrations;
- PlantUML or Diagrams.net when an author chooses a remote renderer.

A page using one of these features can still be valid, but the site should not
claim that page is fully available offline.

## Service-backed diagrams

PlantUML and Diagrams.net differ from browser libraries: their normal workflows
depend on a rendering or editing service. OINK therefore has no implicit public
endpoint.

Enabling PlantUML without `params.plantuml.svg_image_url`, or Diagrams.net
without `params.drawio.drawio_server`, fails the build with an actionable
message. Configure a controlled local endpoint, publish a pre-rendered image, or
make a deliberate remote-service choice:

```yaml
params:
  plantuml:
    enable: true
    svg: true
    svg_image_url: https://diagrams.internal.example/plantuml/svg/
  drawio:
    enable: true
    drawio_server: https://diagrams.internal.example/
```

The OINK documentation regression site explicitly configures public demo servers
so inherited diagram examples continue to render. That sample-site choice is not
the theme default and should not be copied into an air-gap site.

## Local search

Set:

```yaml
params:
  offlineSearch: true
```

Hugo generates a search index for each language. The browser uses local Lunr
search for Latin-script queries and a local substring fallback for CJK text. No
query leaves the site.

Keep search useful by writing descriptive titles and summaries, setting the
correct page language, and excluding generated or sensitive pages that should
not enter a public client-side index. A local index is downloadable by every
visitor and is not an access-control mechanism.

## Per-page assets

OINK does not place every runtime on every page. Mermaid, KaTeX, Markmap,
Swagger UI, Redoc, Asciinema, ECharts, Infographic, and the carousel are
selected from page feature markers. A page that does not use a component does
not receive that component's runtime.

When a page contains several instances of the same component, the runtime is
still included once. Production resources are fingerprinted where the Hugo
pipeline permits it, which supports integrity metadata and long-lived caching.

## Third-party provenance

`VENDOR.json` is the machine-readable inventory for bundled dependencies. For
each dependency it records:

- name and pinned version;
- original source;
- applicable license files;
- selected artifact paths and SHA-256 values;
- the maintainer update procedure.

The theme retains the corresponding license files beside vendor assets. Updating
a runtime means refreshing the artifact, its license and notice material, its
checksum, and its tests as one reviewable change.

## Obtain an offline archive

Use the versioned theme archive and checksum attached to an Oink release. After
transferring both files into the isolated environment:

```sh
shasum -a 256 -c oink-vX.Y.Z.tar.gz.sha256
tar -xzf oink-vX.Y.Z.tar.gz
mkdir -p product-docs/themes
mv oink-vX.Y.Z product-docs/themes/oink
```

Configure the isolated site to use the extracted conventional theme:

```yaml
theme: oink
```

The archive must include `go.mod`, `hugo.yaml`, layouts, assets, static files,
translations, `LICENSE`, `NOTICE`, and `VENDOR.json`. Inspect it before relying
on it in a disconnected build.

## Verify an isolated site

A meaningful air-gap acceptance test covers both build time and browser time:

1. start with the verified theme archive and an empty Hugo cache;
2. block outbound HTTP, HTTPS, and Go module proxies;
3. run the production Hugo command;
4. browse English and Chinese pages from the generated output;
5. exercise search, dark mode, diagrams, API docs, and content components;
6. inspect every HTML and CSS subresource URL for unexpected remote origins.

The project-site regression suite performs these checks against a local theme
candidate. A successful test proves only the tested commit and environment;
repeat it for every release candidate and after bundled dependency updates.

## Content security policy

Local assets make a strict Content Security Policy practical, but OINK does not
invent one universal policy for every site. Inline author HTML, ECharts unsafe
mode, analytics, remote specifications, and custom integrations can all change
the required directives.

Start with the smallest policy that supports the site's reviewed features. Keep
ECharts in structured-data mode, avoid arbitrary inline scripts, and add remote
origins only for integrations that the site deliberately enables.
