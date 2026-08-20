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

## 搭建内容树 {#content-tree}

```filetree {title="一棵小型双语文档树"}
- content/
  - _index.md
  - _index.zh.md
  - docs/
    - _index.md
    - _index.zh.md
    - start/
      - _index.md
      - _index.zh.md
      - install.md
      - install.zh.md
  - blog/
    - _index.md
    - _index.zh.md
```

每个读者可以进入的目录都要有 `_index.md`。译文以 `.zh.md` 后缀放在英文源文件旁边。
页面拥有图片或下载文件时使用 Page Bundle；没有自属资源时，保留单个 Markdown 文件即可。

## 明确写出顺序 {#ordering}

权重使用 10 的倍数。这些空档便于日后插入新页面，而不必重新给所有同级页面编号。

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

[第一章建立的可见基线](/zh/book/01-start/#baseline)是一处明确的参考点。
本章的内容树则为后续每项变更确定了相对于这条基线的稳定位置。

完整规则见[编写页面](/zh/docs/write/pages/)与[组织内容](/zh/docs/write/organize/)。
