---
title: Compose a page worth reading
linkTitle: Compose the page
description: Combine prose, callouts, code, media, tables, and mathematics without turning the page into a component catalogue.
book_kind: chapter
book_number: 3
weight: 30
---

Components should clarify an argument, not compete with it. Begin with plain
prose, then introduce structure only where a reader needs to compare, verify,
copy, or pause.

## Give every block one job {#one-job}

> [!TIP] Write the sentence first
>
> If you cannot state why a component belongs on the page in one sentence,
> leave it as prose until the need becomes clear.

Use a callout for a prerequisite or risk, a table for repeated fields, a code
block for material the reader can run, and an image when shape or spatial
relationships carry information that prose cannot.

## Start from a small page contract {#page-contract}

Continue with `content/docs/preview-check.md` from Chapter 2. Replace its
contents with this complete example; the command inside the page is run from
your site repository in a second terminal while the preview server stays open.

````markdown {title="content/docs/preview-check.md" num="3-1" caption="The same page now states a prerequisite, a command, and a visible result." #eg-page-contract}
---
title: Verify a local preview
description: Check that a documentation edit reaches the browser and builds without warnings.
weight: 25
---

## Check the preview {#check-preview}

> [!NOTE] Keep the preview server running
> Run the build below in a second terminal, from the site repository.

```bash
hugo --environment production --panicOnWarning
```

The command should exit successfully without warnings. Refresh this page at
`http://localhost:1313/docs/preview-check/` and confirm the new note and command
are visible. A successful build and a visible edit are two separate checks.
````

Update `preview-check.zh.md` with the same task and command in Chinese. Keep
`weight: 25` and `#check-preview`; use `/zh/docs/preview-check/` in its local URL.
The title names the task, the description states the result, and the note
explains where to run the command. Open both peers and test language switching
again before adding more components.

## Measure quality without counting decoration {#quality}

A useful page balances three independent properties:

$$
Q = C_{clarity} \times A_{accuracy} \times K_{consistency}
$$
{#eq-page-quality num="3.1" caption="A page fails when any one of clarity, accuracy, or consistency falls to zero."}

The product form is intentional: visual polish cannot compensate for an
incorrect command, and accurate prose still fails when readers cannot find or
follow it.

## Connect the evidence {#connect-evidence}

Use {{< xref eg="3-1" anchor="eg-page-contract" />}} as the source pattern,
and use {{< xref eq="3.1" anchor="eq-page-quality" />}} as the review question.
Chapter 4 outlines the next visual-design stage; for a complete next task now,
continue with [Starter customization](/docs/start/starter/#customize).

The component reference begins at [Components](/docs/components/). Read the
individual page for a component only when the tutorial introduces a need for
it.

