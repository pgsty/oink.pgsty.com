---
title: 搜索与命令面板
linkTitle: 搜索与命令面板
weight: 10
description: 本地索引、搜索排序、命令面板的三种模式与可选的在线搜索。
---

OINK 默认且推荐本地搜索：Hugo 为每种语言生成独立索引，Lunr 与 CJK 回退都从同源资源提供。站点不需要公共爬虫、外部账户、CDN 或网络连接就能完成构建和搜索。

Google Custom Search 与 Algolia
DocSearch 作为兼容集成保留，默认关闭。**同一时间只能启用一种搜索实现。**

## 启用本地搜索 {#enable-local-search}

```yaml {filename="hugo.yaml"}
params:
  offlineSearch: true
  offlineSearchIndex: summary # summary | content
  offlineSearchSummaryLength: 120
  offlineSearchMaxResults: 12
```

{{< fields >}}
{{% field name="offlineSearch" type="boolean" default="false" required=true %}}
启用本地索引与命令面板。不要同时配置 `gcs_engine_id` 或
`params.search.algolia`。 {{% /field %}}
{{% field name="offlineSearchIndex" type="string" default="content" %}}
`summary` 只索引标题、描述与摘要；`content` 索引全部正文。**千页级站点应该用
`summary`**——`content` 会产生数 MB 的索引，读者每次搜索都要先下载它。
{{% /field %}}
{{% field name="offlineSearchSummaryLength" type="integer" default="70" %}}
结果摘要的长度。 {{% /field %}}
{{% field name="offlineSearchMaxResults" type="integer" default="10" %}}
最多显示几条结果。数值要保证对话框在移动端仍然好用。 {{% /field %}}
{{< /fields >}}

构建后每种语言会生成一个索引：

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

> [!IMPORTANT] 子路径部署时，确认浏览器是从配置的 `baseURL`
> 下请求索引，而不是域名根目录。这是搜索「没结果」最常见的原因，而且页面本身看起来是正常的。

## 命令面板 {#command-palette}

本地搜索的入口是命令面板，有三种模式：

| 模式     | 触发                  | 内容                         |
| -------- | --------------------- | ---------------------------- |
| 空查询   | `Cmd/Ctrl-K` 后不输入 | 快捷入口、页面操作、偏好设置 |
| 文本查询 | 直接输入              | 按分区分组的页面结果         |
| 命令模式 | `/` 或输入 `>` 前缀   | 只搜索命令，不查页面         |

`/`
是单字符快捷键，所以它只在可编辑控件之外生效——在 input、textarea、select 和 contenteditable 区域里打斜杠仍然是打字符。带修饰键的组合（`Ctrl-/`）也不会触发。

面板已打开时按 `/` 不会清空当前查询。

### 面板里有什么 {#palette-contents}

- **快捷入口**：由 `params.ui.quick_links` 指定的顶级菜单项
- **页面操作**：复制 Markdown 文本、在 ChatGPT/Claude 中打开、查阅 Markdown 源码、查阅编辑历史、编辑本页、创建子页面、提交文档 issue、提交项目 issue、打印整个分区
- **偏好设置**：切换配色、语言、版本，以及打开项目仓库

页面操作和面板命令走同一套注册表，所以无论从[面包屑拆分按钮](/zh/docs/configure/navigation/#page-actions)还是面板触发，行为完全一致。

> [!NOTE] 页面级的 `print` 操作已废弃。打印单个页面本来就是浏览器 `Cmd/Ctrl+P`
> 的职责；`print_section`
> 保留下来，因为把整个分区渲染成一份可打印文档并不是浏览器自己能做到的事。

### 自定义命令 {#custom-commands}

站点可以添加自己的命令：

```yaml {filename="hugo.yaml"}
languages:
  zh:
    params:
      ui:
        command_palette:
          commands:
            - id: status
              title: 服务状态
              description: 查看当前服务健康状况
              url: https://status.example.com/
              icon: fa-solid fa-signal
              keywords: [可用性, 事故]
```

只接受 **URL** 或内置 action ID，不接受任意 JavaScript 回调。

> [!WARNING] 不要用 `action:`
> 给内置动作起别名。内置动作已经在面板里了，再包一层只会让同一个功能以两个不同名字出现两次。这个坑本站踩过。

多语言站点在 `languages.<lang>.params` 下分别定义，标题和关键词才能本地化。

## 搜索排序 {#search-ranking}

页面可以通过 front matter 影响排序：

```yaml
---
title: PostgreSQL 配置
search_keywords: [postgres, postgresql, pg]
search_boost: 1.5
search_exclude: false
---
```

{{< fields >}} {{% field name="search_keywords" type="string 或数组" %}}
额外的匹配词。Latin 与 CJK 两条路径都会用到——读者搜 `pg`
也能命中标题里只写了「PostgreSQL」的页面。 {{% /field %}}
{{% field name="search_boost" type="number" default="1.0" %}}
正数权重乘子。非法值（零、负数、非数字）会告警并按 `1.0` 处理。 {{% /field %}}
{{% field name="search_exclude" type="boolean" default="false" %}}
把页面排除出索引。旧的 `exclude_search` 与 `excludeSearch` 仍然兼容。
{{% /field %}} {{< /fields >}}

`search_boost` 可以通过 cascade 给整个分区设默认值，页面级设置会覆盖它：

```yaml
---
title: 文档
cascade:
  search_boost: 1.25
---
```

排除采用任一为真即排除的优先级：只要规范字段或任何兼容别名为真，页面就被排除。`search_exclude: false`
不能覆盖一个为真的旧别名。

> [!NOTE] 本地索引对所有访问者都是可下载的，**它不是访问控制**。不该公开的内容不要放进索引，也不要指望搜索排除能保护它。

## 中文与 CJK {#cjk}

Lunr 无法可靠地对中文分词，所以命令面板检测到 CJK 字符时会切换到子串匹配路径。两条路径应用相同的
`search_boost` 加权，结果排序是一致的。

中文搜索没结果时，先确认中文页面的内容确实进了中文索引，再考虑改分词逻辑。

## 可选的在线搜索 {#hosted-search}

### Google Custom Search {#google-search}

```yaml {filename="hugo.yaml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

### Algolia DocSearch {#algolia-docsearch}

```yaml {filename="hugo.yaml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

三个值都必须显式提供，缺一个就中断构建——OINK 不会回退到别的项目的公共索引。

启用在线搜索意味着接受对应的外部请求、索引方式、可用性与隐私边界。这是明确的产品决策，应该写进站点的隐私说明。

## 下一步 {#next-steps}

- [多语言](/zh/docs/configure/language/)：分语言索引的细节
- [AI 与 Agent 支持](../agent-support/)：Markdown 输出与 `llms.txt`
