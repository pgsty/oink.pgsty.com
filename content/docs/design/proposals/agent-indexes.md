---
title: Bulk agent indexes
linkTitle: Agent indexes
description: A draft for optional llms-full text bundles and a stable navigation JSON derived from OINK's existing Markdown output and navigation authority.
weight: 30
icon: fa-solid fa-robot
search_keywords:
  [llms-full.txt, navigation JSON, agent output, machine readable, LLMS]
design_kind: proposal
design_status: draft
proposal_date: 2026-08-20
---

> [!WARNING] Draft PRD — partial premise already exists
> OINK already supports per-page Markdown, language-local `llms.txt`, HTML
> discovery links, and Copy Markdown. It does not currently publish
> `llms-full.txt` or a navigation JSON. Only those remaining outputs are
> proposed here.

## Current baseline {#current-baseline}

A site opts into Hugo's Markdown output for pages and sections and the `LLMS`
home output for `llms.txt`. OINK renders shortcodes into semantic Markdown,
keeps the source URL and language-local LLMS index discoverable, and derives
Copy Markdown from the same alternative output URL. The theme declares output
formats but does not force a site's `outputs` selection.

Navigation already has an authority chain: an explicit `data/docs_nav.json`
tree where present, otherwise the content tree and weights. Sidebar, pager, and
declared section indexes share that authority. A machine navigation output must
derive from it rather than inventing another order.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- optionally assemble a language-local full-text bundle for small sites or one
  bundle per top-level section for larger sites;
- optionally publish a versioned navigation JSON for agents and external tools;
- reuse the same Markdown page renderer, page inclusion policy, and navigation
  authority as the human site;
- keep every output opt-in through Hugo's output configuration;
- validate links, language isolation, media types, and deterministic order.

Non-goals:

- replacing per-page Markdown or `llms.txt`;
- creating a `params.oink.*` configuration tree;
- scraping generated `public/` files during the Hugo build;
- embedding private source paths, draft pages, or cross-language fallbacks;
- promising that one giant bundle is appropriate for every model context.

## Full-text bundle {#full-text-bundle}

The proposed `llms-full.txt` output concatenates the same semantic Markdown
used by each page output. Pages are separated by a stable visible delimiter and
source URL. A site chooses one of two deployment shapes:

| Shape           | Placement                                              | Intended use               |
| --------------- | ------------------------------------------------------ | -------------------------- |
| Site bundle     | One language-local file at the language root           | Small, focused sites       |
| Section bundles | One file for each explicitly enabled top-level section | Large references and books |

Hugo output configuration, not a theme parameter, decides which pages receive
the format. The theme may provide a checker that reports a mismatch between an
intended shape and the actual outputs, but it does not mutate the site's output
set.

The bundle is assembled inside Hugo from one shared page-rendering partial. It
does not read sibling artifacts from `public/` or depend on output build order.
Size is reported as evidence; an arbitrary warning threshold must not make
`--panicOnWarning` fail an otherwise valid publication.

## Navigation JSON {#navigation-json}

The proposed JSON contains a schema version, language, roots, and recursively
ordered nodes. A page node has a stable ID, title, HTML URL, Markdown URL where
enabled, kind/type, weight, and children. An explicit external navigation node
contains only its label, URL, and external kind.

The output follows the same visibility and ordering rules as the rendered
sidebar. It excludes drafts, headless resources, hidden navigation entries,
and pages unavailable in the current language. It never serializes a local
filename.

The format receives its own JSON Schema and golden fixtures. It is marked
`notAlternative` so Hugo does not advertise it as a page-level alternate.

## Discovery and output boundaries {#discovery-and-output-boundaries}

`llms.txt` may link to enabled bulk bundles and the navigation JSON. HTML head
discovery continues to advertise per-page Markdown and the language-local LLMS
index; it does not add every bulk artifact to every page.

Shortcodes, Landing sections, Book targets, and interactive components keep
their current Markdown degradation. The new outputs do not gain permission to
emit component HTML, scripts, comments, feedback controls, or navigation
chrome.

## Acceptance criteria {#acceptance-criteria}

- EN and ZH outputs contain only their own language pages and URLs.
- Every listed Markdown URL exists; every navigation URL resolves or is an
  explicit external node.
- Ordering matches the rendered sidebar and pager for the same root.
- Rebuilding with the same source produces byte-stable output under pinned Hugo
  versions and inputs.
- HTML, Markdown, Print, RSS, and LLMS goldens show no regression when the new
  formats are disabled.
- A large-site fixture demonstrates section bundles without generating a file
  for every nested section.

## Open decisions {#open-decisions}

1. Are both full-text deployment shapes needed, or is section-only safer?
2. Should navigation JSON be a home output or a dedicated content page backed
   by a resource template?
3. Which node metadata is stable enough for schema version 1?
4. Should `llms.txt` list navigation JSON by default when it exists?
5. What size evidence should the checker report without enforcing an arbitrary
   model-context limit?
