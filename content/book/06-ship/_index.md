---
title: Ship with confidence
linkTitle: Validate and ship
description: Separate local preview, repository integration, theme release, and hosted deployment, then verify each state with the right evidence.
book_kind: chapter
book_number: 6
book_status: draft
weight: 60
---

Publishing is a sequence of independently verifiable states. A successful
local preview proves that the content and theme can render together; it does
not prove that a remote module tag exists or that the public site has deployed
that revision.

## Name every delivery state {#delivery-states}

| State | Evidence | What it does not prove |
| --- | --- | --- |
| Local preview | The site renders against the intended checkout | A public theme release exists |
| Site integration | Content, configuration, and dependency changes are reviewed together | The hosting platform has deployed them |
| Theme release | The public tag and module checksum resolve without a local replacement | A consumer site has upgraded |
| Hosted deployment | The public revision and representative routes are reachable | Every language and viewport is correct |
{#tbl-delivery-states num="6-1" caption="Each delivery state needs its own evidence and handoff."}

## Validate the smallest useful surface {#validate}

Start with the checker that owns the changed contract, then widen the scope.
For this site, a strict local build against the sibling theme checkout is an
explicit development operation:

```bash
HUGO_MODULE_REPLACEMENTS='github.com/pgsty/oink -> /path/to/oink' \
  npm run build -- --panicOnWarning
```

Before a public release, repeat the build without the replacement and verify
the module selected by `go.mod`. Record which command produced each result so
another maintainer can reproduce it.

## Review the rendered result {#visual-review}

Automated checks catch broken links, duplicate IDs, invalid shortcodes, and
accessibility regressions. They do not decide whether a Hero crops well or
whether a dense table remains readable on a phone. Review representative
English and Chinese routes at desktop and narrow widths, including navigation,
theme controls, code blocks, and the whole-book output.

## Hand off facts, not implications {#handoff}

A useful handoff lists changed files, commands and results, known limitations,
and the next state still waiting to happen. Use
{{< xref tbl="6-1" anchor="tbl-delivery-states" />}} to say exactly which
state has been reached instead of compressing validation, release, and
deployment into the word “done.”

The full operational references are [Preview the site](/docs/admin/preview/),
[Deploy the site](/docs/admin/deploy/), and
[Troubleshoot a build](/docs/admin/troubleshooting/).

