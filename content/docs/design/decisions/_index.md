---
title: Design decisions
linkTitle: Decisions
description: Accepted decisions that explain why OINK's current contracts and implementation have their present shape.
weight: 60
icon: fa-solid fa-gavel
no_list: true
search_keywords: [design decision, ADR, rationale, accepted, maintainer]
design_kind: decision-index
design_status: active
---

> [!NOTE] Accepted rationale
> A decision explains why OINK selected one compatible design instead of another.
> The five contracts define the required current behavior. The implementation
> and its checkers define the executable facts.

OINK previously kept reviews, PRDs, and execution notes in a local `plan/`
directory, which made useful reasoning hard to find and allowed abandoned
designs to appear authoritative. Accepted rationale now lives here, beside the
contracts it supports, in the same bilingual, versioned site.

## Decision map {#decision-map}

| Decision                                                           | What it settles                                                                                          |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| [Warnings and safe fallbacks](/docs/design/decisions/diagnostics/) | Why ordinary preview survives invalid input while publication remains strict                             |
| [Configuration model](/docs/design/decisions/configuration/)       | Where configuration belongs, how pages override it, and why OINK has no parallel configuration namespace |
| [Markdown-first authoring](/docs/design/decisions/authoring/)      | Why native Markdown is preferred and Docs, Blog, Book, and Landing extend shared systems                 |
| [Generated configuration schema](/docs/design/decisions/config-schema/) | Why the editor schemas are a generated projection, and how the drift gate keeps a third configuration authority from appearing |
| [Optional CLI and result contract](/docs/design/decisions/cli/) | Independent Go executable, versioned diagnostics, coverage, and explicit write boundaries for the local CLI candidate |
| [Visual presets](/docs/design/decisions/visual-presets/) | Paper default, Slate compatibility, opt-in Appearance menu, independent mode and font boundaries |
| [Expo albums](/docs/design/decisions/expo/) | Resource bundles, optional metadata, shared appearance, and album viewing |
| [Blog gallery](/docs/design/decisions/blog-gallery/) | Article covers, shared Expo geometry, independent preferences, and readable captions |

## Record format {#record-format}

An accepted decision records its context, choice, consequences, and evidence
that the choice remains current. It does not repeat a parameter reference or
tutorial. Each decision links to its contract and verification checks, and its
English and Simplified Chinese pages change together.

When a decision changes, update the implementation, checker, affected contract,
and decision record in one delivery. Preserve the previous decision in Git
history and the release changelog rather than leaving two active answers in the
navigation tree.

## Related {#related}

- [Design contracts](/docs/design/) — current required behavior
- [Research](/docs/design/research/) — dated evidence that informs decisions
- [Proposals](/docs/design/proposals/) — ideas that have not been accepted
