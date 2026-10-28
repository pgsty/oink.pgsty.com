---
title: Design research
linkTitle: Research
description: Dated experiments and consumer evidence that inform OINK design decisions.
weight: 70
icon: fa-solid fa-flask
no_list: true
cascade:
  search_boost: 0.35
search_keywords: [design research, evidence, experiment, consumer survey, Hugo]
design_kind: research-index
design_status: active
---

> [!NOTE] Dated research records
> Research records capture measurements, inputs, and tool versions from specific studies. Current behavior is defined by the [Design contracts](/docs/design/) and validated on Hugo Extended 0.168.0 per the [toolchain contract](/docs/design/architecture/#hugo-toolchain).

Publish research in the Design tree only when another maintainer can inspect
its method, understand its scope, and repeat the applicable check.
Keep raw agent transcripts, temporary build logs, and local absolute paths out
of research records.

## Research map {#research-map}

| Record                                                                                       | Evidence                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Goldmark block attributes](/docs/design/research/goldmark-attributes/)                      | Render-hook visibility and CommonMark container limits on the historical Hugo versions recorded in the study |
| [Consumer and migration evidence](/docs/design/research/consumer-evidence/)                  | A dated corpus survey plus deterministic Book migration results                    |
| [Comprehensive review, 2026-08-26](/docs/design/research/2026-08-26-comprehensive-review/)   | Implementation, configuration, output, security, test, performance, and doc audit  |
| [Community issue and PR review, 2026-09-19](/docs/design/research/2026-09-19-upstream-review/) | Reproductions, PR acceptance advice, and remedies for sidebar, focus, and search feedback |
| [OINK 1.1 release review, 2026-09-20](/docs/design/research/2026-09-20-release-review/) | Five runtime repairs, documentation readiness, validation evidence and publication boundaries |
| [CLI acceptance snapshot, 2026-09-29](/docs/design/research/2026-09-29-cli-acceptance/) | Executed Starter, real-site, offline, upgrade, and reproducible-archive checks for the local CLI candidate |
| [Visual preset acceptance, 2026-10-05](/docs/design/research/2026-10-05-visual-presets-acceptance/) | Paper/Slate local implementation, actual output and bounded browser evidence |
| [Ink and Terminal experiment, 2026-10-05](/docs/design/research/2026-10-05-ink-terminal-experiment/) | Explicit experimental presets, design tradeoffs and real-site verification |
| [OINK 1.2 pre-release review, 2026-10-05](/docs/design/research/2026-10-05-v1-2-release-review/) | Final local candidate checks, cleanup, local resources, compatibility and publication boundaries |
| [CLI maintenance acceptance, 2026-10-03](/docs/design/research/2026-10-03-cli-maintenance-acceptance/) | Historical R1–R8 and A18 source-bound runtime and archive evidence |
| [Theme review, 2026-10-13](/docs/design/research/2026-10-13-theme-review/) | Reproduced output and interaction defects, repairs, and local validation scope |
| [Component refinement, 2026-10-25](/docs/design/research/2026-10-25-component-refinement/) | Final component acceptance, 409 Chromium tests, targeted three-engine visual review, CSS/JS size comparison, and separate gallery baseline failures |

## Publication rules {#publication-rules}

A research record states its date, inputs, applicable versions, method, result,
and known limits, with changing counts labeled as snapshots. External framework
comparisons should be refreshed from primary sources before publication and
focus on conclusions that affect OINK.

When a result becomes an accepted product choice, link it from an accepted
[decision](/docs/design/decisions/). If it proposes behavior that does not exist,
move the design question to [Proposals](/docs/design/proposals/).
