---
title: 打印支持
description: 让整节文档更便于打印。
---

大多数浏览器都能很好地打印单篇文档，因为页面样式会从打印输出中移除导航外壳。

有些站点适合启用“打印整节”功能（本用户指南就是如此）。选择后，系统会把当前顶层分区（本页所在的“内容与自定义”等）连同全部子页面和子分区渲染为适合打印的格式，并附上该分区的完整目录。

要启用此功能，请在站点的 `hugo.toml`、`hugo.yaml` 或 `hugo.json` 中，为
`section` 类型添加 `print` 输出格式：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[outputs]
section = [ "HTML", "RSS", "print" ]
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
outputs:
  section:
    - HTML
    - RSS
    - print
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "outputs": {
    "section": [
      "HTML",
      "RSS",
      "print"
    ]
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

随后，站点右侧导航中会显示“打印整节”链接。

## 进一步自定义 {#further-customization}

### 禁用目录 {#disabling-the-toc}

如果不希望可打印视图显示目录，可以在页面 front matter，或者
`hugo.toml`、`hugo.yaml`、`hugo.json` 中将 `disable_toc` 参数设为 `true`：

<!-- markdownlint-disable -->
<!-- prettier-ignore-start -->
{{< tabpane langEqualsHeader=true >}}
{{< tab header="Front matter：" disabled=true />}}
{{< tab toml >}}
+++
…
disable_toc = true
…
+++
{{< /tab >}}
{{< tab yaml >}}
---
…
disable_toc: true
…
---
{{< /tab >}}
{{< tab json >}}
{
  …,
  "disable_toc": true,
  …
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params.print]
disable_toc = true
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  print:
    disable_toc: true
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "print": {
      "disable_toc": true
    }
  }
}
{{< /tab >}}
{{< /tabpane >}}
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
