---
title: What is OINK
linkTitle: Introduction
description: A local-first Hugo documentation framework that evolved from Docsy. Its components remain readable in Markdown. The theme includes its assets. Fifteen production sites use it.
weight: 10
icon: fa-solid fa-circle-info
search_keywords: [OINK, Hugo theme, Docsy, technical documentation, documentation site, local-first, Markdown native]
cascade:
  categories: [Introduction]
---

OINK is a standalone [Hugo](https://gohugo.io/) theme for medium and large
technical documentation sites. It evolved from
[Docsy](https://github.com/google/docsy), retaining the content model and
multilingual behavior while replacing the shell, navigation, search, and
content components.

Current sites use **OINK v1.4.0** and **Hugo Extended 0.168.0**, with its
built-in Sass compiler. Hugo Module installations also need Go to resolve
modules. The initial download needs access to the module source. Theme assets need no Node.js, npm, PostCSS, or CDN request. Bootstrap, Font Awesome, the
fonts, local search, the diagram runtimes and the API reference runtimes are all
committed to the theme repository. Only pages that use them receive them.

Components use Markdown rather than a second template language. `> [!NOTE]`
creates a callout. A table with a `{.fields}` line creates a parameter list.
An image followed by `{caption=}` has a caption.
[Fifteen production sites](/docs/about/showcase/) use OINK today, including this site.

![OINK turns Markdown content, configuration and local assets into one static documentation site](/images/hero-light.webp)
{width="900" height="600" caption="One Hugo build produces a static site ready to host"}

## What the theme provides {#what-oink-provides}
- The documentation and blog shell provides navigation, a sidebar tree, a table of contents, breadcrumbs, a pager, dark mode, print view, and accessible interaction.
- The multilingual structure provides translation routing, fallback for untranslated pages, language weighting, RTL, and 32 complete interface catalogs.
- Local browser features include Mermaid, Markmap, Swagger UI, Redoc, Asciinema, ECharts, Infographic, and full-text search. Mathematics is rendered by Hugo at build time and uses local KaTeX styles.
- Content components include callouts, tabs, steps, cards, field lists, file trees, galleries, badges, keys, and more. Most have a native Markdown form.
- Additional content types provide built-in book numbering and cross-references, release and download pages, data-driven landing pages, and OpenAPI reference pages.

The theme does not handle source hosting or deployment. A site can use
GitHub, GitLab, or a private Git server. You can publish Hugo's static output
anywhere. The site owns its content, brand, and business components. The theme
supplies the shell and reusable components.

## Is OINK for me {#is-oink-for-me}
| A good fit when | A poor fit when |
| --- | --- |
| The site has many pages and combines documentation, a blog, a book, release pages, and an API reference | The site has one or two pages and needs no structured navigation. A README or a lighter Hugo theme is simpler |
| You need full multilingual support rather than only a translation link on an English site | The site is mostly application UI. OINK can provide its documentation. Business components remain at the site layer |
| Reproducible builds and network isolation matter, and the build machine has no outbound access | You need interactive components inside the prose (React / MDX) |
| Several sites need a shared shell without copies of layouts and shortcodes | You want one switch to change the appearance. The theme has no brand switch. Appearance changes require CSS tokens and partial overrides |
| The team has no front-end engineers and maintains no Node toolchain | You need a built-in CMS or a WYSIWYG editor |

## How it differs from other documentation systems {#comparison}

Choose a toolchain and authoring model before comparing individual features.
Different systems can suit the same project. The choice depends on who
maintains it:

| Your priority | What to evaluate |
| --- | --- |
| Keep an existing Hugo content workflow | Compare OINK with Docsy and Hextra using your own content tree, overrides, and language needs |
| Build without a Node toolchain | OINK includes browser assets in the theme. Hugo Module installation still needs Go to resolve modules |
| Write React components inside documentation | Evaluate an MDX-based system such as Docusaurus. OINK's main authoring model uses Markdown, attributes, and shortcodes |
| Publish books, downloads, or data-driven landing pages | Try OINK's built-in patterns on one representative page before adopting them site-wide |

Check each candidate's current installation and extension documentation. OINK's
search, image zoom, comments, and feedback require explicit configuration. The
site also selects Markdown and agent outputs under `outputs`.

OINK forked from Docsy and evolved as a separate theme. It retains Docsy's
source history, Apache-2.0 obligations, and attribution. For details, see
[License and acknowledgements](/docs/about/license/).

## Start here {#start-here}
- [Get started](/docs/start/) — Use the official Starter. Customize one part at a time, then publish it.
- [Components](/docs/components/) — Each component has one page. The source appears first, followed by the rendered result.
- [Showcase](/docs/about/showcase/) — See fifteen production sites and the OINK features each site uses.
{.cards}

[Highlights](/docs/about/features/) lists each theme capability. Each entry
links to its guide.

To report a problem or submit a correction, follow the
[contribution guide](/docs/about/contributing/). The
[1.4.0 release notes](/blog/release/1.4.0/) cover the current build requirements
and recent community fixes.
