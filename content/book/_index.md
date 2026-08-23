---
title: Write Beautiful Docs
linkTitle: Book
description: A practical tutorial for creating clear, beautiful, and maintainable technical content with OINK.
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
  footer_style: slim
  comments: false
  feedback: false
  sidebar_headings: 3
  book_draft_banner: true
---

*Write Beautiful Docs* is the tutorial companion to the OINK reference. The
reference tells you what each parameter and component does; this book follows
one site from its first local preview to a reviewed, published result.

The first three chapters contain working material. Later chapters deliberately
show the Book draft state while their full walkthroughs are being written.

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

## How to read this book {#reading-path}

Read chapters 1–3 in order when starting a site. Return to chapters 4–6 when
you are shaping the public presentation and preparing a release. The appendix
is a copy-and-adapt reference for the front matter patterns used throughout.
