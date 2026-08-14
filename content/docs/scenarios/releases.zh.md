---
title: 版本发布与下载
linkTitle: 版本发布
weight: 20
description: >-
  在不调用远程 API
  的前提下，让发布事实、归档链接、校验和以及滚动/固定版本下载渠道保持一致。
search_keywords: [发布卡片, 发布资产, 校验和, 下载, 滚动渠道, 固定版本]
---

Oink 把不可变的发布事实与呈现方式分开。发布页面拥有版本与仓库身份，本地下载数据拥有分发渠道；卡片、列表、校验和表、文档页与 Landing 页面都从这些记录推导，不必在多个模板中重复复制 URL 与命令。

## 定义发布事实 {#release-facts}

在页面 front matter 中添加严格的 `release` Map：

```yaml
release:
  product: Pig
  version: 1.7.0
  repo: pgsty/pig
  tag: v1.7.0
  date: 2026-08-14
  prev: v1.6.0
  checksums: SHA256SUMS
```

`version` 与 `repo` 必填。省略 `tag` 时推导为 `v{version}`；省略 `date`
时使用页面日期。可选的 `product`、`prev` 与 `checksums`
用于补全记录。未知键、错误类型或不符合 `owner/name` 形式的仓库都会让构建失败。

简单的 GitHub 发布也可以使用精确标签 URL 简写：

```yaml
release: https://github.com/pgsty/pig/releases/tag/v1.7.0
```

Oink 在本地推导仓库、发布、归档、diff、校验和与资产链接。构建时不调用 GitHub，也不会声称某个标签或资产已经远程存在。

## 渲染发布卡片 {#release-card}

在需要显示事实摘要的位置放入无参数短代码：

```go-html-template
{{</* release-card */>}}
```

调用中不接受事实或任何参数，页面 front
matter 是唯一权威来源。HTML 得到无需运行时的语义化链接卡片；print 与 RSS 得到静态链接列表；Markdown 得到普通 Markdown 链接。

## 建立发布索引 {#release-index}

发布分区可以启用确定性排序：

```yaml
---
title: 版本发布
layout: releases
release_group_by_product: true
release_products: [OINK, Pig]
---
```

页面先按规范化发布日期降序，再按有效 SemVer 优先级降序，最后对现实中的非 SemVer 标签使用确定性字典序兜底。默认生成一条全局时间序列。设置
`release_group_by_product: true` 后，每个入选页面都必须定义
`product`。`release_products`
接受单个产品或数组，按产品字符串精确匹配，并在排序前过滤；非法过滤条件会让构建失败，而不是渲染一个看似合理的空页面。

## 发布校验和资产 {#release-assets}

在 `release-assets` 中写入严格的 `sha*sum` 行：

<!-- prettier-ignore-start -->
```go-html-template
{{</* release-assets group="auto" */>}}
0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef  pig-1.7.0-linux-amd64.tar.gz
fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210 *pig-1.7.0-darwin-arm64.tar.gz
{{</* /release-assets */>}}
```
<!-- prettier-ignore-end -->

也可以把校验和文件提交为页面资源或 Hugo 资产，并且只引用一个来源：

```go-html-template
{{</* release-assets src="release/SHA256SUMS" group="auto" */>}}
```

解析器会拒绝格式错误的行并报告行号，也会拒绝混用算法、算法与哈希长度不符、类似路径的文件名和含糊的多输入来源。HTML 会链接每项资产，并按需加载一个本地复制运行时；print 显示完整哈希但不含控件；Markdown 与 RSS 输出完整哈希表。

`group="auto"` 会按常见平台与架构名称分组。只有声明预期校验和算法时才使用
`algo`；只有资产基址不同于 `release` 事实推导出的 URL 时才使用 `base`。

## 只定义一次下载渠道 {#download-data}

创建 `data/download/pig.yaml`：

```yaml
version: 1.7.0
repo: pgsty/pig
published: true
channels:
  - id: script
    kind: rolling
    title: Install script
    title_zh: 安装脚本
    icon: fa-solid fa-bolt
    note: Tracks the rolling stable channel.
    note_zh: 跟随滚动稳定渠道。
    steps:
      - title: Install
        title_zh: 安装
        code: curl -fsSL https://repo.example.org/pig/install | bash
        lang: bash
  - id: source
    kind: pinned
    title: Source archive
    title_zh: 源码归档
    icon: fa-solid fa-code-branch
    url: https://github.com/pgsty/pig/archive/refs/tags/${tag}.tar.gz
    steps:
      - title: Clone the tag
        title_zh: 克隆标签
        code: git clone --branch ${tag} https://github.com/pgsty/pig.git
        lang: bash
  - id: assets
    kind: pinned
    title: Release assets
    title_zh: 发布资产
    icon: fa-solid fa-box-open
    checksums_src: release/pig-SHA256SUMS
```

记录需要直接提供字符串 `version`，或通过 `params.version` 提供版本，同时要有非空
`channels` 数组。每个渠道需要唯一且可作为锚点的 `id`、唯一一种 `kind`（`rolling`
或 `pinned`），以及本地化标题。

共享字段依次尝试精确语言后缀、主语言后缀与无后缀字段。例如中文可能依次解析
`title_zh_cn`、`title_zh`、`title`。只有固定版本渠道的 `url` 与 `steps[].code`
可以插值 `${version}` 或
`${tag}`。滚动渠道拒绝所有插值，避免稳定命令误装成固定版本命令。

## 渲染下载内容 {#download-shortcode}

使用一个位置参数引用数据键：

```go-html-template
{{</* download "pig" */>}}
```

HTML 输出渠道索引与静态优先的内容分区；代码步骤复用 Oink 增强代码渲染器，校验和渠道复用 Release
Assets。print 展开同一份安全内容；Markdown 输出标题、源码围栏与完整哈希；RSS 省略该组件。

不可变发布尚不存在时设置
`published: false`。滚动渠道仍可使用；固定版本渠道显示不可点击的待发布状态，省略固定版本命令，并禁用资产链接与复制控件。只有标签与资产能够解析后才翻转该事实，不要在正文中粘贴猜测的链接。

Landing 页面可以通过 `download` 分区消费同一记录：

```yaml
sections:
  - type: download
    data:
      title: 下载 Pig
      keys: [pig]
```

## 发布检查清单 {#validation}

1. 从源码发布流程确认版本、标签、上一标签、仓库与日期。
2. 每项校验和提交前都与实际发布产物核对。
3. 构建 HTML、print 与 Markdown，并检查非 HTML 中是否保留完整哈希。
4. 发布前测试 `published: false`；只有远程标签和资产存在后才测试并设置为
   `true`。
5. 验证每种语言与子路径部署。
6. 分别记录源码完成、主题标签发布、模块解析、消费站固定版本与线上可用性。
