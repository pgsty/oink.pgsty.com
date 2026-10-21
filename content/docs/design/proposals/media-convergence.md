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
design_status: partially-implemented
proposal_date: 2026-08-20
---

> [!IMPORTANT] Partially implemented
> The theme's main branch implements M1 (the shared media-result contract)
> and M2 (Landing resource metadata). M3 is resolved as option 2.
> Only native Markdown images support processing. The full `fig` source form
> remains a container. Its parameter list deliberately excludes `command`/`options`.
> M4 (compatibility retirement) remains open until consumers are inventoried.
> The sections below retain the original design record.

## Current baseline {#current-baseline}

The content image hook, numbered `fig`, cards, and galleries resolve local page
resources, section resources, global assets, static files, and explicit remote
URLs through `content/image-resolve.html`. Raster resources can supply intrinsic
dimensions and processed derivatives. `data-td-image-zoom` marks HTML Zoom
eligibility, and the build-time detector checks only this theme-emitted marker.

Standalone Markdown images can combine a caption or Book numbering with
processing and a link. Numbered image figures share `td-figure` and
`td-book-figure` semantics. Landing media uses the shared URL trust policy,
while featured images deliberately use a ranking resolver because they select
a representative image rather than render one explicit source.

## Remaining problem {#remaining-problem}

The shared safety boundary is stronger than the shared media model. Landing
media does not obtain the same page-resource metadata and processing
result as body images. Featured-image selection and explicit image resolution
return different result shapes, some compatibility class names remain in
markup, and Book's full `fig` form cannot express every processing option that
the native image hook supports.

The design question is therefore no longer “replace seven image entry points,”
but whether the remaining surfaces can share a small result contract without
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

Document the fields that the content and representative-image resolvers return,
then extract their shared fields into one internal media-result contract.
Source ranking stays in the featured resolver and source resolution in the
content resolver. This internal refactor must preserve output bytes.

### M2 — Landing resource metadata {#m2-landing-resource-metadata}

Allow Landing items to resolve eligible local resources through the media
contract, gaining intrinsic dimensions and the shared URL/security decision.
Explicit width and height in Landing data retain precedence. Remote and static
sources remain valid without claiming metadata for a processable resource.

### M3 — Full figure capability decision {#m3-full-figure-capability}

Choose one of two answers:

1. add processing arguments to the full `fig` source form and normalize them
   through the same processing helper; or
2. keep processing exclusively on native Markdown images and document full
   `fig` as the container for arbitrary numbered block content.

No implementation should leave both options half-supported. In both forms,
Markdown/LLMS must consistently link to the documented source or derivative.

### M4 — Compatibility retirement {#m4-compatibility-retirement}

Before removing old image-element classes or attributes, inventory downstream
CSS and JavaScript. If a compatibility name is still used, retain it for a
documented release window. Alternatively, migrate the owning site in the
same release.

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

For each phase, collect byte-level HTML and Markdown evidence.
Run content and Landing resolver tests, URL/security checks, image-processing
tests, and Book target checks. Run gallery/Zoom browser tests and real-site
EN/ZH narrow-screen review. Acceptance requires an explicit M3 capability choice.

## Open decisions {#open-decisions}

1. Is one shared result struct enough, or would a common lower-level URL/resource
   record keep resolver ownership clearer?
2. Should Landing consume resource attribution, or only dimensions and URL?
3. Does full `fig` processing solve a real consumer need now that native images
   support numbering, captions, links, and processing together?
4. Which emitted compatibility names are still used by real consumers?
