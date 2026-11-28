---
title: 多版本
linkTitle: 多版本
description: 为产品的多个版本并列发布文档，配上版本切换菜单，并用横幅把不再维护的版本标为归档。
weight: 100
search_keywords: [多版本, 版本管理, versions, version-menu, version-menu-pagelinks, archived-version, url-latest-version, 归档, 版本菜单, 子路径部署]
aliases:
  - /docs/configure/versioning/
---

当读者同时在用产品的不同版本，而这些版本在读者要动手的地方确有差异，比如命令、配置键、默认值，文档就需要分版本。如果大多数读者都能升级到最新版，或者旧版本之间只差一些已修复的缺陷，那就只维护一个站点，在正文里注明例外即可：单个站点更容易维护，也更容易搜索。

OINK 把每个版本当作一个独立的站点：单独一次 Hugo 构建，通常来自各自的 Git 分支或 tag，发布到各自的地址。主题用顶栏的版本菜单把这些站点连起来，并在不再维护的版本上显示归档横幅。

## 版本切换菜单 {#version-menu}

在 `params.versions` 里列出各个版本。列表不为空时，顶栏出现一个分支图标，点开就是版本菜单；页脚最底层栏还有一个只显示图标、向上展开的菜单，内容相同。

```yaml {title="hugo.yml"}
params:
  # 当前站点是哪个版本
  version: v2.1
  # 菜单的无障碍名称与悬停提示（默认 Version）
  version_menu: v2.1
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v2.0
      url: https://v2-0.docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
```

菜单项显示 `version` 的值，写了 `name` 就显示 `name`。某个条目的 `version` 等于 `params.version`，或者它的 `url` 等于站点的 `baseURL`（结尾斜杠不计），就标记为当前版本。

没写 `url` 的条目显示为不可点击的灰项，可以用作分组标题；`name: '---'` 画一条分隔线（分隔线上写 `url` 会告警）。`name` 支持行内 Markdown：

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

同一份列表也是[命令面板](/zh/docs/customize/panel/)里「切换版本」的数据来源，菜单与面板始终一致。

## 逐页跳转的取舍 {#pagelinks}

默认情况下，菜单项打开目标版本的首页。`version_menu_pagelinks: true` 则把当前页面的路径拼到目标 URL 后面，读者切换版本时停在同一篇文档上。代价是可能遇到 404：文档结构在版本之间会变化，v2.1 新增的页面在 v1.9 里并不存在。本站关闭了这个选项。

大多数版本结构相同、只有个别版本不同时，可以打开这个选项，再让那个条目单独退出：

```yaml {title="hugo.yml"}
params:
  version_menu_pagelinks: true
  versions:
    - version: v2.1
      url: https://docs.example.com
    - version: v1.9
      url: https://v1-9.docs.example.com
      pagelinks: false # 这一版结构已大改，只跳首页
```

`pagelinks: false` 是唯一的单条目设置；全站选项关闭时，单个条目无法单独开启逐页跳转。判断依据是文档结构是否稳定，而不是版本号相差多远：从版本首页多点一次，对读者来说比 404 好得多。

## 归档横幅 {#archived-banner}

一个版本停止维护后，把它的站点标为快照，从搜索引擎进来的读者就知道该去找更新的版本：

```yaml {title="hugo.yml"}
params:
  archived_version: true
  version: v1.9
  url_latest_version: https://docs.example.com
```

`archived_version: true` 时，站点的每个页面（包括博客和落地页）顶部都会出现一条横幅，说明 v1.9 版本已不再积极维护、当前浏览的是一份归档快照，并给出指向 `url_latest_version` 的链接。文案随站点语言显示，无需自己编写。横幅里的版本号取自 `params.version`，没有设置它时构建会告警并且不显示横幅，所以两项都要写。`url_latest_version` 没有通过主题的 URL 检查时会告警，横幅照常显示，只是没有链接。

## `params.version` 与 `params.versions` 的区别 {#site-version}

两个键名字相近，描述的却是不同的东西：

- `params.versions` 是一份站点清单：菜单里有哪些版本，各自在哪个地址。
- `params.version` 说明当前这次构建是哪个版本。它决定菜单里哪一项标为当前版本，提供横幅里的版本号；`data/download/*.yaml` 没写 `version` 时也以它兜底（见[发布与下载页](/zh/docs/write/releases/)）。

`params.version` 是给读者看的标签，不一定是 Git 引用。内容里需要一个能解析的发布 tag 时，例如安装命令里的版本号，另设一个参数，不要复用 `params.version`。两个键的定义见[配置总览](/zh/docs/customize/config/#languages-versions)。

## 多版本部署布局 {#deployment}

| 布局 | `baseURL` | 特点 |
| --- | --- | --- |
| 子域名 | `https://v1-9.docs.example.com/` | 各版本完全独立；每个版本都要单独配置 DNS 记录与证书 |
| 子路径 | `https://docs.example.com/v1.9/` | 所有版本共用一个域名，搜索排名集中；需要托管方按路径把请求路由到不同的构建产物 |

每个版本单独构建：检出它的分支或 tag，用那一版自己的 `hugo.yml` 构建，再发布到它的地址。版本菜单是每次构建的一部分，所以新增一个版本时，要在每个仍在发布的分支上更新 `params.versions` 并重新构建；没有重建的旧站点，菜单还是旧的。归档站点使用同一份清单，再加上 `archived_version: true`。

> [!IMPORTANT] 子路径部署时 `baseURL` 必须包含那段路径
> 否则搜索索引、页面动作与资源链接都指向域名根目录：页面看上去正常，搜索却没有结果，这是子路径部署最常见的故障。托管方的其余设置见[发布上线](/zh/docs/admin/deploy/)。

## 验证 {#verify}

在站点根目录完成生产构建后执行以下检查。把 `public/zh/docs/getting-started/index.html` 换成你的站点实际生成的某个文档页，并按语言配置调整路径前缀。

1. 确认版本菜单进了页面：

   ```bash
   hugo --printPathWarnings
   PAGE=public/zh/docs/getting-started/index.html
   test -f "$PAGE" && grep -c 'nav-version-menu' "$PAGE"
   ```

   `params.versions` 为空或未配置时，根本不会生成菜单。

2. 确认当前版本已被标记：

   ```bash
   grep -o 'td-nav-hover-menu__option td-is-active[^>]*' "$PAGE"
   ```

   没有输出，说明没有哪个条目的 `version` 等于 `params.version`，也没有哪个条目的 `url` 等于 `baseURL`。

3. 逐个打开菜单里的链接。开启了 `version_menu_pagelinks` 时，在一篇旧版本没有的页面上切换一次，确认读者落到的位置可以接受。

4. 在归档站点上打开任意页面，确认横幅位于顶部、语言与站点一致，并且指向当前版本的链接可用。

5. 按 <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd>，确认「切换版本」列出的版本与菜单相同。

## 相关 {#related}

- [导航与菜单](/zh/docs/customize/navigation/) — 版本菜单在顶栏与页脚里的位置
- [命令面板](/zh/docs/customize/panel/) — 面板里的「切换版本」
- [发布上线](/zh/docs/admin/deploy/) — `baseURL`、子路径与多目标发布
- [发布与下载页](/zh/docs/write/releases/) — 用 `params.version` 兜底的下载数据
- [配置总览](/zh/docs/customize/config/) — `version` / `versions` / `archived_version` 的完整定义
