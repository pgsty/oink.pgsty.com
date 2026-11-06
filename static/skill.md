---
name: oink-site
description: "Oink 建站: build, migrate, and polish Hugo sites on the OINK theme (github.com/pgsty/oink, docs at oink.pgsty.com): product docs, books and course portals, blogs, landing and company sites, archives, albums, aggregate libraries. Use when starting from oink-starter, adding OINK to an existing Hugo or Docsy site, turning PDFs, HTML, or upstream Markdown into Docs or Book pages, designing a home page, adding languages, or checking, upgrading, and publishing an OINK site. Not for changing the theme itself."
---

# Oink 建站

> Public edition of the OINK site-building skill. Source:
> <https://oink.pgsty.com/skill.md> · 中文：<https://oink.pgsty.com/skill.zh.md>.
> Save it as `SKILL.md` in an `oink-site/` skills directory, or hand the URL to
> any agent. Snapshot 2026-11-06 for OINK v1.5.1.

OINK is a local-first Hugo Module theme, a hard fork of Docsy. A site is an
ordinary Hugo repository: `hugo.yaml`, a `go.mod` pinning
`github.com/pgsty/oink@<tag>`, `content/`, `data/`, and optional `assets/` and
`layouts/` hooks. Hugo Extended builds it, plus Go for module installs. There
is no Node, npm, Dart Sass, PostCSS, or CDN. It provides Docs, Book, Blog and
Swagger reading shells, Expo albums, Landing sections, local search, bundled
fonts and icons, 32 interface locales, appearance presets, print, and
Markdown/LLMS outputs. It has no CMS, authentication, database, or automatic
translation.

## How to use this file

The OINK docs own syntax and behaviour. This file owns judgment: workflow,
boundaries, the review standards OINK's maintainers apply to their own sites,
and what went wrong in about fifty earlier builds. Look a key up in the docs
before writing it. Do not trust memory or another site's config for syntax.

Scale the process to the job. A copy fix needs a build and a look in the
browser. A new site, a migration, or a book conversion needs everything below.

The design notes are strong defaults, not templates. Your user's brand, readers,
or material can justify a different shape; when you depart from them, say why.

## Ground truth

- Docs: <https://oink.pgsty.com/docs/> (Chinese under `/zh/docs/`). Append
  `index.md` to any page URL for Markdown; `https://oink.pgsty.com/llms.txt`
  lists them. Source: <https://github.com/pgsty/oink.pgsty.com> (`content/docs/`).
- Contracts are under `docs/design/`. The theme's defaults (`hugo.yaml`) and
  checkers (`bin/`) are in <https://github.com/pgsty/oink>; the template is
  <https://github.com/pgsty/oink-starter>.
- Pages by need: `start/` (starter, from-scratch, anatomy) · `write/`
  (organize, pages, frontmatter, blog, book, expo, releases, openapi) ·
  `components/` · `customize/` (home, brand, navigation, layout, i18n, search,
  config, print, agents) · `admin/` (preview, deploy, upgrade,
  troubleshooting, analytics, comments) · `design/` (landing, shell,
  components, architecture).
- Baseline of this snapshot: OINK v1.5.1, Hugo Extended 0.168.0, Go 1.27.3.
  Check GitHub releases for the newest published version, read its notes, and
  confirm what resolved with `hugo mod graph`. Newer docs win over this file.
- The target site's `AGENTS.md`/`CLAUDE.md`, `README.md`, and `Makefile` are
  binding for that site.
- Older tutorials and sites carry obsolete practice. Treat the following as
  evidence of intent only: OINK 0.4–1.4 keys, `exampleSite`, `type: landing`,
  Docsy `blocks/*`, `--panicOnWarning`, "zero warnings", and Dart Sass.

## Before touching files

- Say which repository and domain you are building, and confirm the working
  directory is that site. Sites you consult for reference are read-only.
- Run `git status --short` first. Keep uncommitted work and other sessions'
  files, and stage only your own. Never `checkout` or `reset` over changes you
  did not make. Ask before `git init` or creating a repository.
- Decide where raw material goes before downloading it: outside the repo, or
  in an ignored path confirmed with `git check-ignore`. PDFs, archives, clones,
  scrapes, and build output stay out of Git unless your user says otherwise.
  Ask when unsure.

## Understand the material and the reader

**Inventory before scaffolding.** List the sources (README, code, upstream
docs, old site, PDFs, archives, data), their editions, languages,
completeness, and licence, and where each will go. For a large conversion keep
the inventory machine-readable, with revisions and checksums. Ask only about
real ambiguities. Inventories often change the scope: more courses than
expected, a licence that forbids modification, two "translations" that turn
out to be different editions. Report such findings before building.

**Choose surfaces by what the reader does.**

| Reader wants to… | Surface |
| --- | --- |
| understand a product and choose a next step | Landing: `data/home/<lang>.yaml` or `layout: landing` (never `type: landing`) |
| do a task or look something up | Docs: `type: docs` |
| read in order and cite figures | Book: `type: book` |
| follow dated posts and releases | Blog: `type: blog` |
| browse albums | Expo: `type: expo` |
| download versioned files | records in `data/download/` |
| explore an HTTP API | Swagger: `type: swagger` |

- The shell follows `type`, not the directory, so `/docs/x/` and `/x/` both
  work. A docs tree outside `content/docs/` also needs `sidebar_root_for: self`.
- Keep tutorials, task guides, reference, and essays in separate trees.

**One site or several.**
- Merge works that share readers, languages, release cadence, and maintainer,
  where one search helps. Split them when edition, language mix, licence,
  cadence, or ownership differ. A set of PostgreSQL books started as one
  aggregate site and ended as one site per book.
- A series from one upstream fits one site with a Book per item, such as one
  per major version or one per course. Each Book is a top-level section, so
  the root switcher doubles as a book switcher.
- Search downloads one index per language for the whole site. Size counts when
  merging.
- Short names work best, with the directory, domain, and repository sharing
  one name.
- Choose the default language by the main readership. A translated book
  usually puts its target language at `/`.
- Ask when the decision changes domains or repositories.

**Study the closest real site.** Walk its reader path, then read its source
where it is public. Take the organizing idea, not the config. Everything in
the last column is site code, not an OINK feature. Write-ups of many of these
sites are in the [case library](https://oink.pgsty.com/case/).

| Building | Study | Worth learning | Site-only |
| --- | --- | --- | --- |
| Product with docs | [vchord.pgsty.com](https://vchord.pgsty.com/) ([source](https://github.com/pgsty/vchord.pgsty.com)); [mooncake.pgsty.com](https://mooncake.pgsty.com/) ([source](https://github.com/pgsty/mooncake.pgsty.com)), the newest; also [pig](https://pig.pgsty.com/), [sow](https://sow.pgsty.com/), [piglet.run](https://piglet.run/) | real commands and capabilities on the home page; a provenance line; download facts that match releases; one `/docs/` root with `upstream_*` | highlighted quick-start partials, `bin/sync_download.py` |
| Translated book | [DDIA](https://ddia.vonng.com/) ([source](https://github.com/Vonng/ddia)); [TPME](https://tpme.vonng.com/) ([source](https://github.com/Vonng/tpme)), lean; [PG Internal](https://pgint.vonng.com/) ([source](https://github.com/Vonng/pg-internal)), single language | reading-first home page; editions kept apart (in DDIA, `content/zh` and `tw` are the 2nd edition, `v1*` the 1st, `en` reference only); numbered figures, `xref`, print | people, legal, and contributor partials; `bin/epub`; zh-tw conversion |
| Converted books and courses | [intro.pgsql.cc](https://intro.pgsql.cc/), [feat.pgsql.cc](https://feat.pgsql.cc/), [dalibo.pgsql.cc](https://dalibo.pgsql.cc/) (sites only) | one chapter per page; coverage accounting; a course catalog kept apart from chapter navigation | converters, course data, generators |
| One site, many languages | [doc.pg.center](https://doc.pg.center/) ([source](https://github.com/pgsty/doc.pg.center)): 8 languages including RTL Arabic; manuals at `/patroni/` and similar | language pairing, Duo View, an upstream registry, checks on rendered anchors | home partials, coverage scripts |
| Large docs on two domains | [pigsty.cc](https://pigsty.cc/) ([source](https://github.com/pgsty/pigsty.cc)) and [pigsty.io](https://pigsty.io/) ([source](https://github.com/pgsty/pigsty.io)) | split between orientation, tasks, and reference; ZH→EN sync | product home page, extension catalog |
| Personal blog | [vonng.com](https://vonng.com/) ([source](https://github.com/Vonng/vonng.com)) | topic-led home page; a restrained selection of recent posts; consistent cards | `hero-featured`, `column-cards`, `recent-posts`, `link-cards`; `data/works.yaml` |
| Albums or exhibition | [OINK Expo albums](https://oink.pgsty.com/expo/) and `docs/write/expo` | one album per topic with a chosen cover and order; for an archive, a narrative by period or work beside a biography and works index | — |
| Company or landing | [pgsty.com](https://pgsty.com/) ([source](https://github.com/pgsty/pgsty.com)), [caps.vonng.com](https://caps.vonng.com/) ([source](https://github.com/Vonng/caps.vonng.com)) | accurate products; facts kept in the footer | pgsty.com's hand-written `layouts/index.html` (don't copy it); the CapsLock configurator |
| Topical guide | [us.vonng.com](https://us.vonng.com/) ([source](https://github.com/Vonng/us.vonng.com)), [sg.vonng.com](https://sg.vonng.com/), [cloudexit.org](https://cloudexit.org/) ([source](https://github.com/cloudexit/cloudexit.org)) | clear reading entries instead of decoration | us and sg are older `themes/oink` copies |
| Baseline | [oink-starter](https://github.com/pgsty/oink-starter); [oink.pgsty.com](https://oink.pgsty.com/) ([source](https://github.com/pgsty/oink.pgsty.com)) | clean config; runnable component examples | the docs site's large config; never the theme's `tests/site/` |

## Build the skeleton

- **New site.** Use the Starter ("Use this template"). Build after each layer:
  1. Languages. The default is en+zh+fr. Before other edits, copy
     `examples/hugo.single.yaml` or `hugo.bilingual.yaml`, or set
     `disableLanguages`.
  2. Identity: `title`, `baseURL`, copyright, repository links.
  3. One home page, then its translations.
  4. Content and navigation.
  5. Brand and reader features.
  6. Integrations.
  7. Production build, then deploy.
- **Existing Hugo site.**
  - Keep the content and the config file name; run `hugo mod init` if needed.
  - Run `hugo mod get github.com/pgsty/oink@<tag>` and add `module.imports`.
  - Merge the markup settings below rather than replacing your config.
  - Review site `layouts/`, old shortcodes, and `type`/`layout` values.
- **Docsy or an old OINK site.** Follow `docs/admin/upgrade` and the migration
  toolkit in the theme's `bin/migrations/`. For `oink06.py`: `report`, then a
  dry-run `migrate`, then `--write`, then `check`. Use `book_figures.py` for
  legacy figure markup. A second run must change nothing.
- **Required site config.** Hugo does not merge a theme's `markup`, so every
  site sets these itself:
  - `goldmark.renderer.unsafe: true`
  - `goldmark.parser.attribute.block: true`
  - `goldmark.parser.wrapStandAloneImageWithinParagraph: false`
  - `markup.highlight.noClasses: false`
  - passthrough when the site has math (never single `$`)
- **Opt-in features.** Set `params.offline_search: true` for search. Request
  extra outputs in an explicit `outputs` block; each kind's list replaces the
  theme's.
- **Git hygiene.** Commit `go.mod` and `go.sum`. Ignore `public/`,
  `resources/`, `.hugo_build.lock`, and caches. Never commit `go.work` or a
  module replacement.
- **Usual shape.**
  - A Makefile with `dev`/`build`/`check` that sets
    `GOWORK=off HUGO_MODULE_WORKSPACE=off`; checks build to a temp directory.
  - An `AGENTS.md`: mission, sources and licences, layout, hard rules,
    verification gate.
  - A `CLAUDE.md` containing `@AGENTS.md`.
  - The Starter's `make dev` previews a sibling `../oink` theme checkout
    through `HUGO_MODULE_REPLACEMENTS`. `serve` and `build` use the pin.
- **Representative route first.** Finish home → section index → content page,
  plus its translation. Settle navigation, type, images, and the conversion
  method on that route before scaling.

## Write and convert content

- **Native Markdown first.** `> [!NOTE]` callouts; `{.steps}`, `{.cards}`, and
  `{.fields}` attribute lines; fenced tabs; `filetree` fences; image attribute
  lines. Use a shortcode only where the docs say the native form falls short.
  No shortcodes in headings, and no footnotes inside shortcode bodies.
- **Every directory** has an `_index.md`. Weights go in steps of ten. Any
  heading that will be linked or translated gets an explicit `{#id}`. Each
  page has a one-sentence `description`.
- **Provenance is built in.**
  - Set `upstream_link` with `upstream_name`, `upstream_copyright`,
    `upstream_license` (SPDX), and `upstream_notice`, usually through
    `cascade` or a `data/upstreams` entry named by `upstream_source`. A missing
    key omits the credit and warns.
  - Keep the site licence separate from upstream licences. Disclose special
    terms as written.
  - When a licence forbids modification or translation, stop and ask.
- **Upstream material.**
  - Work on copies. Fact-check against the code at the pinned tag: one set of
    old docs said `source_uri` where the code says `src_uri`.
  - Map old URLs to `aliases`, and keep old major versions in a labelled
    archive.
  - Make links into the upstream domain site-relative. Replace `git://` and
    similar schemes: OINK components drop them and the output checker rejects
    them.
  - Dead sites: use Wayback CDX, take the newest readable snapshot per URL, and
    keep a manifest with snapshot times and hashes. A snapshot time is not a
    content date.
- **Account by kind, not by file.** Check the source item by item: works,
  chapters, figures, tables, footnotes, code, images, links. Label partial
  material honestly: "summary only", "Beta, not GA", sample data.
- **Archives.** One page per work, not per file or image. Merge fragments. Give
  a complete index and a search page. Remove every conversion trace.
- **Prose.** Concrete tasks and facts. No filler, no invented numbers, no
  AI-flavoured copy. When tightening, keep limits, conditions, and reasoning.
  Test each cut by asking what the reader would get wrong without it.

**Books.** One chapter per page, with every link and internal reference
complete.
- **Setup.** Name the edition and variant you convert.
  - The root `_index.md` has `type: book`, `cascade: {type: book}`, and
    `outputs: [HTML, print, markdown]`.
  - Each chapter directory has a hand-written `book_number` and `weight`.
  - Images live in page bundles.
- **Conversion.**
  - Keep the converter and its README in `scripts/` for the next edition.
  - Convert two samples, review them with your user, then run the rest.
  - PDF traps: reading order, broken lines and identifiers, tables that cross
    pages, numeric output read as headings.
- **Markup.**
  - Figures, tables, and `$$` equations take an attribute line touching the
    block: `{#id num="2-1" caption="…"}`.
  - Examples put `num`, `caption`, and `#id` on the code fence.
  - Use `xref` for references. Put `book-toc` and the `book-*` index
    shortcodes on the book home.
  - PostgreSQL `$$` stays inside code; a SQL chapter has no KaTeX.
- **Checks.**
  - Counts against the source; footnote links both ways.
  - Whole-book print: anchors, cross-chapter links, page count.
  - `index.md`, and the theme's `bin/check-book.py --site-public public`.
  - Leave the status at `failed` when it failed. Keep errata apart from the
    original text.
- **Several books.** One session or subagent per book. A coordinator assigns
  them and accepts results in waves.

**Languages.**
- **File model.** New sites pair files (`page.md` + `page.zh.md`). Existing
  sites keep their model; DDIA uses per-language `contentDir`. Never mix the
  two. Enable only languages with real content.
- **Peers.** Paired pages share `weight`, `date`, `aliases`, and heading IDs
  and order. Each enabled language needs its own:
  - `data/home/<lang>.yaml` (without it, English shows up silently);
  - footer data;
  - menus with matching identifiers.
- **Gaps.** Never fill a gap with the original text or mixed languages. A
  placeholder says the page is untranslated and links the source. Otherwise
  leave the route out. Different editions are not translations of each other.
- **Bundles.** Unsuffixed resources are shared. A bundle with only
  `index.zh.md` needs `.zh.`-suffixed resources.
- **Duo View** (`params.ui.compare: true`) needs:
  - a published same-origin translation;
  - CSP `frame-src 'self'`;
  - analytics guarded by `window.OinkComparePane`.

  Aligned heading IDs make Sync Scroll accurate.
- **Credits.** Name author and translator where the translation is published.
  Ask the translator whether to appear on source-language pages. Keep
  translation wording to a dedicated translation workflow; this skill covers
  the site.

## Home page and design

**Mechanics that bite** (the details are in `customize/home`):
- **Structure.** The home page is `data/home/<lang>.yaml`: a `sections` list
  plus named keys, with 22 built-in types. A misspelled type warns and is
  skipped.
  - `{type: cards, key: chapters}` tells two instances apart.
  - `partial:` renders a site template; prefix its name with the site.
- **Data.**
  - Write internal URLs without a leading slash.
  - Facts such as stars, prices, and avatars are committed data.
  - The footer lives in `data/footer/<lang>.yaml`, never in home data.
- **Links.** Landing `cards` link through an action row, so a whole-card click
  needs scoped site CSS. In content pages, Markdown `{.cards}` lists are
  already whole-card links.
- **Highlighting.** Chroma highlights `code-plate`, `preview`, and fences
  inside Markdown fields. It does not highlight `command-box`, `steps`, or
  `capabilities` lines.
- **Presets.** Sites maintained by the OINK project use
  `params.ui.preset: paper`, `preset_menu: [paper, slate, ink, terminal]`,
  and `dark_mode: true`; it is a good default when readers should choose.
- **Brand.** Change it only through config and public tokens:
  - `params.logo`/`wordmark` and favicons in `static/`;
  - `theme_color`, per section through `cascade`;
  - `params.ui.fonts`, `--td-brand-*`, and the eight font-role properties.

  Set light and dark values in pairs. Never edit theme files, and load no
  remote fonts or CSS.

**Review standards from OINK's own sites:**
- **Substance first.** The first screen names a specific subject and offers a
  useful next step. A book offers reading and contents; a product, a working
  command and docs; an exhibition, a narrative way in. Never invent numbers,
  savings, star counts, status lights, or unshipped features.
- **No orphans.** A few characters stranded on a new line are the defect the
  maintainers reject most often.
  - A line either fits on one line or fills two balanced lines, in every
    language and at every width.
  - Fix it by rewriting the copy or adjusting width and size.
  - Never fake it with an ellipsis, a line clamp, or a fixed `nowrap`.
- **Rhythm fits the content.** Cards in a row have the same number of lines.
  The grid fits the item count: 6 items make 3×2, not 4+2. Long commands get
  width; short claims get compact cards.
- **Restraint.**
  - None of the following: decorative numbering, count badges, eyebrows that
    repeat the title, pulse dots, glassmorphism, terminal chrome.
  - Badges only for real status.
  - Whole cards are links; there are no "View more" buttons.
  - Copy is specific. An intro line earns its place or goes.
- **Faithful people and facts.**
  - Show real authors and translators with photos and links. Never credit an
    AI tool as translator.
  - Give exact provenance: "Fork of X · originally by Y · maintained by Z ·
    licence".
  - Put the legal entity and address only in the footer or a Company page.
  - Balance footer columns and keep labels to one line.
- **Keep what was approved.** Removing a frame is not removing the image.

**Shapes that worked**, as starting points:
- **DDIA book home:** hero with cover and three reading actions →
  author/translator cards → preface → parts and chapters → rights →
  contributors.
- **vchord product home:** hero with provenance → compact facts → quick start
  → docs grid → FAQ → CTA.
- **vonng.com:** portrait, small eyebrows, fitted grids.
- **us.vonng.com:** text on the left, the original image on the right, one card
  per part.

Design for the material in front of you; these orders are not quotas.

**CSS rules.**
- Site styles go in `assets/scss/_styles_project.scss`, scoped under a site
  prefix or a section `class`.
- Never restyle `.td-*` globally or use a global `!important`.
- Check every preset in the menu in both light and dark, plus RTL, print, and
  narrow screens.
- LibSass needs `unquote()` around CSS `min()`/`max()`.

## Extensions

- **Theme first.** Use theme features before writing your own. Configurators,
  generators, sync scripts, custom partials, and CSS are site extensions.
  - Put them in the narrowest hook: `layouts/_partials/hooks/head-end.html`,
    `body-end.html`, or a section's `partial:`.
  - Name them in the site's `AGENTS.md`, and never call them OINK features.
  - When several sites need the same one, propose it upstream through the
    [design proposals](https://oink.pgsty.com/docs/design/proposals/) process
    or an issue on <https://github.com/pgsty/oink>.
- **No copies.** Don't copy a shell or `baseof.html` for one change. Don't build
  new home pages as a hand-written `layouts/index.html` with `static/css`.
- **Integrations stay off** until they are chosen completely.
  - Giscus and GA need the project's own IDs.
  - `share` is an explicit list.
  - Assistant links send the URL to a third party.

Within that boundary, invent freely: a new section partial, a data-driven
index, an unusual reading path. Do it when the content calls for it.

## Verify, report, publish

```bash
unset HUGO_MODULE_REPLACEMENTS; export GOWORK=off HUGO_MODULE_WORKSPACE=off
hugo mod graph | grep github.com/pgsty/oink
hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings
git status --short
```

- **Pass criteria.** The build prints `Total in …` with no ERROR, and you have
  read every WARN. The LibSass deprecation notice is expected.
  - Never use `--panicOnWarning` or `HUGO_PANICONWARNING`.
  - Most bad input warns and falls back. Unresolved `ref`/`relref` and leftover
    `blocks/*` fail the build.
  - Add `--printI18nWarnings` on multilingual sites. Use the real `--baseURL`
    for subpaths, never `canonifyURLs`.
- **Checks, as relevant.** Run the theme's checkers from a checkout of
  <https://github.com/pgsty/oink> at the pinned tag.
  - the site's own `make check`;
  - `bin/check-output-security.py --public <dir> --base-url <url>`;
  - `bin/check-book.py`;
  - internal links;
  - rendered heading IDs of one translated pair;
  - `index.md` and `llms.txt`.
- **Browser review.**
  - Each language root, plus one page of each surface.
  - Desktop and about 390 px; light and dark, and each preset offered.
  - Language switching lands on the peer page.
  - Search, anchors, long code and tables, keyboard use, print, 404, and
    landing pages with JS off.
  - To hunt orphans across many pages, measure line boxes.

  Your user's eye is the acceptance test. A green build proves only that the
  build passed.
- **Report.**
  - Name the reference you followed, the files you changed, the checks you ran
    and what you did not cover, where to preview, and what remains.
  - Keep the states separate: source complete → locally validated → committed
    → pushed → deployed → production verified.
  - Commit, push, deploy, or touch DNS only when asked. Commit in logical
    batches, and make a baseline commit before a redesign.
- **Deploy.**
  - One production path; the Starter ships GitHub Pages and Cloudflare Direct
    Upload.
  - Pin Hugo in CI and on the host; drift in `HUGO_VERSION` has broken builds.
  - Use `fetch-depth: 0` with `enableGitInfo`, and `--environment staging`
    for previews.
  - Files in ignored paths are missing from a deploy built from Git.
  - After deploying, check the canonical URL, sitemap, robots, search index,
    language switching, and 404 at the public URL.
  - Roll back by redeploying, never by editing production.
- **Upgrade.**
  - Read every release note between the two pins. Run
    `hugo mod get …@<tag>` and `hugo mod tidy`. Source copies and submodules
    update separately.
  - Migrate old syntax with the toolkit. Keep the site's preset policy.
  - Commit the pin separately from content.

## Failures worth remembering

- **Wrong repository.** A company site was built in the wrong directory until
  the maintainer asked why it was not the topical site that directory held.
- **Template pastiche.** Generic visuals were rejected outright. A global
  `!important` overrode about 1,800 lines of site SCSS, and a
  `git checkout HEAD` then destroyed the uncommitted styles.
- **"Zero warnings" gates.** They pulled in a Dart Sass dependency that was
  later revoked; ordinary users must not need an extra Sass install.
- **Silent breakage.**
  - `$$` in SQL rendered as math.
  - Numbers were read as headings.
  - PDFs in an ignored `static/` were missing from the deploy.
  - Chinese pages linked to English books through broken `/zh/` routes.
- **False "done" reports.**
  - Completeness claimed from file counts.
  - A Beta edition labelled GA.
  - Failing links hidden behind "done".
  - Prose over-trimmed until it lost 16 conditions.
