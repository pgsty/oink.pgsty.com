---
title: 全文检索
linkTitle: 全文检索
description: 打开本地搜索，控制索引体积与结果排序，让中文查询也能命中。
weight: 60
search_keywords: [offline_search, 全文检索, 搜索, search, 本地搜索, 索引, BM25, CJK, 中文搜索, search-boost, search-keywords, search-exclude, Algolia, DocSearch, Google CSE]
aliases:
  - /docs/advanced/search/
---

OINK 的搜索完全在读者的浏览器里完成：Hugo 在构建时为每种语言生成一份 JSON 索引，浏览器在第一次搜索时下载它，之后每次查询都在本地完成。不需要搭爬虫、开账号、接 CDN 或任何搜索服务，读者的查询也不会离开页面。搜索默认关闭，一行配置即可开启。

读者从命令面板发起搜索；面板怎么打开、里面还有什么，见[命令面板](/zh/docs/customize/panel/)。

## 打开本地搜索 {#enable}

```yaml {title="hugo.yml"}
params:
  offline_search: true
```

开启后，搜索出现在首页、所有使用外壳布局的页面（`docs`、`book`、`blog`、`swagger`、`expo`，见[布局与页面类型](/zh/docs/customize/layout/)），以及 `params.ui.landing_search` 打开时的落地页上；打印输出永远不带搜索。其余页面完全没有搜索对话框、索引引用和搜索引擎：它们不是被隐藏，而是根本不生成。

`hugo server` 同样会生成索引，所以预览里的搜索和线上完全一致。站点很大时，每次改动都重建整份索引会明显拖慢预览，可以在预览时跳过：

```yaml {title="hugo.yml"}
params:
  offline_search: true
  # 预览时跳过索引构建，只在超大站点上需要
  offline_search_on_serve: false
```

## 控制索引体积 {#index-scope}

`offline_search_index` 决定每个页面往索引里写多少内容。这是一笔交换：写得越多，读者能搜到的越多，第一次搜索时浏览器要下载的也越多。

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

`offline_search_summary_length` 是每页存入索引的摘录长度（字符数，默认 70），结果没有命中段落时显示这段摘录；`offline_search_max_results` 是一次搜索最多返回的页面数（默认 10）。完整定义见[配置总览](/zh/docs/customize/config/#search)。

`content` 索引再大，也不会拖慢第一次搜索。一种语言的索引不超过 2 MiB 时发布为单个文件；超过 2 MiB 时，构建会把正文移到第二个文件 `offline-search-body.<lang>.json`，首次下载只包含标题、小节标题、参数条目、描述和关键词，命令面板据此立即给出结果。正文文件不超过 8 MiB 时随后在后台加载；超过 8 MiB，或浏览器要求节省流量（`Save-Data`）时，等读者点击「搜索正文」再加载。想彻底不索引正文，就用 `summary`。

## 调整排序 {#ranking}

页面可以在自己的 front matter 里帮读者找到它：

```yaml {title="content/docs/reference/pgsql.zh.md"}
---
title: PostgreSQL 参数
search_keywords: [postgres, postgresql, pg, 数据库参数, GUC]
search_boost: 1.5
---
```

`search_keywords` 补充读者会搜、但页面本身未必写到的词，可以写一个字符串，也可以写列表。它通常比加权更管用：读者搜 `pg` 或 `GUC`，就能找到标题只写着「PostgreSQL 参数」的页面。关键词的权重仅次于标题，高于正文。

`search_boost` 是页面得分的乘数，默认 `1.0`，同时作用于字段强度和小节 BM25 得分。设为 `1.5` 能把页面往前提，但绝不会让部分匹配排到完整匹配之前。零、负数和非数字会告警，并按 `1.0` 处理。

整个分区的默认值用 cascade 一次设定，页面自己写的值仍然优先于继承来的值：

```yaml {title="content/docs/_index.zh.md"}
---
title: 文档
cascade:
  search_boost: 1.25
---
```

本站 `docs/` 下的每一页都在 `search_keywords` 里列出中文说法、英文原词和本页讲到的配置键名。

## 把页面挡在索引外 {#exclude}

```yaml {title="content/internal/draft-plan.zh.md"}
---
title: 内部计划
search_exclude: true
---
```

正文为空的页面也不进索引。只有 `search_exclude` 有效：已停用的 `exclude_search` 与 `excludeSearch` 会被忽略，仍在用它们的页面照样能被搜到；迁移检查器会报告这两个键。

> [!WARNING] 索引是任何人都能下载的静态 JSON 文件，不是访问控制。
> 不该公开的内容不要放进站点，也不要用 `search_exclude` 保护它。

## 中文、混合查询与标识符 {#cjk}

搜索引擎在扫描下载下来的索引时直接用 BM25 计分，不在浏览器里另建索引。文本怎么切分取决于每个字符所属的 Unicode 文字系统，而不是页面的语言标签，所以一条查询可以同时混用英文、中文和代码标识符：

- **无需空格的中日韩查询**：连续的中日韩文字按相互重叠的二字组匹配，不依赖词典，因此 `数据库连接池超时` 或 `PostgreSQL备份` 不用手打空格也能命中。单个汉字仍是一个词项，中日韩文字与拉丁字母的交界处自动断开。同义说法和缩写仍然靠 `search_keywords` 补充。
- **标识符与符号串**：带下划线、连字符或点号的名字，路径，命令选项，以及两个字符以上的符号串（`shared_buffers`、`pg_basebackup`、`--baseURL`、`/pg/data`、`->>`）按字面匹配，从不参与拼写纠错。
- **词边界、词干与拼写纠错**：普通单词按整词精确匹配，`port` 不会命中 `support`。宽松匹配按字段权重的 0.7 计分，包括：更长单词的前缀、ASCII 单词的 Porter 词形变化、其他字母文字的前四字符词干、下划线名或复合词内部出现的五字符以上单词，以及拼写纠错。拼写纠错只针对当前范围内找不到任何形式的 ASCII 单词（至少 5 个字符）：5–7 个字符允许 1 处编辑，8 个字符起允许 2 处，相邻字母互换算 1 处。
- **查询词与停用词**：统一大小写与 Unicode 全半角，一条查询最多 30 个词参与检索。一小份英语虚词，以及六个中文疑问词（`为什么`、`如何`、`怎么`、`怎样`、`什么`、`请问`）按 0.1 计分且不要求命中；整条查询全由这类词组成时例外。

一条查询的各个词可以命中页面的不同字段。结果按下面的规则依次排序：

1. 覆盖查询权重至少 90% 的页面是完整匹配，有完整匹配时不显示部分匹配；没有完整匹配时，部分匹配按覆盖率的十分档降序排列，并标出命中了几个词。
2. 完整匹配中，单个小节（加上页面级字段）就能覆盖查询的页面，排在需要跨多个小节的页面之前。
3. 字段强度取每个词最强字段的加权平均（标题 10、关键词 8、标签与分类 6、小节标题与搜索条目 5、描述 3、正文 1；宽松匹配再乘 0.7）；各词按顺序相邻出现时乘 1.5，最后乘 `search_boost`。
4. 强度相同时，比较最佳小节的 BM25 得分（`k1 = 1.2`，`b = 0.5`）乘以 `search_boost`；再相同则按标题和 URL 排序。

加权无法把部分匹配提到完整匹配之上。结果按内容根分组，组的顺序跟随顶栏；先应用结果数量上限，再在组内排序。只靠关键词命中的页面显示描述或摘录，不显示关键词列表。

一个页面无论命中多少个小节，都只占一行：这一行写明最相关的小节或条目，显示命中处前后最多 160 个字符，词形变化与拼写纠错按页面上的原文高亮，点击后打开真实渲染的锚点。每个带锚点的[参数表](/zh/docs/components/fields/)条目，无论来自 `{.fields}` 还是 `fields`/`field`，都自动带有 `data-td-search-entry`，所以搜参数名会直接跳到它的定义；自己写的元素只要带 `id` 和非空的 `data-td-search-entry`，效果相同。只命中页面元数据时，打开页面本身。`heading` 与 `summary` 范围仍然可以定位到小节标题和参数条目，但只出现在正文里的词需要 `content`。

面板里的 **搜索范围** 可以把结果限制在当前顶层栏目（首页没有当前栏目），详见[命令面板](/zh/docs/customize/panel/)。输入法组字期间，结果更新与 Enter 都会等文字上屏后再进行。空结果、加载中、索引不可用、结果数量和部分匹配等状态都有可读的文字，并会向屏幕阅读器播报。

## 可选：在线搜索 {#hosted}

主题另外集成了两种在线搜索服务，默认都关闭。它们会把每一次查询发给第三方，所以启用其中一种时，要在站点的隐私说明里写明它的抓取方式、可用性与隐私边界。一个站点只用一种搜索后端：本地搜索、Algolia、Google 同时配置了两种以上时，构建会告警 `params: more than one site-search backend is configured`。

### Algolia DocSearch {#algolia}

```yaml {title="hugo.yml"}
params:
  search:
    algolia:
      appId: YOUR_APP_ID
      apiKey: YOUR_SEARCH_ONLY_KEY
      indexName: YOUR_INDEX
```

三个值都必填，OINK 也绝不会回退到其他项目的公共索引。DocSearch 的脚本和样式随主题内置，不从 CDN 加载，但每次查询都会发往 Algolia。它需要真实的密钥和索引，所以本页不放在线演示。

### Google 可编程搜索 {#google-cse}

```yaml {title="hugo.yml"}
params:
  gcs_engine_id: YOUR_ENGINE_ID
```

结果还需要一个单独的页面：

```yaml {title="content/search.md"}
---
title: 搜索结果
layout: search
---
```

搜索框把查询提交到 `<baseURL>/search/?q=…`，由 Google 的脚本在那个页面上渲染结果，读者的浏览器必须能访问 `cse.google.com`。它依赖外部服务，所以本页同样不放在线演示。

## 验证 {#verify}

1. 构建，确认每种语言各有一份索引：

   ```bash
   hugo --printPathWarnings
   ls public/offline-search-index.*
   ```

   开发构建的文件名是 `offline-search-index.zh.json`，生产构建会加上指纹，形如 `offline-search-index.zh.7ab….json`。少了某个文件，说明那种语言的页面没有进索引。

2. 中文搜不到结果时，先看索引内容：

   ```bash
   python3 -c "import glob,json; f=sorted(glob.glob('public/offline-search-index.zh*.json'))[0]; \
     d=json.load(open(f)); print(f, len(d)); print(d[0])"
   ```

   条目数应接近中文页面数，`keywords` 与 `boost` 字段里能看到 front matter 写进去的值。

3. 打开站点，按 <kbd>/</kbd>，先搜一个英文词，再搜一个中文词。结果按内容根分组，每组以面包屑的第一段命名。

4. 子路径部署（例如 `https://example.com/docs/`）时，打开浏览器的网络面板，确认索引请求带上了子路径。索引请求打到域名根目录会返回 404，而页面本身一切正常，这是「搜索没有结果」最常见的原因。

## 相关 {#related}

- [命令面板](/zh/docs/customize/panel/) — 搜索的入口，以及面板里的命令与页面动作
- [键盘导航](/zh/docs/customize/keyboard/) — 打开搜索与打开命令的四个单键
- [多语言](/zh/docs/customize/i18n/) — 分语言索引与缺译回退
- [配置总览](/zh/docs/customize/config/) — `offline_search*` 各键的完整定义
- [页面参数](/zh/docs/write/frontmatter/) — `search_keywords` / `search_boost` / `search_exclude`
