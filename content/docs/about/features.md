---
title: Highlights
linkTitle: Highlights
description: Look up what OINK adds to an ordinary Hugo theme, one capability at a time, with the setting that turns it on and a link to its guide.
weight: 10
search_keywords: [features, highlights, Markdown native components, local-first, four outputs, bilingual, command palette, keyboard navigation, llms.txt]
aliases:
  - /docs/about/local-first/
---

Everything here ships in the theme. Some of it works as soon as a page uses
it; the rest waits for one configuration key, named in its section next to the
guide that explains it. If you are still deciding whether OINK suits your
project, read [What is OINK](/docs/about/) first.

## Components are written in Markdown {#native-components}

Most components are ordinary Markdown plus an attribute line, so the source
stays readable on GitHub and in any editor. A callout is a `> [!NOTE]`
blockquote, with ten semantic types and one neutral disclosure. A parameter
list is a table followed by `{.fields}`, steps and cards are lists followed by
`{.steps}` or `{.cards}`, timelines and changelog updates are definition lists
with `{.timeline}` and headings with `{.update}`, and images, videos and audio
share Markdown image syntax with `{caption="…"}`. Tabs are adjacent code fences,
each with a `{tab="…"}` attribute, and file trees, galleries, maps, Mermaid and
ECharts are fences named after their data language. Outside OINK, all of these
fall back to blockquotes, tables, lists, headings and code blocks with nothing
lost.

For what plain Markdown cannot express, such as cards with icons and images,
or a field entry several paragraphs long, there are 29 shortcodes. Offline
quoted social posts are `> [!SOCIAL]` callouts, so they stay blockquotes in
plain Markdown. Typeset copy (`params.ui.rich_copy`, on by
default) also keeps pasted selections clean in rich-text editors such as Notion,
Feishu and Word.

→ [Components](/docs/components/)

## Build with Hugo {#hugo-only}

Hugo builds the site in any edition, and nothing else runs during the build.
The theme's stylesheet is plain CSS that Hugo concatenates, so there is no
Sass, PostCSS, npm or webpack step. Go is needed only to fetch the theme as a
Hugo Module, over the network or from a local module cache; with an offline
archive or a Git submodule in place, Hugo alone builds the site.

In the browser, search, the command palette, diagrams and tabs run as
JavaScript. Those scripts ship with the theme, and each page loads only the
ones its content uses.

→ [Get started](/docs/start/)

## Local-first {#local-first}

Everything the browser needs is committed to the theme repository: Bootstrap
styles, Font Awesome, four font families, Mermaid, KaTeX, Markmap, Swagger UI,
Redoc, Asciinema, ECharts, Infographic, Leaflet and a local PlantUML engine, among
others. `VENDOR.json` records the version, source, license file and SHA-256
checksum of each one, so you can audit exactly what your site serves.

A feature that could contact another server stays off until you configure it
completely. PlantUML renders in the browser unless you set
`params.plantuml.svg_image_url`. Diagrams.net needs
`params.drawio.drawio_server`, and Algolia needs `appId`, `apiKey` and
`indexName`; with a value missing, each warns at build time and stays off
rather than falling back to a public service. Interactive maps likewise wait
for a tile service you name in `params.map`, and a video card contacts no
platform unless the site lists it in `params.video_embeds` and the reader
clicks.

Local-first covers the theme, not what authors add. External links, remote
images and video, iframes and remote API specifications; hosted search such as
Algolia or Google Programmable Search; analytics, comments and other SaaS
integrations; and a remote PlantUML or Diagrams.net renderer are all network
choices you make, and pages that use them need network access when they are
read.

→ [License and acknowledgements](/docs/about/license/) · [Configuration](/docs/customize/config/)

## One source, four outputs {#four-outputs}

Every component has a defined form in each of four outputs, so a page reads
correctly wherever it ends up: interactive HTML; a print view with the zoom and
copy controls removed and every disclosure expanded; plain Markdown; and RSS.
The print view covers a whole section at once (this section's is
`/_print/docs/about/`), and a page's Markdown version is its address plus
`index.md`.

The site lists the outputs it publishes under `outputs`; the theme adds none
on its own.

→ [Print](/docs/customize/print/) · [AI-agent support](/docs/customize/agents/)

## Multilingual sites and 32 interface locales {#multilingual}

OINK uses Hugo's own multilingual model: translation routing, a language
picker ordered by weight, fallback for untranslated pages, right-to-left
scripts, and canonical and alternate links for search engines. The interface
comes in 32 language packs with identical keys, covering all 31 locale file
names Docsy supports plus a generic `zh`. Each pack is written natively, with
no English placeholders; `zh` and `zh-cn` are Simplified Chinese and `zh-tw`
is Traditional Chinese. With `params.ui.compare: true`, readers can open an
existing translation beside the current page and scroll both together.

→ [Languages](/docs/customize/i18n/) · [Duo view](/docs/customize/i18n/#bilingual-view)

## Full-text search that stays on the site {#search}

Turn on `params.offline_search` and Hugo writes one search index per language.
A scanning BM25 engine in the browser queries it, with no Lunr and no outside
service. It matches English words with Porter stemming and a spelling
fallback, code identifiers and symbol runs, and Chinese, Japanese or Korean
queries typed without spaces, which it matches as overlapping character pairs.
An index larger than 2 MiB moves page text into a separate file that loads in
stages, and searching for a parameter's name opens its field-list entry
directly. A page can raise its ranking with `search_boost` and add synonyms
with `search_keywords`.

→ [Search](/docs/customize/search/)

## Command palette {#command-palette}

`Cmd/Ctrl + K` opens one box for pages, commands and page actions such as
switching language or theme and copying the page as Markdown, so finding
something and doing something share an entry point. A bare `/` opens it ready
to search, and a query that starts with `>` lists only commands.

→ [Command palette](/docs/customize/panel/)

## Keyboard navigation {#keyboard}

Twenty-nine single-key shortcuts are on by default (ten for navigation, nine for
actions and ten for the view), and can be turned off for a site, a section or a single
page. `w` and `s` move through the sidebar tree and `a` and `d` collapse and
expand it, `q` and `e` go to the previous and next page, `k` and `j` jump to the
previous and next heading, `h` lists the pages you read recently and `g` goes
home. Other keys search, edit or print the page, hand it to ChatGPT or Claude,
fold or unfold everything at once, switch the preset, color mode and
language, open the duo view, toggle Zen Mode, and widen or narrow the reading
column. Every shortcut stands aside while you type in a text field or compose
with an input method. Press `'`, or click the question-mark button in the
footer, to see all twenty-nine in three columns; keys a page cannot use are dimmed.

→ [Keyboard navigation](/docs/customize/keyboard/)

## Backlinks {#backlinks}

Turn on `params.ui.backlinks` and each page lists the pages that link to it.
Hugo derives the list at build time from your ordinary links, so there is no
new syntax and no JavaScript. The list sits in the right rail under
"Backlinks" and folds after eight entries; this site has it on, so you can see
it beside this page.

→ [Backlinks](/docs/customize/navigation/#backlinks)

## Four content types beyond documentation {#content-types}

Four kinds of page need more structure than a documentation page, and the
theme provides it:

- Books number their chapters. `{#id num=}` numbers figures, tables, equations and examples, `xref` cross-references them, `book-toc`, `book-figures` and related shortcodes generate indexes, and a whole book prints as one document.
- Release and download pages are generated from `data/download/*.yaml`: release cards, asset tables and checksums, with the data deciding what is published.
- Landing pages assemble home-page sections from `data/home/<lang>.yaml`, and any page with `layout: landing` can use data under `data/landing/`.
- API references render with the bundled Swagger UI and Redoc, and the specification can live on the site itself.

→ [Books](/docs/write/book/) · [Releases and downloads](/docs/write/releases/) · [Home and landing pages](/docs/customize/home/) · [API reference pages](/docs/write/openapi/)

## Output for AI assistants {#agent-output}

Add `markdown` to `outputs` and every page also publishes a `.md` version,
announced in its HTML `<head>` with `rel="alternate"` and offered in the page
actions for copying or viewing. The `LLMS` output format writes an `llms.txt`
inventory at the site root (this site's is <https://oink.pgsty.com/llms.txt>).

Two more outputs serve agents that want everything at once. A section that
enables `LLMSFULL` publishes its whole text as one `llms-full.txt`, which an
agent fetches in a single request, and a site that enables `NAVJSON` publishes
its sidebar tree as data in one `navigation.json` per language. This site
publishes both: <https://oink.pgsty.com/docs/llms-full.txt> and
<https://oink.pgsty.com/navigation.json>.

"Open in ChatGPT / Claude" links are off by default, because a click
sends the page's URL to a third party. A site turns them on with
`params.ui.page_context_menu.assistant_links`.

→ [AI-agent support](/docs/customize/agents/)

## Versions {#versions}

Configure `params.versions` to add a version menu to the navbar. An archived
version shows a banner that links to the current one, and the site decides
whether the menu jumps to the matching page or to each version's home. Each
version is a separately built and deployed static site, so no runtime service
is involved.

→ [Versions](/docs/customize/versions/)

## See for yourself {#verify}

This site has most of these features on. Four quick checks:

1. Press `Cmd/Ctrl + K` on any page and type `postgres` to see local search results, then start the query with `>` to see only commands.
2. Append `index.md` to this page's address to get its Markdown version.
3. Open <https://oink.pgsty.com/llms.txt>, the site inventory for AI assistants. It links to the docs section's `llms-full.txt` and to `navigation.json`.
4. Look at the "Backlinks" group in this page's right rail; it lists the pages that link here.

## Related {#related}

- [What is OINK](/docs/about/) — scope, fit and comparisons
- [Showcase](/docs/about/showcase/) — how production sites use these features
- [Get started](/docs/start/) — from clone to deploy
- [Configuration](/docs/customize/config/) — where to look up the parameters named above
