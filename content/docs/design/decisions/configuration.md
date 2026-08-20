---
title: Configuration model
linkTitle: Configuration
description: OINK extends Hugo and Docsy-compatible configuration without creating a second namespace or a parallel global resolver.
weight: 20
icon: fa-solid fa-sliders
search_keywords:
  [configuration model, params.ui, front matter, defaults, resolver]
design_kind: decision
design_status: accepted
decision_date: 2026-08-20
---

> [!IMPORTANT] Decision
> OINK keeps Hugo's native keys and useful Docsy-compatible keys in place,
> places theme presentation and behaviour under `params.ui.*`, and exposes a
> matching top-level front-matter key for a page override. It does not add a
> `params.oink.*` tree or a registry that shadows Hugo's configuration model.

## Context {#context}

OINK inherits a mature configuration surface and adds shells, content output,
and local interaction. Earlier designs attempted to move every theme-owned key
under a new namespace and resolve a complete configuration dictionary once per
page. That produced a second language beside Hugo's own keys, complicated
section cascades, and made migration larger than the behaviour it was meant to
control.

The current model keeps ownership visible instead:

| Layer                       | Responsibility                                                         | Examples                                                         |
| --------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Hugo                        | Site identity, languages, menus, outputs, taxonomies, markup, modules  | `baseURL`, `languages`, `outputs`                                |
| Site facts and integrations | Repository, version, author, local search, comments, external services | `params.github_repo`, `params.version`, `params.comments`        |
| OINK interface              | Shell, navigation, presentation, and local interaction                 | `params.ui.sidebar_*`, `params.ui.typography`, `params.ui.share` |
| Page or section             | A narrow override of an eligible site default                          | `sidebar_enabled`, `featured_image`, `share`                     |
| Data files                  | Structured facts and ordered content that are not switches             | `data/landing`, `data/download`, `data/docs_nav.json`            |

## Decision {#decision}

The configuration API follows these rules:

1. Site facts remain at the established top level. Interface choices belong
   under `params.ui.*`.
2. A page override drops the `ui.` prefix and otherwise keeps the same name.
   A section `cascade` can apply that top-level key to its descendants.
3. Boolean features use a scalar where that is the complete policy. A map is
   reserved for features with real subordinate settings; an established map
   may accept a boolean shorthand.
4. Names are positive, snake_case, and grouped by function. Closely related
   settings share a prefix instead of growing another nested resolver.
5. Theme defaults are declared in the theme's `hugo.yaml`. Templates may add a
   derived default only when one static value would erase a deliberate
   shell-specific distinction.
6. Each feature family owns its normalization and validation. A shared helper
   supplies common shapes, but there is no global compatibility registry that
   silently rewrites arbitrary old keys.

The complete current key list, types, and defaults live in the
[configuration reference](/docs/customize/config/). This decision records the
placement rules; it is not a second parameter catalogue.

## Compatibility {#compatibility}

Public renames receive a targeted warning from the owning resolver, a migration
note, and a negative test. Removed or misspelled keys do not justify a permanent
alias layer. Hugo and third-party camelCase keys remain camelCase where changing
them would break their native API; OINK-owned additions use snake_case.

Page values resolve through Hugo's ordinary front-matter and cascade model.
OINK does not ask authors to put a nested `ui:` tree in front matter and does
not promise to merge arbitrary nested page maps.

## Consequences {#consequences}

- Adding a public setting requires a declared default or an explicitly derived
  default, an owning resolver, documentation, and a positive and negative test.
- Configuration guides link to the one reference table instead of repeating
  types and defaults.
- A new data structure is justified by ordered or repeated facts, not merely
  by a desire to avoid adding a parameter.
- Invalid scalar values follow the
  [warning and fallback decision](/docs/design/decisions/diagnostics/).

## Verification {#verification}

`bin/check-params.py` audits declared defaults, page aliases, warning
behaviour, and the no-`errorf` invariant. The public reference and its Chinese
peer are checked in the integration site's bilingual and rendered-link suites.
