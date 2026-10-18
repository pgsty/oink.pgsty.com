---
title: Warnings and safe fallbacks
linkTitle: Diagnostics
description: Invalid input produces visible warnings and safe fallbacks. Checks verify diagnostics and rendered output without aborting on every warning.
weight: 10
icon: fa-solid fa-triangle-exclamation
search_keywords:
  [warnf, errorf, diagnostics, validation, fallback, hugo server]
design_kind: decision
design_status: accepted
decision_date: 2026-08-19
---

> [!IMPORTANT] Decision
> OINK does not call Hugo's `errorf`. Invalid author or site input produces a
> warning. OINK then uses a documented safe fallback or omits the invalid
> fragment. Development, CI, release, and deployment use Hugo Extended 0.168.0
> without `--panicOnWarning` or `HUGO_PANICONWARNING`. Warnings stay visible;
> checks verify the specific diagnostic and the rendered fallback.

## Context {#context}

Hugo builds the whole site as one transaction. An `errorf` raised while one
page is being edited makes every URL served by that rebuild return an error,
including unrelated pages and the home page. The server process survives and
recovers after the input is fixed, but collaborative preview is unavailable in
the meantime.

A warning allows the affected value to use a safe fallback while other pages
remain available for inspection and the author receives a precise message.
Production builds keep these warnings visible for review. The upstream LibSass
deprecation warning is accepted; unexpected theme or content warnings need review.

## Decision {#decision}

Validation follows four rules:

1. Name the invalid key and value, the allowed shape, and the fallback.
2. Include a page position when the value came from page front matter; avoid
   repeating one site-wide warning for every page.
3. Never pass an invalid value into a later operation. Validate first, then
   render from the normalized value.
4. Where no honest fallback exists, warn and render nothing. Do not invent
   content, make a network request, or emit an unsafe URL merely to keep going.

The shared enum, boolean, CSS-length, and number shapes live in
`layouts/_partials/validate.html`. Domain resolvers may add narrower checks,
but they preserve the same warning/fallback contract.

## Safety boundary {#safety-boundary}

Continuing a build never means continuing with unsafe output. A rejected CSS
length falls back before it reaches a style attribute. An incomplete remote
service configuration omits the component before the browser can make a
request. An unsafe action URL is dropped. The protection is the absence of the
bad output, not the act of terminating Hugo.

Editing and publication share the warning and fallback behavior:

| Stage                                    | Invalid input                                                      |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `hugo server` or an ordinary local build | Warn, fall back or omit, keep other pages available                |
| CI, release validation, deployment       | Warn and fall back; review diagnostics and verify the output |

## Consequences {#consequences}

- Every fallback is part of the public contract and must match the default
  declared by the theme.
- When failure behavior changes to a fallback, update its tests. A negative
  test must check build success, warning text, and the rendered fallback or
  omission. A warning alone must not fail the Hugo build.
- Checkers must test rejected output directly. For example, a URL security
  test must confirm that the unsafe URL is absent. Any build failure alone
  is insufficient proof.
- Rendered markup checks verify the DOM, attributes, order, and emitted tokens,
  while the browser suite checks computed color, size, spacing, breakpoints,
  and interaction. When the public result is directly observable, a checker
  does not require exact Sass text.
- Source-level checks detect forbidden constructs such as `errorf` and
  structural requirements that output cannot prove, such as one authority,
  one resolver, or a deliberately restricted caller set.

## Verification {#verification}

The owning references are the
[architecture contract](/docs/design/architecture/#configuration-and-diagnostics),
`bin/check-params.py`, and production builds of both the theme fixture and this
integration site with Hugo Extended 0.168.0.

The warning policy was updated on 2026-10-18. Do not restore a warning-fatal
publication gate.
