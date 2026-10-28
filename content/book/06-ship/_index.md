---
title: Ship with confidence
linkTitle: Validate and ship
description: Verify local previews, production builds, theme upgrades, and live deployments with a repeatable release checklist.
book_kind: chapter
book_number: 6
weight: 60
---

Shipping a documentation site moves through four stages: previewing locally,
pinning or updating the theme module, running a clean production build, and
deploying to your hosting provider. Checking each stage in order makes build or
deployment problems easy to isolate.

## Check each stage in order {#delivery-states}

| Stage | What it verifies | What still needs checking |
| --- | --- | --- |
| Local preview | Pages, navigation, and edits render cleanly in `hugo server` | Production base URL, draft exclusion, and clean module state |
| Theme module pin | `hugo mod graph` resolves the target public tag in `go.mod` and `go.sum` | Whether site content and overrides build cleanly against that tag |
| Production build | Content, configuration, and `go.mod` build cleanly in `--environment production` | Hosting workflow, CDN caching, and live public routes |
| Live deployment | CI workflow succeeds and key public URLs load as expected | Desktop and mobile layout across representative pages |
{#tbl-delivery-states num="6-1" caption="Four verification stages from local preview to live deployment, and what each stage leaves to the next step."}

## Validate the smallest useful surface {#validate}

From your Starter repository, run a clean production build before pushing to
your deployment workflow:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

Confirm that `hugo mod graph` resolves the expected release in `go.mod`, then
follow the [Starter deployment steps](/docs/start/starter/#build-deploy).
An ordinary Starter site needs no npm build script or sibling theme checkout.
If you are developing changes to the OINK theme itself, follow the
[theme-development workflow](/docs/start/from-scratch/#local-theme-checkout).

## Review the rendered result {#visual-review}

Automated checks catch broken links, duplicate IDs, invalid shortcodes, and
accessibility regressions, while visual review checks layout and readability.
Inspect representative English and Chinese pages at desktop and mobile widths,
including Hero cropping, wide tables, navigation, theme controls, code blocks,
and the whole-book print view.

## Keep a release checklist {#handoff}

When opening a pull request or upgrading the theme, record the Hugo version,
the theme version in `go.mod`, the build output, and the routes you reviewed
against {{< xref tbl="6-1" anchor="tbl-delivery-states" />}}. Keeping a concise
checklist in your pull request makes reviews and rollbacks straightforward.

The full operational references are [Preview the site](/docs/admin/preview/),
[Deploy the site](/docs/admin/deploy/), and
[Troubleshoot a build](/docs/admin/troubleshooting/).

