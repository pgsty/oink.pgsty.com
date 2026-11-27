---
title: OINK Hands-On
linkTitle: Book
description: Get a working OINK site from one prompt, then learn its features one layer at a time, from a single page to a published bilingual site.
type: book
icon: fa-solid fa-book-open
weight: 30
book_kind: book
sidebar_root_for: self
sidebar_root_link_self: true
outputs: [HTML, print, markdown]
# The Book/Blog reading shells keep the title bar pinned: long-form reading
# should not make the navbar appear and disappear under the pointer.
navbar_autohide: false
# Section identity: the Book reads in orange. The light half stays readable
# where interactive badges reuse it as ink over a faint wash; the dark half is
# named rather than derived so it stays orange instead of drifting in hue.
cascade:
  theme_color: '#9a3412'
  theme_color_dark: '#fb923c'
  type: book
  navbar_autohide: false
  footer_style: fat
  comments: false
  feedback: false
  book_draft_banner: true
---

The fastest way to an OINK site is to describe it. Part I hands a coding agent
the OINK skill, a published site to follow and the facts about your project,
and gets you a working site in one session. Part II then takes the same kind of
site apart one layer at a time, so you know what the agent built and can
change any of it yourself.

## How to read this book {#reading-path}

| Part | Chapters | Afterwards you can |
| --- | --- | --- |
| I. Quick start | [1. Start from a prompt](/book/01-start/) · [2. Take over the site](/book/02-take-over/) | Build a blog, a project site, a CLI manual or a book from one prompt, preview it, review it and keep improving it with follow-up prompts |
| II. Step by step | [3. Pages](/book/03-pages/) · [4. Components](/book/04-components/) · [5. Diagrams and media](/book/05-media/) · [6. Blog](/book/06-blog/) · [7. Book](/book/07-book/) · [8. Home and appearance](/book/08-design/) · [9. Navigation, search and languages](/book/09-navigation/) · [10. Ship](/book/10-ship/) | Write and structure content, use every kind of component, publish posts and books, shape the home page and the look, help readers find their way in several languages, and deploy and upgrade the site |

If you only want a site, Chapter 1 may be all you need. Part II works on one
sample project, the documentation site for Acme DB, an open-source time-series
database, built from the [OINK Starter](https://github.com/pgsty/oink-starter).
Each chapter adds one layer to it and ends with a prompt that asks your agent
to do the same on your own site.

This book is itself an OINK Book. Its chapters are numbered, its figures,
tables and examples carry numbers that the indexes below collect, the whole
book prints as one document at [`/_print/book/`](/_print/book/), and every
page has a Markdown copy at its address plus `index.md`. Chapter 7 shows how
each of these is written.

## Contents {#contents}

{{< book-toc depth=3 >}}

## Figures {#figures}

{{< book-figures >}}

## Tables {#tables}

{{< book-tables >}}

## Equations {#equations}

{{< book-equations >}}

## Examples {#examples}

{{< book-examples >}}
