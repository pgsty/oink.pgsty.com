---
title: Book 出版
linkTitle: Book 出版
weight: 40
description:
  使用同一棵导航树、编号组件、稳定交叉引用、生成式索引与整本打印 HTML
  出版长篇内容。
search_keywords: [Book, 章节, 图片, 表格, 公式, 交叉引用, 打印]
---

Oink 的 Book 能力扩展现有文档外壳，沿用内容树或
`data/docs_nav.json`、面包屑导航、翻页与感知输出的组件体系，不会引入第二份章节清单或平行导航实现。

## 创建 Book 根页面 {#book-root}

分区 Book 声明类型、请求所需输出，并把类型级联到后代：

```yaml
---
title: 系统手册
type: book
book_kind: book
book_number: B
outputs: [HTML, print, markdown]
cascade:
  type: book
---
```

即使站点启用了侧栏根切换器，Book 根始终是当前一级分区，因此导航不会泄漏到同级文档或博客。站点覆盖
`params.ui.shell_types` 时，请保留 `book`。

必须显式请求
`print`：Oink 不会擅自给消费站增加昂贵的聚合输出。分区 Book 对应 Hugo 的
`section` 输出类型；只有 Book 位于站点根时才使用 `home`：

```yaml
outputs:
  section: [HTML, print]
params:
  ui:
    shell_types: [docs, book, blog, swagger]
    sidebar_headings: 3
    book_draft_banner: true
```

`sidebar_headings` 接受 `false`、表示二级标题的
`true`，或 2 到 4 之间的最大标题层级；它会把当前页的 Hugo
fragment 树投射到章节行下。所有需要引用的标题都应使用显式 ID：

```markdown
## 同步复制 {#sec_replication_sync}
```

自动生成的标题 slug 适合普通导航，但不是持久引用 API。

## 描述章节 {#chapter-metadata}

章节可以使用既有元数据命名空间：

```yaml
---
title: 复制
book_kind: chapter
book_number: 3
book_part: II
book_status: draft
weight: 30
---
```

`book_number` 会显示在页面、侧栏与生成的 Book 目录标题旁。`book_status: draft`
只是可见的编辑状态，不会改变 Hugo 发布状态；设置 `book_draft_banner: true`
后，页面中还会出现本地化提示。

## 添加编号组件 {#numbered-components}

`fig`、`tbl` 与 `eq` 的编号形式要求 **带引号的**
`num`，内容只能包含字母、数字、点或连字符。默认 ID 分别为
`fig-<num>`、`tbl-<num>` 与 `eq-<num>`；迁移既有公开锚点时应显式设置稳定 ID。

### 图片 {#figures}

```go-html-template
{{</* fig num="2-1" id="office_2003" src="/fig/office.png"
    caption="Word 2003 界面" alt="堆叠了多行工具栏的 Word 2003"
    width="960" height="640" */>}}
```

新图片始终应提供有意义的 `alt`。`title` 是用于迁移的 `caption`
别名，两者互斥。图片可以使用 `src`
或内部 Markdown 内容，但不能同时使用。URL、class
token 与正整数图片尺寸均会校验。

### 表格 {#tables}

<!-- prettier-ignore-start -->
```go-html-template
{{</* tbl num="2-1" id="output-matrix" caption="不同输出面的行为。" */>}}
| 输出面 | 标签 | 锚点 |
| --- | --- | --- |
| HTML | 可见 | 稳定 |
| print | 可见 | 稳定 |
{{</* /tbl */>}}
```
<!-- prettier-ignore-end -->

该组件把标签、Markdown 表格、题注与锚点放在同一个语义化 figure 中，不会用标题伪装题注。

### 公式 {#equations}

```go-html-template
{{</* eq num="5.3" id="eq-capacity" caption="容量近似式。" */>}}
X \approx \frac{C}{R+Z}
{{</* /eq */>}}
```

公式内容直接交给本地服务端 KaTeX，即使站点没有启用 Goldmark
passthrough 也能工作。无参数 `eq` 仍是无编号块级公式兜底，不能成为 `xref` 目标。

重复 ID，或同类组件用不同 ID 声明同一编号，都会导致构建失败。题注是纯文本；图片与表格的内部内容遵循当前页面 Markdown 策略。

## 安全地交叉引用 {#cross-references}

按类型与编号引用目标：

```go-html-template
参见 {{</* xref fig="2-1" anchor="office_2003" */>}}。
```

使用显式链接文字引用另一页标题：

```go-html-template
参见{{</* xref page="../replication" anchor="sec_replication_sync" */>}}同步复制{{</* /xref */>}}。
```

`xref` 最多接受一种类型键（`fig`、`tbl` 或 `eq`），以及可选的 `page` 与
`anchor`。类型会提供本地化默认标签，并能推导默认锚点；只提供锚点时必须写内部链接文字。跨页查找使用 Hugo 当前语言的页面解析，因此源码无需硬编码
`/en/` 路径。

引用与源码顺序无关，可以出现在目标之前。在整本 print 中，Book-aware
xref 会变为文档内片段。普通 Markdown 跨页链接刻意保留为站点 URL，因此必须在聚合输出中工作的引用应使用
`xref`。

## 生成 Book 索引 {#book-indexes}

从同一棵有序 Book 树生成目录：

```go-html-template
{{</* book-toc depth=3 */>}}
```

深度 1 列章节，深度 2 加入嵌套分区，深度 3 再加入每页标题树。`drafts=false`
只会从该生成列表中过滤可见编辑草稿，不会取消页面发布。

生成图片、表格或公式清单：

```go-html-template
{{</* book-figures */>}}
{{</* book-figures kind="tbl" */>}}
{{</* book-figures kind="eq" */>}}
```

这些短代码会以确定方式触发并聚合后代内容，然后链接到稳定目标 ID，不需要复制一份注册表文件。

## 出版整本打印输出 {#whole-book-print}

Book 根的 `print`
输出依次生成封面、本地目录、根内容与阅读顺序中的可见后代。标记为
`no_print: true` 的页面、纯链接节点、侧栏分隔项与隐藏占位项都不会成为章节。

编号目标 ID 保持逐字节稳定。聚合文档会给页面局部 Markdown 标题 ID 添加来源页面前缀，因此
`summary`
之类重复锚点仍然唯一；生成的标题链接也会同步改写。Book 目录、图表清单与 `xref`
目标都会变为文档内地址。

产物是面向打印的 HTML，而不是依赖网络的 PDF/EPUB 流水线。分页、PDF 转换与 EPUB 打包仍由站点负责。

## 迁移既有书籍 {#migration}

先盘点，只转换无歧义形式；遇到缺失编号、题注、替代文字或目标时停止，不要猜测。公开 ID 与显示编号应分别保留。在分支上执行迁移，保存机器可读的前后报告，逐项审阅跳过记录，并要求第二次运行零变更。

Oink v0.4.0 源码提供先 dry-run、可幂等重跑的迁移工具，以及针对实测内容形态的
[TPME](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-tpme.md)、
[DDIA](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-ddia.md) 与
[pg-internal](https://github.com/pgsty/oink/blob/v0.4.0/docs/prd5-migrate-pg-internal.md)
方案。它们是对应源格式的可执行模式，不是通用题注猜测器。

## 验收 Book {#validation}

1. 对比侧栏、翻页、生成目录与整本打印的章节顺序。
2. 确认每个编号目标 ID 唯一，并且每种语言下的 xref 都能到达类型和编号匹配的目标。
3. 确认编号图片替代文字有意义，并与题注意图一致。
4. 检查独立 HTML、Markdown、print 与整本聚合输出。
5. 在聚合打印中测试重复标题名与跨章节引用。
6. 从主题 checkout 工作时运行
   `scripts/check-book.py`；消费站 CI 则应实现等价的渲染锚点检查。
