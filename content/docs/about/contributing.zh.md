---
title: 贡献指南
description: 为 Oink 贡献代码与双语文档。
aliases: [contribution-guidelines, /docs/contributing/]
weight: 40
---

OINK 是从 Docsy 派生的独立主题。贡献必须保留 Apache-2.0 历史和适用的第三方 NOTICE，同时改进唯一的标准实现。

## 提交变更之前 {#before-opening-a-change}

- 在 [OINK 仓库][repo]中搜索已有 issue 和拉取请求。
- 报告缺陷时，请记录 Hugo 版本、安装方式、语言、路由、生产命令和最小可复现输入。
- 提议功能时，请说明它为什么属于可复用主题，而不是消费站点的业务层。
- 不要引入 `oink.enabled` 开关、`oink.*`
  配置树或平行视觉外壳。OINK 的标准布局就是产品本身。

小型修复可以直接实现。较大的行为变更应在编写代码前说明兼容性、离线、无障碍、安全与迁移影响。

## 开发环境 {#development-environment}

消费站点只需要 Hugo Extended、Go 与 Git。主题仓库是直接的 Hugo
Module；项目站点仓库使用固定的 Node.js 与 npm 版本运行格式、链接、翻译与回归检查。

请在仓库根目录按照 lockfile 安装维护依赖。不要在无关变更中顺带更新依赖。

项目拆分为：

- `github.com/pgsty/oink`：发布主题源码与 `VENDOR.json`；
- `github.com/pgsty/oink.pgsty.com`：文档、示例与测试。

## 构建消费端合同 {#build-the-consumer-contract}

必须从消费站点验证用户真正运行的路径：

```sh
hugo --gc --minify
```

该构建必须在消费站点不安装 npm 软件包的情况下成功，也不能为了主题自有浏览器资源发起网络请求。

测试本地主题候选版本时，把两个仓库克隆为同级目录，并启用被忽略的 Hugo
workspace：

```sh
go work init .
go work edit -replace=github.com/pgsty/oink=../oink
HUGO_MODULE_WORKSPACE=go.work npm run build
```

## 运行聚焦测试 {#run-focused-tests}

先选择最小的相关测试集：

```sh
npm run test:hugo-build
npm run test:alt-site
npm run test:md-output
npm run test:favicons
```

完整站点测试使用 `npm test`。

多语言变更应覆盖 1、2、3、4 种以上语言状态，以及缺失页面回退、RTL、规范 URL、`hreflang`
和 Open Graph locale 元数据。

内容组件变更应覆盖单实例与多实例、未使用页面不加载资源、非法参数、子路径构建、打印、键盘操作、减少动态效果和离线行为。

## 编写双语文档 {#write-bilingual-documentation}

在 `content/docs/` 或 `content/blog/` 下新增的所有面向用户页面，都需要对应
`.zh.md` 文件。术语与中文排版遵循 `TRANSLATION.md`。

中文 Markdown 标题必须显式使用英文渲染 HTML 中的 ID。先检查源码覆盖，再在构建后比较渲染标题 ID：

```sh
node scripts/check-doc-translations.mjs
node scripts/check-doc-translations.mjs --public public
```

代码、配置键、URL、发布事实、作者信息和链接定义必须保持准确；可见元数据、替代文字、提示块、UI 标签和短代码字符串必须翻译。不要为了通过文件名检查而提交占位内容或未翻译正文。

## 预览文档 {#preview-documentation}

使用固定的公开模块运行项目站点，或启用上文所述本地 workspace：

```sh
npm run serve
```

请分别在桌面和移动端宽度下检查变更页面的中英文版本，并覆盖深浅色模式、目录、语言切换、搜索、代码块、表格、提示块、打印输出和片段链接。

本地构建只能证明本地渲染。CI、发布打包、托管预览和生产发布是彼此独立的验证层。

## 保持兼容 {#keep-changes-compatible}

- 复用现有 partial、短代码、SCSS 辅助方法和资源加载器。
- 浏览器运行时只在实际使用的页面中加载，并且每页最多一次。
- 默认行为保持本地优先和同源。
- 安全序列化结构化数据；任意 JavaScript 必须设置显式 unsafe 边界。
- 使用逻辑 CSS 属性，并同时测试 LTR 与 RTL。
- 保留站点自有业务组件和已经记录的兼容别名。
- 重新分发资源时保留法律归属与 vendor 元数据。

## 创建拉取请求 {#open-the-pull-request}

提交与说明应保持精炼，并解释面向用户的行为和迁移影响。列出实际运行的聚焦命令与结果。

如果某项变更有意偏离 Docsy，请更新相应迁移或发布文档。不能删除上游版权、许可证或历史。

[repo]: https://github.com/pgsty/oink
