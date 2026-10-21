---
title: Configuration model
linkTitle: Configuration
description: Hugo and Docsy-compatible configuration, with a narrow OINK interface and no parallel configuration namespace or global resolver.
weight: 20
icon: fa-solid fa-sliders
search_keywords:
  [configuration model, params.ui, front matter, defaults, resolver]
design_kind: decision
design_status: accepted
decision_date: 2026-08-20
---

> [!IMPORTANT] Decision
> OINK retains Hugo's native keys and useful Docsy-compatible keys.
> Theme presentation and behavior use `params.ui.*`. A page override uses
> the matching top-level front-matter key. OINK does not add a `params.oink.*`
> tree or a second registry for Hugo configuration.

## Context {#context}

OINK extends existing configuration with shells, content output, and local
interaction. Earlier designs attempted to move all theme-owned keys to a new
namespace and resolve a complete configuration dictionary for each page.
That approach added a second configuration language beside Hugo's keys,
complicated section cascades, and required a large migration for limited
behavior changes.

The current model defines these responsibilities:

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
3. If a scalar describes the complete policy, use it for a boolean feature.
   Use a map only when a feature has subordinate settings. An established
   map may accept a boolean shorthand.
4. Use positive, snake_case names grouped by function. Closely related settings
   share a prefix without requiring another nested resolver.
5. Declare theme defaults in the theme's `hugo.yaml`. Templates may derive a
   default only when one static value would remove a deliberate distinction
   between shells.
6. Each feature family owns its normalization and validation, using a shared
   helper for common shapes. There is no global compatibility registry that
   silently rewrites arbitrary old keys.

The complete current key list, types, and defaults are in the
[configuration reference](/docs/customize/config/). This decision records the
placement rules rather than maintaining a second parameter catalog.

## Compatibility {#compatibility}

For each public rename, the owning resolver gives a targeted warning, supported
by a migration note and a negative test.
Removed or misspelled keys do not require a permanent alias layer.
If a rename would break the native API, retain Hugo and third-party camelCase
keys. OINK-owned additions use snake_case.

Hugo's ordinary front-matter and cascade model resolves page values. OINK does
not ask authors to build a nested `ui:` tree in front matter or promise to merge
arbitrary nested page maps.

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

`bin/check-params.py` checks declared defaults, page aliases, warning behavior,
and the no-`errorf` requirement. The integration site's bilingual and
rendered-link suites check the public reference and its Chinese peer.
