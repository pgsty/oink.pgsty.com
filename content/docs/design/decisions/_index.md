---
title: Design decisions
linkTitle: Decisions
description: Accepted choices that explain why OINK's public contracts and implementation have their present shape.
weight: 60
icon: fa-solid fa-gavel
no_list: true
search_keywords: [design decision, ADR, rationale, accepted, maintainer]
design_kind: decision-index
design_status: active
---

> [!NOTE] Accepted rationale
> A decision explains why OINK chose one compatible design over another. The
> five contracts above it remain the normative description of current
> behaviour; implementation and owning checkers remain the executable facts.

OINK used to keep reviews, PRDs, and execution notes in a local `plan/`
directory. That made useful reasoning hard to discover and allowed abandoned
designs to look authoritative. Accepted reasoning now lives here, in the same
bilingual, versioned site as the contracts it supports.

## Decision map {#decision-map}

| Decision                                                           | What it settles                                                                                          |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [Warnings and safe fallbacks](/docs/design/decisions/diagnostics/) | Why ordinary preview survives invalid input while publication remains strict                             |
| [Configuration model](/docs/design/decisions/configuration/)       | Where configuration belongs, how pages override it, and why OINK has no parallel configuration namespace |
| [Markdown-first authoring](/docs/design/decisions/authoring/)      | Why native Markdown is preferred and Docs, Blog, Book, and Landing extend shared systems                 |

## Record format {#record-format}

An accepted decision records context, the choice, consequences, and the proof
that makes the choice current. It does not reproduce a parameter reference or
a tutorial. Every decision links to its owning contract and verification
surface, and its English and Simplified Chinese pages change together.

When a decision changes, update the implementation, checker, affected
contract, and decision record in one delivery. Preserve the old answer in Git
history and the release changelog instead of leaving two active answers in the
navigation tree.

## Related {#related}

- [Design contracts](/docs/design/) — current normative behaviour
- [Research](/docs/design/research/) — dated evidence that informs decisions
- [Proposals](/docs/design/proposals/) — ideas that have not been accepted
