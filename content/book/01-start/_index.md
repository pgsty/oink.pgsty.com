---
title: Build a site from one prompt
linkTitle: Start from a prompt
description: Give a coding agent the OINK skill, a production OINK site to model on and the facts about your project, and review a working site the same session.
book_kind: chapter
book_number: 1
weight: 10
---

You do not have to learn OINK before you have an OINK site. Open a coding
agent such as Claude Code or Codex in an empty directory, point it at the OINK
skill and at a published site that looks like the one you want, and tell it
about your project. The agent starts from the Starter, reshapes it after the
model, checks the result in a browser and reports what is left. This chapter
gives four such prompts, each modeled on a production site, and the pattern
for writing your own.

```gallery
![vonng.com, a personal blog with columns and immersive articles](/case/vonng-com/featured.webp) # A personal blog {link=/case/vonng-com/}
![silo.pgsty.com, the site of an open-source object store](/case/silo/featured.webp) # An open-source project site {link=/case/silo/}
![pig.pgsty.com, the manual of a command-line package manager](/case/pig/featured.webp) # A command-line tool site {link=/case/pig/}
![ddia.vonng.com, a multilingual book](/case/ddia/featured.webp) # A book {link=/case/ddia/}
```

## Before you start {#before}

The agent runs Git, Go and Hugo on your machine, so install them first; the
supported versions are listed in [Get started](/docs/start/#tools). Then make
an empty directory for the site and start the agent inside it:

```bash
mkdir my-site && cd my-site
claude        # or codex, or any agent that can run commands and open a browser
```

Every prompt below begins by sending the agent to
`https://oink.pgsty.com/skill.md`, the OINK skill: one Markdown file holding
the build process, the review standards of OINK's own sites and the mistakes
earlier builds made. Reading it from the URL needs no installation. If you
build sites often, [install it as a skill](/docs/start/#agent-skill) and start
your prompts with "Use the oink-site skill" instead.

Replace everything in `<angle brackets>` with your own facts before you send a
prompt. Keep the line about not copying the model site: the four sites below
are open source, but their articles, images and names belong to their
authors.

## A personal blog like vonng.com {#blog}

[vonng.com](/case/vonng-com/) is an engineering blog with more than a thousand
essays in two languages. Each column is a top-level section with its own feed,
column indexes are card grids, and articles open on a full-width image with the
outline running beside the text. Model on it when you write regularly and want
the site to read like a publication rather than a manual.

```text {num="1-1" caption="A personal blog modeled on vonng.com." #eg-prompt-blog}
Read https://oink.pgsty.com/skill.md and follow it to build my personal blog
with OINK in this empty directory.

Model it on https://vonng.com (source: https://github.com/Vonng/vonng.com):
- Each column is a top-level section with its own RSS feed.
- Column indexes are card grids that readers can switch to a list or a table.
- Articles open with a full-width hero image, keep the outline beside the
  text, and end with share buttons.
- Author pages, series and tags are enabled; the home page introduces me
  with a photo and then lists the columns.
- Paper look by default, with dark mode and all four presets in the
  Appearance menu.

About me: <name>, <one-line bio>, writing about <databases and operations>.
Domain: <blog.example.com>. Languages: <English, with Chinese translations>.
Columns: <Engineering, Notes, Travel>.

Borrow structure, configuration and design only; do not copy vonng.com's
articles, images or branding. Write three placeholder posts in my voice.
When it builds, run hugo server, check it in a browser at desktop and phone
widths, and tell me what is still missing.
```

Expect one directory per column under `content/`, an author profile under
`content/authors/`, and `hugo.yaml` settings such as `blog_index: cards`,
`featured_image: hero` and `toc_style: flow`. [Chapter 6](/book/06-blog/)
explains each of them. Open a column and press {{< kbd "L" >}} to cycle its
index layouts, then open a post and check the hero image, the outline and the
author byline.

## An open-source project site like silo.pgsty.com {#project}

[silo.pgsty.com](/case/silo/) serves SILO, an S3-compatible object store: a
bilingual manual of about four hundred pages per language, release notes in a
blog, a download page, case studies, and a home page assembled from data files
with metrics and project cards. Model on it when your project has users who
install it, configure it and upgrade it.

```text {num="1-2" caption="An open-source project site modeled on silo.pgsty.com." #eg-prompt-project}
Read https://oink.pgsty.com/skill.md and follow it to build the website for
my open-source project with OINK in this empty directory.

Model it on https://silo.pgsty.com (source: https://github.com/pgsty/silo.pgsty.com):
- A Docs tree: Get started, Configuration, Operations, Reference.
- A Blog with one release-notes post per version.
- A Download page with assets and checksums, kept in data/download/.
- A data-driven home page: hero, metrics, feature cards, a call to action.
- Local search, plus a Markdown copy of every page and an llms.txt.

My project: <name>, <one-line description>, repository <https://github.com/you/project>.
Use its README, docs/ folder and CHANGELOG.md as the source, and keep every
command and configuration key exactly as written there.
Domain: <project.example.com>. Languages: <English and Simplified Chinese>.

Borrow structure, configuration and design only; do not copy SILO's text,
logo or screenshots. When it builds, run hugo server, check both languages in
a browser at desktop and phone widths, and list the pages that still need
real content.
```

Expect `content/docs/` with an `_index.md` per section, `content/blog/release/`,
a home page in `data/home/en.yaml` and its translation, and `data/download/`
records feeding the download page. [Chapter 3](/book/03-pages/) covers how
the tree becomes the sidebar, and [Chapter 8](/book/08-design/) the home page.
Switch languages from the navbar and press {{< kbd "/" >}} to try search.

## A command-line tool site like pig.pgsty.com {#cli}

[pig.pgsty.com](/case/pig/) documents PIG, a package manager for PostgreSQL
extensions. Its manual is deliberately small, about twenty pages per language
with one page per subcommand, while a blog of fifty posts carries release
notes and longer explanations. Model on it when the reference is short and
stable and the news needs room to grow.

```text {num="1-3" caption="A command-line tool site modeled on pig.pgsty.com." #eg-prompt-cli}
Read https://oink.pgsty.com/skill.md and follow it to build the website for my
command-line tool with OINK in this empty directory.

Model it on https://pig.pgsty.com (source: https://github.com/pgsty/pig.pgsty.com):
- A shallow manual: Install, Getting started, and one reference page per
  subcommand. Each reference page documents its flags as a field list.
- Install commands for each platform as tabs.
- A Blog with release notes for every version in CHANGELOG.md.
- A home page with a copyable install command and a few metrics.
- "Open in ChatGPT" and "Open in Claude" in the page actions.

My tool: <name>, repository <https://github.com/you/tool>. It is installed
on this machine: run `<tool> --help` and `<tool> <subcommand> --help` for
every subcommand and draft the reference pages from that output.
Domain: <tool.example.com>. Languages: <English and Simplified Chinese>.

Borrow structure, configuration and design only; do not copy PIG's text or
branding. When it builds, run hugo server, check it in a browser, and tell me
which help texts were too thin to document.
```

Expect a page per subcommand, a `{.fields}` table of flags on each, and install
tabs built from adjacent code fences; [Chapter 4](/book/04-components/) shows
both. The assistant links need one setting, which
[Chapter 10](/book/10-ship/) explains along with the other outputs written for
agents.

## A book like ddia.vonng.com {#book}

[ddia.vonng.com](/case/ddia/) publishes *Designing Data-Intensive
Applications* as a multilingual book: two dozen chapters per edition in
Simplified and Traditional Chinese and English, more than 130 numbered figures,
tables and examples, cross-references that survive chapters moving, a glossary,
and the whole book as one printable document. Model on it for any long work
read in order: a handbook, a course, a translated book.

```text {num="1-4" caption="A book modeled on ddia.vonng.com." #eg-prompt-book}
Read https://oink.pgsty.com/skill.md and follow it to publish my book with
OINK in this empty directory.

Model it on https://ddia.vonng.com (source: https://github.com/Vonng/ddia):
- A type: book tree with numbered chapters, a preface and a glossary.
- Numbered figures, tables and code examples, with xref cross-references
  instead of hand-written "see Figure 3" links.
- A contents page with lists of figures, tables and examples.
- Whole-book print, so readers can save the book as a PDF.
- Command palette entries for "Start reading" and "Print the whole book".

My manuscript: <the Markdown files in ./manuscript, or book.pdf>, <title>
by <author>. I hold the rights to publish it. Keep the wording exactly as
written; only convert the structure.
Domain: <book.example.com>. Languages: <Simplified Chinese>.

Borrow structure, configuration and design only; do not copy DDIA's text,
figures or cover. Before converting, list the chapters, figures and tables
you found and wait for my confirmation. When it builds, run hugo server and
check the numbering, the cross-references and the print view.
```

The confirmation step matters for a book: an inventory before conversion
catches missing chapters and two files that turned out to be different
editions. [Chapter 7](/book/07-book/) explains numbering, `xref` and the
generated indexes.

## Write your own prompt {#your-prompt}

The four prompts share one shape, and so should yours. Leave a part out and the
agent guesses it, usually from a site that is not yours:

```text {num="1-5" caption="The shape of a site-building prompt." #eg-prompt-shape}
Read https://oink.pgsty.com/skill.md and follow it to build <kind of site>
with OINK in this directory.

Model it on <URL> (source: <repository URL>):
- <each feature of the model you want>

My material: <repository, folder, PDF or old site>; keep <what must not change>.
Facts: name <…>, domain <…>, languages <…>.

Borrow structure, configuration and design only. When it builds, check it in a
browser at desktop and phone widths and report <what you want to hear back>.
```

- **The skill** sends the agent to these docs for syntax and gives it OINK's review standards. Without it, agents tend to write Docsy or older OINK syntax from memory.
- **The model** is a URL plus its source repository, so the agent can read the real configuration instead of guessing from screenshots. List the features you want, because a production site carries many you do not need.
- **Your material** is what the agent writes from. A README, `--help` output, a changelog or an old site produces far better pages than an empty directory, and naming what is authoritative keeps commands and keys intact.
- **The facts** are the things no agent can infer: the name, the domain that becomes `baseURL`, and the languages.
- **The acceptance** says when the work is done. The skill already asks for a browser check; say what you want reported, and add "do not push or deploy" if the directory is a real repository.

### More model sites {#more-models}

Any site in the [case library](/case/) can be the model. These cover the other
common kinds of site:

| You want to publish | Model site | What to borrow |
| --- | --- | --- |
| A company or product landing site | [pgsty.com](/case/pgsty-com/) | A bilingual home page built entirely from landing sections |
| An app with downloads | [caps.pgsty.com](/case/caps-pgsty/) | A centered hero, a download page and a compact manual |
| A catalogue generated from data | [ext.pgsty.com](/case/pgext-cloud/) | Thousands of entries rendered from data files, searchable locally |
| A course or tutorial book | [pgexp.pgsql.cc](/case/pgexp-pgsql/) | Lessons as Book chapters with runnable examples and downloads |
| A photo archive or exhibition | [fzb.vonng.com](/case/fzb/) | Expo albums beside long-form Book pages |
| An existing Docsy site, moved to OINK | [hugegraph.apache.org](/case/apache-hugegraph/) | A brand hero on the Slate preset over migrated bilingual docs |
{#tbl-model-sites num="1-1" caption="More production OINK sites to model a new site on, by kind of site."}

To move an existing Hugo or Docsy site instead of starting a new one, run the
agent in that site's repository and replace the first lines of
{{< xref eg="1-5" anchor="eg-prompt-shape" />}} with "Read
https://oink.pgsty.com/skill.md and follow it to move this Hugo site to OINK";
the skill covers the migration path described in
[Upgrade](/docs/admin/upgrade/#from-docsy).

## What the agent hands back {#handoff}

A finished run ends with a report: what it built, the address of the running
preview, the checks it did, and what is still placeholder text. Open the
address it gives, usually <http://localhost:1313/>, and keep the report.
[Chapter 2](/book/02-take-over/) turns it into your own review, so that the
site stays yours after the agent's session ends.
