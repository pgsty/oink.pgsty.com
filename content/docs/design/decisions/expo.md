---
title: Expo image collections
linkTitle: Expo albums
description: Record the reasons for album bundles, shared appearance, three display modes, and the image viewer.
weight: 60
icon: fa-solid fa-images
design_kind: decision
design_status: accepted
decision_date: 2026-10-13
aliases: [/docs/design/proposals/muse-gallery/]
---

> [!NOTE] Available in OINK 1.3.0
> Expo is included in OINK v1.3.0.

The [Expo contract](/docs/design/expo/) defines required behavior.
The [authoring guide](/docs/write/expo/) explains how to create an album.

## Context {#context}

Docs organizes explanations. Blog organizes posts. Book organizes chapters.
Expo organizes image collections into topics and albums. Readers need to scan
an album, select an image, and inspect its details.

The Graph experiment used a separate copy of an existing collection. It contained
7,658 originals in 149 albums. The images included mixed dimensions, long images,
GIFs, captions, and existing citation anchors. This collection supplied the
initial content and scale requirements.

## Decisions {#decisions}

### One bundle per album {#one-bundle-per-album}

An album is one Hugo leaf bundle: `index.md` and image files. Filenames provide
default titles. Optional `resources` metadata adds descriptions, credits, order,
explicit IDs, and paths to separate originals.

| Model considered | Effect on authoring |
| --- | --- |
| One directory and metadata file per image | Many small files to manage for a large collection |
| One Markdown page per image | Useful when each image needs an article, but adds a page model to every image |
| One bundle per album with optional resource metadata | An album can start with image files and one page; metadata can be added later |

Expo uses the third model. The album owns the URL and reading sequence. Each
image has a fragment anchor. Authors use explicit IDs for lasting citations.
They split large collections into albums themselves. This version has no
resource pagination or separate image database.

### Shared appearance and compact controls {#shared-appearance-and-compact-controls}

Expo is a layout. It uses the existing Paper, Slate, Ink, and Terminal presets
and their light/dark modes. Shared colors, type styles, navigation, and corner
settings keep the album consistent with the rest of the site.

Three adjacent radio cells expose all display choices: Wall, Cards, and Seamless.
The play/pause button and size slider follow them. Icons keep the toolbar compact.
Localized names, tooltips, and focus indicators make the controls usable with
keyboards and assistive technology.

Reader display choices persist across albums and appearance changes. Appearance
controls stay in the navigation. The image toolbar supplies album actions, so
the album body omits the article action menu. The `gallery` fence remains the
component for image groups inside text pages.

### Animation and image viewing {#animation-and-image-viewing}

GIFs play by default. Pause and the system's reduced-motion preference provide
still previews. Readers can start playback explicitly. Lazy loading reduces
initial requests, but large GIFs still transfer the original files. Authors must
consider album size when they group animated images.

The viewer starts at original size and shrinks large images to fit. Expand to fit
uses the smaller width or height ratio. This rule keeps the whole image visible.
Manual zoom, mouse dragging, and WASD movement let readers inspect details.
Q/E and H/L move through the album. J/K control zoom, R resets, and F expands to fit.
These shortcuts apply inside the viewer so they do not also move the page.

Original-file and album-location links preserve access and citation. A native
modal dialog supplies focus containment. Expo loads its own album runtime only
where needed. Ordinary Image Zoom keeps its existing single-image behavior.
Without JavaScript, readers can still use the image links and captions.

### Stable geometry and shared outputs {#stable-geometry-and-shared-outputs}

A width-consuming scrollbar changes the grid width. A new width can change the
row count and total height. Near the viewport boundary, these changes can make
the scrollbar appear and disappear repeatedly. This feedback caused the reported
flicker even when the viewer was closed.

Expo reserves scrollbar space and preserves the grid width during modal scroll
locking. The regression test forces a width-consuming scrollbar and samples
successive frames. A single screenshot cannot detect this failure.

One image resolver supplies HTML, Print, Markdown, LLMSFULL, RSS, and album covers.
This keeps image order and metadata consistent across outputs. Static formats
remain usable without viewer JavaScript. Changes to the resolver require checks
for each affected output.

## Validation and ownership {#validation-and-ownership}

The theme repository owns the resolver, layouts, runtime, schema, and focused
checks. The documentation site owns the [bilingual examples](/expo/), browser
tests, and desktop/mobile visual review. Acceptance includes all four presets,
light/dark mode, keyboard input, focus, animation, and static outputs.

The copied Graph collection supplies additional evidence at a larger scale.
Its original acceptance checked 7,658 file hashes, image anchors, and the unchanged
source collection. Personal image data, generated output, and screenshots remain
outside the theme and documentation source repositories.

Use the commands in the [Expo contract](/docs/design/expo/#acceptance-and-release-boundary)
for current acceptance.
