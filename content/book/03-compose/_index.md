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

```yaml {num="3-1" caption="A page contract with one stable title, one summary, and an explicit place in the tree." #eg-page-contract}
---
title: Back up a cluster
description: Create and verify one recoverable backup.
weight: 20
---

## Verify the backup {#verify-backup}
```

The title names the reader's task. The description explains the result. The
weight locates the page, and the explicit heading ID gives another page a
durable target.

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
Chapter 4 applies both to the site-wide visual system.

The component reference begins at [Components](/docs/components/). Read the
individual page for a component only when the tutorial introduces a need for
it.

