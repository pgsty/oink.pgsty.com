---
title: Highlights
linkTitle: Highlights
description: What separates OINK from an ordinary Hugo theme, one item at a time, each linking to the guide that covers it.
weight: 10
search_keywords: [features, highlights, Markdown native components, local-first, four outputs, bilingual, command palette, keyboard navigation, llms.txt]
aliases:
  - /docs/about/local-first/
---

This page lists what separates OINK from an ordinary Hugo theme, each item
ending with the guide that covers it. To install straight away, see
[Quick start](/docs/start/).

## Components are written in Markdown {#native-components}

A callout is a `> [!NOTE]` blockquote (ten semantic types plus one neutral
disclosure). A field list is a table with a `{.fields}` line. Steps and cards
are lists with `{.steps}` / `{.cards}`. A caption is a `{caption="…"}` line
under an image. Tabs are adjacent fences each carrying a `{tab="…"}`; file
trees, galleries, Mermaid and ECharts are data fences named after their
language. On GitHub or in any plain Markdown reader these degrade to
blockquotes, tables, lists and code blocks, and nothing is lost.

29 shortcodes cover what the native forms cannot express: cards with icons and
images, field entries whose body is several paragraphs of Markdown.

→ [Components](/docs/components/)

## One Hugo binary is enough {#hugo-only}

A consuming site's entire build dependency is Hugo Extended 0.160.1 or newer.
SCSS is compiled by Hugo's embedded Sass transpiler; the theme never invokes
`postCSS`. There is no npm, no webpack and no build-time download. Installing
the theme as a Hugo Module needs Go on the machine to resolve the module; an
offline archive or a submodule does not.

"Hugo only" refers to the build dependency. The interface still runs JavaScript
in the browser: search, the command palette, diagrams and tabs are page
scripts. The difference is that those scripts ship with the theme and are
delivered per page according to what that page actually uses.

→ [Quick start](/docs/start/)

## Local-first {#local-first}

Everything the browser needs is committed to the theme repository: Bootstrap,
Font Awesome, four fonts, Lunr, Mermaid, KaTeX, Markmap, Swagger UI, Redoc,
Asciinema, ECharts, Infographic. `VENDOR.json` records the version, source,
licence file and SHA-256 checksum of each of the 26 dependencies; updating a
runtime means updating artifact, licence and checksum together.

Where a feature could cause a network request, the theme leaves it off rather
than reaching out silently: PlantUML without `params.plantuml.svg_image_url`,
Diagrams.net without `params.drawio.drawio_server`, and Algolia without
`appId` / `apiKey` / `indexName` each warn and stay disabled, and a publishing
gate built with `--panicOnWarning` turns that warning into a failure.

Local-first does not extend to what an author adds. All of these are explicit
network choices: external links, remote images and video, iframes, remote API
specifications; hosted search such as Algolia or Google Programmable Search;
analytics, comments and other SaaS integrations; and PlantUML or Diagrams.net
once the author configures a remote renderer. Pages using them are still valid
pages, but a site should stop claiming those pages work fully offline.

→ [License and acknowledgements](/docs/about/license/) · [Configuration](/docs/customize/config/)

## One source, four outputs {#four-outputs}

Every component has a defined shape in all four outputs: interactive HTML; a
print page with zoom and copy controls stripped and disclosures fully expanded;
plain Markdown; and RSS. The print view is generated per section (this one is
`/_print/docs/about/`), and the Markdown version is the same page address plus
`index.md`.

A site chooses which of them it wants under `outputs`; the theme does not decide
for it.

→ [Print](/docs/customize/print/) · [AI-agent support](/docs/customize/agents/)

## Two languages and 32 interface locales {#multilingual}

Multilingual support uses Hugo's own mechanism: translation routing, a language
picker ordered by weight, fallback for untranslated pages, RTL, and canonical
and alternate metadata. Interface strings come in 32 language packs sharing one
194-message schema: all 31 locale filenames supported by Docsy, plus generic `zh`.
Every pack now contains native OINK interface text rather than English
placeholder blocks; `zh` and `zh-cn` use Simplified Chinese and `zh-tw` uses
Traditional Chinese.

→ [Languages](/docs/customize/i18n/)

## Full-text search that stays on the site {#search}

With `params.offline_search` on, Hugo generates one index per language. The
browser searches Latin text with a local Lunr index and falls back to substring
matching for CJK text; no query leaves for a third party. A page can adjust its
weight with `search_boost` and add synonyms with `search_keywords`.

→ [Search](/docs/customize/search/)

## Command palette {#command-palette}

`Cmd/Ctrl + K` opens the command palette; a bare `/` enters search mode and a
bare `\` enters command-only mode. The palette holds pages, commands and page
actions (switch language, switch theme, copy Markdown) together, so searching
and acting share one entry point.

→ [Command palette](/docs/customize/panel/)

## Keyboard navigation {#keyboard}

On by default, and switchable off per site or per section. `w` and `s` move up
and down the sidebar tree, `a` and `d` collapse and expand, `q` and `e` go to
the previous and next page, `j` and `k` jump along the page's table of
contents, `t` toggles light and dark, `l` switches language, `h` hides the
reading shell. Every single-key shortcut stands down while an input or textarea
has focus or an input method is composing. The question-mark button in the
footer's bottom bar opens the cheatsheet.

→ [Keyboard navigation](/docs/customize/keyboard/)

## Backlinks {#backlinks}

Turn on `params.ui.backlinks` and every page lists the pages that link to it —
derived at build time from the ordinary links you already write, with no new
syntax and no JavaScript. This site enables it site-wide: look at the "Linked
from" group in this page's right rail, and the more a page is referenced, the
longer its list — past eight entries it folds.

→ [Backlinks](/docs/customize/navigation/#backlinks)

## Four content types beyond documentation {#content-types}

The theme also has four kinds of page that need extra structure:

- Books: chapter numbering, figures / tables / equations / examples numbered with `{#id num=}` and cross-referenced with `xref`, indexes generated by `book-toc` and `book-figures` and friends, and a printable whole.
- Release and download pages: `data/download/*.yaml` produces release cards, asset tables and checksums, with a controlled publication state.
- Landing pages: `data/home/<lang>.yaml` assembles the home page sections; any page with `layout: landing` can use data under `data/landing/`.
- API references: Swagger UI and Redoc are both local runtimes, and the specification can live on the site.

→ [Books](/docs/write/book/) · [Releases and downloads](/docs/write/releases/) · [Home and landing pages](/docs/customize/home/) · [API reference pages](/docs/write/openapi/)

## Output for AI assistants {#agent-output}

Add `markdown` to `outputs` and every page gains a `.md` twin, the HTML `<head>`
gains a `rel="alternate"` pointing at it, and the page actions gain "Copy
Markdown" and "View source". The `LLMS` output format writes an `llms.txt`
inventory at the site root (this site's is
<https://oink.pgsty.com/llms.txt>).

0.8.0 adds two more: a section that enables `LLMSFULL` becomes one
`llms-full.txt` an agent fetches in a single request, and a site that enables
`NAVJSON` publishes `navigation.json` per language — the sidebar's tree
readable as data. Both are live on this site:
<https://oink.pgsty.com/docs/llms-full.txt> and
<https://oink.pgsty.com/navigation.json> are the real artifacts.

"Open in ChatGPT / Claude" is off by default: clicking it hands the current URL
to a third party, so the site must turn on
`params.ui.page_context_menu.assistant_links` explicitly.

→ [AI-agent support](/docs/customize/agents/)

## Versions {#versions}

Configure `params.versions` and a version menu appears in the navbar, while an
archived version shows a banner at the top of the page pointing readers at the
current one; whether the menu jumps page-for-page is the site's choice. The
versions are separately built and separately deployed static sites, so nothing
is needed at runtime.

→ [Versions](/docs/customize/versions/)

## See for yourself {#verify}

This site has most of the above enabled. Four checks:

1. Press `Cmd/Ctrl + K` on any page and type `postgres` to see local search results; press `\` for command-only mode.
2. Append `index.md` to the current page address to get this page's Markdown version.
3. Open <https://oink.pgsty.com/llms.txt>, the site inventory written for AI assistants; it leads to the docs section's `llms-full.txt` and to `navigation.json`.
4. Look at this page's right rail: "Backlinks" lists the pages that link here.

## Related {#related}

- [What is OINK](/docs/about/) — scope, fit and comparisons
- [Showcase](/docs/about/showcase/) — how production sites use these features
- [Quick start](/docs/start/) — from clone to deploy
- [Configuration](/docs/customize/config/) — where to look up the parameters named above
