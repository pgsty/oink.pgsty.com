---
title: 全文检索
linkTitle: 全文检索
description: 打开本地搜索，控制索引体积与结果排序，让中文查询也能命中。
weight: 60
search_keywords: [offline_search, 全文检索, 搜索, search, 本地搜索, 索引, Lunr, CJK, 中文搜索, search-boost, search-keywords, search-exclude, Algolia, DocSearch, Google CSE]
aliases:
  - /docs/advanced/search/
---

OINK 的搜索是本地搜索：Hugo 在构建时给每种语言生成一份 JSON 索引，读者的浏览器下载它，在本地完成检索。不需要爬虫、账号、CDN，也不需要联网。主题默认不启用，一行配置即可开启。

搜索的入口是命令面板，打开方式与面板的其余内容见[命令面板](/zh/docs/customize/panel/)。

## 打开本地搜索 {#enable}

```yaml {title="hugo.yml"}
params:
  offline_search: true
```

这一个键决定索引、Lunr 运行时与搜索对话框是否进入页面。三个条件同时成立时页面才带上它们：

- `params.offline_search` 为真；
- 页面是首页，或者用了外壳布局（`docs` / `book` / `blog` / `swagger`，见[布局与页面类型](/zh/docs/customize/layout/)），或者是开着 `params.ui.landing_search` 的落地页；
- 当前输出不是打印。

任何一条不成立，构建就不往这个页面里放对话框、索引引用与 Lunr。这些资源不是被隐藏，而是不生成。

`hugo server` 下索引默认 **也会生成**，预览行为与线上一致。站点极大、每次改动都重建全站索引明显拖慢预览时，把它关掉：

```yaml {title="hugo.yml"}
params:
  offline_search: true
  # 预览时跳过索引构建，只在超大站点上需要
  offline_search_on_serve: false
```

## 控制索引体积 {#index-scope}

`offline_search_index` 决定每个页面往索引里写多少内容，因此同时决定两件事：读者能否搜到正文里的词，以及第一次搜索要下载多大的文件。

```yaml {title="hugo.yml"}
params:
  offline_search: true
  offline_search_index: summary
  offline_search_summary_length: 70
  offline_search_max_results: 10
```

| 取值 | 索引进去的内容 | 什么时候用 |
| --- | --- | --- |
| `title` | 标题、标签、分类、`search_keywords` | 只靠标题定位的超大站 |
| `heading` | 上面这些 + 页内各级标题 | 标题写得足够具体时 |
| `summary` | 上面这些 + 描述与摘要 | 千页级站点；本站使用这一档 |
| `content` | 上面这些 + 全文纯文本 | 默认值，几百页以内适用 |

其它取值在普通预览中告警并使用 `content`；发布前应审阅 `invalid params.offline_search_index` 诊断并检查回退结果。

`offline_search_summary_length` 是结果行里摘要的截断长度（默认 70），`offline_search_max_results` 是结果条数上限（默认 10）。这几个键的完整定义在[配置总览](/zh/docs/customize/config/)。

> [!IMPORTANT] 每种语言一份索引，预算是未压缩 2 MiB、gzip 512 KiB。
> 读者搜第一个词之前要先下载整份索引。超过这个量级就把 `offline_search_index` 从 `content` 降到 `summary`。

## 调整排序 {#ranking}

页面在 front matter 里影响自己的排名：

```yaml {title="content/docs/reference/pgsql.zh.md"}
---
title: PostgreSQL 参数
search_keywords: [postgres, postgresql, pg, 数据库参数, GUC]
search_boost: 1.5
---
```

`search_keywords` 是额外的匹配词，可以写一个字符串，也可以写数组。它是这两个键里更有用的一个：读者搜 `pg` 或 `GUC` 即可命中标题只写着「PostgreSQL 参数」的页面。检索时关键词的权重仅次于标题，高于正文。

`search_boost` 是最终得分的正数乘子，默认 `1.0`，作用在文本匹配得分之上。`1.5` 不会把页面固定在第一位，在本地候选中，只让它在相同关键词覆盖率与短语层级内前移。零、负数与非数字会告警并按 `1.0` 处理。

整节的默认值用 cascade 一次设定：

```yaml {title="content/docs/_index.zh.md"}
---
title: 文档
cascade:
  search_boost: 1.25
---
```

页面自己写的值覆盖继承来的值。本站 `docs/` 下的页面按这种方式使用 `search_keywords`：每页列出中文说法、英文原词与配置键名。

## 把页面挡在索引外 {#exclude}

```yaml {title="content/internal/draft-plan.zh.md"}
---
title: 内部计划
search_exclude: true
---
```

`search_exclude` 是唯一写法。已移除的 `exclude_search` 与 `excludeSearch` 不再被
读取，因此不能保护页面；迁移检查器会报告它们。正文为空的页面不进索引。

> [!WARNING] 索引是任何人都能下载的静态 JSON 文件，不是访问控制。
> 不该公开的内容不要放进站点，也不要用 `search_exclude` 保护它。

## 中文、混合查询与标识符 {#cjk}

> [!NOTE] 下一版本的本地候选
> 以下行为已在同级开发 checkout 中实现。公开 v1.3.2 仍按整条 CJK 查询连续匹配。

搜索按空白和拉丁文字与 CJK 的边界拆词：`PostgreSQL 备份` 与 `PostgreSQL备份`
都会查询 `postgresql` 和 `备份`。连续的 CJK 字串仍按字面子串匹配，不使用词典；
`主从复制` 不等于 `复制主从`。请用空格分隔概念，例如 `连接池 超时`。
`search_keywords` 仍适合补充同义说法与缩写。

搜索保留下划线、连字符、点号、路径与命令选项。可以查询 `shared_buffers`、
`pg_basebackup`、`--baseURL` 或 `/pg/data`。这些内容按字面标识符处理，不作为
查询运算符或拼写纠错对象。英文词保留 Lunr 词干匹配；某个词没有精确或词干命中时，
5–7 个字符的词最多允许一次编辑，更长的词最多允许两次。短词和标识符使用字面子串匹配。
查询会统一大小写与 Unicode 全半角，最多使用 24 个不同的词。

关键词可以分布在不同字段中：标题含 `PostgreSQL`、描述含 `备份`，即可覆盖两个词。
排序规则如下：

1. 有页面覆盖全部关键词时，只显示这些页面。否则显示标注命中词数与总词数的部分匹配，优先展示覆盖更多词的页面。
2. 覆盖率相同时，连续完整短语优先。
3. 在上述层级内部，把字段得分乘以 `search_boost`。每个词取最强字段，依次为页面标题、关键词、标签与分类、页内标题、描述、正文。同分时按标题和 URL 稳定排序。

输入过程中的字面子串也能命中。加权不能让部分匹配超过完整匹配。
结果仍按顶栏的栏目顺序分组；先应用全局结果数量上限，再在组内保留排序。
仅命中关键词时显示页面描述或摘要，不显示同义词列表。

同页多个小节命中时只占一行，显示最相关的小节标题与附近文字，并打开真实渲染的标题 ID。
显式 ID、自动生成的重复标题 ID、中文标题和部署子路径都保留。只有元数据命中、没有小节
命中时打开页面。`heading` 和 `summary` 范围可以定位标题命中；只出现在正文里的词需要
`content`。索引不会隐式扩大为全文。命中摘要展示附近最多 160 个字符；配置的摘要长度仍
控制无上下文命中时的后备摘录。

面板中的 **搜索范围** 并排显示全部栏目与当前顶层栏目（如文档、博客、书籍），点击即可切换。
每次加载页面默认全部栏目，在同页关闭再打开面板时保留选择。首页没有当前栏目。
命令和页面操作继续可用，命令模式隐藏范围控件。用 Tab 到达选中的范围，方向键切换，
再按 Tab 回到查询框；在查询框中按 Shift+Tab 则回到选中的范围。

输入法组字期间暂停结果更新与 Enter 激活，文字上屏后再检索。
空结果、加载中、索引不可用、结果数量与部分匹配状态都有可读文字，并向屏幕阅读器播报。

## 可选：在线搜索 {#hosted}
本地搜索之外，主题保留了两个在线搜索集成，默认关闭。**同一时间只启用一种**：配置了多个入口时构建告警 `You have more than one site-search option configured`。

启用在线搜索意味着接受对应服务的抓取方式、可用性与隐私边界，这些应写进站点的隐私说明。

### Algolia DocSearch {#algolia}

```yaml {title="hugo.yml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

三个值必须都显式写出。缺任意一项都会告警并停用 Algolia：普通预览继续，发布前应核对告警与停用结果。OINK 不会回退到其它项目的公共索引。DocSearch 的 JS 与 CSS 随主题内置，不从 CDN 加载，但每次检索请求都发到 Algolia。需要真实的密钥与索引才能工作，此处不渲染。

### Google 可编程搜索 {#google-cse}

```yaml {title="hugo.yml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

还需要给结果准备一个落地页：

```yaml {title="content/search.md"}
---
title: 搜索结果
layout: search
---
```

搜索框把查询提交到 `<baseURL>/search/?q=…`，结果由 Google 的脚本在那个页面上渲染，需要访问 `cse.google.com`。同样需要外部服务，此处不渲染。

## 验证 {#verify}

1. 构建，确认每种语言各生成了一份索引：

   ```bash
   hugo --printPathWarnings
   ls public/offline-search-index.*
   ```

   开发构建下文件名是 `offline-search-index.zh.json`，生产构建加指纹，形如 `offline-search-index.zh.7ab….json`。一种语言一个文件，缺少某个文件说明那种语言的页面没进索引。

2. 查看索引内容，这是排查「中文搜不到」的第一步：

   ```bash
   python3 -c "import glob,json; f=sorted(glob.glob('public/offline-search-index.zh*.json'))[0]; \
     d=json.load(open(f)); print(f, len(d)); print(d[0])"
   ```

   条目数应接近中文页面数，`keywords` 与 `boost` 字段能看到写进 front matter 的值。

3. 打开站点，按 <kbd>/</kbd>，分别用一个英文词与一个中文词各搜一次。结果按内容根分组，每组的名字是面包屑的第一段。

4. 子路径部署（站点挂在 `https://example.com/docs/` 这类路径下）时，打开浏览器开发者工具的网络面板，确认索引请求带上了子路径。索引请求打到域名根目录并返回 404、页面其余部分正常，是「搜索没结果」最常见的原因。

## 相关 {#related}

- [命令面板](/zh/docs/customize/panel/) — 搜索的入口，以及面板里的命令与页面动作
- [键盘导航](/zh/docs/customize/keyboard/) — 打开搜索与打开命令的四个单键
- [多语言](/zh/docs/customize/i18n/) — 分语言索引与缺译回退
- [配置总览](/zh/docs/customize/config/) — `offline_search*` 各键的完整定义
- [页面参数](/zh/docs/write/frontmatter/) — `search_keywords` / `search_boost` / `search_exclude`
