---
title: Bulk agent indexes
linkTitle: Agent indexes
description: Optional per-section full-text bundles and a stable navigation JSON, built on OINK's existing Markdown outputs and navigation authority.
weight: 30
icon: fa-solid fa-robot
search_keywords: [llms-full.txt, navigation JSON, agent outputs, machine-readable, LLMS]
design_kind: proposal
design_status: accepted
proposal_date: 2026-08-20
---

> [!IMPORTANT] Implemented; ships with OINK 0.8.0
> Accepted on 2026-08-27 after resolving every open decision. Both outputs --
> the per-top-level-section `LLMSFULL` bundles and the `NAVJSON` navigation
> tree at the language root -- are implemented on the theme's `main` branch and
> ship with OINK 0.8.0, after which this proposal retires; released behaviour is
> owned by the
> [Architecture contract](/docs/design/architecture/#outputs-and-runtime).
> OINK already shipped per-page Markdown, the in-language `llms.txt`, the HTML
> discovery link, and Copy Markdown; this page covers only the two new outputs.

## Current baseline {#current-baseline}

A site can enable Hugo's Markdown output for pages and sections, and the `LLMS` home output that
generates `llms.txt`. OINK renders shortcodes as semantic Markdown, keeps source URLs and the
in-language LLMS index discoverable, and Copy Markdown reads the same alternative output URL. The
theme declares output formats but never forces a site's `outputs` choice.

Navigation already has an authority chain: an explicit `data/docs_nav.json` tree when present,
otherwise the content tree and weights. The sidebar, the pager, and declared section indexes share
that authority. Machine navigation output must derive from the same tree rather than invent ordering.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- Optionally assemble an in-language full-text bundle for each explicitly enabled top-level section;
- Optionally publish a versioned navigation JSON for agents and external tools;
- Reuse the human site's page renderer, page-inclusion rules, and navigation authority;
- Keep every output opt-in through Hugo output configuration;
- Validate links, language isolation, media types, and deterministic order.

Non-goals:

- Replacing per-page Markdown or `llms.txt`;
- A new `params.oink.*` configuration tree;
- Scraping generated `public/` files during the Hugo build;
- Embedding private source paths, draft pages, or cross-language fallback;
- Promising that one giant full-text file fits every model context.

## Full-text bundle {#full-text-bundle}

The `llms-full.txt` output concatenates the same semantic Markdown used for per-page output, with a
stable, visible separator and source URL between pages. Version 1 implements per-top-level-section
bundles only: each top-level section that explicitly enables the format in its `_index` front matter
`outputs` gets one file per language. The whole-site single-file shape is deferred until real-site
evidence shows per-section bundling is not enough — a giant single file both outgrows model contexts
and couples every section's updates to one artifact.

Hugo output configuration decides which sections receive the format, never a theme parameter. The
theme ships a checker that reports mismatches between intent and actual output, but must not modify
the site's output set.

The bundle is assembled inside Hugo through the shared page-render partial; it never reads sibling
artifacts from `public/` and never depends on output build order. File size is reported as evidence;
no arbitrary threshold may let `--panicOnWarning` reject an otherwise legal publish.

## Navigation JSON {#navigation-json}

The navigation JSON is a home output beside `llms.txt`: one file per language at the language root.
It carries a schema version, the language, the root node, and recursive ordered nodes. Page nodes
carry a stable ID (the in-language permalink path), title, HTML URL, Markdown URL when enabled,
kind, and children — plus the description when one exists. Explicit external navigation nodes carry
only a label, a URL, and the external kind.

Nodes **do not serialize `weight`**: array order is the contract, weight is the private mechanism
that derives it, and publishing it would invite consumers to re-sort. The output follows the same
visibility and ordering rules as the rendered sidebar, excluding drafts, headless resources, hidden
navigation items, and pages unavailable in the current language, and never serializes local
filenames.

The format owns its JSON Schema (`schema/nav.v1.schema.json`, a hand-authored, versioned contract
artifact outside the generated configuration schema's drift gate) and golden fixtures, and is marked
`notAlternative` so Hugo never advertises it as a page-level alternate.

## Discovery and output boundaries {#discovery-and-output-boundaries}

`llms.txt` lists the enabled bundles and the navigation JSON by default — discovery belongs in the
index file; that is what it is for. The HTML head keeps discovering per-page Markdown and the
in-language LLMS index without stuffing every bulk artifact into every page.

Shortcodes, Landing sections, Book targets, and interactive components keep their current Markdown
degradation. The new outputs may not add component HTML, scripts, comments, feedback controls, or
navigation chrome.

## Compatibility and migration {#compatibility}

Both outputs default off; a site that does not enable them is byte-identical. Enabling is a
site-side Hugo `outputs` choice — no new `params` keys, no renames, no migration steps. Disabling an
output is a complete exit with no residue.

## Implementation and owning-checker plan {#implementation-plan}

1. Output formats: `LLMSFULL` (`text/plain`, `baseName: llms-full`, `notAlternative`, section
   level) and `NAVJSON` (`application/json`, `notAlternative`, home level), declared beside the
   existing `MARKDOWN`/`LLMS` definitions.
2. Templates: the section `llms-full` layout concatenates the shared per-page Markdown render
   partial in navigation order; the home navigation JSON layout walks the existing navigation
   authority partial rather than introducing a second tree traversal.
3. Owning checker: a new `bin/check-agent-indexes.py` validates, on the `tests/site` fixture,
   language isolation, link resolvability, sidebar-consistent order, schema compliance, and
   byte-stable rebuilds, and reports each bundle's bytes and page count (report only, no ceiling
   gate).
4. Goldens: the `check-goldens.py` matrix gains llms-full and navigation JSON fixtures.
5. Documentation: the site gains a bilingual agent-index guide; `llms.txt` discovery behaviour
   folds into the existing LLMS documentation; this proposal retires through the lifecycle.

## Acceptance criteria {#acceptance-criteria}

- EN and ZH outputs contain only their own language's pages and URLs.
- Every listed Markdown URL exists; every navigation URL resolves or is explicitly external.
- Order under the same root matches the rendered sidebar and pager.
- The navigation JSON validates against `schema/nav.v1.schema.json`.
- With a pinned Hugo version and inputs, rebuilding the same sources is byte-stable.
- With the new formats off, HTML, Markdown, Print, RSS, and LLMS goldens show no regression.
- A large-site fixture proves per-top-level-section bundling rather than a file for every nested
  section.

## Decision log {#decision-log}

- 2026-08-20: Drafted; the bundle listed whole-site and per-section shapes, and the navigation
  JSON's location was undecided.
- 2026-08-27: Resolved the five open decisions and accepted the proposal. Version 1 builds
  per-top-level-section bundles only, deferring the whole-site file until real evidence; the
  navigation JSON is a home output; schema v1 node metadata is the minimal set (stable ID, title,
  HTML URL, Markdown URL, kind, children, optional description) with `weight` never serialized;
  `llms.txt` lists both enabled artifacts by default; the checker reports size evidence without
  enforcing any model-context ceiling.
