---
title: Take over the site
linkTitle: Take over the site
description: Run the preview yourself, learn which file controls what, review the agent's work against one checklist, and keep improving the site with small follow-up prompts.
book_kind: chapter
book_number: 2
weight: 20
---

The agent's session ends; the site should not end with it. Before you ask for
more, make sure you can run the site without the agent, know where each kind
of change lives, and have checked the result yourself. That takes about twenty
minutes and turns a generated site into one you own.

## Run it yourself {#preview}

Start the preview from the site's directory and open the address Hugo prints:

```bash
cd my-site
hugo server
```

The first start takes longer while Hugo downloads the pinned OINK release into
its module cache. Then change one sentence on the home page, in
`data/home/en.yaml` or whichever language file the agent wrote, and save. The
browser reloads by itself. When your own edit shows up, you no longer depend on
the agent for small changes.

## Know the five places {#anatomy}

An OINK site is an ordinary Hugo repository. Almost every change you will make
lands in one of five places:

```filetree {title="An OINK site, by where changes go"}
- hugo.yaml           # site-wide: title, baseURL, languages, menus, params.ui
- go.mod              # the OINK release the site is pinned to
- content/            # every page; the path is the URL, *.zh.md is the Chinese peer
  - docs/
  - blog/
- data/               # the home page sections, download records, footer links
  - home/
- assets/             # logo, images to process, css/project.css
- static/             # files served exactly as they are
- layouts/            # template overrides; ideally empty
- .github/workflows/  # the deployment pipeline
```

`content/` and `data/` change every week, `hugo.yaml` changes the whole site at
once, and `go.mod` changes only when you upgrade OINK. `layouts/` deserves a
look on day one: a file there replaces a theme template and stops receiving the
theme's fixes, so every override should exist for a reason you can name.
[Starter repository tour](/docs/start/anatomy/) explains each file the Starter
ships.

## Review what you got {#review}

The agent checked its work, but you are the reader the site is for. Go through
these with the preview open:

| Check | How | What it catches |
| --- | --- | --- |
| Every language | Switch languages from the navbar on three different pages | Pages the agent translated in one language only |
| Every look | Press {{< kbd "T" >}} to cycle presets and {{< kbd "Y" >}} to cycle light and dark | Custom colors that are unreadable in one mode |
| A phone | Narrow the window to about 390 pixels | Wide tables, hero images and long code lines |
| Search | Press {{< kbd "/" >}} and search for a word from your own pages | A missing or stale search index |
| The Markdown copy | Append `index.md` to a page address | Components that read badly as plain text for AI readers |
| Overrides | List the files under `layouts/` and `assets/css/` | Templates copied from the theme without a reason |
| Placeholders | Search the repository for `<`, `TODO` and `example.com` | Facts the agent could not know and left for you |
| The production build | Run the command below and read every warning | Settings OINK ignored and replaced with a safe default |
{#tbl-first-review num="2-1" caption="A first review of an agent-built site, in about twenty minutes."}

The production build is the one your host will run:

```bash
hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

It ends with a `Total in …` line. Read the warnings above it: OINK reports a
mistyped key or an incomplete integration as a warning and keeps building, so a
warning usually means a feature you expect is switched off rather than a broken
site.

## Improve it with follow-up prompts {#follow-up}

Ask for one change per prompt, and say how the agent should check it. A small
change comes back as a small diff that you can read in a minute; "make the site
better" comes back as forty files you cannot review.

```text {num="2-1" caption="Follow-up prompts, each one reviewable change." #eg-follow-ups}
Change the accent color to #0f766e for the whole site and to #6d28d9 for the
blog only. Check both in light and dark mode.

Translate every page under content/docs/get-started/ into Simplified Chinese.
Keep the front matter weights and every heading ID identical to the English.

The install page is too long. Split it into one page per platform under
content/docs/install/, and keep the old address working with aliases.

Run the production build and fix every warning. Explain each fix in one line.
```

Edit the files yourself when that is quicker than describing the change: a
sentence, a menu label, a date. Ask the agent for changes that touch many files
at once, such as a translation pass or a restructure, and for settings you have
not learned yet. Part II teaches those settings, so that over time you can tell
the agent exactly which key to change, or change it yourself.

## Save a baseline {#baseline}

Commit the site as it is now, so every later session shows up as a diff
against a version you reviewed:

```bash
git init        # skip if the agent already created the repository
git add -A
git commit -m "Initial site from the OINK Starter"
```

The Starter's `.gitignore` already keeps `public/`, `resources/` and Hugo's
caches out of Git. Note the Hugo version (`hugo version`) and the OINK release
in `go.mod` beside the commit; when something changes later, those three facts
tell you whether the content, the theme or the toolchain moved.

## Where Part II goes {#part-two}

Part II rebuilds the same kinds of features by hand, on one sample project:
the documentation site of Acme DB, an open-source time-series database, started
from the [OINK Starter](https://github.com/pgsty/oink-starter). Each chapter
adds one layer, shows the source beside its result on this page, and ends with
a prompt for doing the same on your own site.
[Chapter 3](/book/03-pages/) starts with a single page.
