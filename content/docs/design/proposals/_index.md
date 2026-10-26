---
title: Design proposals and PRDs
linkTitle: Proposals
description: The canonical bilingual home for OINK PRDs and designs that remain under evaluation.
weight: 80
icon: fa-solid fa-compass-drafting
no_list: true
cascade:
  search_boost: 0.35
search_keywords: [proposal, PRD, design draft, roadmap, RFC]
design_kind: proposal-index
design_status: active
---

> [!WARNING] Non-normative material
> A proposal describes behavior that may not exist. The contracts, accepted
> decisions, implementation, and owning checkers define current behavior.
> Never use a proposal as a configuration reference.

This section contains the authoritative OINK product requirement documents,
RFC-style designs, and unresolved maintainer proposals. Do not create a local
`plan/`, `plans/`, `proposal/`, or parallel design tree in the theme repository
or the documentation repository.

## Active proposals {#active-proposals}

| Proposal                                                                 | Current boundary                                                                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [Backlinks and knowledge graph](/docs/design/proposals/knowledge-graph/) | G1 (static backlinks) is accepted, implemented on the theme's main branch, and ships with OINK 0.8.0; the local and global graphs (G2/G3) remain draft |
| [Media convergence](/docs/design/proposals/media-convergence/)           | Partially implemented; the media-result contract and Landing resource metadata shipped, M3 resolved for native-image processing, retirement (M4) open |
| [OINK CLI and the next product stage](/docs/design/proposals/oink-cli-roadmap/) | Independent Go repository and first-stage boundary accepted; local CLI candidate implemented, not publicly released; later theme, migration, adoption, versioning, OpenAPI, and platform stages remain proposals |
| [Visual presets and appearance switching](/docs/design/proposals/visual-presets/) | Paper/Slate ship in v1.2.0; Ink/Terminal ship as explicit opt-in experiments awaiting design acceptance; see the accepted decision and dated acceptance record |

Component refinement, unified diagram reading and local search refinement ship in 1.4.0 and now live under [accepted decisions](/docs/design/decisions/).

The table-reading draft is also retired: the [accepted decision](/docs/design/decisions/large-table-reading/)
and [component contract](/docs/design/components/#table-reading) define the narrower,
`.expand` behavior released in OINK 1.4.0.

The bulk agent-index proposal was retired after its outputs were released.
[Architecture](/docs/design/architecture/#outputs-and-runtime) defines the accepted
behavior. [Agent-ready output](/docs/customize/agents/) gives the user steps.
The Book publication proposal was retired after `BookManifest` and the
EPUB/PDF tools were released. The accepted behavior is documented in
[Architecture](/docs/design/architecture/#outputs-and-runtime) and
[Writing a book](/docs/write/book/#print); dated downstream adoption evidence
is recorded in [Consumer evidence](/docs/design/research/consumer-evidence/#publication-adoption).
Pending consumer adoption does not keep an upstream design proposal active.
Git history retains both proposal drafts.

The generated-configuration-schema proposal completed its lifecycle and was
retired: [Configuration](/docs/customize/config/#editor-schema) defines the
required behavior, the
[generated configuration schema decision](/docs/design/decisions/config-schema/)
records the accepted rationale, and Git history retains the draft text.

## CLI workspaces and adapters {#cli-maintenance-candidate}

Explicit workspaces and optional adapters remain in the current reduced CLI.
The [current contract](/docs/design/decisions/cli/#workspace-registry) defines the command boundary.
The dated R1–R8 and A18 record applies only to its historical source and binaries.
It does not qualify later command or output changes. The finite maintenance
roadmap remains retired from active navigation; no public CLI release or
deployment has been established.

## Where a new PRD goes {#where-a-new-prd-goes}

Create one English-primary page and its Simplified Chinese peer:

```text
content/docs/design/proposals/<slug>.md
content/docs/design/proposals/<slug>.zh.md
```

Use explicit, stable English heading IDs in both files. Keep code, keys, paths,
versions, and API names unchanged in Chinese. A proposal begins with visible
draft status and includes:

1. status, owner, date, and affected contract surface;
2. context and evidence;
3. goals and explicit non-goals;
4. proposed behaviour and output/accessibility/security boundaries;
5. compatibility and migration impact;
6. implementation and owning-checker plan;
7. acceptance criteria and open decisions;
8. a decision log for later changes to the proposal itself.

For a large experiment, you may add a dated page under
[`../research/`](/docs/design/research/). Keep temporary logs and generated
artifacts outside Hugo content and Git.

## Lifecycle {#lifecycle}

```text
draft proposal
    ├── rejected/superseded → remove from the active tree; preserve Git history
    └── accepted
          ├── implementation + owning checker
          ├── affected EN/ZH contract
          ├── accepted Design decision when rationale is durable
          └── changelog, migration, and user docs when their audiences need them
```

Acceptance does not make the PRD a second contract. Move accepted behavior
to the owning contract, stable rationale to Decisions, and user steps to the
applicable guide, then retire the proposal from active navigation.
A local build, commit, tag, public module, consumer pin, and deployment are
separate completion states.

## Review gate {#review-gate}

Before implementation, confirm that the proposal does not duplicate an existing
shell, resolver, component family, or data authority. If the design changes
during implementation, update this bilingual proposal before changing the code.
Acceptance requires the focused theme checker and the real documentation site.
It also requires rendered EN/ZH, applicable outputs, accessibility checks, and
responsive review.

## Read-only Studio candidate {#cli-studio-candidate}

Studio is removed from the current CLI on 2026-10-04. Use `oink dev`,
an ordinary editor, and structured `inspect`/`check` reports. The
[R7 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r7)
preserves historical acceptance of the earlier browser implementation.

## Reviewed editing {#cli-editing-candidate}

General source editing is removed from the current CLI. Guarded `new`,
`move`, review records, and baseline plans remain. Old editing plans are
rejected. The [R8 record](/docs/design/research/2026-10-03-cli-maintenance-acceptance/#r8)
remains historical evidence rather than the current command API.
