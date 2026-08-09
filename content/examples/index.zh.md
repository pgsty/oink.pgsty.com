---
title: OINK 示例与模板
linkTitle: 示例
description: 构建双语 starter，体验 OINK 功能，并对照继承自 Docsy 的参考站点
type: docs
aliases: [/zh/docs/examples]
menu: { main: { weight: 30 } }
# prettier-ignore
cSpell:ignore: Agones kubeflow Navidrome tekton fluxcd Graphviz Stroom protobuf Dapr
---

本仓库提供一份完整的双语 starter，以及一个覆盖 OINK 产品能力的文档站点。你可以用它们验证当前检出内容、学习内容模型，或在无需组装前端工具链的情况下创建新站点。

当前检出内容是一份实现预览。示例能在本地正常运行，只能证明源码可以构建；它本身并不能证明 OINK 已有公开版本、稳定的远程模块路径或投入生产的托管站点。

<a id="starter-templates"></a>

## 内置双语 starter {#included-bilingual-starter}

[`starter/`][starter-repo]
目录是一份最小而完整的 OINK 站点。它包含英文和简体中文页面、本地搜索、支持语言切换的导航、深色模式、文档分区、博客与 Cloudflare
Pages 配置。取得完整仓库后，运行：

```sh
hugo --source starter server --disableFastRender
```

只用 Hugo 即可生成生产构建产物：

```sh
hugo --source starter --gc --minify
```

在本地开发时，starter 会解析同级的 `theme/`
检出目录。公开版本可用后，消费站点应固定已经声明的 OINK 模块版本，或使用完整且经过审计的主题归档包。请按照[构建双语
starter][]的说明准备环境、理解仓库结构、选择部署方式，并完成网络隔离环境中的构建。

## 本站参考页面 {#reference-pages-in-this-site}

`oink.pgsty.com/`
同时也是 OINK 的产品文档与回归验证载体。评估主题时，以下页面最具代表性：

| 页面              | 展示内容                                                  |
| ----------------- | --------------------------------------------------------- |
| [OINK 产品参考][] | 产品边界、仓库结构与运作契约                              |
| [内容组件][]      | 折叠块、标签页、卡片、图表、终端录屏、数据图表与 API 参考 |
| [多语言支持][]    | 并置译文、稳定 ID、路由、SEO 与本地搜索                   |
| [实现日记][]      | 设计决策、已交付工作、验证证据与尚未通过的发布门禁        |

<a id="docsy-theme-examples"></a>

## 上游 Docsy 生态 {#upstream-docsy-ecosystem}

OINK 直接演化自 Docsy，并有意保留其中仍然有价值的兼容内容约定。以下生产站点都是上游 Docsy 的参考案例：它们展示了继承内容模型所能支持的规模与多样性，但
**并不表示这些站点正在使用 OINK**。

定制程度较低或适中的案例：

| 站点                                                 | 源码仓库                                                       |
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

## 高度定制的上游案例 {#highly-customized-upstream-references}

以下 Docsy 站点展示了继承模板与内容约定所能实现的深度定制。它们是兼容性参考，并非 OINK 部署案例：

| 站点                                                 | 源码仓库                                         |
| ---------------------------------------------------- | ------------------------------------------------ |
| [Apache Airflow](https://airflow.apache.org/)        | <https://github.com/apache/airflow-site/>        |
| [Docsy Mostly Docs](https://mostlydocs.netlify.app/) | <https://github.com/gwatts/mostlydocs/>          |
| [Kubernetes](https://kubernetes.io)                  | <https://github.com/kubernetes/website>          |
| [XLT](https://xltdoc.xceptance.com/)                 | <https://github.com/Xceptance/xlt-documentation> |
| [Dapr](https://docs.dapr.io/)                        | <https://github.com/dapr/docs>                   |

[构建双语 starter]: /zh/docs/oink/getting-started/
[内容组件]: /zh/docs/oink/components/
[Docsy]: https://www.docsy.dev/
[实现日记]: /zh/blog/2026/oink-implementation-diary/
[多语言支持]: /zh/docs/language/
[OINK 产品参考]: /zh/docs/oink/
[starter-repo]: <{{% param github_repo %}}/tree/main/starter>
