---
title: Generated configuration schema
linkTitle: Config schema
description: JSON Schemas for site parameters and front matter, projected from the theme's existing configuration authorities for editor completion.
weight: 40
icon: fa-solid fa-list-check
search_keywords: [JSON Schema, configuration, front matter, editor completion, yaml-language-server]
design_kind: proposal
design_status: implemented
proposal_date: 2026-08-24
---

> [!IMPORTANT] Implemented with the same release train
> `bin/generate-config-schema.py` and the `schema/` artifacts described here
> ship on the theme's main branch, with the CI drift gate in place.

## Premise {#premise}

The theme already has two configuration authorities: `hugo.yaml`, which
declares every default beside a comment explaining it, and
`check-params.py`, whose read-point scan knows every key the templates
actually consume. Editors know neither, so authors type `params.ui.*` keys
and front matter from memory.

A JSON Schema gives editors completion and hover documentation. The danger is
the schema quietly becoming a third authority that drifts from the other two.
This design forbids that by construction: the schema is a generated
projection, and CI fails when the committed files differ from what the
authorities produce.

## Design {#design}

`bin/generate-config-schema.py` writes two files under `schema/`:

| File | Validates | Content |
| --- | --- | --- |
| `site-params.schema.json` | A site's `hugo.yaml` | The `params` tree: types and defaults from the theme's own `hugo.yaml`, descriptions from its comment blocks, kept maps typed as `boolean` or `object` for the bare-boolean shorthand, plus scan-discovered keys that carry no declared default |
| `front-matter.schema.json` | Page front matter | Every front matter key the templates read, with descriptions inherited from the matching site key |

Two deliberate restraints:

- The front-matter schema carries **no type constraints**. Several keys
  accept a bare-boolean opt-out beside their site type (`share: false`,
  `theme_color: false`); a wrong red squiggle under valid input would be
  worse than no squiggle at all.
- The `hugo.yaml` reader is a small parser for exactly the shapes that file
  uses -- nested maps, scalars, inline lists. Anything it cannot read is a
  hard error, so outgrowing it breaks the drift gate loudly instead of
  mis-generating.

## Drift gate {#drift-gate}

`python3 bin/generate-config-schema.py --check` regenerates in memory and
fails when `schema/` is stale or missing. The theme's CI runs it beside the
parameter contract checker. Editing a schema by hand therefore cannot
survive a pull request; the only way to change them is to change `hugo.yaml`
or the templates the scan reads.

## Editor use {#editor-use}

See [Configuration](/docs/customize/config/#editor-schema) for wiring the
schemas into VS Code's YAML language server.
