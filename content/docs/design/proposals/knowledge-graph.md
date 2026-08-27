---
title: Backlinks and knowledge graph
linkTitle: Knowledge graph
description: A draft three-stage design for deriving backlinks and local or global graph views from ordinary Hugo links.
weight: 10
icon: fa-solid fa-diagram-project
search_keywords: [backlinks, knowledge graph, link index, graph.json, ECharts]
design_kind: proposal
design_status: accepted
proposal_date: 2026-08-19
---

> [!IMPORTANT] G1 implemented; G2/G3 remain draft
> On 2026-08-27 every G1 open decision was resolved and G1 (static backlinks)
> was accepted. It is implemented on the theme's main branch and ships with
> OINK 0.8.0. The local and global graphs (G2/G3) stay draft pending real-world
> evidence from G1; their names and configuration are not public API until
> accepted.

## Premise {#premise}

Reverse navigation and a view of connected pages are properties of the link
graph, not of `[[wikilink]]` spelling. Hugo already accepts ordinary Markdown
links and `ref` / `relref`. OINK can derive a graph from content authors already
write, without adding a parser, Goldmark extension, or parallel authoring
syntax.

The first value is backlinks, not visualization. A static inbound-link list is
useful without JavaScript and can degrade into print and Markdown. An
interactive graph remains an optional enhancement over that complete list.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- derive one language-local link index per build;
- show deterministic inbound links on a page;
- optionally show a bounded local neighbourhood;
- optionally publish a whole-site view and a machine-readable graph;
- preserve ordinary preview when an edited link is stale or incomplete.

Non-goals:

- introducing `[[wikilink]]` syntax;
- indexing external, `mailto:`, same-page anchor, or self links;
- executing JavaScript to discover links already present in content;
- turning a visualization into the only way to navigate;
- promising perfect extraction from arbitrary shortcode parameters or raw HTML.

## Delivery stages {#delivery-stages}

| Stage | Deliverable                                 | Runtime                                     | Independent value                                 |
| ----- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------------- |
| G1    | Language-local link index and backlink list | None                                        | Reverse navigation in HTML, Print, and Markdown   |
| G2    | Local graph around the current page         | Existing ECharts plus a small local runtime | Spatial view with G1 as the accessible fallback   |
| G3    | Global graph page and graph data output     | Same runtime                                | Whole-site exploration and machine-readable edges |

Each stage is accepted separately. G1 does not wait for G2, and G2 does not
force every page to load graph code.

## Extraction contract {#extraction-contract}

The proposed index scans source content once per language and records one edge
per source/target pair. It strips fenced code and inline code before extracting
ordinary Markdown links and `ref` / `relref`; then it resolves only internal
pages, removes fragments for page identity, drops self-links, and deduplicates
repeated references.

The implementation must test at least:

- duplicate links collapse to one edge;
- fenced and inline code produce no edge;
- external, protocol-relative, mail, same-page anchor, and self links are
  excluded;
- `ref` and `relref` are included;
- each language produces an independent graph;
- an unresolved derived edge warns or is reported by the focused checker
  without making ordinary `hugo server` unusable.

Raw source scanning has known omissions. A URL stored in a custom shortcode
parameter or raw `<a href>` may not appear. Those omissions must be documented
instead of hidden behind a claim of a complete semantic graph.

## Backlink output {#backlink-output}

G1 renders a short, ordered list in the page-end composition, after the page
annotation and before the pager: the reader sees where the page came from, then
what points at it, then moves on. The switch is the site key
`params.ui.backlinks` (bare boolean, default off); a page overrides it with the
prefix-free front matter key `backlinks`, and a section can cascade it. Order
is deterministic: the stable page path — language-independent, naturally
grouped with navigation, and needing no second ordering authority. The block
uses ordinary links and headings, has no disclosure-only content, and is
omitted when there are no inbound pages.

Unresolvable derived edges are dropped silently and recorded as a known gap:
G1 is a local navigation enhancement, not a link checker, and having it report
broken links for the site would only duplicate warnings.

Print and Markdown keep the readable list. RSS omits it unless feed-level
research demonstrates that backlinks improve an article feed rather than
creating noisy site navigation.

## Interactive graph boundary {#interactive-graph-boundary}

G2 reuses the locally vendored ECharts graph series. The current page is the
centre; direct inbound and outbound neighbours form the default depth. A hard
node cap prevents unreadable or expensive views. Keyboard focus, text
alternatives, reduced motion, forced colours, narrow screens, and print are
acceptance requirements, not later polish.

If JavaScript or ECharts is unavailable, G1 remains complete and visible. The
runtime is loaded only on pages that render a graph and must join the existing
feature-bundle key so unlike pages cannot collide in the asset cache.

## Global output {#global-output}

G3 may add a dedicated graph page and an opt-in JSON output. The JSON schema
would contain a version, language, nodes, and directed edges with stable URLs;
it would not expose local file paths or unpublished pages. The output must be
derived from the same index as G1 and G2 so three representations cannot drift.

## Compatibility and migration {#compatibility-and-migration}

Ordinary Markdown remains unchanged, so content migration is unnecessary.
Configuration names remain undecided until a prototype proves the smallest
surface. The default for every interactive or global output is off; a static
backlink list may be considered separately because it is local navigation with
no network or browser state.

## Acceptance criteria {#acceptance-criteria}

Acceptance requires a focused graph checker, extraction fixtures, HTML/Print/
Markdown goldens, strict-build negative cases, browser accessibility and
responsive tests, and a real bilingual-site build. Performance is measured on
a representative large site, but a dated prototype timing is not a permanent
budget.

## Open decisions {#open-decisions}

Every G1 question is resolved (see the decision log). Still open, and owned by
G2/G3:

1. Does the local graph expose one depth or a tightly capped second depth?
2. Which page metadata, if any, is useful enough to enter graph JSON?
3. Is G3 useful enough to justify a new output format before G1 and G2 have
   production evidence?

## Decision log {#decision-log}

- 2026-08-19: Drafted the three-stage design.
- 2026-08-27: Resolved and accepted G1, scheduled for OINK 0.8.0. G1 is
  opt-in: the site key `params.ui.backlinks` is a bare boolean defaulting to
  off, pages override with `backlinks`, and no shell-type gating — policy
  belongs to the site and the page, not the shell. Ordering simplifies to a
  single stable-page-path sort, dropping the section → weight → title chain:
  one deterministic authority is enough for reverse navigation, and a
  multi-level sort would be a second navigation authority. Unresolvable edges
  drop silently and are recorded as a known gap, never warned. G2/G3 and the
  graph data output keep waiting for production evidence.
