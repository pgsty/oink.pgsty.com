---
title: Generated configuration schema
linkTitle: Config schema
description: Editor schemas generated from existing configuration sources, with a CI gate that prevents drift.
weight: 40
icon: fa-solid fa-list-check
search_keywords: [JSON Schema, configuration, front matter, editor completion, yaml-language-server, drift gate]
design_kind: decision
design_status: accepted
decision_date: 2026-08-24
---

> [!IMPORTANT] Decision
> `bin/generate-config-schema.py` generates the two JSON Schemas under `schema/`.
> It reads the theme's `hugo.yaml` and the template read-point scan.
> CI rejects manual schema changes. The schemas are read-only projections
> of the existing configuration authorities. They are not a third authority.

## Context {#context}

The theme already has two configuration authorities: `hugo.yaml` declares each
default beside an explanatory comment, and the read-point scan in
`check-params.py` identifies each key that the templates consume. Editors do
not read either source, so authors have to enter `params.ui.*` keys and front
matter from memory.

A JSON Schema gives editors completion and hover documentation, but a manually
maintained schema can become a third authority that drifts from the
implementation. Incorrect completion can cause more problems than no
completion, so the schema must follow the existing sources.

## Decision {#decision}

`bin/generate-config-schema.py` generates two files under `schema/`.
`site-params.schema.json` validates a site's `hugo.yaml`, taking types and
defaults from the theme's own `hugo.yaml` and descriptions from its comment
blocks. `front-matter.schema.json` validates page front matter and includes each
key that the templates read as an authoring input, with descriptions from the
matching site key. The generator excludes, by name, keys read only to warn about
a rename or removal.

Two deliberate restraints are part of the decision:

- The front-matter schema has **no type constraints**. Several keys accept a
  bare-boolean opt-out in addition to their site type (`share: false`,
  `theme_color: false`). An incorrect editor warning for valid input would be
  worse than no warning.
- The `hugo.yaml` reader parses only the shapes that the file uses: nested
  maps, scalars, and inline lists. If the parser cannot read an input, it fails.
  The drift gate then fails instead of generating an incorrect schema.

The parameter checker identifies maps with documented boolean shorthand.
The generated site schema preserves both boolean and object forms for those
maps, including `ui.dark_mode`; pure configuration maps such as `print` and
`ui.expo` remain objects. Front-matter read points such as `feedback.enable`
produce nested properties under `feedback`, never literal dotted keys. Those
properties do not exclude the supported boolean page override.

## Consequences {#consequences}

To change a schema, change `hugo.yaml` or the templates that the scan reads.
When public configuration changes, regenerate the schemas in the same commit.
Maintainers do not need a second parameter inventory, but the generator and
read-point scan constrain the public configuration surface: a new parameter
key must use a shape they understand, or CI fails.

## Verification {#verification}

`python3 bin/generate-config-schema.py --check` regenerates schemas in memory
and fails if `schema/` is stale or missing. Theme CI runs this check with the
parameter contract checker. Editor configuration and schema behavior are
documented normatively in [Configuration](/docs/customize/config/#editor-schema).

Visual preset enum values are also derived from `preset-config.html`. The
`preset_menu` union accepts a boolean or a list of those resolver-owned values;
the schema does not maintain its own list.
