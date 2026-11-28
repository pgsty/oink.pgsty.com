---
title: 公式
linkTitle: 公式
description: 用 KaTeX 写行内与块级数学公式，构建期渲染完毕，读者不下载任何脚本。
weight: 280
search_keywords: [公式, 数学, Math, KaTeX, LaTeX, TeX, passthrough, chem, mhchem, 化学式, 编号公式, eq]
---

公式用 TeX 书写，Hugo 在构建站点时用 KaTeX 把它渲染成 HTML 与 MathML。读者只多下载一份本地样式表，不需要任何脚本，也不会向远程数学服务发送请求。句子里的公式写 `\(…\)`，独占一行的公式写 `$$…$$` 或 `\[…\]`；不能修改站点配置时，用 `math` 与 `chem` 围栏。需要 TikZ 绘图或 KaTeX 不支持的宏包时，改用预渲染的[图片](/zh/docs/components/image/)。

## 站点前置配置 {#config}

`$$`、`\[…\]`、`\(…\)` 这几种分隔符，要在站点自己的配置里打开 Goldmark 的 passthrough 扩展后才生效。Hugo 不会从主题继承 `markup` 配置，所以这一步主题替你做不了。写 `math: true`（无论在 front matter 还是 `params` 里）什么也不会打开：缺少下面这段配置时，`$$` 会原样显示在页面上。

```yaml {title="hugo.yml"}
markup:
  goldmark:
    parser:
      attribute:
        block: true # 编号公式的属性行需要它
    extensions:
      passthrough:
        enable: true
        delimiters:
          block: [['\[', '\]'], ['$$', '$$']]
          inline: [['\(', '\)']]
```

行内分隔符刻意不包含单个 `$`，这样正文里「$5」之类的价格不会被当成公式的开头。各键的说明见[配置总览](/zh/docs/customize/config/)。`math`、`chem` 围栏和 `eq` shortcode 都不需要这段配置。

## 最简例子 {#minimal}

行内公式直接写在句子中，前后的空格与标点留在分隔符外面。

```markdown {title="源码"}
共享缓冲区命中率是 \(\mathrm{hit} = \frac{H}{H + R}\)，其中 \(H\) 是 `blks_hit`，\(R\) 是 `blks_read`。
```

共享缓冲区命中率是 \(\mathrm{hit} = \frac{H}{H + R}\)，其中 \(H\) 是 `blks_hit`，\(R\) 是 `blks_read`。

## 块级公式 {#display}

把公式单独成段、用 `$$` 或 `\[…\]` 包起来，就会居中放大显示。

```markdown {title="源码"}
一棵扇出为 \(f\)、共 \(N\) 个键的 B 树，其高度为：

$$
h = \left\lceil \log_{f} N \right\rceil
$$
```

一棵扇出为 \(f\)、共 \(N\) 个键的 B 树，其高度为：

$$
h = \left\lceil \log_{f} N \right\rceil
$$

一行放不下的长公式在正文栏内横向滚动，不会把页面撑宽。

## `math` 围栏 {#math-fence}

`math` 围栏是块级公式的另一种写法。它不依赖 passthrough 配置，在 GitHub 上显示为普通代码块。

````markdown {title="源码"}
```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```
````

```math
N_{\text{conn}} = \lambda \cdot \bar{t}_{\text{resp}}
```

这是 Little 定律在连接池上的形式：稳态下需要的连接数等于到达速率乘以平均响应时间，所以连接池可以比客户端数量小得多。

## 化学式与单位 {#chem}

`chem` 围栏用 KaTeX 的 mhchem 扩展排版 `\ce{…}`，物理单位也能排。

````markdown {title="源码"}
```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```
````

```chem
\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3^-}
```

语法见 [mhchem 手册](https://mhchem.github.io/MathJax-mhchem/)。

## 编号公式 {#numbered}

在块级公式下面加一行属性即可编号。编号写在 `num` 里，如 `3-1`、`5.3`，由你自己决定，因为主题不会自动计数；锚点默认为 `#eq-<num>`。编号显示在公式右侧，前面带上按站点语言本地化的「公式」字样。

```markdown {title="源码"}
$$
\text{WAL}_{\text{day}} \approx \text{TPS} \times \bar{s}_{\text{record}} \times 86400
$$
{#eq-wal num="3-1" caption="每日 WAL 产量的估算"}

见[公式 3-1](#eq-wal)：乘上保留天数就是归档盘容量的下限。
```

$$
\text{WAL}_{\text{day}} \approx \text{TPS} \times \bar{s}_{\text{record}} \times 86400
$$
{#eq-wal num="3-1" caption="每日 WAL 产量的估算"}

见[公式 3-1](#eq-wal)：乘上保留天数就是归档盘容量的下限。

`caption` 是可选的纯文本；`#id` 与 `caption` 都必须和 `num` 一起出现。属性行不完整时会告警，并丢弃用不上的部分；目标重复时告警并保留第一个。窄屏上，较长的公式标题在正文栏内换行。

## 交叉引用 {#xref}

同一页里用普通链接就能指向编号公式，上一节就是这样写的。要跨页引用，或者想让「公式 N」字样自动生成，用 `xref`：

```markdown {title="源码"}
容量规划从 {{</* xref eq="3-1" anchor="eq-wal" /*/>}} 开始。
```

容量规划从 {{< xref eq="3-1" anchor="eq-wal" />}} 开始。

`xref` 可以写在它所指的公式之前。整本书的公式目录和 `book-equations` 索引见[书籍出版](/zh/docs/write/book/)。

## `eq` shortcode {#eq-shortcode}

`eq` 使用同一个 KaTeX 引擎，供无法开启 passthrough 的站点使用，比如迁移来的书稿，或者你改不了 `hugo.yml` 的站点。不带参数时是一个不编号的块级公式；带上 `num` 后与属性行写法等价。能开启 passthrough 的站点，写 `$$` 更简洁。

```markdown {title="源码"}
{{</* eq */>}}\sigma_{\text{idx}} = \frac{\text{rows}_{\text{matched}}}{\text{rows}_{\text{total}}}{{</* /eq */>}}

{{</* eq num="3-2" caption="顺序扫描与索引扫描的代价平衡点" */>}}
c_{\text{seq}} \cdot P = c_{\text{rand}} \cdot \sigma \cdot T
{{</* /eq */>}}
```

{{< eq >}}\sigma_{\text{idx}} = \frac{\text{rows}_{\text{matched}}}{\text{rows}_{\text{total}}}{{< /eq >}}

{{< eq num="3-2" caption="顺序扫描与索引扫描的代价平衡点" >}}
c_{\text{seq}} \cdot P = c_{\text{rand}} \cdot \sigma \cdot T
{{< /eq >}}

## 输出形态 {#outputs}

任何写法都不加载 JavaScript。含公式的页面加载一份本地 `katex.min.css` 及其引用的 WOFF2 字体，不含公式的页面两者都不加载。打印时公式照常显示，长公式不滚动。Markdown 输出原样保留 TeX 源码，只有 `eq` shortcode 会变成 `**公式 3-2.** 说明` 加一个 `$$` 块。RSS 中是 KaTeX 渲染好的 HTML 与 MathML：带编号的 `$$` 块前有一行粗体「公式 N.」，带编号的 `eq` 则在公式下方保留「公式 N」图注。

## 参数参考 {#reference}

公式的四种写法：

| 写法 | 位置 | 说明 |
| --- | --- | --- |
| `\(…\)` | 行内 | 需要站点的 passthrough 配置；不能带属性 |
| `$$…$$` / `\[…\]` | 块级 | 需要站点的 passthrough 配置；下面加一行属性即可编号 |
| ```` ```math ```` | 块级围栏 | 不依赖 passthrough；不接受属性 |
| ```` ```chem ```` | 块级围栏 | 不依赖 passthrough；正文写 `\ce{…}` |
{.fields}

块级公式下的属性行 `{…}`：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `num` | 字符串 | — | `[0-9A-Za-z.-]+`；注册为编号公式，右侧显示「公式 N」 |
| `#id` | 标识符 | `eq-<num>` | `[A-Za-z][A-Za-z0-9_.:-]*`；锚点与交叉引用目标 |
| `caption` | 纯文本 | — | 编号后面的说明；需要 `num` |
{.fields meta="type default"}

`eq` shortcode 的参数：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `num` | 字符串 | — | 同上；不写就是一个不编号的普通块级公式 |
| `id` | 标识符 | `eq-<num>` | 需要 `num` |
| `caption` | 纯文本 | — | 需要 `num` |
| `class` | class 列表 | — | 需要 `num`；透传给站点 CSS |
| 正文 | TeX | — | 必填，非空 |
{.fields meta="type default"}

TeX 写错不会中断构建：Hugo 给出带 KaTeX 错误信息与源码位置的告警，页面上按原样显示这段表达式。发布前请在构建日志里查找这类告警。

## 限制与常见问题 {#limits}

- 只有 `$$` 块和 `eq` 能编号。`math` 围栏不接受属性行，需要编号时换一种写法。
- 主题从不自动计数或重新编号。调整章节顺序后，要自己改 `num`。
- 行内公式不能带属性，属性行只对块级公式有效。
- `caption` 是纯文本，里面的 Markdown 会按字面显示。

## 相关 {#related}

- [代码块](/zh/docs/components/code/) — 围栏参数与代码编号
- [图片](/zh/docs/components/image/) — 图的编号用同一套 `{#id num=}`
- [书籍出版](/zh/docs/write/book/) — 公式目录与跨页交叉引用
- [配置总览](/zh/docs/customize/config/) — `markup.goldmark` 相关键
