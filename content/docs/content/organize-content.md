---
title: Organize your content
weight: 30
icon: fa-solid fa-folder-tree
description: Structure documentation around reader goals and content types.
aliases:
  [/docs/best-practices/organizing-content/, /docs/tutorial/organize-content/]
---

Oink derives the documentation sidebar from Hugo's content tree. The directory
structure is therefore part of the reader experience, not just a source-code
detail. Start with the questions readers need answered, then create the smallest
hierarchy that makes those answers easy to find.

## Start from reader goals {#start-from-reader-goals}

Give new readers a short path from product context to a successful first task.
Give returning readers direct routes to procedures, reference material, and
troubleshooting. A practical documentation set usually needs:

- an overview that establishes scope and product boundaries;
- a get-started path that produces a working result;
- task-oriented guides for common jobs;
- reference pages for parameters, APIs, and compatibility;
- troubleshooting for predictable failure modes.

Examples are useful when readers can copy or compare them, but they should not
replace the procedure or reference that explains the behavior.

## Use predictable content types {#use-predictable-content-types}

Keep pages focused on one reader intent:

| Content type    | Reader question                               |
| --------------- | --------------------------------------------- |
| Overview        | What is this, and when should I use it?       |
| Tutorial        | How do I reach a first working result?        |
| How-to guide    | How do I complete one specific task?          |
| Reference       | What fields, commands, or interfaces exist?   |
| Explanation     | Why does the system behave this way?          |
| Troubleshooting | How do I diagnose and recover from a failure? |

Do not create an empty top-level section merely to mirror an organization chart.
Add a section when several pages share a stable reader purpose.

## Keep the hierarchy shallow {#keep-the-hierarchy-shallow}

Prefer a short, explicit route over a deep classification tree. Use page weights
to establish a learning sequence, and keep related page weights spaced
consistently so new pages can be inserted without renumbering the entire
section. Add an icon and concise description to every navigable page so the
sidebar and section indexes remain scannable.

See
[Adding content](/docs/content/adding-content/#organizing-your-documentation)
for Hugo's bundle and section model, and
[Navigation and menus](/docs/content/navigation/) for sidebar behavior.

## Plan languages together {#plan-languages-together}

Create the English source and Simplified Chinese peer in the same directory.
Keep page order, intent, examples, and stable heading IDs aligned. If the two
languages need different prose lengths, preserve the same information rather
than forcing sentence-for-sentence symmetry.

## Review the complete route {#review-the-complete-route}

After moving or adding pages, review the documentation landing page, section
index, sidebar, breadcrumbs, previous/next navigation, local search, and every
homepage link. Build both languages and validate rendered fragment links before
publishing.
