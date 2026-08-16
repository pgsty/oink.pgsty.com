---
title: 打印支持
weight: 20
description: 配置单页与整节文档的打印输出。
aliases: [/docs/content/print/, /docs/feature/print/]
---

大多数浏览器都能很好地打印单篇文档，因为页面样式会从打印输出中移除导航外壳。因此，打印单个页面交给浏览器自带的
`Cmd/Ctrl+P` 即可，OINK 不再提供页面级的打印操作。

有些站点适合启用“打印整节”功能（本用户指南就是如此）。选择后，系统会把当前顶层分区（例如本页所在的“高级特性”）连同全部子页面和子分区渲染为适合打印的格式，并附上该分区的完整目录。

要启用此功能，请在站点的 `hugo.toml`、`hugo.yaml` 或 `hugo.json` 中，为
`section` 类型添加 `print` 输出格式：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
```toml {tab="hugo.toml" group="hugotoml-hugoyaml-hugojson" value="hugotoml"}
[outputs]
section = [ "HTML", "RSS", "print" ]
```

```yaml {tab="hugo.yaml" value="hugoyaml"}
outputs:
  section:
    - HTML
    - RSS
    - print
```

```json {tab="hugo.json" value="hugojson"}
{
  "outputs": {
    "section": [
      "HTML",
      "RSS",
      "print"
    ]
  }
}
```
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

随后，[页面操作菜单](/zh/docs/configure/navigation/#page-actions)中会出现「打印整个分区」条目，命令面板中则以
`print_section` 的形式出现。

## 进一步自定义 {#further-customization}

### 禁用目录 {#disabling-the-toc}

如果不希望可打印视图显示目录，可以在页面 front matter，或者
`hugo.toml`、`hugo.yaml`、`hugo.json` 中将 `disable_toc` 参数设为 `true`：

<!-- markdownlint-disable -->
<!-- prettier-ignore-start -->
```toml {tab="toml" group="toml-yaml-json" value="toml"}
+++
…
disable_toc = true
…
+++
```

```yaml {tab="yaml" value="yaml"}
---
…
disable_toc: true
…
---
```

```json {tab="json" value="json"}
{
  …,
  "disable_toc": true,
  …
}
```
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
```toml {tab="hugo.toml" group="hugotoml-hugoyaml-hugojson" value="hugotoml"}
[params.print]
disable_toc = true
```

```yaml {tab="hugo.yaml" value="hugoyaml"}
params:
  print:
    disable_toc: true
```

```json {tab="hugo.json" value="hugojson"}
{
  "params": {
    "print": {
      "disable_toc": true
    }
  }
}
```
<!-- prettier-ignore-end -->
<!-- markdownlint-restore -->

## 布局钩子 {#layout-hooks}

主题定义了多种布局 partial 和钩子，可用来定制打印格式。这些文件位于
`layouts/_partials/print`。

钩子可以按内容类型定义。例如，如果希望 `blog` 页与 `docs`
页使用不同的标题布局，可以创建
`layouts/_partials/print/page-heading-<type>.html`，例如
`page-heading-blog.html`。默认实现使用页面标题和描述作为页首标题。

同理，可以通过创建 `layouts/_partials/print/content-<type>.html`
来定制每个页面的正文格式。
