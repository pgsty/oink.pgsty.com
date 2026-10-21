---
title: Highlights
linkTitle: Highlights
description: Compare OINK with an ordinary Hugo theme. Each feature links to its guide.
weight: 10
search_keywords: [features, highlights, Markdown native components, local-first, four outputs, bilingual, command palette, keyboard navigation, llms.txt]
aliases:
  - /docs/about/local-first/
---

This page lists the differences between OINK and an ordinary Hugo theme.
Each item links to its guide. To install OINK now, see
[Quick start](/docs/start/).

## Components are written in Markdown {#native-components}

A callout is a `> [!NOTE]` blockquote (ten semantic types plus one neutral
disclosure). A field list is a table with a `{.fields}` line. Steps and cards
are lists with `{.steps}` / `{.cards}`. A caption is a `{caption="…"}` line
under an image. Tabs use adjacent fences, each with a `{tab="…"}` attribute. File
trees, galleries, Mermaid, and ECharts use data fences named after their
language. On GitHub or in a plain Markdown reader, these appear as
blockquotes, tables, lists, and code blocks. They retain all content.

29 shortcodes provide forms that native Markdown cannot express. These include
cards with icons and images, and field entries with several Markdown paragraphs.

→ [Components](/docs/components/)

## Build with Hugo {#hugo-only}

Hugo Extended 0.168.0 or newer compiles the site's assets. SCSS is compiled by
Hugo's embedded Sass transpiler. The theme never invokes `postCSS`. It requires
neither npm nor webpack. Installing the theme as a Hugo Module also needs Go
and access to the module dependencies, either over the network or from a local
cache. With an offline archive or a submodule already prepared, Hugo is enough
to build the site.

The interface runs JavaScript in the browser: search, the command palette,
diagrams and tabs are page scripts. The theme includes those scripts. Each page receives only the scripts it uses.

→ [Quick start](/docs/start/)

## Local-first {#local-first}

Everything the browser needs is committed to the theme repository: Bootstrap,
Font Awesome, four fonts, Lunr, Mermaid, KaTeX, Markmap, Swagger UI, Redoc,
Asciinema, ECharts, Infographic. `VENDOR.json` records the version, source,
license file and SHA-256 checksum of each of the 26 dependencies. When you
update a runtime, update its artifact, license, and checksum together.

Features that could make network requests require explicit configuration.
Without `params.plantuml.svg_image_url`, PlantUML warns and stays disabled.
Without `params.drawio.drawio_server`, Diagrams.net warns and stays disabled.
Without `appId` / `apiKey` / `indexName`, Algolia warns and stays disabled.
Review warnings and their safe fallbacks before publishing.

Local-first does not cover content that an author adds. Explicit network
choices include external links, remote images and video, iframes, and remote
API specifications. They also include hosted search, such as Algolia or Google
Programmable Search, and analytics, comments, or other SaaS integrations.
PlantUML and Diagrams.net use the network if the author configures a remote
renderer. Pages with these features remain valid. The site should not claim
that those pages work fully offline.

→ [License and acknowledgements](/docs/about/license/) · [Configuration](/docs/customize/config/)

## One source, four outputs {#four-outputs}

Every component has a defined form in four outputs: interactive HTML, print,
plain Markdown, and RSS. Print pages omit zoom and copy controls and fully
expand disclosures. The print view is generated per section (this one is
`/_print/docs/about/`), and the Markdown version is the same page address plus
`index.md`.

Select the site's output formats under `outputs`. The theme does not select
them for the site.

→ [Print](/docs/customize/print/) · [AI-agent support](/docs/customize/agents/)

## Two languages and 32 interface locales {#multilingual}

Multilingual support uses Hugo's own mechanism: translation routing, a language
picker ordered by weight, fallback for untranslated pages, RTL, and canonical
and alternate metadata. Interface strings come in 32 language packs sharing one
218-message schema. These include all 31 locale filenames that Docsy supports,
plus generic `zh`. Every pack contains native OINK interface text instead of
English placeholder blocks. `zh` and `zh-cn` use Simplified Chinese. `zh-tw`
uses Traditional Chinese.

→ [Languages](/docs/customize/i18n/)

## Full-text search that stays on the site {#search}

With `params.offline_search` on, Hugo generates one index per language. The
browser searches Latin text with a local Lunr index and falls back to substring
matching for CJK text. It sends no query to a third party. A page can adjust its
weight with `search_boost` and add synonyms with `search_keywords`.

→ [Search](/docs/customize/search/)

## Command palette {#command-palette}

`Cmd/Ctrl + K` opens the command palette. A bare `/` enters search mode. A
bare `\` enters command-only mode. The palette contains pages, commands, and
page actions, such as switching language, switching theme, and copying Markdown.
Use the same entry point to search and run actions.

→ [Command palette](/docs/customize/panel/)

## Keyboard navigation {#keyboard}

Keyboard navigation is on by default. You can turn it off per site or section.
`w` and `s` move up and down the sidebar tree. `a` and `d` collapse and expand
it. `q` and `e` go to the previous and next page. `j` and `k` move through the
page's table of contents. `t` toggles light and dark mode. `l` switches
language. `h` hides the reading shell. Single-key shortcuts are inactive while
an input or textarea has focus, or while an input method is composing. The question-mark button in the
footer's bottom bar opens the cheatsheet.

→ [Keyboard navigation](/docs/customize/keyboard/)

## Backlinks {#backlinks}

Turn on `params.ui.backlinks` to list the pages that link to each page. Hugo
derives the list at build time from ordinary links. This requires no new
syntax and no JavaScript. This site enables backlinks site-wide. See the
"Linked from" group in this page's right rail. More references produce a longer
list. The list collapses when it has more than eight entries.

→ [Backlinks](/docs/customize/navigation/#backlinks)

## Four content types beyond documentation {#content-types}

The theme also has four kinds of page that need extra structure:

- Books provide chapter numbering. Use `{#id num=}` to number figures / tables / equations / examples and `xref` to reference them. `book-toc`, `book-figures`, and related shortcodes generate indexes. You can print the whole book.
- Release and download pages use `data/download/*.yaml` to produce release cards, asset tables, and checksums. The data controls publication state.
- Landing pages use `data/home/<lang>.yaml` to assemble home-page sections. Any page with `layout: landing` can use data under `data/landing/`.
- API references use the local Swagger UI and Redoc runtimes. The specification can reside on the site.

→ [Books](/docs/write/book/) · [Releases and downloads](/docs/write/releases/) · [Home and landing pages](/docs/customize/home/) · [API reference pages](/docs/write/openapi/)

## Output for AI assistants {#agent-output}

Add `markdown` to `outputs`. Each page then has a `.md` version. Its HTML `<head>`
has a `rel="alternate"` reference to that version. Page actions include "Copy
Markdown" and "View source". The `LLMS` output format writes an `llms.txt`
inventory at the site root (this site's is
<https://oink.pgsty.com/llms.txt>).

0.8.0 adds two more outputs. A section that enables `LLMSFULL` produces one
`llms-full.txt` file. An agent can fetch it in a single request. A site that
enables `NAVJSON` publishes `navigation.json` per language. This file represents
the sidebar tree as data. Both are live on this site:
<https://oink.pgsty.com/docs/llms-full.txt> and
<https://oink.pgsty.com/navigation.json> are the real artifacts.

"Open in ChatGPT / Claude" is off by default. Clicking it sends the current URL
to a third party. The site must turn on
`params.ui.page_context_menu.assistant_links` explicitly.

→ [AI-agent support](/docs/customize/agents/)

## Versions {#versions}

Configure `params.versions` to add a version menu to the navbar. An archived
version shows a banner that links to the current version. The site chooses
whether the menu links to corresponding pages. Each version is a separately
built and deployed static site. No runtime service is required.

→ [Versions](/docs/customize/versions/)

## See for yourself {#verify}

This site enables most of these features. Use these four checks:

1. Press `Cmd/Ctrl + K` on any page. Type `postgres` to see local search results. Press `\` for command-only mode.
2. Append `index.md` to the current page address to get this page's Markdown version.
3. Open <https://oink.pgsty.com/llms.txt>, the site inventory for AI assistants. It links to the docs section's `llms-full.txt` and to `navigation.json`.
4. Look at this page's right rail. "Backlinks" lists the pages that link here.

## Related {#related}

- [What is OINK](/docs/about/) — scope, fit and comparisons
- [Showcase](/docs/about/showcase/) — how production sites use these features
- [Quick start](/docs/start/) — from clone to deploy
- [Configuration](/docs/customize/config/) — where to look up the parameters named above
