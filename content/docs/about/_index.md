---
title: What is OINK
linkTitle: Introduction
description: Decide whether OINK fits your project, what you get with it, how it differs from Docsy and MDX-based tools, and where it falls short.
weight: 10
icon: fa-solid fa-circle-info
search_keywords: [OINK, Hugo theme, Docsy, technical documentation, documentation site, local-first, Markdown native]
cascade:
  categories: [Introduction]
---

OINK is a [Hugo](https://gohugo.io/) theme for technical documentation that
has outgrown a README: product manuals, API references, books, release pages
and blogs, often in several languages, maintained by engineers rather than a
front-end team. You write Markdown, run `hugo`, and publish a static site with
a sidebar built from your folders, local full-text search, a print view and a
Markdown copy of every page for AI agents. Every script, font and stylesheet
ships inside the theme, so the build needs no Node.js, npm, Sass or CDN, and
unless you add an integration such as analytics or comments, the theme makes
your readers' browsers request nothing from third parties.

OINK began as a fork of [Docsy](https://github.com/google/docsy). It keeps
Docsy's content model and multilingual behavior and replaces the shell,
navigation, search and components.
[Seventy-nine production sites](/docs/about/showcase/) run on it: 48
independent projects, among them Apache HugeGraph's bilingual documentation,
a nine-language team portal at Red Hat AI Services, and Cortrix's AI agent
memory docs, plus 31 sites from the PGSTY and Vonng ecosystem, the largest of
which spans nearly 5,000 Markdown files in eight languages, Arabic included.

![OINK turns Markdown content, configuration and local assets into one static documentation site](/images/hero-light.webp)
{width="900" height="600" caption="One Hugo build produces a static site ready to host"}

## What you get {#what-oink-provides}

- **A build that needs only Hugo.** Any edition of Hugo builds the site, and Go
  is needed only to download the theme as a Hugo Module. The stylesheet is
  plain CSS, so your repository has no Sass compiler, PostCSS step or
  `package.json`. [Get started](/docs/start/#tools) lists the versions.
- **Components that stay Markdown.** `> [!NOTE]` is a callout, a table followed
  by `{.fields}` is a parameter list, and an image followed by
  `{caption="…"}` is a captioned figure. On GitHub or in any editor the same
  source still reads as a quote, a table and an image.
- **A complete reading shell.** Sidebar tree, table of contents, breadcrumbs,
  pager, a `Cmd/Ctrl + K` command palette, keyboard navigation, light and dark
  modes and four visual presets.
- **Search without a service.** A BM25 engine in the browser queries an index
  Hugo builds for each language, and it finds Chinese, Japanese and Korean
  text typed without spaces.
- **Real multilingual sites.** Hugo's own translation model, an interface
  translated into 32 locales, right-to-left scripts, and an optional view that
  puts a page beside its translation.
- **More than documentation.** Books with numbered figures and
  cross-references, release and download pages generated from YAML, landing
  pages assembled from 22 section types, and OpenAPI references rendered by
  bundled Swagger UI and Redoc.
- **Output for people and machines.** Print a whole section at once, read any
  page as plain Markdown, or point an AI agent at `llms.txt`.

[Highlights](/docs/about/features/) describes each capability and links to its
guide.

The theme stops at the static site. Your source can live on GitHub, GitLab or a
private Git server, and Hugo's output deploys to any static host. Content,
brand and components specific to your product stay in your site; the theme
supplies the shell and the reusable parts.

## Is OINK for me {#is-oink-for-me}

| OINK fits when | Look elsewhere when |
| --- | --- |
| The site has many pages and mixes documentation, a blog, a book, release pages and an API reference | The site has one or two pages and needs no navigation; a README or a lighter Hugo theme is simpler |
| You publish full translations, not an English site with a translate link | The site is mostly application UI; OINK can carry its documentation, but product components stay in your site |
| Builds must be reproducible, and the build machine may have no network access | You want interactive React components inside your prose (MDX) |
| Several sites should share one shell without copying layouts and shortcodes | You want a completely different look from one switch; beyond the four presets, appearance changes go through CSS tokens and partial overrides |
| Nobody on the team is a front-end engineer or wants to maintain a Node toolchain | You need a CMS or a WYSIWYG editor |

Weigh two more things. Most features are off until you configure them,
including search, dark mode, image zoom, comments, feedback and the Markdown
and agent outputs; the [Starter](https://github.com/pgsty/oink-starter) turns
the common ones on for you. And OINK is young and moves quickly: 1.0.0 shipped
in August 2026 and 1.7.0 three months later. Each site pins an exact release,
so nothing changes until you raise the pin, and the
[upgrade guide](/docs/admin/upgrade/) has a section for every release that asks
you to change something.

## How it differs from other documentation systems {#comparison}

The usual alternatives are Docsy, which OINK forked, and Node-based systems
built on MDX, such as Docusaurus. These are the differences that tend to decide
the choice:

| | OINK | Docsy | Docusaurus and other MDX systems |
| --- | --- | --- | --- |
| Build tools | Hugo in any edition, plus Go to fetch the theme module | Hugo Extended to compile Sass, plus npm for PostCSS and Autoprefixer | Node.js and npm |
| Callouts and tabs | Markdown that GitHub also renders: `> [!NOTE]`, fences with `{tab="…"}` | Shortcodes such as `alert` and `tabpane` | MDX, with React components inside the prose |
| Search | Bundled BM25 engine, one index per language, unspaced CJK included | Lunr offline search, or a hosted service | Algolia DocSearch, or a community plugin for local search |
| Fonts and scripts | Bundled and served from your own domain; no jQuery | Google Fonts unless switched off; jQuery on every page | Scripts bundled by the Node build |
| Home page | Sections listed in `data/home/<lang>.yaml` | `blocks/*` shortcodes in a Markdown page | A React page |

If you already run Docsy, your content and most front matter carry over;
[Migrating from Docsy](/docs/admin/upgrade/#from-docsy) lists what to delete
and convert. If you are comparing Hugo themes such as Docsy and Hextra, build
a copy of your own content tree with each before you decide, because overrides
and language needs show differences no feature list does.

OINK is a hard fork rather than a skin over Docsy, and it keeps Docsy's source
history, Apache-2.0 obligations and attribution; see
[License and acknowledgements](/docs/about/license/).

## Start here {#start-here}

- [Get started](/docs/start/) — Clone the Starter, preview it, make it yours one piece at a time, and deploy it.
- [Components](/docs/components/) — Every component on its own page, source first, then the result.
- [Showcase](/docs/about/showcase/) — 79 production sites and the OINK features each one uses.
{.cards}

Found a problem or want to send a fix? The
[contribution guide](/docs/about/contributing/) says where it goes. The
[1.7.0 release notes](/release/1.7.0/) describe the current release.
