---
name: oink-site
description: "Oink 建站: build, migrate, and polish Hugo sites on the OINK theme (github.com/pgsty/oink, docs at oink.pgsty.com): open-source and product docs, books and courses, personal blogs and knowledge bases, archives and photo albums, company and landing sites, catalogs. Use when creating an OINK site, moving a Hugo or Docsy site onto OINK, converting books or upstream docs, designing a home page, adding languages, or checking, upgrading, and publishing an OINK site. Maps each kind of site to real OINK sites worth studying and each task to the docs page that explains it. Not for changing the theme itself."
---

# Oink 建站

> Public edition of the OINK site-building skill: <https://oink.pgsty.com/skill.md>
> · 中文：<https://oink.pgsty.com/skill.zh.md>. Save it as `SKILL.md` in an
> `oink-site/` skills directory, or hand the URL to any agent. Written
> 2026-11-27 for OINK v1.7.0.

This file is a map, not a manual. It tells you what OINK offers, which real
sites look like the one you are about to build, and which page of the
documentation explains each task. The details live in those sites and pages:
open them when you need them, and use your own judgment in between.

## What OINK is

OINK is a local-first Hugo Module theme, a hard fork of Docsy. An OINK site is
an ordinary Hugo repository: a config file, a `go.mod` that pins
`github.com/pgsty/oink@<tag>`, `content/`, `data/`, and optionally `assets/`
and `layouts/`. Hugo 0.169.0 or newer, in any edition, builds it and Go fetches
the module; there is no Node, npm, Sass, or CDN step.

What you have to work with:

- reading shells for Docs, Book, Blog, and Swagger, and Expo photo albums;
- home and landing pages assembled from YAML data out of 22 section types;
- content components, most of them plain Markdown with one attribute line:
  callouts, steps, cards, tabs, annotated code, diagrams and charts, timelines,
  changelog entries, video and audio players, quoted social posts, maps;
- local search with a command palette, keyboard shortcuts, 32 interface
  languages, Duo View for translations, versions, and taxonomies;
- four visual presets with light and dark modes, print, and Markdown and
  `llms.txt` outputs for agents.

There is no CMS, login, database, or automatic translation.

A good way in: find the closest case below, read a few docs pages for what you
are about to do, then build one small route end to end (home page, a section,
one page, and its translation if there is one) before scaling up.

## Learn from real sites

The [case library](https://oink.pgsty.com/case/) documents 45 production OINK
sites. Each write-up explains the design, its trade-offs, and which parts the
site built itself rather than taking from the theme; those parts are not OINK
features and may not suit your project. Each name below links to its write-up
(add `index.md` to the URL for Markdown), followed by the live site and, where
it is public, the source.

Pick the closest one or two, walk the live site as a reader would, then read
the source. Borrow the organizing idea and adapt the configuration; your
user's content and taste decide the rest.

### Open-source project or product

A home page that shows what the product does, with a real command, diagram, or
screenshot, leading into a manual; downloads and releases that match what was
actually shipped.

- [Apache HugeGraph](https://oink.pgsty.com/case/apache-hugegraph/)
  ([site](https://hugegraph.apache.org/),
  [source](https://github.com/apache/hugegraph-doc)): an ASF project with a
  custom brand hero on the Slate preset and about 300 bilingual pages.
- [Stashix](https://oink.pgsty.com/case/stashix/)
  ([site](https://stashix.net/), [source](https://github.com/Aroy-Art/Stashix-Site)):
  a self-hosted app on the Ink preset with its own accent and a product preview.
- [AGW](https://oink.pgsty.com/case/agw/) ([site](https://agw-ai.dev/),
  [source](https://github.com/zxyao145/agw)): product site and docs kept in
  the `site/` folder of the application repository.
- [Vchord](https://oink.pgsty.com/case/vchord/)
  ([site](https://vchord.pgsty.com/), [source](https://github.com/pgsty/vchord.pgsty.com)):
  a 366-page manual with architecture diagrams, benchmarks, and downloads.
- [Mooncake](https://oink.pgsty.com/case/mooncake/)
  ([site](https://mooncake.pgsty.com/), [source](https://github.com/pgsty/mooncake.pgsty.com)):
  a diagram-led landing page shared with sibling extension sites.
- [Barn](https://oink.pgsty.com/case/barn/) ([site](https://barn.pgsty.com/),
  [source](https://github.com/pgsty/barn.pgsty.com)): illustrated hero,
  terminal quick start, docs, and a blog.
- [PIG](https://oink.pgsty.com/case/pig/) ([site](https://pig.pgsty.com/),
  [source](https://github.com/pgsty/pig.pgsty.com)): a compact CLI manual with
  a data-driven home page.
- [Piglet](https://oink.pgsty.com/case/piglet/) ([site](https://piglet.run/),
  [source](https://github.com/pgsty/piglet.run)): a dark terminal hero over
  short setup docs.
- [SOW](https://oink.pgsty.com/case/sow/) ([site](https://sow.pgsty.com/),
  [source](https://github.com/pgsty/sow.pgsty.com)) and
  [PG Exporter](https://oink.pgsty.com/case/pg-exporter/)
  ([site](https://exp.pgsty.com/), [source](https://github.com/pgsty/exp.pgsty.com)):
  operations manuals with a download page and a generated catalog.

### Large, multilingual, or migrated documentation

- [pigsty.io](https://oink.pgsty.com/case/pigsty-io/)
  ([site](https://pigsty.io/), [source](https://github.com/pgsty/pigsty.io))
  and [pigsty.cc](https://oink.pgsty.com/case/pigsty-cc/)
  ([site](https://pigsty.cc/), [source](https://github.com/pgsty/pigsty.cc)):
  one product's English and Chinese homes run as two sites, with a manual,
  blog, extension catalog, versions, and pricing.
- [PG.CENTER](https://oink.pgsty.com/case/doc-pg-center/)
  ([site](https://doc.pg.center/), [source](https://github.com/pgsty/doc.pg.center)):
  eight languages including Arabic, nearly 5,000 files, upstream manuals side
  by side.
- [Red Hat AI Services](https://oink.pgsty.com/case/redhat-cai/)
  ([site](https://rh-aiservices-bu.github.io/cai/),
  [source](https://github.com/rh-aiservices-bu/cai)): a team portal in nine
  languages.
- [Cloud Exit](https://oink.pgsty.com/case/cloudexit/)
  ([site](https://cloudexit.org/), [source](https://github.com/cloudexit/cloudexit.org)):
  an open standard and public cost ledger across 690 bilingual pages.
- [SILO](https://oink.pgsty.com/case/silo/) ([site](https://silo.pgsty.com/)):
  a large upstream migration generated from a checked manifest.
- [PostgreSQL ecosystem library](https://oink.pgsty.com/case/pgsql-cc/)
  ([source](https://github.com/pgsty/pgsql.cc)): several upstream manuals
  under one search, with translations that grow over time.

### Books, courses, and tutorials

The Book shell numbers chapters, figures, and tables, resolves
cross-references, and prints the whole book; these sites show reading-first
home pages with a cover, contents, and a way in. For a conversion, it usually
pays to convert two sample chapters and review them with your user before
running the rest.

- [DDIA](https://oink.pgsty.com/case/ddia/) ([site](https://ddia.vonng.com/),
  [source](https://github.com/Vonng/ddia)): the most complete book site, with
  several languages and editions kept apart, numbered figures, and print.
- [TPME](https://oink.pgsty.com/case/tpme/) ([site](https://tpme.vonng.com/),
  [source](https://github.com/Vonng/tpme)): a lean bilingual book that needs
  only the Book shell.
- [PG Internals](https://oink.pgsty.com/case/pg-internal/)
  ([site](https://pgint.vonng.com/), [source](https://github.com/Vonng/pg-internal)):
  a single-language book site.
- [PG 36 Stratagems](https://oink.pgsty.com/case/pg36g/)
  ([site](https://pg36g.vonng.com/), [source](https://github.com/Vonng/pg36g)):
  36 chapters with cover art and labs.
- [Empire of AI](https://oink.pgsty.com/case/aiempire/)
  ([site](https://aiempire.vonng.com/)): a cover-art hero and author profiles.
- [PostgreSQL 18 Internals](https://oink.pgsty.com/case/int18-pgsql/)
  ([site](https://int18.pgsql.cc/)): a trilingual translation with translator
  profiles.
- [PostgreSQL by Example](https://oink.pgsty.com/case/pgexp-pgsql/)
  ([site](https://pgexp.pgsql.cc/)): a 57-lesson tutorial with downloadable
  example bundles.
- [SSG Book](https://oink.pgsty.com/case/ssg-book/)
  ([site](https://polla.dev/ssg-book/), [source](https://github.com/polla-fattah/ssg-book)):
  a dark-mode open book with slides and learning paths, served from a subpath.
- [System Design Notes](https://oink.pgsty.com/case/system-design-notes/)
  ([site](https://ariana-yang.github.io/system-design-notes-zh/),
  [source](https://github.com/Ariana-Yang/system-design-notes-zh)): a
  28-chapter Chinese study book.
- [Dalibo Training](https://oink.pgsty.com/case/dalibo-pgsql/)
  ([site](https://dalibo.pgsql.cc/)) and
  [PGPRO Training](https://oink.pgsty.com/case/pgpro-pgsql/)
  ([site](https://pgpro.pgsql.cc/)): multilingual course libraries whose
  curriculum stays apart from chapter navigation.

### Personal blog, digital garden, or knowledge base

- [vonng.com](https://oink.pgsty.com/case/vonng-com/)
  ([site](https://vonng.com/), [source](https://github.com/Vonng/vonng.com)):
  a 1,344-page bilingual blog with columns and an author showcase.
- [Nekonull's Garden](https://oink.pgsty.com/case/nekonull/)
  ([site](https://nekonull.me/),
  [source](https://github.com/jerrylususu/jerrylususu.github.io)): long
  essays, short shares, and TIL notes behind a typography-led home page.
- [Sanbei's Blog](https://oink.pgsty.com/case/sanbei-blog/)
  ([site](https://sanbei101.github.io/blog/), [source](https://github.com/sanbei101/blog)):
  dated essays beside a structured guide section.
- [blog.xjkj.org](https://oink.pgsty.com/case/xjkj-blog/)
  ([site](https://blog.xjkj.org/), [source](https://github.com/wzemc/blog)):
  no hero at all; the card-grid post index is the front door.
- [hongyu](https://oink.pgsty.com/case/hongyu-docs/)
  ([site](https://le0shy.github.io/my-docs/), [source](https://github.com/Le0shy/my-docs)):
  essays, a knowledge base, and book and film reviews in one site.
- [Vianlex's Wiki](https://oink.pgsty.com/case/vianlex-wiki/)
  ([site](https://vianlex.github.io/), [source](https://github.com/vianlex/vianlex.github.io)):
  a 150-page knowledge base entered through landing cards.
- [Le Shi Handbook](https://oink.pgsty.com/case/le-shi/)
  ([site](https://le-shi.github.io/), [source](https://github.com/le-shi/le-shi.github.io))
  and [Homelab IaC](https://oink.pgsty.com/case/homelab-iac/)
  ([site](https://blue126.github.io/IaC/), [source](https://github.com/blue126/IaC)):
  personal operations manuals; the second lives beside its infrastructure code.

### Albums, archives, and exhibitions

- [Feng Zhenbiao Archive](https://oink.pgsty.com/case/fzb/)
  ([site](https://fzb.vonng.com/)): a 601-page family archive where memoir and
  poetry are Book chapters and photographs are Expo albums.
- [OINK's own Expo albums](https://oink.pgsty.com/expo/): album layouts,
  covers, and the image viewer, with the guide at `write/expo`.

### Company, organization, landing page, or small tool

- [pgsty.com](https://oink.pgsty.com/case/pgsty-com/)
  ([site](https://pgsty.com/), [source](https://github.com/pgsty/pgsty.com)):
  a small corporate site built almost entirely from landing data.
- [CASSA](https://oink.pgsty.com/case/cassa/) ([site](https://cassa.au/),
  [source](https://github.com/cassa/static-CASSA-website)): a student
  association with membership, a timeline, and news.
- [CapsLock](https://oink.pgsty.com/case/capslock/)
  ([site](https://caps.vonng.com/), [source](https://github.com/Vonng/caps.vonng.com)):
  a two-page site whose second page is an interactive configurator.
- [Capslock App](https://oink.pgsty.com/case/caps-pgsty/)
  ([site](https://caps.pgsty.com/)) and [Crib](https://oink.pgsty.com/case/crib/)
  ([site](https://crib.pgsty.com/)): native-app sites with a hero, a preview,
  and downloads.

### Catalogs and data-driven sites

- [PGEXT](https://oink.pgsty.com/case/pgext-cloud/)
  ([site](https://ext.pgsty.com/), [source](https://github.com/pgsty/pgext.cloud)):
  2,241 extensions indexed from data and searchable by platform and version.
- [PIGSTY PRO](https://oink.pgsty.com/case/pgsty-pro/)
  ([site](https://pgsty.pro/)): a release archive rendered from structured
  release records.

### The broadest reference

- [OINK Docs](https://oink.pgsty.com/case/oink/)
  ([site](https://oink.pgsty.com/), [source](https://github.com/pgsty/oink.pgsty.com)):
  every component page opens with source you can paste. Its configuration is
  large because it also serves the theme's regression tests, so borrow from
  its pages rather than its config. The theme repository's `tests/site/` is a
  test fixture, not a design to copy.

## Where the docs explain it

Docs live at <https://oink.pgsty.com/docs/> (Chinese under `/zh/docs/`). Every
page has a Markdown copy at its URL plus `index.md`; `https://oink.pgsty.com/llms.txt`
lists them all, and `https://oink.pgsty.com/docs/llms-full.txt` holds the
whole manual in one file of about 2 MB, which is handy to search. Paths below
are relative to `/docs/`.

| When you are… | Read |
| --- | --- |
| deciding whether OINK fits, and what it adds | `about/`, `about/features/` |
| creating a site, or adding OINK to an existing Hugo site | `start/from-scratch/` |
| starting from a template with deploy workflows included | `start/starter/`, `start/anatomy/` |
| arranging folders into a sidebar; writing pages and front matter | `write/organize/`, `write/pages/`, `write/frontmatter/` |
| writing a blog, a book, or photo albums | `write/blog/`, `write/book/`, `write/expo/` |
| publishing releases and downloads, or an API reference | `write/releases/`, `write/openapi/` |
| choosing a component | `components/`: a cheatsheet of all of them, then one page each |
| building the home page or other landing pages | `customize/home/` |
| setting logo, colors, fonts, presets, and site CSS | `customize/brand/` |
| shaping menus, breadcrumbs, and the footer | `customize/navigation/` |
| choosing shells, sidebars, tables of contents, page width | `customize/layout/` |
| adding languages, or Duo View | `customize/i18n/` |
| setting up search and the command palette | `customize/search/`, `customize/panel/` |
| linking to the repository; crediting upstream sources | `customize/repository/` |
| tagging pages; publishing several product versions | `customize/taxonomy/`, `customize/versions/` |
| printing a page or a whole section | `customize/print/` |
| serving Markdown and `llms.txt` to agents | `customize/agents/` |
| looking up keyboard shortcuts | `customize/keyboard/` |
| looking up any config key, and how a wrong value behaves | `customize/config/` |
| previewing, deploying, adding analytics or comments | `admin/preview/`, `admin/deploy/`, `admin/analytics/`, `admin/comments/` |
| upgrading, or migrating from Docsy or an old OINK | `admin/upgrade/` |
| fixing something that broke | `admin/troubleshooting/` |
| checking how the theme is meant to behave | `design/` (maintainer contracts) |

The site also has a hands-on tutorial book at `/book/`, release notes at
`/release/`, and engineering notes at `/blog/`. The theme's source, defaults
(`hugo.yaml`), migration tools, and checkers are at
<https://github.com/pgsty/oink>. Check its releases for the newest version;
newer docs win over this file. Older tutorials and sites carry retired
practice, such as OINK 0.4–1.4 keys, `exampleSite`, `type: landing`, Docsy
`blocks/*`, and Sass, so read them for intent, not syntax.

## Things worth knowing early

A few facts have cost earlier builds real time. Everything else is in the
docs.

- Hugo does not take `markup` settings from a theme, so every site carries its
  own Goldmark options; without them, attribute lines such as `{.steps}` show
  up as literal text. `start/from-scratch` has the block to copy.
- Interactive and third-party features stay off until the site turns them on:
  search, Duo View, extra outputs, comments, analytics, maps, in-page video
  players, assistant links. When something seems missing, look for its switch.
- A wrong value warns and falls back rather than failing the build, so read
  the warnings: one usually means a feature you expected did not turn on.
- Each enabled language needs its own home data, footer data, and menus, or
  the default language quietly shows through.
- The shell a page gets follows its `type`, not its folder.
- Site styles go in `assets/css/project.css` and overrides in the narrowest
  hook or partial. Editing theme files or copying a whole shell for one change
  makes every upgrade painful.

## Working with your user

- Confirm which repository and domain you are building, and that the working
  directory is that site. Sites you study are read-only.
- Respect work that is already there: check `git status`, keep uncommitted
  changes and other sessions' files, and stage only your own. Ask before
  creating a repository, committing, pushing, deploying, or touching DNS.
- Agree with your user where large raw material such as PDFs, scrapes, or
  recordings should live before you download it, so nothing lands in Git by
  accident.
- A short brief, such as a name, a directory, the content and its readers, a
  few sections, a style, a domain, and a host, is a starting point. Ask about
  what would change the build; pick sensible defaults for the rest and say
  what you picked.
- "Make full use of OINK's features" means reaching for the theme's feature
  before writing your own wherever the content calls for it. A timeline wants
  real dates and a map real places; a site that shows off every component
  reads as a demo.
- Keep facts true: no invented numbers, quotes, posts, or features; real people
  credited as they are; licences and upstream sources stated. Ask when a
  licence limits copying or translation.
- Extensions of your own (a partial, a script, a generator) are fine when the
  theme has nothing for the job. Name them in the site's `AGENTS.md` as site
  code; when several sites need the same thing, it may belong upstream as an
  issue or a [design proposal](https://oink.pgsty.com/docs/design/proposals/).

## Taste

The maintainers review their own sites against a few preferences. Treat them as
tendencies, not rules; your user's eye is the real acceptance test, and what
they have approved stays.

- The first screen names the subject and offers a real next step: reading for
  a book, a working command for a product, a way into the story for an
  archive.
- Restraint over decoration: real content and real status rather than
  ornamental badges, counters, or effects.
- Headlines and card text wrap cleanly in every language and width, with no
  word or two stranded on a line of their own; rewriting the copy is the
  usual fix.
- Grids fit their item count, and cards in a row line up.

## Check and ship

- Build the way production will, without local module replacements or
  workspaces, and read every warning:

  ```bash
  export GOWORK=off HUGO_MODULE_WORKSPACE=off; unset HUGO_MODULE_REPLACEMENTS
  hugo mod graph | grep github.com/pgsty/oink
  hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings
  ```

- Look at the result in a browser: each language, each kind of page, a phone
  width, light and dark, each preset offered, search, and language switching.
  A green build only proves that the build ran.
- The theme repository's `bin/` has checkers for output security, books, and
  translations when a site needs that depth.
- Report what you followed, what you changed, what you checked and what you
  did not, and keep the states apart: built locally, committed, pushed,
  deployed, verified live. Count what readers get, such as chapters, figures,
  and working links, rather than files.
- `admin/deploy` covers hosts, CI, `baseURL`, security headers, and rollback;
  remember that files in ignored paths never reach a deploy built from Git.
  `admin/upgrade` covers moving between releases.
