---
title: Media convergence
linkTitle: Media convergence
description: A draft for the remaining convergence between content images, numbered figures, Landing media, and featured-image selection.
weight: 20
icon: fa-solid fa-images
search_keywords:
  [
    image resolver,
    figure,
    image processing,
    zoom,
    landing media,
    featured image,
  ]
design_kind: proposal
design_status: draft
proposal_date: 2026-08-20
---

> [!WARNING] Draft PRD — remaining work only
> OINK already has a shared content-image resolver, one Zoom marker, processed
> Markdown images, numbered figures, and safe Landing URL handling. This page
> proposes only the unresolved convergence; it must not be read as a list of
> missing current features.

## Current baseline {#current-baseline}

The content image hook, numbered `fig`, cards, and galleries resolve local page
resources, section resources, global assets, static files, and explicit remote
URLs through `content/image-resolve.html`. Raster resources can contribute
intrinsic dimensions and processing derivatives. HTML Zoom eligibility is
marked with `data-td-image-zoom`; the build-time detector only checks that
theme-emitted marker.

Standalone Markdown images can already combine caption or Book numbering with
processing and a link. Numbered image figures share `td-figure` and
`td-book-figure` semantics. Landing media passes the shared URL trust policy,
while featured images intentionally use a ranking resolver because their job
is to select a representative image rather than render one explicit source.

## Remaining problem {#remaining-problem}

The shared safety boundary is stronger than the shared media model. Landing
media still does not obtain the same page-resource metadata and processing
result as body images. Featured-image selection and explicit image resolution
have separate result shapes. Some compatibility class names remain in markup,
and Book's full `fig` form cannot express every processing option available to
the native image hook.

The design question is therefore no longer “replace seven image entry points.”
It is whether the remaining surfaces can share a small result contract without
erasing their different semantics.

## Goals and non-goals {#goals-and-non-goals}

Goals:

- define one normalized media-result shape for URL, source URL, dimensions,
  alternative text, attribution, processability, and external status;
- let explicit content images, Landing media, and representative images reuse
  that shape where their source semantics overlap;
- keep figure markup and Zoom eligibility single-owned;
- decide whether the full `fig` form needs processing or whether authors should
  use the native image form for processed numbered images;
- retire compatibility markup only after consumer evidence and a release note.

Non-goals:

- adding a third-party lightbox or remote image service;
- changing image Zoom from opt-in to site policy by accident;
- giving galleries a new caption, sequence, or carousel model;
- merging non-image Book targets such as tables, equations, and examples into
  an image-only base class;
- making featured-image ranking identical to explicit image resolution.

## Proposed phases {#proposed-phases}

### M1 — Result contract {#m1-result-contract}

Document the fields returned by the content and representative-image
resolvers, then extract the intersection into one internal media-result
contract. Keep source ranking in the featured resolver and source resolution in
the content resolver. This is an internal refactor with byte-stable output.

### M2 — Landing resource metadata {#m2-landing-resource-metadata}

Allow Landing items to resolve eligible local resources through the media
contract, gaining intrinsic dimensions and the same URL/security decision.
Explicit width and height in Landing data continue to win. Remote and static
sources remain valid but cannot pretend to have processable-resource metadata.

### M3 — Full figure capability decision {#m3-full-figure-capability}

Choose one of two answers:

1. add processing arguments to the full `fig` source form and normalize them
   through the same processing helper; or
2. keep processing exclusively on native Markdown images and document full
   `fig` as the container for arbitrary numbered block content.

No implementation should leave both answers half-supported. Markdown/LLMS
must link to the documented source or derivative consistently in both forms.

### M4 — Compatibility retirement {#m4-compatibility-retirement}

Inventory downstream CSS and JavaScript before removing old image-element
classes or attributes. If a compatibility name is still used, retain it for a
documented release window or migrate the owning site in the same release train.

## Safety, output, and accessibility {#safety-output-and-accessibility}

- Image URLs keep the shared scheme and remote-host policy.
- Missing required alternative text warns and renders a decorative fallback
  only where the current contract permits it.
- Width and height never claim metadata that an SVG, static file, or remote
  source did not provide.
- Linked images are not Zoom targets; the runtime preserves dialog focus,
  keyboard close, reduced motion, and narrow-screen containment.
- Print, Markdown, RSS, and LLMS strip interaction markers while retaining the
  intended image, caption, attribution, number, and link.

## Acceptance criteria {#acceptance-criteria}

Each phase owns byte-level HTML and Markdown evidence, content and Landing
resolver tests, URL/security checks, image-processing tests, Book targets,
gallery/Zoom browser tests, and real-site EN/ZH narrow-screen review. The
proposal is accepted only after the M3 capability choice is explicit.

## Open decisions {#open-decisions}

1. Is one shared result struct enough, or would a common lower-level URL/resource
   record keep resolver ownership clearer?
2. Should Landing consume resource attribution, or only dimensions and URL?
3. Does full `fig` processing solve a real consumer need now that native images
   support numbering, captions, links, and processing together?
4. Which emitted compatibility names are still used by real consumers?
