---
title: Start with a working site
linkTitle: Start with a working site
description: Install the one required tool, run a local preview, and establish a visible baseline before changing the design.
book_kind: chapter
book_number: 1
weight: 10
---

A good tutorial begins with a result the reader can see. For OINK, that result
is a bilingual site served locally by Hugo Extended—before any logo, palette,
or content architecture is changed.

## Define the outcome {#outcome}

At the end of this chapter you should have an English home page, its Chinese
peer, working Docs and Blog routes, local search, and a color-mode control. That
small baseline is enough to distinguish a content mistake from a theme or
deployment problem later.

![The OINK documentation site after its first successful local build](/images/oink.webp)
{#fig-first-preview num="1-1" caption="The first milestone is a site a reader can open, not a configuration file that merely looks plausible." width=600 height=300}

## Install the prerequisite {#prerequisite}

OINK consumers need Hugo Extended 0.160.1 or newer. Node.js is part of this
repository's maintainer test harness, not a requirement for building an
ordinary consuming site.

```console
$ hugo version
hugo v0.160.1+extended
```

## Run the preview {#preview}

Clone the documentation site, enter the checkout, and start Hugo with drafts,
future content, and expired content visible:

```console
$ git clone https://github.com/pgsty/oink.pgsty.com.git my-docs
$ cd my-docs
$ hugo server -DFE --disableFastRender
```

Open the address Hugo prints. Change one sentence in `content/_index.md` and
confirm that the browser shows it. A preview that responds to a content edit is
more useful evidence than a terminal that only says the server started.

## Record the baseline {#baseline}

Before customizing anything, record four facts: the Hugo version, the theme
version in `go.mod`, the commit under review, and the routes you opened. Chapter
2 turns that running site into a content tree without losing this baseline.

For the complete installation alternatives, see [Quick start](/docs/start/)
and [From scratch](/docs/start/from-scratch/).

