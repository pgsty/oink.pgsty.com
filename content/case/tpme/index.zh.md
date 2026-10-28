---
title: tpme.vonng.com
linkTitle: TPME
description: >-
  《The Product-Minded Engineer》的双语书籍站，以精简的 OINK Book 外壳组织长篇阅读。
images: [featured.webp]
weight: 110
date: 2026-08-05
search_keywords: [tpme.vonng.com, Product-Minded Engineer, 双语书籍, 书籍外壳]
tags: [书籍, 双语, 出版]
---

[tpme.vonng.com](https://tpme.vonng.com/) 以中英文发布 *The Product-Minded
Engineer*，本案例快照中每种语言各十八章。它把支持的页面外壳收窄为 `[book]`。

## 它展示了什么 {#what-it-demonstrates}

- 只有一种内容模型、完全不需要文档外壳的出版物。
- 共享视觉与导航体系的双语章节对等页。
- 比多版本 DDIA 站更精简的 Book 实现。

对于单本教程或译著，这是更清晰的起点：先把站点架构保持精简，再按手稿需要
逐步加入编号与索引。

## 只保留书籍需要的阅读模型 {#implementation}

站点的 [`hugo.yaml`](https://github.com/Vonng/tpme/blob/bb49bef8ea3c66f8b27231b6a80f4bb4d6c98597/hugo.yaml)
在 `params.ui` 中设置：

```yaml
params:
  ui:
    typography: system
    shell_types: [book]
    docs_section: ''
```

这让共享外壳专注于书籍布局并采用系统字体栈。配合 `content/book/_index.md` 中的
[Book 根页模式](/zh/docs/write/book/)即可完成配置；后续若新增独立文档或博客栏目，
再按需加入对应的外壳类型。

→ [创作书籍](/zh/docs/write/book/) · [DDIA 案例](/zh/case/ddia/)
