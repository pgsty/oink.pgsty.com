---
title: 搜索
weight: 20
icon: fa-solid fa-magnifying-glass
description: 配置本地多语言搜索，或显式启用在线服务商。
aliases: [/docs/content/search/, /docs/feature/search/]
cSpell:ignore: GCSE docsearch
---

OINK 默认并推荐使用本地搜索。Hugo 会为每种语言生成独立索引；主题从同源资源提供 Lunr 及其 CJK 回退。站点无需公共爬虫、外部账户、CDN 或网络连接，即可完成构建和搜索。

Google Custom Search 与 Algolia
DocSearch 仍作为兼容的在线集成保留。它们默认关闭；只有站点明确接受相应的外部请求、索引方式、可用性与隐私边界时，才应启用。

同一时间只能启用一种搜索实现。

## 使用 Lunr 的本地搜索 {#local-search-with-lunr}

在 `hugo.yaml` 中启用本地搜索：

```yaml
params:
  offlineSearch: true
```

不要同时配置 `gcs_engine_id` 或
`params.search.algolia`。生产构建完成后，输出中会为每种语言生成一个索引，例如：

```text
offline-search-index.en.json
offline-search-index.zh.json
```

浏览器加载当前语言的索引，并在不离开页面的情况下显示结果。中文内容使用 OINK 的 CJK 回退，不依赖以空格分词。

### 测试前构建索引 {#build-the-index-before-testing}

启动预览前先执行常规构建：

```sh
hugo --gc
hugo server --disableFastRender
```

如果索引变化时 server 已经在运行，请将其重启。对于子路径部署，请确认浏览器从配置的
`baseURL` 下请求索引，而不是从域名根目录请求。

### 配置结果摘要与数量限制 {#configure-result-summaries-and-limits}

设置摘要长度和最大结果数：

```yaml
params:
  offlineSearch: true
  offlineSearchSummaryLength: 120
  offlineSearchMaxResults: 12
```

所选限制应确保搜索对话框在移动设备上保持流畅。摘要用于帮助发现内容，不能替代认真编写的页面描述。

### 排除页面 {#exclude-a-page}

在页面 front matter 中设置 `exclude_search: true`：

```yaml
---
title: Internal index
exclude_search: true
---
```

该设置适用于工具页、重复页、生成页或测试页。不要仅仅因为当前译文不完整就排除页面；应修复译文。

### 设置结果面板样式 {#style-the-result-panel}

结果面板会随内容扩展。站点可以在 `assets/scss/_styles_project.scss` 中限制宽度：

```scss
.td-offline-search-results {
  max-width: 46rem;
}
```

覆盖搜索样式时，必须保留键盘焦点、可见选中状态、移动端宽度和深色模式对比度。

## 搜索入口 {#search-entry-points}

OINK 会在品牌外壳中提供搜索入口，也可以在侧栏显示输入框。如果要隐藏侧栏输入框，同时保留主搜索入口，请配置：

```yaml
params:
  ui:
    sidebar_search_disable: true
```

外壳的打开与关闭控件会向辅助技术暴露对话框关系和状态。自定义实现必须保留这些语义。

## 多语言搜索 {#multilingual-search}

搜索始终停留在当前语言。请验证：

- 每种已发布语言都有自己的索引；
- 译文标题、描述和正文出现在对应索引中；
- 结果 URL 包含正确的语言前缀；
- 英文结果不会通过内容回退取代中文结果；
- 结果页上的语言选择器能前往对应译文，或按文档规则回退到语言首页。

中文搜索出现故障时，应先检查生成的中文 JSON，再考虑修改分词。索引缺失或只包含英文，通常属于内容或构建配置问题。

## Google Custom Search（可选） {#google-search}

Google Custom Search
Engine（GCSE）通过 Google 索引搜索公开站点。它需要已经部署且允许爬取的生产站点，并会把查询发送给第三方服务。

在 [Google Programmable Search][] 中创建搜索引擎后，添加搜索结果页：

```yaml
---
title: 搜索结果
layout: search
---
```

随后配置搜索引擎 ID：

```yaml
params:
  gcs_engine_id: YOUR_ENGINE_ID
  offlineSearch: false
```

Google 搜索的暗色兼容样式默认不加载。启用 GCSE 时，请在消费站点的
`assets/scss/_styles_project.scss` 中显式导入：

```scss
@import 'td/gcs-search-dark';
```

为每种支持语言创建译文结果页；必要时使用适合该语言的搜索引擎配置。删除
`gcs_engine_id` 即可禁用 GCSE。

消费站点应在隐私政策中说明外部请求和隐私影响。GCSE 无法在网络隔离部署中使用。

## Algolia DocSearch（可选） {#algolia-docsearch}

Algolia
DocSearch 为符合条件的公开文档站点提供托管爬虫和交互式结果面板。取得项目的 application
ID、搜索 API key 和索引名称后，配置：

```yaml
params:
  offlineSearch: false
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_API_KEY
      indexName: YOUR_INDEX_NAME
```

只能使用公开的只读搜索 key，绝不能使用管理 key。爬虫规则、语言 facet、索引更新与外部服务声明应与站点配置一同维护。该集成有意与本地优先默认值分离。

可以覆盖主题 partial `layouts/_partials/algolia/head.html` 和
`layouts/_partials/algolia/scripts.html`，实现站点专属集成。空的覆盖文件会禁用对应主题 partial。

## 自定义搜索 {#custom-search}

如果现有选项都不合适，站点可以替换搜索输入、结果行为与样式。应尽量复用外壳的对话框与无障碍合同。除非自定义代码与服务商无关，并且能被多个产品复用，否则应保留在站点层。

自定义在线服务商必须显式启用，并说明网络、隐私、索引、故障与离线行为。自定义本地服务商必须从站点或主题发布全部运行时资源，并遵守语言和
`baseURL` 边界。

[Google Programmable Search]: https://programmablesearchengine.google.com/
