---
name: oink-site
description: "Oink 建站：用 OINK 主题（github.com/pgsty/oink，文档 oink.pgsty.com）搭建、迁移和打磨 Hugo 网站，包括开源项目与产品文档、书籍与课程、个人博客与知识库、档案馆与相册、公司站与落地页、数据目录站。适用场景：新建 OINK 站点；把 Hugo 或 Docsy 站点迁到 OINK；转换书籍或上游文档；设计首页；增加语言；检查、升级和发布 OINK 站点。它把每类站点对应到值得参考的真实 OINK 站点，把每项任务对应到讲解它的文档页。不用于修改主题本身。"
---

# Oink 建站

> OINK 建站技能的公开版：<https://oink.pgsty.com/skill.zh.md> · English：<https://oink.pgsty.com/skill.md>。保存为技能目录 `oink-site/` 下的 `SKILL.md`，或直接把地址交给任何 agent。本文写于 2026-11-27，对应 OINK v1.7.0。

这份文件是一张地图，不是说明书。它告诉你 OINK 能提供什么、哪些真实站点和你要建的站点相像、每项任务该读文档的哪一页。细节都在那些站点和文档里：需要时再去打开，其间的事情交给你自己判断。

## OINK 是什么

OINK 是本地优先的 Hugo 模块主题，硬分叉自 Docsy。一个 OINK 站点就是普通的 Hugo 仓库：一份配置文件、一个固定 `github.com/pgsty/oink@<tag>` 的 `go.mod`、`content/`、`data/`，以及可选的 `assets/` 和 `layouts/`。用 Hugo 0.169.0 或更新版本构建（不限 edition），Go 负责拉取模块；不需要 Node、npm、Sass 或 CDN。

可以用上的东西：

- Docs、Book、Blog、Swagger 四种阅读外壳，以及 Expo 相册；
- 用 YAML 数据拼出来的首页和落地页，有 22 种区块可选；
- 内容组件，大多是纯 Markdown 加一行属性：提示框、步骤、卡片、标签页、带注释的代码、图表、时间线、更新日志条目、视频和音频播放器、引用的社交帖子、地图；
- 带命令面板的本地搜索、键盘快捷键、32 种界面语言、对照译文的双列视图、多版本、分类标签；
- 四种外观预设及亮暗模式、打印，以及给 agent 读的 Markdown 和 `llms.txt` 输出。

它不提供 CMS、登录、数据库或自动翻译。

比较顺手的入门方式：先在下面找到最接近的案例，再读几页与手头任务相关的文档，然后先把一条小路径从头到尾做通（首页、一个分区、一个页面，有译文的话连同译文），再铺开。

## 参考真实站点

[案例库](https://oink.pgsty.com/zh/case/)收录了 45 个线上运行的 OINK 站点。每篇介绍都讲了设计思路和取舍，并分清哪些是站点自己写的、哪些来自主题；站点自己写的部分不是 OINK 功能，未必适合你的项目。下面每个名字都链接到它的介绍（URL 后加 `index.md` 可读 Markdown），后面跟着线上站点，源码公开的还附上源码。

挑最接近的一两个，先像读者一样逛一遍线上站点，再读源码。借鉴组织思路，配置要按自己的情况改；其余的由用户的内容和品味决定。

### 开源项目或产品

首页用真实的命令、图示或截图说明产品能做什么，再引向手册；下载和版本信息与实际发布一致。

- [Apache HugeGraph](https://oink.pgsty.com/zh/case/apache-hugegraph/)（[站点](https://hugegraph.apache.org/)、[源码](https://github.com/apache/hugegraph-doc)）：ASF 项目，在 Slate 预设上做了自定义品牌 Hero，约 300 页中英文档。
- [Stashix](https://oink.pgsty.com/zh/case/stashix/)（[站点](https://stashix.net/)、[源码](https://github.com/Aroy-Art/Stashix-Site)）：自托管应用，Ink 预设配自己的强调色和产品预览图。
- [AGW](https://oink.pgsty.com/zh/case/agw/)（[站点](https://agw-ai.dev/)、[源码](https://github.com/zxyao145/agw)）：产品站和文档都放在应用仓库的 `site/` 目录里。
- [Vchord](https://oink.pgsty.com/zh/case/vchord/)（[站点](https://vchord.pgsty.com/)、[源码](https://github.com/pgsty/vchord.pgsty.com)）：366 页手册，配架构图、基准测试和下载页。
- [Mooncake](https://oink.pgsty.com/zh/case/mooncake/)（[站点](https://mooncake.pgsty.com/)、[源码](https://github.com/pgsty/mooncake.pgsty.com)）：以图示为主的落地页，和同系列扩展站共用一套产品形象。
- [Barn](https://oink.pgsty.com/zh/case/barn/)（[站点](https://barn.pgsty.com/)、[源码](https://github.com/pgsty/barn.pgsty.com)）：插画 Hero、终端快速开始、文档加博客。
- [PIG](https://oink.pgsty.com/zh/case/pig/)（[站点](https://pig.pgsty.com/)、[源码](https://github.com/pgsty/pig.pgsty.com)）：紧凑的命令行工具手册，首页由数据驱动。
- [Piglet](https://oink.pgsty.com/zh/case/piglet/)（[站点](https://piglet.run/)、[源码](https://github.com/pgsty/piglet.run)）：深色终端风格的 Hero，配简短的安装文档。
- [SOW](https://oink.pgsty.com/zh/case/sow/)（[站点](https://sow.pgsty.com/)、[源码](https://github.com/pgsty/sow.pgsty.com)）和 [PG Exporter](https://oink.pgsty.com/zh/case/pg-exporter/)（[站点](https://exp.pgsty.com/)、[源码](https://github.com/pgsty/exp.pgsty.com)）：运维手册，带下载页和自动生成的目录。

### 大型、多语言或迁移过来的文档

- [pigsty.io](https://oink.pgsty.com/zh/case/pigsty-io/)（[站点](https://pigsty.io/)、[源码](https://github.com/pgsty/pigsty.io)）和 [pigsty.cc](https://oink.pgsty.com/zh/case/pigsty-cc/)（[站点](https://pigsty.cc/)、[源码](https://github.com/pgsty/pigsty.cc)）：同一个产品的英文和中文主页分成两个站点运行，包括手册、博客、扩展目录、多版本和定价页。
- [PG.CENTER](https://oink.pgsty.com/zh/case/doc-pg-center/)（[站点](https://doc.pg.center/)、[源码](https://github.com/pgsty/doc.pg.center)）：八种语言（含阿拉伯语），近 5,000 个文件，多份上游手册并列。
- [Red Hat AI Services](https://oink.pgsty.com/zh/case/redhat-cai/)（[站点](https://rh-aiservices-bu.github.io/cai/)、[源码](https://github.com/rh-aiservices-bu/cai)）：九种语言的团队门户。
- [Cloud Exit](https://oink.pgsty.com/zh/case/cloudexit/)（[站点](https://cloudexit.org/)、[源码](https://github.com/cloudexit/cloudexit.org)）：一份开放标准加公开成本账本，共 690 页中英双语。
- [SILO](https://oink.pgsty.com/zh/case/silo/)（[站点](https://silo.pgsty.com/)）：大规模上游迁移，导航由一份校验过的清单生成。
- [PostgreSQL 组件文库](https://oink.pgsty.com/zh/case/pgsql-cc/)（[源码](https://github.com/pgsty/pgsql.cc)）：多份上游手册共用一个搜索，译文逐步补齐。

### 书籍、课程与教程

Book 外壳会给章节、图和表编号，解析交叉引用，并支持整书打印；这些站点展示了以阅读为先的首页：封面、目录和一个阅读入口。做书籍转换时，先转两个样章和用户一起看过，再处理其余部分，通常更划算。

- [DDIA](https://oink.pgsty.com/zh/case/ddia/)（[站点](https://ddia.vonng.com/)、[源码](https://github.com/Vonng/ddia)）：最完整的书籍站，多种语言、多个版本分开管理，图表编号，可打印。
- [TPME](https://oink.pgsty.com/zh/case/tpme/)（[站点](https://tpme.vonng.com/)、[源码](https://github.com/Vonng/tpme)）：精简的双语书，只用 Book 外壳。
- [PG Internals](https://oink.pgsty.com/zh/case/pg-internal/)（[站点](https://pgint.vonng.com/)、[源码](https://github.com/Vonng/pg-internal)）：单语言的书籍站。
- [PG 三十六计](https://oink.pgsty.com/zh/case/pg36g/)（[站点](https://pg36g.vonng.com/)、[源码](https://github.com/Vonng/pg36g)）：36 章，配封面插画和实验。
- [人工智能帝国](https://oink.pgsty.com/zh/case/aiempire/)（[站点](https://aiempire.vonng.com/)）：封面插画 Hero 和作者介绍。
- [PG 18 内参](https://oink.pgsty.com/zh/case/int18-pgsql/)（[站点](https://int18.pgsql.cc/)）：三语译本，带译者介绍。
- [PG 实例教程](https://oink.pgsty.com/zh/case/pgexp-pgsql/)（[站点](https://pgexp.pgsql.cc/)）：57 课教程，配可下载的示例包。
- [SSG Book](https://oink.pgsty.com/zh/case/ssg-book/)（[站点](https://polla.dev/ssg-book/)、[源码](https://github.com/polla-fattah/ssg-book)）：深色模式的开源书，带课件和学习路径，部署在子路径下。
- [System Design Notes](https://oink.pgsty.com/zh/case/system-design-notes/)（[站点](https://ariana-yang.github.io/system-design-notes-zh/)、[源码](https://github.com/Ariana-Yang/system-design-notes-zh)）：28 章的中文学习笔记书。
- [Dalibo 培训](https://oink.pgsty.com/zh/case/dalibo-pgsql/)（[站点](https://dalibo.pgsql.cc/)）和 [PGPRO 培训](https://oink.pgsty.com/zh/case/pgpro-pgsql/)（[站点](https://pgpro.pgsql.cc/)）：多语言课程库，课程体系与章节导航分开组织。

### 个人博客、数字花园或知识库

- [vonng.com](https://oink.pgsty.com/zh/case/vonng-com/)（[站点](https://vonng.com/)、[源码](https://github.com/Vonng/vonng.com)）：1,344 页的双语博客，有专栏和作者展示。
- [Nekonull's Garden](https://oink.pgsty.com/zh/case/nekonull/)（[站点](https://nekonull.me/)、[源码](https://github.com/jerrylususu/jerrylususu.github.io)）：长文、短分享和 TIL 笔记，首页以排版为主。
- [Sanbei's Blog](https://oink.pgsty.com/zh/case/sanbei-blog/)（[站点](https://sanbei101.github.io/blog/)、[源码](https://github.com/sanbei101/blog)）：按日期发布的文章，旁边是一个结构化的指南栏目。
- [blog.xjkj.org](https://oink.pgsty.com/zh/case/xjkj-blog/)（[站点](https://blog.xjkj.org/)、[源码](https://github.com/wzemc/blog)）：没有 Hero，卡片网格的文章索引就是首页。
- [hongyu](https://oink.pgsty.com/zh/case/hongyu-docs/)（[站点](https://le0shy.github.io/my-docs/)、[源码](https://github.com/Le0shy/my-docs)）：随笔、知识库和书影评论放在同一个站点里。
- [Vianlex's Wiki](https://oink.pgsty.com/zh/case/vianlex-wiki/)（[站点](https://vianlex.github.io/)、[源码](https://github.com/vianlex/vianlex.github.io)）：150 页的个人知识库，从首页卡片进入。
- [Le Shi 系统手册](https://oink.pgsty.com/zh/case/le-shi/)（[站点](https://le-shi.github.io/)、[源码](https://github.com/le-shi/le-shi.github.io)）和 [Homelab IaC](https://oink.pgsty.com/zh/case/homelab-iac/)（[站点](https://blue126.github.io/IaC/)、[源码](https://github.com/blue126/IaC)）：个人运维手册；后者和它管理的基础设施代码放在一起。

### 相册、档案馆与展览

- [冯振彪 · 沙漠之箭](https://oink.pgsty.com/zh/case/fzb/)（[站点](https://fzb.vonng.com/)）：601 页的家庭档案，回忆录和诗歌是 Book 章节，照片是 Expo 相册。
- [OINK 自己的 Expo 相册](https://oink.pgsty.com/zh/expo/)：相册布局、封面和图片查看器，指南在 `write/expo`。

### 公司、组织、落地页或小工具

- [pgsty.com](https://oink.pgsty.com/zh/case/pgsty-com/)（[站点](https://pgsty.com/)、[源码](https://github.com/pgsty/pgsty.com)）：小型公司站，几乎完全由落地页数据搭成。
- [CASSA](https://oink.pgsty.com/zh/case/cassa/)（[站点](https://cassa.au/)、[源码](https://github.com/cassa/static-CASSA-website)）：学生社团站，有会员招募、时间线和新闻。
- [CapsLock](https://oink.pgsty.com/zh/case/capslock/)（[站点](https://caps.vonng.com/)、[源码](https://github.com/Vonng/caps.vonng.com)）：两页的小站，第二页是一个交互式配置器。
- [Capslock 应用](https://oink.pgsty.com/zh/case/caps-pgsty/)（[站点](https://caps.pgsty.com/)）和 [Crib](https://oink.pgsty.com/zh/case/crib/)（[站点](https://crib.pgsty.com/)）：原生应用的产品站，有 Hero、预览和下载。

### 数据目录与数据驱动的站点

- [PGEXT](https://oink.pgsty.com/zh/case/pgext-cloud/)（[站点](https://ext.pgsty.com/)、[源码](https://github.com/pgsty/pgext.cloud)）：由数据生成的 2,241 个扩展的目录，可按平台和版本检索。
- [PIGSTY PRO](https://oink.pgsty.com/zh/case/pgsty-pro/)（[站点](https://pgsty.pro/)）：由结构化发布记录渲染出来的版本归档。

### 最全面的参考

- [OINK 文档](https://oink.pgsty.com/zh/case/oink/)（[站点](https://oink.pgsty.com/)、[源码](https://github.com/pgsty/oink.pgsty.com)）：每个组件页开头都有可以直接粘贴的源码。它的配置很庞大，因为同时承担着主题的回归测试，所以借鉴它的页面，而不是它的配置。主题仓库里的 `tests/site/` 是测试夹具，不是可以照搬的设计。

## 文档目录

文档在 <https://oink.pgsty.com/zh/docs/>（英文在 `/docs/`）。每个页面 URL 后加 `index.md` 就是它的 Markdown 版本；`https://oink.pgsty.com/zh/llms.txt` 列出全部页面，`https://oink.pgsty.com/zh/docs/llms-full.txt` 把整套手册放在一个约 2 MB 的文件里，适合检索。下表路径都相对于 `/zh/docs/`。

| 你在做… | 读这里 |
| --- | --- |
| 判断 OINK 是否合适，它增加了什么 | `about/`、`about/features/` |
| 新建站点，或给已有 Hugo 站点接入 OINK | `start/from-scratch/` |
| 从自带部署工作流的模板起步 | `start/starter/`、`start/anatomy/` |
| 把目录组织成侧栏，编写页面和 front matter | `write/organize/`、`write/pages/`、`write/frontmatter/` |
| 写博客、书或相册 | `write/blog/`、`write/book/`、`write/expo/` |
| 发布版本与下载，或 API 参考 | `write/releases/`、`write/openapi/` |
| 挑选组件 | `components/`：先是全部组件的速查表，然后每个组件一页 |
| 做首页或其他落地页 | `customize/home/` |
| 设置 Logo、颜色、字体、预设和站点 CSS | `customize/brand/` |
| 调整菜单、面包屑和页脚 | `customize/navigation/` |
| 选择外壳、侧栏、目录和页面宽度 | `customize/layout/` |
| 增加语言，或使用双列视图 | `customize/i18n/` |
| 配置搜索和命令面板 | `customize/search/`、`customize/panel/` |
| 关联代码仓库，标注上游来源 | `customize/repository/` |
| 给页面打标签，发布多个产品版本 | `customize/taxonomy/`、`customize/versions/` |
| 打印一页或整个分区 | `customize/print/` |
| 给 agent 提供 Markdown 和 `llms.txt` | `customize/agents/` |
| 查键盘快捷键 | `customize/keyboard/` |
| 查任何配置键，以及填错时会怎样 | `customize/config/` |
| 本地预览、部署、加统计或评论 | `admin/preview/`、`admin/deploy/`、`admin/analytics/`、`admin/comments/` |
| 升级，或从 Docsy、旧版 OINK 迁移 | `admin/upgrade/` |
| 排查出了问题的地方 | `admin/troubleshooting/` |
| 核对主题应有的行为 | `design/`（维护者合同） |

站点上还有一本动手教程书在 `/zh/book/`，发布说明在 `/zh/release/`，工程笔记在 `/zh/blog/`。主题的源码、默认值（`hugo.yaml`）、迁移工具和检查器在 <https://github.com/pgsty/oink>。到它的 Releases 查看最新版本；较新的文档优先于本文。旧教程和旧站点里有已经退役的做法，比如 OINK 0.4–1.4 的键名、`exampleSite`、`type: landing`、Docsy `blocks/*`、Sass，读它们是为了了解意图，不是照抄语法。

## 值得早点知道的事

有几件事曾经让之前的建站白白耗费时间。其余的都在文档里。

- Hugo 不会继承主题的 `markup` 设置，所以每个站点都要带上自己的 Goldmark 选项；缺了它们，`{.steps}` 这样的属性行会原样显示成文字。`start/from-scratch` 里有可以直接复制的配置块。
- 交互功能和第三方功能在站点开启之前都是关闭的：搜索、双列视图、额外输出、评论、统计、地图、页内视频播放器、AI 助手链接。觉得某个功能没出现时，先找它的开关。
- 填错的值只会告警并回退，不会让构建失败，所以要读告警：一条告警往往意味着你以为开着的功能其实没开。
- 每种启用的语言都要有自己的首页数据、页脚数据和菜单，否则默认语言的内容会悄悄露出来。
- 页面用哪个外壳由 `type` 决定，与所在目录无关。
- 站点样式写在 `assets/css/project.css`，覆盖放进最窄的钩子或 partial。改主题文件，或为一处改动复制整个外壳，会让每次升级都很痛苦。

## 与用户协作

- 确认要建的是哪个仓库、哪个域名，当前工作目录就是那个站点。拿来参考的站点一律只读。
- 尊重已有的工作：先看 `git status`，保留未提交的修改和其他会话的文件，只暂存自己的。新建仓库、提交、推送、部署或改 DNS 之前先问用户。
- PDF、抓取结果、录音录像这类大体积原始材料放在哪里，下载之前先和用户商量好，免得它们意外进了 Git。
- 一段简短的需求，比如名称、目录、内容与受众、几个栏目、风格、域名和托管平台，只是起点。会改变构建方式的问题就问；其余的取合理的默认值，并说明你选了什么。
- “充分利用 OINK 的特性”的意思是：内容需要什么，就先用主题现成的功能，而不是自己另写一套。时间线要有真实的日期，地图要有真实的地点；把每个组件都摆一遍的站点，读起来就像演示。
- 事实要真实：不编造数字、引文、帖子或功能；真实的人按真实身份署名；写明许可证和上游来源。许可证限制复制或翻译时，先问用户。
- 主题没有现成功能时，自己写扩展（partial、脚本、生成器）完全可以。在站点的 `AGENTS.md` 里注明它们是站点代码；多个站点都需要同一样东西时，它也许应该作为 issue 或[设计提案](https://oink.pgsty.com/zh/docs/design/proposals/)提交给上游。

## 品味

维护者审阅自家站点时，有几条偏好。把它们当作倾向，而不是规则；用户的眼睛才是真正的验收标准，用户已经认可的部分就保留。

- 第一屏点明主题，并给出真正的下一步：书籍给出阅读入口，产品给出能跑的命令，档案馆给出进入故事的门。
- 克制胜过装饰：放真实的内容和真实的状态，而不是装饰性的徽章、计数器或特效。
- 标题和卡片文字在每种语言、每种宽度下都换行得体，不会有一两个字孤零零地落到下一行；通常改写文案就能解决。
- 栅格贴合条目数量，同一行的卡片对齐。

## 检查与发布

- 按生产环境的方式构建，不带本地模块替换或工作区，并读完每条告警：

  ```bash
  export GOWORK=off HUGO_MODULE_WORKSPACE=off; unset HUGO_MODULE_REPLACEMENTS
  hugo mod graph | grep github.com/pgsty/oink
  hugo --cleanDestinationDir --gc --minify --environment production --printPathWarnings
  ```

- 在浏览器里看结果：每种语言、每种页面、手机宽度、亮色和暗色、提供的每种预设、搜索和语言切换。构建通过只说明构建跑完了。
- 站点需要更深入的检查时，主题仓库的 `bin/` 里有针对输出安全、书籍和译文的检查器。
- 汇报时说明参照了什么、改了什么、检查了什么、哪些没检查，并把各个状态分开：本地构建通过、已提交、已推送、已部署、线上已核实。按读者实际得到的东西清点，比如章节、图表和能打开的链接，而不是按文件数。
- `admin/deploy` 讲了托管平台、CI、`baseURL`、安全响应头和回滚；记住放在忽略路径里的文件，永远不会出现在从 Git 构建的部署中。`admin/upgrade` 讲了如何在版本之间升级。
