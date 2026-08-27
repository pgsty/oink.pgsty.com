---
title: Design proposals and PRDs
linkTitle: Proposals
description: The canonical bilingual home for OINK PRDs and designs that are still being evaluated.
weight: 80
icon: fa-solid fa-compass-drafting
no_list: true
search_keywords: [proposal, PRD, design draft, roadmap, RFC]
design_kind: proposal-index
design_status: active
---

> [!WARNING] Non-normative material
> A proposal describes behaviour that may not exist. Current behaviour is
> defined by the contracts, accepted decisions, implementation, and owning
> checkers. Never use a proposal as a configuration reference.

This section is the canonical home for OINK product requirement documents,
RFC-style designs, and unresolved maintainer proposals. Do not create a local
`plan/`, `plans/`, `proposal/`, or parallel design tree in the theme repository
or the documentation repository.

## Active proposals {#active-proposals}

| Proposal                                                                 | Current boundary                                                                                                     |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [Backlinks and knowledge graph](/docs/design/proposals/knowledge-graph/) | Draft; no graph or backlink implementation exists                                                                    |
| [Media convergence](/docs/design/proposals/media-convergence/)           | Partially implemented; the media-result contract and Landing resource metadata shipped, M3 resolved for native-image processing, retirement (M4) open |
| [Bulk agent indexes](/docs/design/proposals/agent-indexes/)              | Draft; per-page Markdown and `llms.txt` already exist, while bulk text and navigation JSON do not                    |
| [Book publication pipeline](/docs/design/proposals/book-publication/)    | Manifest and EPUB/PDF tooling are released — see [Architecture](/docs/design/architecture/); only consumer migration is still open here |

The generated-configuration-schema proposal has been retired through the
lifecycle: the behaviour is documented normatively in
[Configuration](/docs/customize/config/#editor-schema), the long-lived
rationale moved to the
[generated configuration schema decision](/docs/design/decisions/config-schema/),
and the draft text is preserved by Git history.

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

Large experiments may add a dated page under
[`../research/`](/docs/design/research/), but temporary logs and generated
artifacts stay outside Hugo content and outside Git.

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

Acceptance does not turn the PRD into a second contract. Move stable behaviour
into the owning contract, stable rationale into Decisions, and user steps into
the relevant guide. Then retire the proposal from active navigation. A local
build, commit, tag, public module, consumer pin, and deployment remain separate
completion states.

## Review gate {#review-gate}

Before implementation, reviewers confirm that the proposal does not duplicate
an existing shell, resolver, component family, or data authority. During
implementation, a changed design updates this bilingual proposal before code
silently diverges. Acceptance requires the narrow theme checker, the real
documentation site, rendered EN/ZH, relevant outputs, accessibility, and
responsive review.
