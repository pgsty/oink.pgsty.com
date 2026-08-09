---
title: 从 Docsy npm 包迁移
linkTitle: 从 npm 迁移
aliases: [/docs/updating/updating-npm-package/]
weight: 2
description: 从 OINK 消费站点中移除上游 npm 主题包。
---

上游 `@docsy/theme` npm 包不是 OINK 的发行渠道。OINK 将 Bootstrap、Font
Awesome、字体和浏览器运行时直接随主题提供，因此消费站点只需 Hugo
Extended 即可构建。

## 移除 npm 主题集成 {#remove-the-npm-theme-integration}

首先选择一种 OINK 发行方式：固定版本的归档、Git
submodule 或克隆，或者兼容 Hugo 模块。让 Hugo 能够访问该主题，并确认执行
`hugo --gc --minify` 时可以正确解析。

随后，从站点的 `package.json` 中移除
`@docsy/theme`，以及仅用于构建 Docsy 资源的依赖。删除 Hugo 配置中 Bootstrap 和 Font
Awesome 的 npm 挂载项，同时删除只为旧主题管线存在的 PostCSS 与 Autoprefixer 构建步骤。

不要仅仅因为某项应用依赖使用 npm 就将其删除。Hugo-only 合同针对文档主题；站点自有应用或业务组件仍可能采用另一套明确且必要的工具链。

## 验证迁移 {#verify-the-migration}

从全新 checkout 开始，只安装 Hugo Extended，不创建 `node_modules`
目录，然后执行：

```sh
hugo --gc --minify
```

如果站点同时支持 LTR 和 RTL 页面，请分别检查。还要验证本地字体与图标、搜索、图表、API 文档和所有已经迁移的内容组件。构建完全正常后，只有在站点自有工具也不再使用 lockfile 时，才可以删除过时的 lockfile。

随后继续[审查主题覆盖](/zh/docs/update/#update-overrides)。
