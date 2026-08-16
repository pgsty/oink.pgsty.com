---
title: 版本管理
linkTitle: 版本管理
weight: 40
description: 让读者在多个文档版本之间切换，并标记归档版本。
cSpell:ignore: pagelinks
---

产品有多个受支持版本时，文档通常也要分版本。OINK 提供两样东西：版本切换菜单和归档版本横幅。

各版本具体怎么部署由你决定——常见做法是每个版本一个子域名或子路径，各自独立构建。

## 版本切换菜单 {#adding-a-version-drop-down-menu}

在 `params.versions` 中列出要出现在菜单里的版本：

```yaml {title="hugo.yaml"}
params:
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

{{< fields >}} {{< field name="version_menu" type="string" >}}
菜单按钮上显示的文字，通常是当前版本号。 {{< /field >}}
{{< field name="versions[].version" type="string" required=true >}}
版本标识，显示在菜单项上。 {{< /field >}}
{{< field name="versions[].url" type="string" required=true >}}
该版本文档站的地址。留空的条目会显示为不可用。 {{< /field >}}
{{< field name="version_menu_pagelinks" type="boolean" default=false >}}
是否把当前页面路径附加到目标版本的 URL 后面。 {{< /field >}} {{< /fields >}}

菜单里可以用 `- name: '---'` 插入分隔线，把「受支持版本」和「历史版本」分开：

```yaml {title="hugo.yaml"}
params:
  versions:
    - name: '**当前版本**'
    - version: v2.1
      url: https://docs.example.com
    - name: '---'
    - name: '**历史版本**'
    - version: v1.9
      url: https://v1-9.docs.example.com
```

## 逐页跳转的取舍 {#page-level-switching}

`version_menu_pagelinks: true`
会把当前页面路径拼到目标版本的 URL 上，读者切换版本时停留在同一篇文档。

代价是：**目标版本不一定有这个页面**。文档结构在版本之间演进，旧版本可能没有新写的页面，读者会撞上 404。

```yaml {title="hugo.yaml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # 这个版本结构差异大，只跳首页
```

单个版本条目上的 `pagelinks: false` 会覆盖全局设置，让该版本只跳转到首页。

> [!TIP] 文档结构在版本间基本稳定时开
> `pagelinks`；差异大时关掉更好——跳到版本首页虽然多一步，但好过 404。

## 归档版本横幅 {#archived-banner}

在不再维护的旧版本站点上，显式告诉读者：

```yaml {title="hugo.yaml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

{{< fields >}}
{{< field name="archived_version" type="boolean" default=false >}} 设为 `true`
时，在每个页面顶部显示归档提示横幅。 {{< /field >}}
{{< field name="version" type="string" >}} 横幅中显示的当前版本号。
{{< /field >}} {{< field name="url_latest_version" type="string" >}}
指向最新版本的地址。横幅会给出一个链接。 {{< /field >}} {{< /fields >}}

横幅文案随站点语言本地化，不需要你自己写。

## 部署布局 {#deployment-layout}

两种常见做法：

| 布局   | `baseURL`                        | 特点                             |
| ------ | -------------------------------- | -------------------------------- |
| 子域名 | `https://v1-9.docs.example.com/` | 各版本完全独立，互不影响         |
| 子路径 | `https://docs.example.com/v1.9/` | 单一域名，需要托管方支持路径路由 |

> [!IMPORTANT] 子路径部署时 `baseURL`
> 必须包含该路径，否则搜索索引、页面操作和资源链接都会指向错误位置。这是子路径部署最常见的故障。

各版本是独立构建的：从对应的 Git 分支或标签检出内容，用该版本自己的 `hugo.yaml`
构建，产物发布到对应地址。OINK 不提供跨版本的单次构建。

## 下一步 {#next-steps}

- [多语言](../language/)：语言与版本的组合
- [部署](/zh/docs/deploy/)：把各版本发布出去
