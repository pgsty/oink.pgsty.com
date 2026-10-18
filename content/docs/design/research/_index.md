---
title: Design research
linkTitle: Research
description: Dated experiments and consumer evidence used to make OINK design decisions, without normative force.
weight: 70
icon: fa-solid fa-flask
no_list: true
cascade:
  search_boost: 0.35
search_keywords: [design research, evidence, experiment, consumer survey, Hugo]
design_kind: research-index
design_status: active
---

> [!NOTE] Evidence, not a contract
> Research records measurements, inputs, and tool versions.
> Results may explain a decision. They do not override current contracts or
> implementation. Current validation uses Hugo Extended 0.168.0 and follows
> the [toolchain contract](/docs/design/architecture/#hugo-toolchain). Older
> versions recorded here are historical evidence, not compatibility test targets.

Research belongs in the public Design tree when another maintainer can inspect
its method, understand its limits, and repeat the relevant check. Raw agent
transcripts, temporary build logs, and local absolute paths do not meet that
standard.

## Research map {#research-map}

| Record                                                                                       | Evidence                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Goldmark block attributes](/docs/design/research/goldmark-attributes/)                      | Render-hook visibility and CommonMark container limits on the historical Hugo versions recorded in the study |
| [Consumer and migration evidence](/docs/design/research/consumer-evidence/)                  | A dated corpus survey plus deterministic Book migration results                    |
| [Comprehensive review, 2026-08-26](/docs/design/research/2026-08-26-comprehensive-review/)   | Implementation, configuration, output, security, test, performance, and doc audit  |
| [Community issue and PR review, 2026-09-19](/docs/design/research/2026-09-19-upstream-review/) | Reproductions, PR acceptance advice, and remedies for sidebar, focus, and search feedback |
| [OINK 1.1 release review, 2026-09-20](/docs/design/research/2026-09-20-release-review/) | Five runtime repairs, documentation readiness, validation evidence and publication boundaries |
| [CLI acceptance snapshot, 2026-09-29](/docs/design/research/2026-09-29-cli-acceptance/) | Executed Starter, real-site, offline, upgrade, and reproducible-archive checks; final local acceptance and public release remain separate |
| [Visual preset acceptance, 2026-10-05](/docs/design/research/2026-10-05-visual-presets-acceptance/) | Paper/Slate local implementation, actual output and bounded browser evidence |
| [Ink and Terminal experiment, 2026-10-05](/docs/design/research/2026-10-05-ink-terminal-experiment/) | Explicit experimental presets, design tradeoffs and real-site verification |
| [OINK 1.2 pre-release review, 2026-10-05](/docs/design/research/2026-10-05-v1-2-release-review/) | Final local candidate checks, cleanup, local resources, compatibility and publication boundaries |
| [CLI maintenance acceptance, 2026-10-03](/docs/design/research/2026-10-03-cli-maintenance-acceptance/) | Historical R1–R8 and A18 source-bound runtime and archive evidence |
| [Theme review, 2026-10-13](/docs/design/research/2026-10-13-theme-review/) | Reproduced output and interaction defects, repairs, and local validation scope |

## Publication rules {#publication-rules}

A research record states its date, inputs, relevant versions, method, result,
and known limits. Volatile counts are labeled as snapshots. External framework
comparisons are refreshed from primary sources before publication and distilled
into OINK-relevant conclusions rather than copied as a competitor catalogue.

When a result becomes a stable product choice, link it from an accepted
[decision](/docs/design/decisions/). When it proposes behaviour that does not
exist, move the design question to [Proposals](/docs/design/proposals/).
