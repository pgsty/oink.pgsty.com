---
title: 迁移现有 Docsy 站点
weight: 20
description: 替换复制的 Docsy 外壳，同时保留站点自有行为。
aliases:
  [
    /docs/oink/migration/,
    /docs/update/convert-site-to-module/,
    /docs/updating/convert-site-to-module/,
  ]
---

OINK 旨在替换各站点复制的公共外壳、运行时与短代码，而无需批量重写普通正文。安全迁移应按依赖关系删除覆盖项，把产品专用行为留在站点，并在修改生产环境前先验证临时副本。

## 迁移原则 {#migration-principles}

- 固定目标实现，不要把生产站点迁移到未固定版本的分支。
- 删除覆盖项之前先完成清点。
- 删除公共主题副本，不删除站点业务逻辑。
- 在 OINK API 兼容的地方，保持内容 URL、front matter 与短代码行为不变。
- unsafe 或在线例外必须显式声明，并且只在过渡期使用。
- 分别测试构建产物、浏览器行为与托管站点行为。

## 固定目标版本 {#pin-the-target}

请在 `go.mod` 中固定已发布标签，或使用完整的版本化归档。预发布评估期间，Hugo
Module 站点可以使用被忽略的 Go
workspace，在不修改已提交模块版本的情况下解析本地 checkout：

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=/absolute/path/to/oink
export HUGO_MODULE_WORKSPACE=go.work
hugo --gc --minify
```

站点的 `hugo.yaml` 导入 `github.com/pgsty/oink`；workspace 只替换本地 checkout。

## 清点现有覆盖项 {#inventory-existing-overrides}

把每个站点级文件归入以下四类之一：

| 类别                     | 处理方式                |
| ------------------------ | ----------------------- |
| 公共外壳的完全或近似副本 | OINK 验证通过后删除     |
| OINK 已提供的可复用组件  | 删除或机械重命名        |
| 范围明确的品牌或产品定制 | 保留，再缩小到最小 hook |
| 业务专用数据或交互       | 留在站点                |

`layouts/`、`assets/`、`static/`、配置与构建工作流必须一起检查。复制的短代码通常还伴随一份 JavaScript
bundle、样式表、vendor 文件和 CI 安装步骤。

## 迁移配置 {#move-configuration}

### 搜索与品牌 {#search-and-brand}

启用主题提供的本地搜索，并让外壳使用站点自己的 Logo：

```yaml
params:
  logo: img/product.svg
  offlineSearch: true
```

继续在原有语义位置使用
`title`、`languages.*`、`github_repo`、`github_project_repo`、
`github_branch`、`page_width` 与 `ui.*`，不要把它们迁入 `oink.*` 命名空间。

### 字体 {#fonts}

旧 Sass 开关 `$td-enable-google-fonts: true` 现在会选择 OINK 随附的本地 Open
Sans，而不会请求 Google Fonts。`$td-web-font-path`
不再参与当前构建。需要其他字体的站点必须提供获准使用的本地资源及其许可证。

## 删除公共覆盖项 {#remove-common-overrides}

临时构建证明等价后，可以删除站点中的以下副本：

- `layouts/baseof.html` 与公共 docs/blog `baseof*.html`；
- 公共 navbar、footer、sidebar、目录（TOC）、search、head CSS
  partial 及相应 hook；
- 旧的公共品牌文档外壳 partial；
- `asciinema`、`echarts`、`infographic`、`doc-carousel`、`details`、
  `tab`/`tabpane`、card 与 `param` 短代码副本；
- 只服务于上述已删除实现的 JavaScript、Lunr 副本、轮播代码与 SCSS；
- 不再被任何站点资源需要的消费端 PostCSS 与 Autoprefixer 步骤。

应按引用关系删除，而不是直接清空
`layouts/`。首页、下载页与门户仍可能调用本地 icon、search dialog、blog
row 或 tag filter 等 partial。

## 保留站点专用行为 {#keep-site-specific-behavior}

保留语义属于具体产品的内容与代码：

- 产品矩阵与兼容性数据；
- 价格、下载、门户、解决方案与目录页面；
- 站点专用首页结构；
- 自定义重定向、响应头、分析或身份集成；
- 承载业务数据、而非通用呈现逻辑的内容组件。

对于 Pigsty 家族，`pgvers`、`pgext_matrix`、`pgext_os_matrix`、`home-docs`
以及当前 `metric` 实现继续留在站点层。

## 参考站点矩阵 {#reference-site-matrix}

当前迁移计划采用以下边界：

| 站点   | 删除或迁移                                                                                 | 保留                             |
| ------ | ------------------------------------------------------------------------------------------ | -------------------------------- |
| SILO   | 公共 docs/blog 外壳、核心短代码与重复运行时；设置 `logo: img/silo.svg`                     | 首页、下载页与产品数据           |
| PGSTY  | 公共外壳与核心短代码；设置 `logo: img/logo/logo.svg`                                       | 门户、解决方案与企业页面         |
| SOW    | 公共 docs/blog 外壳、核心短代码与重复运行时；设置 `logo: img/sow.svg`                      | 首页与仓库专用内容               |
| Pigsty | 公共外壳、核心短代码与重复运行时；设置 `logo: icons/logo.svg`，并保留已审查的 ECharts 回调 | 扩展矩阵、首页与价格页、目录样式 |

该矩阵是清点工作的起点，并不意味着可以删除所有名称相似的文件。必须在目标检出目录中解析实际模板引用。

## 演练工作流 {#rehearsal-workflow}

请在消费站点的临时副本中演练迁移。应用本地 Oink
workspace，每次删除一组计划覆盖项，阻断非预期网络与前端工具访问，再执行生产构建：

```sh
HUGO_MODULE_WORKSPACE=go.work hugo --gc --minify
```

演练不得修改源工作区。保留失败副本用于诊断，并记录准确的主题 commit、Hugo 版本、已删除文件与输出数量。

## 当前证据 {#current-evidence}

最近一次记录的演练发生在 2026-08-08，使用 Hugo Extended `0.164.0`：

| 站点   | 演练结果                                                                      | HTML 文件数 |
| ------ | ----------------------------------------------------------------------------- | ----------: |
| SILO   | 删除 20 个公共覆盖项；完整构建中英文内容，OINK 外壳、同源搜索与站点 Logo 生效 |       1,095 |
| PGSTY  | 删除 20 个公共覆盖项；构建双语门户，并用临时 docs 页面验证外壳                |          16 |
| SOW    | 删除 20 个公共覆盖项；完整构建中英文内容，OINK 外壳、同源搜索与站点 Logo 生效 |         128 |
| Pigsty | 删除 24 个公共覆盖项；保留三个业务矩阵短代码与现有 ECharts 回调               |       2,473 |

这些是临时副本的构建结果，不代表四个生产站点已经完成迁移或部署。

## 生产迁移流程 {#production-rollout}

对每个站点依次执行：

1. 创建专用迁移分支；
2. 固定 OINK 候选版本并记录其源码提交；
3. 每次只删除一组内聚的覆盖项；
4. 执行干净的 Hugo-only 构建与针对性自动化测试；
5. 比较具有代表性的首页、文档页、博客页、特殊页面与 `404` 页面；
6. 检查移动导航、两种颜色模式、语言切换、搜索、打印与站点保留的业务组件；
7. 部署预览，并验证真实 URL 与网络请求；
8. 评审通过后才合并并部署，随后执行生产冒烟测试。

对于 OINK 有意改变外壳的部分，应记录合理差异，而不是强求像素级相同。

## 回滚 {#rollback}

保留迁移前的主题 pin、站点提交与已知可用部署产物。回滚时三者应一致恢复。针对新主题只重新引入一部分随机复制布局，会形成比任一完整版本都更难诊断的混合状态。
