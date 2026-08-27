---
title: Generated configuration schema
linkTitle: Config schema
description: The editor schemas are projected from the existing configuration authorities; a CI drift gate keeps them from ever becoming a third one.
weight: 40
icon: fa-solid fa-list-check
search_keywords: [JSON Schema, configuration, front matter, editor completion, yaml-language-server, drift gate]
design_kind: decision
design_status: accepted
decision_date: 2026-08-24
---

> [!IMPORTANT] Decision
> The two JSON Schemas under `schema/` are projected by
> `bin/generate-config-schema.py` from the theme's `hugo.yaml` and the
> template read-point scan; hand edits cannot survive CI. The schema is a
> read-only projection of the existing authorities, never a third one.

## Context {#context}

The theme already has two configuration authorities: `hugo.yaml`, which
declares every default beside a comment explaining it, and
`check-params.py`, whose read-point scan knows every key the templates
actually consume. Editors know neither, so authors type `params.ui.*` keys
and front matter from memory.

A JSON Schema gives editors completion and hover documentation. The danger is
the schema quietly becoming a third authority that drifts from the other two.
A hand-maintained schema always ends up out of step with the implementation,
and stale completion is worse than none.

## Decision {#decision}

`bin/generate-config-schema.py` generates two files under `schema/`:
`site-params.schema.json` validates a site's `hugo.yaml` (types and defaults
from the theme's own `hugo.yaml`, descriptions from its comment blocks), and
`front-matter.schema.json` validates page front matter (every key the
templates read as authoring surface, descriptions inherited from the matching
site key). Keys read only to warn that they were renamed or removed are
excluded by name.

Two deliberate restraints are part of the decision:

- The front-matter schema carries **no type constraints**. Several keys
  accept a bare-boolean opt-out beside their site type (`share: false`,
  `theme_color: false`); a wrong red squiggle under valid input would be
  worse than no squiggle at all.
- The `hugo.yaml` reader is a small parser for exactly the shapes that file
  uses -- nested maps, scalars, inline lists. Anything it cannot read is a
  hard error, so outgrowing it breaks the drift gate loudly instead of
  mis-generating.

## Consequences {#consequences}

The only way to change a schema is to change `hugo.yaml` or the templates the
scan reads: when the public configuration surface moves, the schemas
regenerate in the same commit, and there is no second inventory anyone must
remember to maintain. The cost is that the generator and the read-point scan
become an implicit gate on the public surface -- a new parameter key must be
something they can understand, or CI fails outright.

## Verification {#verification}

`python3 bin/generate-config-schema.py --check` regenerates in memory and
fails when `schema/` is stale or missing; the theme's CI runs it beside the
parameter contract checker. Editor wiring and the behaviour itself are
documented normatively in [Configuration](/docs/customize/config/#editor-schema).
