---
title: 多语言
linkTitle: 多语言
weight: 30
description: 语言配置、译文组织、稳定锚点与 RTL 支持。
---

OINK 直接使用 Hugo 的多语言页面模型，不引入站点专属的域名约定或模板假设。本站以英文为首要语言、简体中文（`zh`）为第二语言。

## 配置语言 {#configure-languages}

```yaml {title="hugo.yaml"}
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

{{< fields >}} {{< field name="label" type="string" required=true >}}
语言选择器里显示的名字，用该语言自己的文字写——`简体中文` 而不是 `Chinese`。
{{< /field >}} {{< field name="locale" type="string" >}} 标准语言标签，用于
`<html lang>`、`hreflang` 备用链接和 Open Graph 元数据。 {{< /field >}}
{{< field name="weight" type="integer" >}}
同时决定语言排序和选择器轮换顺序，数字小的在前。 {{< /field >}}
{{< field name="title" type="string" >}} 该语言下的站点标题。 {{< /field >}}
{{< field name="params.*" type="map" >}}
语言级参数覆盖全局同名值；没定义的继承全局。日期格式通常需要按语言设置。
{{< /field >}} {{< /fields >}}

菜单标签因语言而异时，在各语言下分别定义 `menus`。

## 组织译文 {#organize-translations}

译文与原文并排放在同一目录，用文件名后缀区分：

<!-- prettier-ignore-start -->

- content/docs/
  - install.md
  - install.zh.md
{.filetree}

<!-- prettier-ignore-end -->

相同的基础文件名让 Hugo 把它们识别为同一页面的不同语言版本。

**要保持一致的**：日期、权重、别名、页面资源，以及所有影响路由的元数据。

**要翻译的**：front matter 的 `title` 和
`description`、摘要、菜单标签、标签、图片 alt 文本、提示块、shortcode 的可见参数。

**不要翻译的**：命令、标识符、配置键、文件名、URL、产品名。

> [!NOTE] 语言树很大且由不同团队独立维护时，Hugo 还支持按语言分目录的
> `contentDir`
> 模型。**不要混用两种布局**——选一种写进规范，并验证 Hugo 是否正确关联了译文。

## 稳定的标题锚点 {#stable-heading-anchors}

这是多语言文档最容易出问题的地方。Hugo 从标题文本生成 ID，所以中文标题会生成中文 ID，`/docs/page/#install`
和 `/zh/docs/page/#安装` 变成两个互不相通的锚点。

在译文标题里显式写上原文 ID：

```markdown
## 安装 {#install}
```

翻译已有页面时，ID 要从英文渲染出的 HTML 里取，不要凭标题文本猜——含 shortcode 或行内代码的标题，生成的 ID 往往和你想的不一样。

本站用一个脚本强制中英标题数量、顺序和 ID 完全一致：

```sh
node scripts/check-doc-translations.mjs --public public
```

## 语言选择器行为 {#language-selector-behavior}

选择器读取每个页面的 `.Translations`：

- 目标语言有对应译文 → 直接跳到那一页
- 目标语言没有译文 → 回退到该语言的首页

回退是有意设计，不是缺陷。把读者送到一个不存在的 URL 更糟。

## 搜索与语言 {#search-and-languages}

`offlineSearch: true` 时，每种语言生成各自独立的索引：

```text {copy=false}
public/offline-search-index.en.json
public/offline-search-index.zh.json
```

读者在中文页面搜索，只会命中中文内容。

中文查询走主题的 CJK 子串回退——Lunr 无法可靠地对中文分词，所以命令面板会在检测到 CJK 字符时切换到子串匹配路径，两条路径应用相同的排序加权。

## 从右向左的语言 {#right-to-left-languages}

在语言下声明书写方向：

```yaml {title="hugo.yaml"}
languages:
  ar:
    label: العربية
    locale: ar
    languageDirection: rtl
    weight: 3
```

OINK 会加载 Bootstrap 的 RTL 样式表，主题自身的 CSS 使用逻辑属性（`margin-inline-start`
而非 `margin-left`），因此镜像布局是自动的。

站点自己写的 CSS 也应使用逻辑属性，否则 RTL 下会错位。

## 界面文案翻译 {#internationalization-bundles}

主题内置 32 个 locale 的界面文案。英文、简体中文（`zh-cn` 与通用
`zh`）和繁体中文（`zh-tw`）经过完整审校；其余语言保留继承自 Docsy 的翻译，OINK 新增的标签暂时使用英文兜底。

站点要覆盖某条界面文案时，在自己的 `i18n/` 下建同名文件：

```yaml {title="i18n/zh.yaml"}
ui_search: 搜索文档
```

## 翻译检查清单 {#translation-checklist}

- [ ] 每个 `page.md` 都有对应的 `page.zh.md`
- [ ] 中文标题带显式 ID，且与英文渲染 ID 一致
- [ ] 影响路由的 front matter 保持一致
- [ ] 命令、配置键、URL 未被翻译
- [ ] 语言选择器在有译文和无译文的页面上都验证过
- [ ] 两种语言的搜索都能返回结果

## 下一步 {#next-steps}

- [版本管理](../versioning/)：语言与版本的组合
- [导航与菜单](../navigation/)：按语言配置菜单
