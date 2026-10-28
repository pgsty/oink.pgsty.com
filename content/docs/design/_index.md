---
title: Design and development
linkTitle: Design
description: OINK's contracts, accepted decisions, dated research, and active proposals in one bilingual section.
weight: 70
icon: fa-solid fa-compass-drafting
no_list: true
search_keywords:
  [
    OINK design,
    maintainer contract,
    architecture,
    decision,
    research,
    proposal,
    PRD,
  ]
contract_status: v1.4.0
cascade:
  search_boost: 0.6
  categories: [Design]
---

> [!NOTE] OINK 1.4.0 contract
> The contracts in this section describe OINK v1.4.0.

This section explains how OINK works and why it has its present shape. It brings
together current contracts, the reasoning behind accepted decisions, evidence
from alternative designs, and ideas that remain proposals. The other guides on
this site explain how to build and maintain a site with OINK.

## Reading this section {#reading-this-section}

| Layer     | Meaning                                                              |
| --------- | -------------------------------------------------------------------- |
| Contracts | Normative behavior that compatible implementations must preserve     |
| Decisions | Accepted rationale and boundaries that explain current behavior      |
| Research  | Dated, non-normative evidence that may need to be refreshed          |
| Proposals | Draft PRDs and RFCs; publication here is not proof of implementation |

## Contract map {#contract-map}

| Contract                                      | Authority                                                                                            |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [Architecture](/docs/design/architecture/)    | Build, configuration, diagnostics, localization, featured images, output, security, accessibility, and performance |
| [Components](/docs/design/components/)        | Component API, Book and release primitives, validation, and output degradation                       |
| [Shell and navigation](/docs/design/shell/)   | Navigation, search, blog presentation, actions, taxonomies, and page-end composition                 |
| [Landing pages](/docs/design/landing/)        | Landing data, the 22-section registry, runtime, accessibility, and outputs                           |
| [Migration boundary](/docs/design/migration/) | Supported 0.4-to-current content and configuration migrations                                        |

## Design records {#design-records}

| Collection                           | Contents                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| [Decisions](/docs/design/decisions/) | Accepted diagnostic, configuration, authoring, Expo, and CLI rationale                       |
| [Research](/docs/design/research/)   | Goldmark probes, consumer evidence, CLI acceptance, and October theme reviews                             |
| [Proposals](/docs/design/proposals/) | Active PRDs for knowledge graphs, media convergence, visual presets, and the CLI roadmap |

Create each new OINK PRD or RFC as an English and Chinese page pair under
`content/docs/design/proposals/`. Do not create another repository-local
`plan/`, `plans/`, or `proposal/` tree. After acceptance, update the
implementation, its checker, and the applicable contract, then record the
accepted rationale under Decisions. Retire the draft from active use while
preserving it in Git history and the changelog.

## Expo contract {#expo-contract}

The [Expo contract](/docs/design/expo/) describes the image-album layout
introduced in OINK 1.3.0. Its [accepted decision](/docs/design/decisions/expo/) records the
content model and the revisions to the earlier Muse experiment. The
[authoring guide](/docs/write/expo/) explains album setup and viewer controls.
The contract, accepted decision, and authoring guide describe the same
released content model and controls.

## Authority and maintenance {#authority-and-maintenance}

This directory owns the English and Chinese design text for maintainers; the
theme repository owns the executable facts. Within the theme, `hugo.yaml`
defines published defaults, while each resolver and checker defines the input
shapes it accepts. `layouts/` and `assets/` define rendered behavior, and check
scripts with `tests/goldens/` define validation. `VENDOR.json` records bundled
versions, licenses, files, and checksums.

When public behavior changes, update the implementation, its checker, and both
language versions of the applicable contract in the same delivery.
Tests should check behavior and output without requiring exact prose.
