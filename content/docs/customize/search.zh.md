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

其它取值构建失败，报 `invalid params.offline_search_index`。

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

`search_boost` 是最终得分的正数乘子，默认 `1.0`，作用在文本匹配得分之上。`1.5` 不会把页面固定在第一位，只让它在本来就匹配的结果里前移。零、负数与非数字会告警并按 `1.0` 处理。

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

`search_exclude` 是唯一写法，`exclude_search` 与 `excludeSearch` 会让构建失败并提示改名。正文为空的页面不进索引。

> [!WARNING] 索引是任何人都能下载的静态 JSON 文件，不是访问控制。
> 不该公开的内容不要放进站点，也不要用 `search_exclude` 保护它。

## 中文与 CJK {#cjk}

Lunr 不能可靠地给中文分词。面板在查询里检测到 CJK 字符时整条切到子串匹配：逐篇比对标题、关键词、页内标题、描述、正文，命中哪一层给哪一层的分，最后同样乘上 `search_boost`。两条路径的排序规则一致。

三点需要知道：

- 中文查询是 **子串** 匹配。搜「主从复制」只命中连续出现这四个字的位置，搜「复制主从」没有结果。
- `search_keywords` 对中文站的收益因此最大：把读者可能使用的同义说法、英文原词、缩写都写进去。
- 输入法组字期间面板不重算结果，文字上屏后才检索，中文输入不会逐字母刷新结果。

中文搜不到内容时，先确认中文页面进了中文那份索引（见下面的验证），再考虑分词问题。

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

三个值必须都显式写出，缺一个构建中断：OINK 不会回退到其它项目的公共索引。DocSearch 的 JS 与 CSS 随主题内置，不从 CDN 加载，但每次检索请求都发到 Algolia。需要真实的密钥与索引才能工作，此处不渲染。

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
   hugo --printPathWarnings --panicOnWarning
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
