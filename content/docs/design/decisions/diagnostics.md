---
title: Warnings and safe fallbacks
linkTitle: Diagnostics
description: Invalid author input warns and degrades safely during preview; --panicOnWarning restores a hard publication gate.
weight: 10
icon: fa-solid fa-triangle-exclamation
search_keywords:
  [warnf, errorf, panicOnWarning, validation, fallback, hugo server]
design_kind: decision
design_status: accepted
decision_date: 2026-08-19
---

> [!IMPORTANT] Decision
> OINK does not call Hugo's `errorf`. Invalid author or site input emits a
> warning and either uses a documented safe fallback or omits the invalid
> fragment. Release and deployment builds use `--panicOnWarning`, so the same
> warning remains a hard publishing failure.

## Context {#context}

Hugo builds the whole site as one transaction. An `errorf` raised while one
page is being edited makes every URL served by that rebuild return an error,
including unrelated pages and the home page. The server process survives and
recovers after the input is fixed, but collaborative preview is unavailable in
the meantime.

A warning has a different development cost. The affected value can fall back,
the rest of the site remains inspectable, and the author receives a precise
message. A publication build still fails because OINK's CI and integration
gates add `--panicOnWarning`.

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

This also separates editing from publication cleanly:

| Stage                                    | Invalid input                                                      |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `hugo server` or an ordinary local build | Warn, fall back or omit, keep other pages available                |
| CI, release validation, deployment       | The same warning becomes a non-zero build under `--panicOnWarning` |

## Consequences {#consequences}

- Every fallback is part of the public contract and must match the default
  declared by the theme.
- A change from failure to fallback also changes its tests. A negative test
  proves ordinary build survival, the warning text, the rendered fallback, and
  strict-build failure.
- Checkers must test the rejected output directly. A URL security test, for
  example, asserts that the unsafe URL is absent instead of treating any build
  failure as sufficient proof.
- The source-level parameter checker protects the invariant that theme layouts
  contain no `errorf` calls.

## Verification {#verification}

The owning references are the
[architecture contract](/docs/design/architecture/#configuration-and-diagnostics),
`bin/check-params.py`, and strict builds of both the theme fixture and this
integration site.
