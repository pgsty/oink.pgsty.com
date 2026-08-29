---
title: Start with a working site
linkTitle: Start with a working site
description: Install the one required tool, run a local preview, and establish a visible baseline before changing the design.
book_kind: chapter
book_number: 1
weight: 10
---

A good tutorial begins with a result the reader can see. For OINK, that result
is the official Starter served locally by Hugo Extended—before any logo,
palette, language set, or content architecture is changed.

## Define the outcome {#outcome}

At the end of this chapter you should have English, Chinese, and French home
pages; working Docs, Blog, and Book routes; local search; and a color-mode
control. That small baseline is enough to distinguish a content mistake from a
theme or deployment problem later.

![The OINK documentation site after its first successful local build](/images/oink.webp)
{#fig-first-preview num="1-1" caption="The first milestone is a site a reader can open, not a configuration file that merely looks plausible." width=600 height=300}

## Install the prerequisite {#prerequisite}

The current Starter needs Git, Go 1.27 or newer, and Hugo Extended 0.165.0 or
newer. OINK's lower declared compatibility floor remains 0.160.1, but the
Starter and its workflows deliberately pin the current tested toolchain.
Node.js is not required.

```console
$ go version
go version go1.27.0 darwin/arm64
$ hugo version
hugo v0.165.0+extended+withdeploy darwin/arm64
```

## Run the preview {#preview}

Create a repository with GitHub's **Use this template** action when it will
become a real project. To evaluate the original locally, clone it and start
Hugo:

```console
$ git clone https://github.com/pgsty/oink-starter.git my-docs
$ cd my-docs
$ hugo server
```

Open the address Hugo prints. Change one sentence in `data/home/en.yaml` and
confirm that the browser shows it. A preview that responds to a content edit is
more useful evidence than a terminal that only says the server started.

## Record the baseline {#baseline}

Before customizing anything, record four facts: the Hugo version, the theme
version in `go.mod`, the commit under review, and the routes you opened. Chapter
2 turns that running site into a content tree without losing this baseline.

For the complete layered workflow, see [Use OINK Starter](/docs/start/starter/).
For installation without the template, see [From scratch](/docs/start/from-scratch/).
