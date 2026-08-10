---
title: Processes, timelines, and cycles
linkTitle: Processes and timelines
description:
  Match sequential information to horizontal, chronological, and circular
  templates.
weight: 10
icon: fa-solid fa-arrows-spin
---

Sequence templates answer different questions. A horizontal process emphasizes
ordered handoffs, a timeline emphasizes chronology, and a cycle emphasizes that
the last stage feeds the first again. The surrounding prose must state which
relationship matters.

## Horizontal process {#horizontal-process}

Use `list-row-simple-horizontal-arrow` for a short left-to-right sequence. On
narrow screens, keep labels brief and verify that the rendered order remains
clear.

```go-html-template
{{</* infographic */>}}
infographic list-row-simple-horizontal-arrow
data
  title Documentation delivery
  items
    - label Plan
      desc Define the reader and outcome
    - label Write
      desc Draft the smallest complete page
    - label Review
      desc Check facts, language, and links
    - label Ship
      desc Build and verify the hosted route
{{</* /infographic */>}}
```

The process moves from planning through writing and review to a separately
verified hosted result.

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic list-row-simple-horizontal-arrow
data
  title Documentation delivery
  items
    - label Plan
      desc Define the reader and outcome
    - label Write
      desc Draft the smallest complete page
    - label Review
      desc Check facts, language, and links
    - label Ship
      desc Build and verify the hosted route
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Chronological timeline {#chronological-timeline}

Use `sequence-timeline-simple` when time or release order is the primary
relationship.

```go-html-template
{{</* infographic */>}}
infographic sequence-timeline-simple
data
  title Release evidence
  items
    - label Source ready
      desc Scope, copy, attribution, and review are complete
    - label Checks pass
      desc Theme and project-site suites pass
    - label Tag public
      desc The immutable module version resolves
    - label Site deployed
      desc Production routes pass smoke tests
{{</* /infographic */>}}
```

The timeline separates four evidence points; a passing test does not skip the
public-tag or deployment stages.

<!-- prettier-ignore-start -->

{{< infographic >}}
infographic sequence-timeline-simple
data
  title Release evidence
  items
    - label Source ready
      desc Scope, copy, attribution, and review are complete
    - label Checks pass
      desc Theme and project-site suites pass
    - label Tag public
      desc The immutable module version resolves
    - label Site deployed
      desc Production routes pass smoke tests
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Continuous cycle {#continuous-cycle}

Use `sequence-circular-simple` only when the final item genuinely returns work
to the first. Do not use a cycle for a process that has a terminal state.

```go-html-template
{{</* infographic height="480px" */>}}
infographic sequence-circular-simple
data
  title Documentation maintenance loop
  items
    - label Observe
      desc Collect support and search signals
    - label Prioritize
      desc Select a reader problem
    - label Improve
      desc Update content and examples
    - label Verify
      desc Test links, rendering, and outcomes
{{</* /infographic */>}}
```

Verification produces new observations, so the maintenance loop returns to its
first stage.

<!-- prettier-ignore-start -->

{{< infographic height="480px" >}}
infographic sequence-circular-simple
data
  title Documentation maintenance loop
  items
    - label Observe
      desc Collect support and search signals
    - label Prioritize
      desc Select a reader problem
    - label Improve
      desc Update content and examples
    - label Verify
      desc Test links, rendering, and outcomes
{{< /infographic >}}

<!-- prettier-ignore-end -->

## Selection rule {#selection-rule}

If removing the arrows or time axis would not change the meaning, use a native
list or cards instead. Infographics should reveal a relationship, not decorate
an otherwise unrelated set of statements.
