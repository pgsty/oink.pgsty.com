---
title: Backlinks and knowledge graph
linkTitle: Knowledge graph
description: A draft three-stage design to generate backlinks and local or global graph views from ordinary Hugo links.
weight: 10
icon: fa-solid fa-diagram-project
search_keywords: [backlinks, knowledge graph, link index, graph.json, ECharts]
design_kind: proposal
design_status: accepted
proposal_date: 2026-08-19
---

> [!IMPORTANT] G1 implemented; G2/G3 remain draft
> On 2026-08-27, all G1 open decisions were resolved and G1 (static backlinks)
> was accepted. The theme's main branch implements G1, which is included in
> OINK 0.8.0. The local and global graphs (G2/G3) remain drafts until G1
> supplies real-world evidence. Their names and configuration are not public
> API until acceptance.

## Premise {#premise}

Reverse navigation and a view of connected pages come from the link graph,
independently of `[[wikilink]]` syntax. Hugo already accepts ordinary Markdown
links and `ref` / `relref`, so OINK can derive a graph from content authors
already write, without another parser, Goldmark extension, or authoring syntax.

The first value is backlinks, not visualization. A static inbound-link list is
useful without JavaScript and remains readable in print and Markdown, making
an interactive graph an optional enhancement to an already complete list.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- derive one language-local link index per build;
- show deterministic inbound links on a page;
- optionally show a bounded local neighborhood;
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

Each stage requires separate acceptance. G1 does not depend on G2.
G2 does not require every page to load graph code.

## Extraction contract {#extraction-contract}

The proposed index scans source content once per language and records one edge
per source/target pair. After removing fenced code and inline code, it extracts
ordinary Markdown links and `ref` / `relref`, resolves internal pages, and
removes fragments for page identity. Self-links are excluded, and repeated
references produce only one edge.

The implementation must test at least:

- duplicate links collapse to one edge;
- fenced and inline code produce no edge;
- external, protocol-relative, mail, same-page anchor, and self links are
  excluded;
- `ref` and `relref` are included;
- each language produces an independent graph;
- an unresolved derived edge warns or is reported by the focused checker
  without making ordinary `hugo server` unusable.

Raw source scanning has known omissions: it may miss a URL in a custom
shortcode parameter or raw `<a href>`. These omissions must be documented
rather than hidden behind a claim of a complete semantic graph.

## Backlink output {#backlink-output}

G1 renders an aside group in the right rail beside the table of contents and
taxonomy clouds, placing what points to this page beside what is on this page.
The group is expanded by default and shows the first eight entries, with the
rest behind a native disclosure so a heavily referenced page cannot occupy the
entire rail.
The site key `params.ui.backlinks` is a bare boolean, off by default.
A page overrides it with the prefix-free front matter key `backlinks`, which
a section can cascade. Entries sort by stable page path: a language-independent
order that naturally groups related paths without a second ordering authority.
The group uses ordinary links and is omitted when there are no inbound pages.

G1 silently removes derived edges that it cannot resolve. This is a documented
limitation of its role as a local navigation enhancement: site-wide broken-link
reports would duplicate existing warnings.

Print and Markdown retain the readable list. RSS omits the list unless
feed-level research shows that backlinks improve article feeds without adding
unnecessary site navigation.

## Interactive graph boundary {#interactive-graph-boundary}

G2 uses the locally vendored ECharts graph series, with the current page at the
center and its direct inbound and outbound neighbors forming the default depth.
A hard node limit prevents unreadable or expensive views. Keyboard focus, text
alternatives, reduced motion, forced colors, narrow screens, and print are
acceptance requirements rather than later polish.

If JavaScript or ECharts is unavailable, G1 remains complete and visible.
Only pages that render a graph load the runtime. The runtime must use the
existing feature-bundle key to prevent asset-cache collisions between pages
with different features.

## Global output {#global-output}

G3 may add a dedicated graph page and an opt-in JSON output. The proposed JSON
schema contains a version, language, nodes, and directed edges with stable URLs.
It would not expose local file paths or unpublished pages. Generate this output
from the same index as G1 and G2 so all three representations remain consistent.

## Compatibility and migration {#compatibility-and-migration}

Ordinary Markdown remains unchanged and needs no content migration.
Configuration names remain undecided until a prototype proves the minimum
required surface. Every interactive or global output is off by default.
A static backlink list may be considered separately because it supports local
navigation without network access or browser state.

## Acceptance criteria {#acceptance-criteria}

Acceptance requires a focused graph checker, extraction fixtures, and
HTML/Print/Markdown goldens. It also requires strict-build negative cases,
browser accessibility and responsive tests, and a real bilingual-site build.
Measure performance on a representative large site. A dated prototype timing
does not establish a permanent performance budget.

## Open decisions {#open-decisions}

All G1 questions are resolved (see the decision log). G2/G3 must resolve these
remaining questions:

1. Does the local graph expose one depth or a tightly capped second depth?
2. Which page metadata, if any, is useful enough to enter graph JSON?
3. Is G3 useful enough to justify a new output format before G1 and G2 have
   production evidence?

## Decision log {#decision-log}

- 2026-08-19: Drafted the three-stage design.
- 2026-08-27: Resolved and accepted G1, scheduled for OINK 0.8.0. G1 is opt-in:
  the site key `params.ui.backlinks` is a bare boolean, off by default, and pages
  override it with `backlinks`. Shell types do not restrict this policy because
  it belongs to the site and page. A single stable-page-path sort replaces the
  section → weight → title chain: one deterministic authority is enough for
  reverse navigation, while a multi-level sort would introduce a second
  navigation authority.
  Unresolvable edges are silently removed, without warnings, as a documented
  limitation. G2/G3 and graph data output still require production evidence.
- 2026-08-27: Design review moved the block from the page end to the right rail.
  Backlinks are page metadata and belong beside the table of contents, while
  the page end is the reader's completion zone: share, feedback, provenance,
  pager, and comments. The rail group limits visible entries to eight, with
  the rest behind a native disclosure.
