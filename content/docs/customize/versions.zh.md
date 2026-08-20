---
title: 多版本
linkTitle: 多版本
description: 配置版本切换菜单与归档横幅，并选择多个版本在域名上的部署布局。
weight: 100
search_keywords: [多版本, 版本管理, versions, version-menu, version-menu-pagelinks, archived-version, url-latest-version, 归档, 版本菜单, 子路径部署]
aliases:
  - /docs/configure/versioning/
---

产品有多个受支持版本时，文档通常也要分版本。主题提供两项功能：顶栏的版本切换菜单，与旧版本站点上的归档提示横幅。部署布局由站点决定：主题不做跨版本的单次构建，每个版本是一次独立的 Hugo 构建。

## 版本切换菜单 {#version-menu}

在 `params.versions` 里列出要出现在菜单里的版本。这个列表非空时，顶栏工具区出现一个分支图标的菜单，页脚最底层栏出现同样内容的纯图标向上菜单。

```yaml {title="hugo.yml"}
params:
  # 当前站点是哪个版本
  version: v2.1
  # 菜单的无障碍名称；底栏触发器仍只显示图标
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

菜单项默认显示 `version` 的值，写了 `name` 就显示 `name`。当前项标成选中态，判定方式是条目的 `version` 等于 `params.version`，或者条目的 `url` 等于站点的 `baseURL`，两者满足其一即可。

没写 `url` 的条目显示为不可点击的灰项，可用作分节标题；`name: '---'` 是一条分隔线（分隔线上写 `url` 会告警）。`name` 支持行内 Markdown：

```yaml {title="hugo.yml"}
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

同一份列表也是[命令面板](/zh/docs/customize/panel/)里「切换版本」的数据来源，菜单与面板不会不一致。

## 逐页跳转的取舍 {#pagelinks}

`version_menu_pagelinks: true` 会把当前页面的路径拼到目标版本的 URL 后面，读者切换版本时 **停在同一篇文档**。

代价是目标版本不一定有这个页面：文档结构在版本间会演进，旧版本没有新增的页面，读者切换过去就是 404。本站关闭这个选项。

单个条目可以覆盖全局设置：

```yaml {title="hugo.yml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # 这一版结构差异大，只跳首页
```

> [!TIP] 判断依据是文档结构的稳定程度，不是版本号的距离
> 结构稳定时开启，结构变动大时关闭。跳到版本首页多一步操作，仍优于 404。

## 归档横幅 {#archived-banner}

不再维护的旧版本站点上，向读者说明这是一份快照：

```yaml {title="hugo.yml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

`archived_version: true` 时，每个文档页与书籍页正文顶部出现一条横幅，写明当前版本已不再积极维护，并给出指向 `url_latest_version` 的链接。文案随站点语言本地化，无需自行编写；`version` 是横幅里显示的版本号。

横幅只出现在文档与书籍页面上，博客和落地页没有。

## `params.version` 与 `params.versions` 的区别 {#site-version}

两个键名字相近，职责不同：

- `params.versions` 是 **一张跨站点的清单**：菜单里能跳到哪些版本，各自的地址是什么。它描述的是其它站点。
- `params.version` 是当前这次构建自己的版本标识。它决定菜单里哪一项被标成选中、归档横幅里显示什么版本号，`data/download/*.yaml` 没写 `version` 时也以它兜底（见[发布与下载页](/zh/docs/write/releases/)）。

它不一定是 Git 引用。需要一个能解析的发布 tag（例如安装命令里引用的那个）时，另设一个自己的参数，不要复用 `params.version`。这两个键的完整定义在[配置总览](/zh/docs/customize/config/)。

## 多版本部署布局 {#deployment}
| 布局 | `baseURL` | 特点 |
| --- | --- | --- |
| 子域名 | `https://v1-9.docs.example.com/` | 各版本相互独立，互不影响；需要给每个版本配 DNS 与证书 |
| 子路径 | `https://docs.example.com/v1.9/` | 单域名，SEO 权重集中；需要托管方支持按路径路由到不同产物 |

每个版本是一次独立构建：从对应的 Git 分支或 tag 检出内容，用那一版自己的 `hugo.yml` 构建，产物发布到对应地址。当前版本的站点把 `versions` 列全，旧版本的站点在列全之外再加上归档横幅。

> [!IMPORTANT] 子路径部署时 `baseURL` 必须包含那段路径
> 否则搜索索引、页面动作与资源链接都指向域名根目录：页面看上去正常，搜索却没有结果。这是子路径部署最常见的故障，部署细节见[发布上线](/zh/docs/admin/deploy/)。

## 验证 {#verify}

1. 构建后确认版本菜单进了页面：

   ```bash
   grep -c 'nav-version-menu' public/zh/docs/customize/versions/index.html
   ```

   `params.versions` 为空或未配置时，菜单整个不生成。

2. 看当前版本有没有被标成选中：

   ```bash
   grep -o 'nav-hover-menu__option is-active[^>]*' public/index.html
   ```

   一条都没有，说明 `params.version` 与 `versions` 里的 `version` 字段对不上，或者 `baseURL` 与该条目的 `url` 不一致（注意结尾斜杠）。

3. 逐个访问菜单里的链接。开启 `version_menu_pagelinks` 时，在一篇旧版本不存在的文档上试一次，确认落点可以接受。

4. 归档站点上打开任意文档页，横幅应该在正文最上方，语言与站点一致，链接指向最新版本。

5. 按 <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> 打开命令面板，「切换版本」列出的应该是同一份清单。

## 相关 {#related}

- [导航与菜单](/zh/docs/customize/navigation/) — 版本菜单在顶栏与侧栏里的位置
- [命令面板](/zh/docs/customize/panel/) — 面板里的「切换版本」
- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、子路径与多目标发布
- [发布与下载页](/zh/docs/write/releases/) — 用 `params.version` 兜底的下载数据
- [配置总览](/zh/docs/customize/config/) — `version` / `versions` / `archived_version` 的完整定义
