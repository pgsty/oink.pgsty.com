---
title: 徽章
linkTitle: 徽章
description: 用五种语义 tone 之一，给功能名、版本号或表格单元格标上 Beta、已弃用这类简短状态。
weight: 170
search_keywords: [徽章, Badge, 状态标签, tone, Beta, 已弃用, neutral, info, success, warning, danger]
---

徽章（Badge）是跟在名字后面的行内小标签，用一两个词说明它的状态：Beta、已弃用、v0.5、需自建服务。你只需决定这个状态的含义，从五种 tone 里选一个，颜色由主题挑选，浅色与深色模式下都保持足够的对比度。状态需要说明原因、操作步骤或截止日期时，改写一句正文或一个[提示块](/zh/docs/components/callout/)。

## 最简例子 {#minimal}

```markdown {title="源码"}
{{</* badge text="Beta" tone="warning" */>}}
```

{{< badge text="Beta" tone="warning" >}}

`text` 是唯一必填参数，不能为空。

## 五种 tone {#tones}

```markdown {title="源码"}
{{</* badge text="默认" */>}}
{{</* badge text="信息" tone="info" */>}}
{{</* badge text="已支持" tone="success" */>}}
{{</* badge text="实验性" tone="warning" */>}}
{{</* badge text="已弃用" tone="danger" */>}}
```

{{< badge text="默认" >}}
{{< badge text="信息" tone="info" >}}
{{< badge text="已支持" tone="success" >}}
{{< badge text="实验性" tone="warning" >}}
{{< badge text="已弃用" tone="danger" >}}

不写 `tone` 时是 `neutral`。这五个之外的取值会告警并回退为 `neutral`，也没有办法自定义颜色。

## 夹在句子里 {#inline}

徽章紧跟在它所修饰的名字后面，与名字在同一行：

```markdown {title="源码"}
逻辑复制 {{</* badge text="默认关闭" tone="neutral" */>}} 需要设置
`wal_level = logical`。`pg_duckdb` 扩展 {{</* badge text="按需启用" tone="info" */>}}
需要单独安装；备份仓库 {{</* badge text="需自建服务" tone="warning" */>}}
必须在第一次备份之前指向一个对象存储。
```

逻辑复制 {{< badge text="默认关闭" tone="neutral" >}} 需要设置
`wal_level = logical`。`pg_duckdb` 扩展 {{< badge text="按需启用" tone="info" >}}
需要单独安装；备份仓库 {{< badge text="需自建服务" tone="warning" >}}
必须在第一次备份之前指向一个对象存储。

## 标题旁边 {#in-headings}

不要把徽章或其它任何 shortcode 写进标题。Hugo 先生成目录、后展开 shortcode，标题本身看起来正常，目录里对应的条目却会显示一段 Hugo 内部占位符。把徽章放在标题下第一段的开头：

```markdown {title="源码"}
### OpenAPI 页面 {#openapi-example}

{{</* badge text="0.5 新增" tone="success" */>}} 这一节介绍……
```

### OpenAPI 页面 {#openapi-example}

{{< badge text="0.5 新增" tone="success" >}} 徽章紧贴在标题下方，目录保持干净，
分享出去的标题链接也不会带上徽章文字。

## 表格单元格里 {#in-tables}

对照表里用一列徽章标状态，比整列写「是」「否」更容易扫读：

```markdown {title="源码"}
| 组件 | 形态 | 状态 |
| --- | --- | --- |
| 提示块 | `> [!NOTE]` | {{</* badge text="稳定" tone="success" */>}} |
| 画廊 | ` ```gallery ` 围栏 | {{</* badge text="稳定" tone="success" */>}} |
| PlantUML | ` ```plantuml ` 围栏 | {{</* badge text="按需启用" tone="info" */>}} |
| `image` shortcode | — | {{</* badge text="已移除" tone="danger" */>}} |
```

| 组件 | 形态 | 状态 |
| --- | --- | --- |
| 提示块 | `> [!NOTE]` | {{< badge text="稳定" tone="success" >}} |
| 画廊 | ` ```gallery ` 围栏 | {{< badge text="稳定" tone="success" >}} |
| PlantUML | ` ```plantuml ` 围栏 | {{< badge text="按需启用" tone="info" >}} |
| `image` shortcode | — | {{< badge text="已移除" tone="danger" >}} |

## 列表与步骤里 {#in-lists}

```markdown {title="源码"}
1. 安装 Hugo {{</* badge text="0.170+" tone="info" */>}}
1. 从 OINK Starter 创建站点，修改 `hugo.yaml` 里的 `baseURL`
1. `hugo server` 预览 {{</* badge text="1313 端口" tone="neutral" */>}}
{.steps}
```

1. 安装 Hugo {{< badge text="0.170+" tone="info" >}}
1. 从 OINK Starter 创建站点，修改 `hugo.yaml` 里的 `baseURL`
1. `hugo server` 预览 {{< badge text="1313 端口" tone="neutral" >}}
{.steps}

## 卡片里 {#in-cards}

卡片有自己的 `badge` 参数，是显示在标题旁的纯文本；卡片正文里也可以放徽章 shortcode：

```markdown {title="源码"}
{{</* cards */>}}
{{</* card title="Hugo Module" icon="fa-brands fa-golang" badge="推荐" */>}}
一行 `hugo mod get` 完成安装 {{</* badge text="需要 Go" tone="info" */>}}
{{</* /card */>}}
{{</* card title="离线归档" icon="fa-solid fa-box-archive" */>}}
不联网的机器也能构建 {{</* badge text="手动升级" tone="warning" */>}}
{{</* /card */>}}
{{</* /cards */>}}
```

{{< cards >}}
{{< card title="Hugo Module" icon="fa-brands fa-golang" badge="推荐" >}}
一行 `hugo mod get` 完成安装 {{< badge text="需要 Go" tone="info" >}}
{{< /card >}}
{{< card title="离线归档" icon="fa-solid fa-box-archive" >}}
不联网的机器也能构建 {{< badge text="手动升级" tone="warning" >}}
{{< /card >}}
{{< /cards >}}

## 可点击的徽章 {#link}

`link` 把徽章变成链接，可以是站内路径、相对路径、`http(s):` 地址或 `mailto:` 地址：

```markdown {title="源码"}
当前版本 {{</* badge text="v0.5" tone="info" link="/zh/blog/" */>}}，
升级步骤见 {{</* badge text="版本升级" tone="neutral" link="/zh/docs/admin/upgrade/" */>}}。
```

当前版本 {{< badge text="v0.5" tone="info" link="/zh/blog/" >}}，
升级步骤见 {{< badge text="版本升级" tone="neutral" link="/zh/docs/admin/upgrade/" >}}。

链接无效时告警并丢弃，只留下一个普通徽章。

## 输出形态 {#outputs}

徽章不加载脚本，打印与 RSS 中的样子与页面上一致。徽章只有 shortcode 一种写法，没有原生 Markdown 形态，所以页面的 Markdown 输出把它变成加粗文字：`**Beta**`，带链接时是 `[**Beta**](/…)`。

## 参数参考 {#reference}

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | 纯文本 | — | 必填，非空。读者看到的文字 |
| `tone` | 枚举 | `neutral` | `neutral` `info` `success` `warning` `danger` |
| `link` | URL | — | 设置后徽章变成链接 |
{.fields meta="type default"}

徽章只接受命名参数，没有 `icon`、`class`、`color`、`outline`、`size`。写错时告警并回退：未知参数被忽略，缺少 `text` 或为空时不渲染，未知的 `tone` 变成 `neutral`，不安全的链接被丢弃。

## 限制与常见问题 {#limits}

- 颜色只是辅助，文字本身要说清状态。`{{</* badge text="🔴" */>}}` 对读屏器毫无信息。
- 没有图标参数。需要图标时改用[卡片](/zh/docs/components/cards/)或[提示块](/zh/docs/components/callout/)。
- 文字控制在几个字以内。徽章不换行，更长的内容写进句子里。
- 同一处最多放三枚，一排徽章会盖过它们修饰的名字。

## 相关 {#related}

- [卡片](/zh/docs/components/cards/) — `card` 自己的 `badge` 参数
- [文件树](/zh/docs/components/filetree/) — `tone` 用的是同一套词汇
- [按键](/zh/docs/components/kbd/) — 另一个行内 shortcode
- [提示块](/zh/docs/components/callout/) — 状态需要解释时用它
