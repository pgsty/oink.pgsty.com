---
title: Deployment
weight: 60
description: Build OINK once and publish its static output
---

OINK deployment has two separate stages: Hugo builds a complete `public/`
directory, then a static host publishes that directory. Keep build verification
and hosted verification distinct so a successful local command is not mistaken
for a completed production release.

## Production build

Run the pinned Hugo Extended version from the site root:

```sh
hugo --gc --minify --cleanDestinationDir
```

`--gc` removes unused cached resources, `--minify` produces production assets,
and `--cleanDestinationDir` removes files left by an earlier build. Review the
command before using the last option when `publishDir` points anywhere other
than the site's dedicated output directory.

The build must finish without warnings that hide missing content, endpoints, or
resources. Inspect `public/` locally before uploading it.

## Local preview

For editing:

```sh
hugo server --disableFastRender
```

Hugo's development server proves that the source can render. It is not a
production host and its live-reload behavior is not part of the generated site.
Always run a clean production build before release.

## Static hosting

Any host that can serve directories and files can publish OINK:

- object storage and a CDN;
- GitHub Pages, GitLab Pages, or similar Git-driven static hosting;
- Netlify, Cloudflare Pages, or another build-and-publish platform;
- an Nginx, Caddy, Apache, or internal file server.

Set `baseURL` to the canonical production URL. If the site is published below a
path such as `https://example.com/manual/`, include that path and test it;
OINK's local assets and component URLs are designed to preserve subpath
deployments.

## Cloudflare Pages

Connect Pages directly to the source branch. OINK does not require a GitHub
Actions workflow that prebuilds and pushes an orphan Pages branch.

Use these settings for the current starter:

| Setting                   | Value                                 |
| ------------------------- | ------------------------------------- |
| Production branch         | `main`, or the reviewed source branch |
| Root directory            | the standalone site directory         |
| Build command             | `hugo --gc --minify`                  |
| Build output directory    | `public`                              |
| `HUGO_VERSION`            | `0.164.0`                             |
| `SKIP_DEPENDENCY_INSTALL` | `1`                                   |

As of 2026-08-08, Cloudflare Pages' v3 build image documents Hugo `0.147.7` as
its default, below OINK's minimum `0.160.1`. Set `HUGO_VERSION` explicitly for
both Production and Preview rather than relying on the moving platform default.
`SKIP_DEPENDENCY_INSTALL=1` prevents the platform's generic dependency installer
from adding a frontend installation step that the site does not need.

For previews that need the generated Pages URL as their canonical build URL:

```sh
hugo --gc --minify --baseURL "$CF_PAGES_URL"
```

Cloudflare documents `public` as Hugo's standard output directory, the
`HUGO_VERSION` override, and the `CF_PAGES_URL` base-URL pattern. Recheck the
platform documentation when changing the build image or pinned Hugo version.

[Cloudflare Hugo guide]:
  https://developers.cloudflare.com/pages/framework-guides/deploy-a-hugo-site/
[Cloudflare build image]:
  https://developers.cloudflare.com/pages/configuration/build-image/

See the [Cloudflare Hugo guide][] and [Cloudflare build image][] reference.

## Air-gap deployment

For a disconnected environment, transfer both the site source and a verified
theme archive rather than depending on an initial Hugo Module download:

1. verify the theme archive's sidecar SHA-256 file;
2. install a supported Hugo Extended binary inside the environment;
3. extract the theme into the site's `themes/oink/` directory;
4. set `theme: oink` and run `hugo --gc --minify` in the site;
5. publish `public/` to the internal static server.

Keep PlantUML and Diagrams.net disabled unless a reachable internal endpoint is
configured. External links and embeds remain the content author's
responsibility.

## Headers and caching

Fingerprint-bearing CSS and JavaScript can use long-lived immutable caching.
HTML, search indexes, feeds, and sitemaps should use shorter caching or
revalidation so a new deployment becomes visible promptly.

The project site includes a sample `static/_headers` file for hosts that
recognize that convention. Treat it as a starting point, not a portable
standard. Review security headers against the site's actual inline content and
integrations.

## Preview and production URLs

Canonical, `hreflang`, Open Graph, feeds, and absolute links depend on
`baseURL`. A production build should use the production URL; a preview may use
its temporary URL when link validation or social metadata needs to be accurate.

Do not publish a preview build to production without rebuilding against the
canonical URL. Conversely, do not reject a preview merely because it contains
the intentionally supplied preview host.

## Deployment acceptance

Verify each layer independently:

### Source and configuration

- the expected commit and pinned theme version are present;
- `baseURL`, languages, menus, repository metadata, and optional endpoints are
  correct;
- no unpublished draft or secret enters the public content tree.

### Build artifact

- a clean production build succeeds with the pinned Hugo Extended version;
- English, Chinese, feeds, sitemaps, search indexes, and `404.html` are present;
- local assets resolve under both root and configured subpath;
- the artifact contains required license and attribution surfaces.

### Hosted site

- the production URL returns the new artifact;
- canonical and language-alternate URLs use the production origin;
- navigation, search, language switching, dark mode, print, and representative
  components work in a real browser;
- redirects, custom headers, cache policy, and `404` handling behave as
  configured;
- an air-gap claim is backed by a browser network audit.

A green build log completes only the artifact stage. Deployment is complete
after the hosted checks pass.

## Rollback

Keep the previous known-good static artifact or hosting deployment identifier.
If a new release fails hosted validation, restore that artifact first, then
diagnose source or platform behavior. Rebuilding an old source commit with a new
unpinned toolchain is not equivalent to restoring the original artifact.
