---
title: 全文检索
linkTitle: 全文检索
description: 打开本地搜索，控制索引体积与结果排序，让中文查询也能命中。
weight: 60
search_keywords: [offline_search, 全文检索, 搜索, search, 本地搜索, 索引, BM25, CJK, 中文搜索, search-boost, search-keywords, search-exclude, Algolia, DocSearch, Google CSE]
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

这一个键决定索引、本地搜索引擎与搜索对话框是否进入页面。三个条件同时成立时页面才带上它们：

- `params.offline_search` 为真；
- 页面是首页，或者用了外壳布局（`docs` / `book` / `blog` / `swagger` / `expo`，见[布局与页面类型](/zh/docs/customize/layout/)），或者是开着 `params.ui.landing_search` 的落地页；
- 当前输出不是打印。

任何一条不成立，构建就不往这个页面里放对话框、索引引用与搜索引擎。这些资源不是被隐藏，而是不生成。

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

其它取值会报 `invalid params.offline_search_index` 告警并使用 `content`。

`offline_search_summary_length` 是结果行里摘要的截断长度（默认 70），`offline_search_max_results` 是结果条数上限（默认 10）。这几个键的完整定义在[配置总览](/zh/docs/customize/config/)。

> [!IMPORTANT] 超过 2 MiB 自动拆分索引（OINK 1.6.0 起）
> 每种语言的首批导航索引预算是未压缩 2 MiB、gzip 512 KiB。`content` 索引不超过 2 MiB 时仍发布为单个文件；超过 2 MiB 时，Hugo 会自动把正文拆分到 `offline-search-body.<lang>.json`：命令面板先用标题、小节标题、参数条目与关键词立即返回结果，正文不超过 8 MiB 时自动后台加载，超过 8 MiB 或浏览器开启 `Save-Data` 时则等读者点击「搜索正文」再加载。你仍可将 `offline_search_index` 设为 `summary` 以彻底省略正文。

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

`search_boost` 是最终得分的正数乘子，默认 `1.0`，同时作用于字段强度与小节 BM25 得分。`1.5` 可以提高页面排名，但不会让部分匹配排在完整匹配之前。零、负数与非数字会告警并按 `1.0` 处理。

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

OINK 1.6.0 用单一的扫描式 BM25 引擎替换了 Lunr 与旧子串回退，浏览器中不再建索引。
文本如何切分取决于字符本身的 Unicode 文字系统，而不依赖页面语言标签：

- **无需空格的中日韩查询**：连续的中日韩文字段按重叠二元组匹配，不附带词典，因此
  `数据库连接池超时` 或 `PostgreSQL备份` 无需手打空格即可命中。单个汉字仍作为一个词项，
  中日韩与拉丁文字边界自动断开。`search_keywords` 仍适合补充同义说法与缩写。
- **标识符与符号串**：下划线、连字符、点号、路径、命令选项以及两个字符以上的符号串
  （`shared_buffers`、`pg_basebackup`、`--baseURL`、`/pg/data`、`->>`）按字面匹配，
  从不作为拼写纠错对象。
- **词边界、词干与拼写回退**：普通单词按整词边界精确匹配（`port` 不再命中 `support`）。
  更长词的前缀、ASCII 词的 Porter 词形变化、其他字母文字的前四字符词干、下划线名或
  五字符以上复合词内部命中，以及拼写纠错，记为宽松匹配（按字段权重 0.7 计）。
  拼写回退仅在当前范围内找不到该 ASCII 词（至少 5 字符）的任何形式时启用：5–7 字符允许
  1 处编辑，8 字符起允许 2 处，相邻字母互换算 1 处。
- **格与虚词**：统一大小写与 Unicode 全半角，一次查询最多参与 30 个格。一小份英语虚词表和
  六个中文疑问词（`如何`、`怎么`、`什么`、`为什么`、`哪个`、`哪些`）按 0.1 计分且不作要求；
  整条查询全由这类词组成时按原样检索。

关键词可以分布在不同字段中，排序规则如下：

1. 按权重覆盖至少 90% 查询格的页面为完整匹配，有完整匹配时不显示部分匹配；否则按覆盖率
   十分档降序展示部分匹配，并标注命中数与总数。
2. 完整匹配中，在单个小节（及页面级字段）内即可覆盖查询的页面，排在需要跨多个小节的页面之前。
3. 字段强度取各格最强字段的加权平均（标题 10、关键词 8、标签与分类 6、小节标题与搜索条目 5、
   描述 3、正文 1；宽松匹配乘 0.7）；片段按顺序相邻出现时乘 1.5，再乘 `search_boost`。
4. 强度相同时按最佳小节的 BM25 得分（`k1 = 1.2`，`b = 0.5`）乘 `search_boost` 排序，
   再同分则按标题与 URL 稳定排序。

加权不能让部分匹配超过完整匹配。结果仍按顶栏的栏目顺序分组；先应用全局结果数量上限，
再在组内保留排序。仅命中关键词时显示页面描述或摘要，不显示同义词列表。

同页多个小节命中时只占一行，显示最相关的小节或条目标题，以及命中附近最多 160 个字符
（词形变化与拼写纠错按原文高亮），并打开真实渲染的锚点。每个带锚点的[参数表](/zh/docs/components/fields/)条目
（无论来自 `{.fields}` 还是 `fields`/`field`）都自动带有 `data-td-search-entry`，搜索参数名可直接定位到该条目；
自定义元素带有 `id` 与非空 `data-td-search-entry` 时行为相同。只有元数据命中、没有小节或条目
命中时打开页面。`heading` 和 `summary` 范围可以定位标题与参数条目；只出现在正文里的词需要
`content`。配置的摘要长度仍控制无上下文命中时的后备摘录。

面板中的 **搜索范围** 并排显示全部栏目与当前顶层栏目（如文档、博客、书籍），点击即可切换。
每次加载页面默认全部栏目，在同页关闭再打开面板时保留选择。首页没有当前栏目。
命令和页面操作继续可用，命令模式隐藏范围控件。用 Tab 到达选中的范围，方向键切换，
再按 Tab 回到查询框；在查询框中按 Shift+Tab 则回到选中的范围。

输入法组字期间暂停结果更新与 Enter 激活，文字上屏后再检索。
空结果、加载中、索引不可用、结果数量与部分匹配状态都有可读文字，并向屏幕阅读器播报。

## 可选：在线搜索 {#hosted}
本地搜索之外，主题保留了两个在线搜索集成，默认关闭。**同一时间只启用一种**：配置了多个入口时构建告警 `params: more than one site-search backend is configured`。

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

三个值必须都显式写出。缺任意一项都会告警并停用 Algolia。OINK 不会回退到其它项目的公共索引。DocSearch 的 JS 与 CSS 随主题内置，不从 CDN 加载，但每次检索请求都发到 Algolia。需要真实的密钥与索引才能工作，此处不渲染。

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
