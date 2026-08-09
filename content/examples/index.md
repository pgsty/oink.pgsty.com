---
downstream_modified: true
title: OINK examples and templates
linkTitle: Examples
description: >-
  Build the bilingual starter, explore OINK features, and compare inherited
  Docsy references
type: docs
aliases: [/docs/examples]
menu: { main: { weight: 30 } }
# prettier-ignore
cSpell:ignore: Agones kubeflow Navidrome tekton fluxcd Graphviz Stroom protobuf Dapr
---

This repository includes a complete bilingual starter and a documentation site
that exercises the OINK product surface. Use them to validate a checkout, learn
the content model, or start a new site without assembling a frontend toolchain.

The current checkout is an implementation preview. A working local example is
evidence that the source builds; it is not by itself evidence of a public OINK
release, stable remote module path, or hosted production deployment.

<a id="starter-templates"></a>

## Included bilingual starter

The [`starter/`][starter-repo] directory is the smallest complete OINK site. It
ships with English and Simplified Chinese pages, local search, language-aware
navigation, dark mode, a documentation section, a blog, and Cloudflare Pages
configuration. After obtaining the complete repository, run:

```sh
hugo --source starter server --disableFastRender
```

Create its production output with Hugo alone:

```sh
hugo --source starter --gc --minify
```

The starter resolves the sibling `theme/` checkout for local development. A
released consumer site should pin the declared OINK module version or use a
complete audited theme archive. Follow [Build the bilingual starter][] for the
prerequisites, repository layout, deployment options, and network-isolated
workflow.

## Reference pages in this site

The `oink.pgsty.com/` site doubles as OINK's documentation and regression
surface. These pages demonstrate the parts most useful when evaluating the
theme:

| Page                       | What it demonstrates                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------ |
| [OINK product reference][] | Product boundaries, repository map, and operating contract                           |
| [Content components][]     | Details, tabs, cards, diagrams, recordings, charts, and API references               |
| [Multi-language support][] | Side-by-side translations, stable IDs, routing, SEO, and local search                |
| [Implementation diary][]   | Design decisions, delivered work, verification evidence, and remaining release gates |

<a id="docsy-theme-examples"></a>

## Upstream Docsy ecosystem

OINK evolved directly from Docsy and intentionally retains compatible content
conventions where they remain useful. The following production sites are
upstream Docsy references: they show the scale and variety of sites supported by
the inherited content model, but they are **not** claims that those sites run
OINK.

Examples with low to moderate customization:

| Site                                                 | Source repository                                              |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [Docsy][]                                            | <https://github.com/google/docsy>                              |
| [AgileBase docs](https://docs.agilebase.co.uk/)      | <https://github.com/okohll/abdocs>                             |
| [Agones.dev](https://agones.dev/site/)               | <https://github.com/googleforgames/agones/tree/main/site>      |
| [Apache Parquet](https://parquet.apache.org/)        | <https://github.com/apache/parquet-site>                       |
| [CloudWeGo.io](https://www.cloudwego.io/)            | <https://github.com/cloudwego/cloudwego.github.io>             |
| [etcd.io](https://etcd.io/)                          | <https://github.com/etcd-io/website>                           |
| [fission.io](https://fission.io/)                    | <https://github.com/fission/fission.io>                        |
| [fluxcd.io](https://fluxcd.io/)                      | <https://github.com/fluxcd/website>                            |
| [Graphviz](https://graphviz.org/)                    | <https://gitlab.com/graphviz/graphviz.gitlab.io>               |
| [gRPC](https://www.grpc.io/)                         | <https://github.com/grpc/grpc.io>                              |
| [JVMPerf.net](https://jvmperf.net/)                  | <https://github.com/cchesser/java-perf-workshop>               |
| [Kubeflow.org](https://www.kubeflow.org/)            | <https://github.com/kubeflow/website>                          |
| [Layer5 Docs](https://docs.layer5.io/)               | <https://github.com/layer5io/docs>                             |
| [Navidrome Music Server](https://www.navidrome.org/) | <https://github.com/navidrome/website>                         |
| [OpenTelemetry.io](https://opentelemetry.io/)        | <https://github.com/open-telemetry/opentelemetry.io>           |
| [protobuf.dev](https://protobuf.dev/)                | <https://github.com/protocolbuffers/protocolbuffers.github.io> |
| [Selenium.dev](https://www.selenium.dev/)            | <https://github.com/SeleniumHQ/seleniumhq.github.io>           |
| [Stroom.io](https://gchq.github.io/stroom-docs)      | <https://github.com/gchq/stroom-docs>                          |
| [tekton.dev](https://tekton.dev/)                    | <https://github.com/tektoncd/website>                          |
| [YMCA Website Services](https://ds-docs.y.org/)      | <https://github.com/YCloudYUSA/yusaopeny_docs>                 |

<a id="customized-docsy-examples"></a>

## Highly customized upstream references

These Docsy-based sites demonstrate how far the inherited templates and content
conventions can be customized. They are compatibility references, not OINK
deployments:

| Site                                                 | Source repository                                |
| ---------------------------------------------------- | ------------------------------------------------ |
| [Apache Airflow](https://airflow.apache.org/)        | <https://github.com/apache/airflow-site/>        |
| [Docsy Mostly Docs](https://mostlydocs.netlify.app/) | <https://github.com/gwatts/mostlydocs/>          |
| [Kubernetes](https://kubernetes.io)                  | <https://github.com/kubernetes/website>          |
| [XLT](https://xltdoc.xceptance.com/)                 | <https://github.com/Xceptance/xlt-documentation> |
| [Dapr](https://docs.dapr.io/)                        | <https://github.com/dapr/docs>                   |

[Build the bilingual starter]: /docs/oink/getting-started/
[Content components]: /docs/oink/components/
[Docsy]: https://www.docsy.dev/
[Implementation diary]: /blog/2026/oink-implementation-diary/
[Multi-language support]: /docs/language/
[OINK product reference]: /docs/oink/
[starter-repo]: <{{% param github_repo %}}/tree/main/starter>
