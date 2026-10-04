---
title: 为内容建立结构
linkTitle: 组织内容
description: 让目录、分区索引、页面包与权重共同构成可预期的阅读与导航顺序。
book_kind: chapter
book_number: 2
weight: 20
---

对普通站点而言，OINK 不会另外维护一份导航数据库。内容树就是侧栏树，同一个顺序还会驱动翻页器
与 Book 目录。读者不应该对“下一页是什么”得到三个不同答案。

## 从读者的问题出发 {#reader-questions}

一级分区应使用读者能辨认的任务或主题命名。小型工程站点通常需要上手指南、参考文档、
运维指南与变更记录。只有当一个目录能为若干页面提供有意义的共享上下文时，才应创建它。

继续使用第 1 章的 Starter，保留已有示例。本章在现有 Docs 分区下新增一篇英文页面及其
中文译文。法语可以保持启用；本练习只添加下面两种语言的对页。

## 搭建内容树 {#content-tree}

```filetree {title="本练习涉及的文件；其它 Starter 文件保持不变"}
- content/
  - docs/
    - _index.md                         # 已有分区根页
    - _index.zh.md                      # 已有中文根页
    - preview-check.md                  # 新增页面
    - preview-check.zh.md               # 新增译文
```

按下面的完整内容创建两个文件。分区根页已经存在，不要替换它们。

```markdown {title="content/docs/preview-check.md"}
---
title: Verify a local preview
description: Check that a documentation edit reaches the browser.
weight: 25
---

## Check the preview {#check-preview}

Open this page locally, change this sentence, and confirm the browser updates.
```

```markdown {title="content/docs/preview-check.zh.md"}
---
title: 验证本地预览
description: 确认文档修改已经显示在浏览器中。
weight: 25
---

## 检查预览 {#check-preview}

在本地打开本页，修改这句话，再确认浏览器已显示新内容。
```

译文以 `.zh.md` 后缀放在英文源文件旁边。这两页没有图片或下载资源，使用独立 Markdown
文件即可；页面拥有这些资源时，再使用页面包。

## 明确写出顺序 {#ordering}

现有栏目权重之间留有空档。新页面使用 `25`，可以插入相邻栏目之间，而不必重新编号；两种译文保持相同权重。新建内容树时，以 10 为间隔也能留下类似空间：

| 项目 | 权重 | 为什么放在这里 |
| --- | ---: | --- |
| 快速上手 | 10 | 建立可运行的基线 |
| 创作内容 | 20 | 在可运行站点上继续搭建 |
| 定制站点 | 30 | 在结构之后改变呈现 |
| 运行维护 | 40 | 验证并发布结果 |
{#tbl-reading-order num="2-1" caption="同一个显式顺序被导航、翻页与生成目录共同使用。"}

## 建立稳定地址 {#stable-addresses}

任何可能被其它页面引用的标题，都要显式写出 ID。英文页面与中文页面虽然显示不同的标题，
却使用同一个 ID。这会让链接、页内目录与整书打印在两种语言中始终对齐。

保持 `hugo server` 运行，打开 `/docs/preview-check/` 与 `/zh/docs/preview-check/`。
两页都应出现在各自的 Docs 侧栏中，语言切换应打开对应译文；两页标题的锚点均为
`#check-preview`。保留这两个文件，第 3 章继续修改它们。

完整规则见[编写页面](/zh/docs/write/pages/)与[组织内容](/zh/docs/write/organize/)。
