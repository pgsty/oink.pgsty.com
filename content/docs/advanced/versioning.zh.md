---
title: 文档版本管理
weight: 30
icon: fa-solid fa-code-branch
description: 连接多个文档版本并标记归档版本。
aliases: [/docs/content/versioning/, /docs/feature/versioning/]
cSpell:ignore: pagelinks Kubeflow
---

<!-- markdownlint-disable blanks-around-headings no-bare-urls single-h1 -->

根据项目的发布和版本管理方式，你可能需要让用户访问旧版文档。旧版本的具体部署方式由你决定。本页介绍 OINK 提供的功能：在各个文档版本之间导航，并在归档站点上显示信息横幅。

## 添加版本下拉菜单 {#adding-a-version-drop-down-menu}

如果在 `hugo.toml`、`hugo.yaml` 或 `hugo.json` 中添加
`[params.versions]`，OINK 会在顶部导航栏加入版本下拉选择器。请为每个需要加入菜单的版本指定 URL 和名称，例如：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
# Add your release versions here
[[params.versions]]
  version = "master"
  url = "https://master.kubeflow.org"

[[params.versions]]
  version = "v0.2"
  url = "https://v0-2.kubeflow.org"

[[params.versions]]
  version = "v0.3"
  url = "https://v0-3.kubeflow.org"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  versions:
    - version: master
      url: 'https://master.kubeflow.org'
    - version: v0.2
      url: 'https://v0-2.kubeflow.org'
    - version: v0.3
      url: 'https://v0-3.kubeflow.org'
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "versions": [
      {
        "version": "master",
        "url": "https://master.kubeflow.org"
      },
      {
        "version": "v0.2",
        "url": "https://v0-2.kubeflow.org"
      },
      {
        "version": "v0.3",
        "url": "https://v0-3.kubeflow.org"
      }
    ]
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

别忘了加入当前版本，这样用户才能返回！

版本下拉菜单的默认标题是 **Releases**。要修改标题，请在 `hugo.toml`、`hugo.yaml`
或 `hugo.json` 中调整站点参数 `version_menu`：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->
{{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params]
version_menu = "Releases"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  version_menu: Releases
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "version_menu": "Releases"
  }
}
{{< /tab >}}
{{< /tabpane >}}
<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->

如果把 `version_menu_pagelinks` 参数设为
`true`，版本下拉菜单会链接到其他版本中的当前页面，而不是它们的首页。如果文档在不同版本之间变化不大，这项功能会很有用。请注意：如果当前页面在另一版本中不存在，链接就会失效。

还可以分别配置每个菜单项：

- 如果菜单标签不是版本号，使用 `name` 代替 `version`。
- 将 `name` 设为 `---` 可添加菜单分隔线。
- 省略 `url` 可渲染禁用的文本项，例如分组标题。
- 设置 `kind` 可添加与类型对应的 CSS 类。详情请参阅[导航与菜单][]。
- 即使全局 `version_menu_pagelinks` 参数为 `true`，仍可在某个菜单项上设置
  `pagelinks: false`，让它始终链接到该版本首页。

例如：

```yaml
params:
  version_menu: v1.2
  version_menu_pagelinks: true
  versions:
    - name: '**Versions**'
    - version: v1.3-dev
      kind: next
      url: https://next.example.com
    - version: v1.2
      kind: latest
      url: https://docs.example.com
    - name: ---
    - name: Preview variant
      kind: home
      pagelinks: false
      url: https://preview.example.com
```

要进一步了解 OINK 菜单，请参阅[导航与菜单][]。

[导航与菜单]: /zh/docs/content/navigation/#version-menu

## 在归档文档站点显示横幅 {#displaying-a-banner-on-archived-doc-sites}

如果为旧版文档创建归档快照，可以在归档文档的每个页面顶部添加提示，告诉读者他们正在查看不再维护的快照，并提供指向最新版本的链接。

例如，可以查看 [Kubeflow v0.6 归档文档](https://v0-6.kubeflow.org/docs/)：

<figure>
  <img src="/images/version-banner.png"
       alt="一个文本框，说明当前页面是不再维护的文档快照。"
       class="mt-3 mb-3 border border-info rounded" />
  <figcaption>图 1：Kubeflow v0.6 归档文档中的横幅</figcaption>
</figure>

要在文档站点加入横幅，请在 `hugo.toml`、`hugo.yaml` 或 `hugo.json`
中完成以下修改：

<!-- markdownlint-disable no-shortcut-ref-link -->
<!-- prettier-ignore-start -->

1. 将站点参数 `archived_version` 设为 `true`：

    {{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params]
archived_version = true
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  archived_version: true
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "archived_version": true
  }
}
{{< /tab >}}
    {{< /tabpane >}}

1. 将站点参数 `version` 设为归档文档集的版本。例如，如果归档文档对应 0.1 版：

    {{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params]
version = "0.1"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  version: 0.1
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "version": "0.1"
  }
}
{{< /tab >}}
    {{< /tabpane >}}

1. 确认站点参数 `url_latest_version` 包含希望读者前往的网站 URL。大多数情况下，它应该是最新版文档的 URL：

    {{< tabpane >}}
{{< tab header="配置文件：" disabled=true />}}
{{< tab header="hugo.toml" lang="toml" >}}
[params]
url_latest_version = "https://your-latest-doc-site.com"
{{< /tab >}}
{{< tab header="hugo.yaml" lang="yaml" >}}
params:
  url_latest_version: https://your-latest-doc-site.com
{{< /tab >}}
{{< tab header="hugo.json" lang="json" >}}
{
  "params": {
    "url_latest_version": "https://your-latest-doc-site.com"
  }
}
{{< /tab >}}
    {{< /tabpane >}}

<!-- prettier-ignore-end -->
<!-- markdownlint-enable no-shortcut-ref-link -->
