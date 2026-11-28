---
title: Case 导览
linkTitle: 案例
description: 按文档、书籍、博客、数据目录与社区站点形态，找到最接近自己需求的 OINK 生产案例。
weight: 20
search_keywords: [Case 导览, 案例, 示例站点, 生产站点, 社区案例, Apache HugeGraph, Pigsty, 谁在用 OINK]
aliases:
  - /docs/about/examples/
---

设计一个 OINK 站点，最快的办法是找一个形态相近的线上站点，看看它是怎么搭起来的。[案例库](/zh/case/)收录了 79 个这样的站点：48 个独立社区项目，31 个来自 PGSTY 与 Vonng 生态，本站也在其中。每个案例都链接到线上站点（源码公开的还会链接到源码仓库），讲清设计思路与取舍，并区分哪些是站点自己写的代码、哪些是主题提供的能力。先从案例了解整体架构，再顺着其中的链接去指南里查具体配置。页数之类的统计数字来自撰写案例时的快照。

## 如何选择起点 {#choosing-a-starting-point}

- 品牌感强的开源项目：参考 [Apache HugeGraph](/zh/case/apache-hugegraph/)、[Cortrix](/zh/case/cortrix/)、[Stashix](/zh/case/stashix/) 或 [Barn](/zh/case/barn/)。
- 常规产品手册：从 [PIG](/zh/case/pig/)、[SOW](/zh/case/sow/)、[AGW](/zh/case/agw/) 或 [GPUWorks](/zh/case/gpuworks/) 开始。
- 大规模多语言或迁移而来的语料：对比 [PG.CENTER](/zh/case/doc-pg-center/)、[SILO](/zh/case/silo/)、[OPIC 算力平台](/zh/case/opic/) 与 [Red Hat CAI](/zh/case/redhat-cai/)。
- 书籍与课程库：对比精简的 [TPME](/zh/case/tpme/)、深色风格的 [SSG Book](/zh/case/ssg-book/)、双列核读的 [并行处理器编程第 5 版](/zh/case/pmpp5-zh/) 与完整的 [DDIA](/zh/case/ddia/)；单语版本可参考 [《PG 技术内幕》](/zh/case/pg-internal/)。
- 个人博客与数字花园：对比 [老冯云数](/zh/case/vonng-com/)、[张暮川](/zh/case/zhangmuchuan/)、[Nekonull's Garden](/zh/case/nekonull/) 与 [小知小和](/zh/case/xjkj-blog/)。
- 开放标准、人文档案或可检索的数据集：参考 [Cloud Exit](/zh/case/cloudexit/)、[《冯振彪 · 沙漠之箭》](/zh/case/fzb/) 或 [ext.pgsty.com](/zh/case/pgext-cloud/)。
- 落地页或交互工具站：从 [pgsty.com](/zh/case/pgsty-com/)、[CASSA](/zh/case/cassa/) 或 [Capslock](/zh/case/capslock/) 开始。
- 最全面的参考：[OINK 文档](/zh/case/oink/)。

站点本身请从 [Starter](/zh/docs/start/) 起步，而不是从主题仓库的 `tests/site/` 起步：那个目录是测试夹具，其中的页面专门用来覆盖渲染边界情况，不是可供模仿的设计。

## 第三方与社区站点 {#community-sites}

### [Apache HugeGraph](/zh/case/apache-hugegraph/) {#apache-hugegraph}

Apache 软件基金会顶级图数据库平台，基于 OINK Slate 风格打造自定义品牌首屏，维护近 300 篇中英双语文档。

### [Red Hat AI Services (CAI)](/zh/case/redhat-cai/) {#redhat-cai}

Red Hat AI Services 业务部团队门户，在 OINK Paper 风格上配置九种语言，并配套多部 OpenShift AI 实战手册。

### [Cortrix](/zh/case/cortrix/) {#cortrix}

面向 AI Agent 的开源语义存储与记忆系统文档站，基于 OINK Slate 风格整合 `{.wide .expand}` 宽参考表、Mermaid 图表与 OpenAPI 规范。

### [Stashix](/zh/case/stashix/) {#stashix}

自托管漫画与电子书库产品站，采用高对比度 Ink 风格配合紫色主题、顶部公告条与深色应用预览。

### [GPUWorks](/zh/case/gpuworks/) {#gpuworks}

面向 GPU 算力管理平台的中英双语文档站，基于 OINK 构建并在 Read the Docs 上托管多版本手册。

### [SSG Book](/zh/case/ssg-book/) {#ssg-book}

《Static Site Generators in the Age of AI》采用深色 Book 书籍外壳，在子路径部署下整合课程讲义、学习路径与练习场。

### [CASSA](/zh/case/cassa/) {#cassa}

澳大利亚高校计算机与安全学生协会官网，用居中落地页组织会员加入、历史时间线、社团新闻与周边。

### [AGW](/zh/case/agw/) {#agw}

自托管 AI Agent 工作空间与网关，在主应用仓库的 `site/` 目录内同步维护居中官网与 88 篇双语文档。

### [张暮川](/zh/case/zhangmuchuan/) {#zhangmuchuan}

在 OINK 之上打造「纸·墨·朱」东方编辑视觉外壳与朱印标识的个人随笔和译文博客，同时完整保留四套视觉预设。

### [Nekonull's Garden](/zh/case/nekonull/) {#nekonull}

中英双语个人技术博客与数字花园，在极简居中首页下组织 144 篇长文、短分享与 TIL 笔记。

### [Sanbei 的博客](/zh/case/sanbei-blog/) {#sanbei-blog}

广受欢迎的 Go 工程与 AI 编程随笔站，在 OINK Paper 风格下结合时间线博客与结构化 AI 指南。

### [Homelab IaC](/zh/case/homelab-iac/) {#homelab-iac}

Proxmox 集群 Terraform 与 Ansible 运维手册，与基础设施代码同源维护并同步输出 HTML、Markdown 与 `llms.txt`。

### [系统设计笔记](/zh/case/system-design-notes/) {#system-design-notes}

28 章中文系统设计学习指南，通过 Hugo 挂载接入 OINK 书籍外壳并提供本地中文检索。

### [hongyu](/zh/case/hongyu-docs/) {#hongyu-docs}

中英双语个人写作站，在一套外壳内统一管理随笔博客、数据系统知识库与书影音评论。

### [小知小和](/zh/case/xjkj-blog/) {#xjkj-blog}

聚焦 Oracle 数据库与 Homelab 的中文技术博客，跳过营销落地页，直接以 OINK 三栏博客卡片视图作为主页。

### [Vianlex's Wiki](/zh/case/vianlex-wiki/) {#vianlex-wiki}

150 页个人软件工程维基，用首页主题卡片将读者直接引入深层后端文档树。

### [Le Shi 系统手册](/zh/case/le-shi/) {#le-shi}

持续生长的中文个人系统配置手册，记录经过实测的 Linux Mint 与 Windows 11 配置与修复方案。

### [CAI 手册库](/zh/case/cai-field-manual-library/) {#cai-field-manual-library}

Red Hat AI Services 的多仓聚合书架站点，在基于 OINK 封装的共享 Hugo 模块之上统一挂载多部 OpenShift AI 实战手册。

### [OPIC 算力平台](/zh/case/opic/) {#opic}

从 Docusaurus 3 完整迁移至单二进制 Hugo + OINK 的开放智能算力平台双语官网与文档站。

### [Tasklane](/zh/case/tasklane/) {#tasklane}

面向 TypeScript 后台任务运行时的 49 页中文官网与 Diátaxis 架构文档站，采用 OINK Slate 风格与非对称调度图示首屏。

### [pgcli](/zh/case/pgcli/) {#pgcli}

部署于 Cloudflare Pages 的 218 页中英双语 PostgreSQL 实例管理与 Patroni 运维手册，采用 OINK Paper 风格。

### [ansible-vms](/zh/case/ansible-vms/) {#ansible-vms}

与 `pgcli.pages.dev` 共用同一家族视觉的 KVM 与 libvirt 虚拟机自动化双语手册，基于 OINK Paper 构建。

### [YourBuddy](/zh/case/yourbuddy/) {#yourbuddy}

可定制 macOS AI 桌面工作台的产品官网，在同一站点中整合居中首屏、插件文档与版本下载。

### [CC4PM 课程文档](/zh/case/cc4pm/) {#cc4pm}

89 节面向产品经理的 AI 编程课程文档站，基于 OINK 构建并在课程中专门收录了 OINK 建站实战章节。

### [CheeseSec 文档](/zh/case/cheesesec-docs/) {#cheesesec-docs}

96 页中英双语安全产品文档中心，直接以 OINK 三栏文档壳呈现 CheeseWAF 与插件生态手册。

### [kbdiag](/zh/case/kbdiag-docs/) {#kbdiag-docs}

直接基于 OINK Starter 起步构建的 62 页 KingbaseES 命令行诊断工具中英双语手册。

### [grelease](/zh/case/ggrelease/) {#ggrelease}

面向 Spring Cloud Gateway 与 etcd 灰度发布框架的精简中文文档站，清晰区分使用指南与维护者指南。

### [Claude API Proxy](/zh/case/claude-api-proxy-docs/) {#claude-api-proxy-docs}

直接采用 OINK 三栏文档壳编写的 15 页工程手册，同时面向工程师与接手任务的 AI Agent。

### [现代前端工程教材](/zh/case/frontend-book/) {#frontend-book}

63 页开源前端工程高校教材，在 OINK 书籍外壳中整合章节正文、课程讲义、学习路径与练习场。

### [面向对象与敏捷实践教材](/zh/case/ood-agile-book/) {#ood-agile-book}

65 页研究生软件工程开源教材，在同一 OINK 书籍壳中整合书稿、配套代码、课程大纲与幻灯片。

### [并行处理器编程第 5 版](/zh/case/pmpp5-zh/) {#pmpp5-zh}

覆盖 27 章的《大规模并行处理器编程》中英对照阅读站，借助 OINK 双列视图实现 230 个锚点同步核读。

### [图灵奖演讲集](/zh/case/turing-lectures/) {#turing-lectures}

收录 1966–2024 年 42 篇图灵奖演讲与百余篇图灵论文的中文文献站，采用 OINK 构建期 KaTeX 公式与 `hypothes.is` 批注。

### [设计虚拟世界](/zh/case/vgbaike-dvw/) {#vgbaike-dvw}

挂载于 VG 百科 `/dvw/` 子路径的 285 页《设计虚拟世界》中文译本在线书站，配有书封首屏与整书打印。

### [毛泽东选集阅读站](/zh/case/maoxuan/) {#maoxuan}

五卷 229 篇文献阅读站，展示宣纸档案风 Paper 排版、纸本式点线目录、互链注释与本地子集化字体。

### [增长黑客课程笔记](/zh/case/growth-hacker-notes/) {#growth-hacker-notes}

将 41 集视频课程经 FunASR 转写润色后整理为 7 章可检索文字版的 OINK 课程笔记站。

### [赵杨](/zh/case/eliaszhao/) {#eliaszhao}

从 Blowfish 迁移至 OINK 1.6.0 Paper 的双语个人工程与量化博客，配有定制雪山横幅首屏与双列视图。

### [karmine 的安全笔记](/zh/case/dirtyfrag-blog/) {#dirtyfrag-blog}

从 Blowfish 零断链迁移至 OINK Slate 的英文安全运营与检测工程个人博客。

### [YHY 学习站](/zh/case/yhy-website/) {#yhy-website}

86 页双语机器人与 AI 学习站，配有深色像素终端定制首屏、跨托管共享 Giscus 评论与 Obsidian 到 OINK 建站笔记。

### [Yongjie Xue](/zh/case/yongjiexue/) {#yongjiexue}

335 页中英双语分布式系统、数据库与 AI 工程博客，采用 OINK Slate 风格、多专栏导航与定制插画首屏。

### [KK 的博客](/zh/case/spin6lock/) {#spin6lock}

从 Jekyll 迁移至 OINK Paper 的 217 篇中文工程博客，采用直入正文的时间线列表首页。

### [追风笔记](/zh/case/88ok/) {#88ok}

聚焦银行系统架构与支付清算的 60 页 Paper 风格个人技术站，配有定制 SVG 首屏与浏览器本地 PlantUML 渲染。

### [Donny 的博客](/zh/case/donnyguo-blog/) {#donnyguo-blog}

聚焦自托管与开源工具实践的中文技术博客，以 OINK Paper 风格搭配手绘风个人头像首屏。

### [Kina's Blog](/zh/case/kinaz-blog/) {#kinaz-blog}

部署于 Cloudflare Pages 的极简中英双语个人博客，采用 OINK Paper 风格、静物首屏与 Giscus 评论。

### [一叶方舟](/zh/case/leafz/) {#leafz}

采用 OINK Paper 风格的极简中文工程博客，作者同时维护了一份社区 OINK Agent Skill。

### [孙方学术索引](/zh/case/sunfang3/) {#sunfang3}

中英双语个人学术总索引门户，用 OINK 首页卡片串联独立的教材伴读与前沿论文笔记站。

### [WHLLE_YI](/zh/case/whlle-yi/) {#whlle-yi}

融合像素风首屏、几何插画与可交互网页终端的创意双语个人作品集，基于本地 vendor 的 OINK 构建。

### [Nicole 学习手记](/zh/case/nicole-ya/) {#nicole-ya}

涵盖课程学习、项目展示、知识收藏、技能与成长轨迹的六分区 OINK 个人主页与学习手记。

### [Zhangyi 技术笔记](/zh/case/zhangyi-page/) {#zhangyi-page}

部署于 Cloudflare Pages 的双语个人工程笔记站，展示固定 Hugo 构建脚本与人机同源 Markdown 发布。

## 发行版文档 {#pigsty-sites}

### [pigsty.io](/zh/case/pigsty-io/) {#pigsty-io}

大型英文站，把发行版手册、博客、扩展目录、分类、版本导航与价格落地页放在同一个站点中。

### [pigsty.cc](/zh/case/pigsty-cc/) {#pigsty-cc}

独立部署的中文对等站；当两种语言的语料都已成为完整产品时，拆成两个单语站是一种清晰的取舍。

### [pgsty.pro](/zh/case/pgsty-pro/) {#pgsty-pro}

双语版本档案站，从可复用的结构化发布数据渲染大量版本页面。

### [PG.CENTER](/zh/case/doc-pg-center/) {#doc-pg-center}

覆盖八种语言、近 5,000 篇文档的 PostgreSQL 内核与组件文档中心，验证自动拆分 BM25 索引与阿拉伯语 RTL 排版。

## 产品文档 {#product-sites}

### [PIG](/zh/case/pig/) {#pig-pgsty-com}

紧凑的双语命令行工具手册，配有数据驱动首页与体量更大的博客。

### [SOW](/zh/case/sow/) {#sow-pgsty-com}

双语运维手册，使用独立下载内容类型展示发布元数据与产物。

### [SILO](/zh/case/silo/) {#silo-pgsty-com}

大型上游迁移案例，通过受检查的清单生成双语文档导航。

### [PG Exporter](/zh/case/pg-exporter/) {#exp-pgsty-com}

把生成导航、结构化指标目录与系统字体组合起来的指标手册。

### [Piglet](/zh/case/piglet/) {#piglet-run}

Agentic Postgres 运行时产品官网，以非对称深色终端卡片首屏衔接精炼双语上手文档。

### [Barn](/zh/case/barn/) {#barn-pgsty-com}

本地多节点 Linux 实验环境与原生 macOS 虚拟机双语手册，结合暖色插画首屏、终端输出演示与博客。

### [Vchord](/zh/case/vchord/) {#vchord-pgsty-com}

366 页 PostgreSQL 向量与 BM25 检索扩展双语文档站，结合引擎架构图、基准测试与版本下载。

### [Mooncake](/zh/case/mooncake/) {#mooncake-pgsty-com}

PostgreSQL 实时列存与 Apache Iceberg 湖仓扩展双语手册，与同系列 PGSTY 扩展站保持统一家族视觉。

### [Crib](/zh/case/crib/) {#crib-pgsty-com}

原生 macOS 离线 PostgreSQL 手册应用官网，用居中 Paper 首屏呈现宽幅深色应用截图与中文文档。

### [Capslock 应用](/zh/case/caps-pgsty/) {#caps-pgsty-com}

原生 macOS 键位工具完整双语官网，在两页配置器基础上扩展出居中首屏、键位图示、文档、博客与下载。

## 书籍与培训 {#book-sites}

### [《设计数据密集型应用》](/zh/case/ddia/) {#ddia-vonng-com}

多语言、多版本书籍，也是编号图表、交叉引用、章节导航与索引最完整的案例。

### [《The Product-Minded Engineer》](/zh/case/tpme/) {#tpme-vonng-com}

只需要 OINK Book 外壳的聚焦型双语出版物。

### [《PG 技术内幕》](/zh/case/pg-internal/) {#pgint-vonng-com}

已完稿的中文译本，刻意做成单语 Book：没有文档树，也没有可切换的第二语言。

### [《PG 三十六计》](/zh/case/pg36g/) {#pg36g-vonng-com}

36 章中英双语 PostgreSQL 与 Pigsty 生产实战书籍，配有定制 3D 封面、实验脚本与多维交叉索引。

### [《人工智能帝国》](/zh/case/aiempire/) {#aiempire-vonng-com}

精简双语非虚构在线书籍，结合 Paper 风格、书封首屏、作者译者名片与整书打印输出。

### [《PostgreSQL 18 内参》](/zh/case/int18-pgsql/) {#int18-pgsql-cc}

中、英、俄三语内核技术书籍，展示书籍外壳与双列视图在三种文字体系下的协同体验。

### [Dalibo 培训](/zh/case/dalibo-pgsql/) {#dalibo-pgsql-cc}

中、法、英三语 PostgreSQL 培训门户，在同一外壳下汇聚十二套开源课程手册。

### [PGPRO 培训](/zh/case/pgpro-pgsql/) {#pgpro-pgsql-cc}

441 页中、英、俄三语课程库，在首页直接嵌入可视化官方学习路线矩阵。

### [《PostgreSQL 实例教程》](/zh/case/pgexp-pgsql/) {#pgexp-pgsql-cc}

57 节中英双语 SQL 实战短课书籍，每课配套可运行示例脚本与整书打印支持。

## 博客、标准、目录与自定义站点 {#other-sites}

### [老冯云数](/zh/case/vonng-com/) {#vonng-com}

1,344 篇中英双语个人技术博客与归档站，按六个专栏独立提供 RSS 订阅，并整合作品与书籍目录。

### [Cloud Exit](/zh/case/cloudexit/) {#cloudexit-org}

690 页中英双语下云开放标准、公共成本账本与实操手册，用居中 Paper 首屏统领六大内容分区。

### [《冯振彪 · 沙漠之箭》](/zh/case/fzb/) {#fzb-vonng-com}

601 页个人传记、回忆录、诗文集与 Expo 摄影相册档案馆，展示 OINK 在人文出版与长期归档中的表现力。

### [PostgreSQL 组件文库](/zh/case/pgsql-cc/) {#pgsql-cc}

聚合型运维文库，让多个上游手册与完成度不一的翻译树共享搜索和视觉体系。

### [pgsty.com](/zh/case/pgsty-com/) {#pgsty-com}

小型双语公司站，展示 OINK 也可以主要作为数据驱动的落地页系统。

### [Capslock](/zh/case/capslock/) {#caps-vonng-com}

每种语言只有两页，其中自定义外壳承载数据驱动交互配置生成器。

### [oink.pgsty.com](/zh/case/oink/) {#oink-pgsty-com}

完整参考站：公开文档、实时组件示例、设计契约、多种内容外壳与回归覆盖都在同一个仓库中。

### [pgext.cloud](/zh/case/pgext-cloud/) {#pgext-cloud}

PostgreSQL 扩展目录：把可检索的数据集作为站点主体呈现，收录 2,241 个扩展、576 个已打包版本，覆盖 16 个 Linux 平台。

→ [浏览全部案例](/zh/case/) · [快速上手](/zh/docs/start/) · [从零开始](/zh/docs/start/from-scratch/)
