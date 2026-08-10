---
title: 多语言支持
weight: 10
icon: fa-solid fa-language
description: 配置语言、译文、稳定链接与 RTL 布局。
aliases: [/docs/language/, /docs/feature/language/]
---

OINK 使用 Hugo 的多语言页面模型，不依赖某个站点专属的域名或模板假设。随仓库提供的站点将英文设为首要语言，将简体中文（`zh`）设为第二语言。

## 配置语言 {#configure-languages}

在 `hugo.yaml` 中定义默认语言与所有启用的语言：

```yaml
defaultContentLanguage: en

languages:
  en:
    label: English
    locale: en-US
    weight: 1
    title: Product Documentation
    params:
      description: Product guides and reference
  zh:
    label: 简体中文
    locale: zh-CN
    weight: 2
    title: 产品文档
    params:
      description: 产品指南与参考资料
      time_format_default: 2006年1月2日
      time_format_blog: 2006年1月2日
```

`weight` 同时决定语言排序和选择器顺序。`label`
使用该语言自己的文字显示。`locale` 为 HTML、备用链接和 Open
Graph 元数据提供符合标准的语言标签。

语言专属参数会覆盖全局值；未定义的参数继承全局值。菜单标签不同时，请在每种语言下分别定义菜单。

## 组织译文内容 {#organize-translated-content}

Oink 项目站将译文并置保存：

```text
content/docs/
├── install.md
└── install.zh.md
```

共同的基础文件名会让 Hugo 把这些文件识别为同一页面的不同译文。除非确实需要语言专属差异，否则日期、权重、别名、资源和影响路由的元数据应保持一致。

所有可见文本都需要翻译，包括 front
matter 标题与描述、摘要、菜单标签、标签、图片替代文字、提示块和短代码参数。命令、标识符、配置键、文件名、URL 与产品名称应保持原样。

语言树规模很大且由不同团队独立维护时，也可以使用 Hugo 的语言专属 `contentDir`
模型。不要随意混用两种布局；应选定一种、写入规范，并验证 Hugo 如何关联译文。

## 保持标题链接稳定 {#keep-heading-links-stable}

自动标题 ID 取决于标题文字，因此翻译后通常会破坏共用的片段链接。请在译文中显式使用英文页面实际渲染出的 ID：

```markdown
## Configure local search
```

```markdown
## 配置本地搜索 {#configure-local-search}
```

必须检查渲染后的 HTML，不能凭规则猜测。内联 HTML、标点、徽章和短代码都可能影响 Hugo 生成的 ID。对应页面应具有相同的标题顺序和渲染 ID 列表。

## 语言选择器行为 {#language-selector-behavior}

语言选择器根据 Hugo 配置的站点和页面译文自动生成。只配置一种语言时隐藏；配置两种或更多语言时，统一显示一个语言图标按钮。直接点击会按
`weight` 顺序切换到下一种语言；悬停半秒或聚焦按钮则展示完整语言菜单。

对于每种目标语言，如果当前页面存在译文，选择器就会链接到该译文；如果不存在，则链接到目标语言首页，避免生成断链或冒充译文的路由。当前语言具有可见状态和
`aria-current` 状态。

## SEO 与文档元数据 {#seo-and-document-metadata}

每个页面都会输出：

- 正确的 HTML `lang` 与 `dir` 值；
- 当前页面的规范 URL；
- 为所有配置语言生成带 `hreflang` 的 `rel="alternate"` 链接；
- Open Graph locale 与备用 locale 元数据。

备用目标采用与可见选择器相同的“当前页面译文或目标语言首页”回退规则。请使用正确的生产
`baseURL`；OINK 支持子路径部署，布局中不得用硬编码绝对路径替代它。

## 从右向左语言 {#right-to-left-languages}

为 RTL 语言设置 `direction: rtl`：

```yaml
languages:
  ar:
    label: العربية
    locale: ar
    direction: rtl
    weight: 4
```

主题会加载已经提交的本地 Bootstrap
RTL 产物，自有外壳则使用逻辑 CSS 属性。LTR 与 RTL 站点使用同一个命令：

```sh
hugo --gc --minify
```

消费站点不安装 RTLCSS、PostCSS 或 npm。测试时应使用真实 RTL 内容，并检查导航、代码、表格、图表和双向混排字符串，不能认为选中样式表就已足够。

<a id="internationalization-bundles"></a>

## UI 翻译包 {#ui-translation-bundles}

主题 UI 字符串位于
`i18n/`。OINK 包含英文、简体中文、繁体中文，以及从上游继承的其他翻译包。站点可以创建自己的
`i18n/<language>.yaml`，只覆盖确实需要修改的字符串；其余值继续回退到主题翻译包。

翻译期间运行：

```sh
hugo server --printI18nWarnings
```

通用译文应贡献到主题中；产品专属语言应留在站点翻译包中。

## 分语言搜索 {#search-by-language}

启用 `offlineSearch: true`
后，OINK 会为每种语言生成独立的同源索引。简体中文索引使用主题的 CJK 回退，搜索结果不会离开当前语言。

请验证 `offline-search-index.en.json` 和 `offline-search-index.zh.json`
均已生成，包含预期页面，并能在部署后的 `baseURL` 下正确解析。

## 翻译检查清单 {#translation-checklist}

- [ ] 支持范围内的每个源页面都有对应 `.zh.md` 文件。
- [ ] front matter 身份和路由元数据一致。
- [ ] 可见正文、UI 字符串、替代文字和元数据均已翻译。
- [ ] 每个中文 Markdown 标题都有显式稳定 ID。
- [ ] 中英文渲染标题 ID 列表一致。
- [ ] 站内链接与片段在两种语言中都能解析。
- [ ] 导航、面包屑、上一页/下一页链接和搜索保持在当前语言。
- [ ] 日期、标点、空格和技术术语符合目标语言的编辑规范。
- [ ] 生产构建输出正确的 canonical 与备用语言元数据。

Hugo 底层模型请参阅[多语言模式][Multilingual mode]。

[Multilingual mode]: https://gohugo.io/content-management/multilingual/
