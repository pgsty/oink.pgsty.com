---
title: 分析、用户反馈与 SEO
weight: 50
description: 配置分析、用户反馈与搜索元数据。
aliases: [/docs/content/feedback/, /docs/feature/analytics/]
cSpell:ignore: fabform pageviews
---

OINK 默认不会连接分析、表单、评论或广告服务。这些集成属于站点决策：必须显式启用、记录数据边界，并根据用户与站点所在司法辖区提供必要的同意机制或政策说明。

## 添加分析 {#adding-analytics}

Hugo 为分析服务提供嵌入模板。站点配置 Google
Analytics 后，页面浏览量与自定义事件等浏览器使用信息会发送给 Google。这与完全网络隔离的运行环境不兼容，也可能不符合严格的同源内容安全策略（CSP）。

### 配置 {#setup}

取得站点的 Google Analytics measurement ID，然后使用 Hugo 当前的服务配置：

```yaml
services:
  googleAnalytics:
    id: G-YOUR-ID
```

不要同时设置已经弃用的顶层 `googleAnalytics` 键。通常只有 Hugo `production`
环境才会输出分析代码。发布前，请构建生产预览，并检查 HTML 与浏览器网络日志。

禁用分析后，OINK 不会发起 Google
Analytics 请求。应彻底删除相关配置，而不是填写虚假 ID。

## 用户反馈 {#user-feedback}

OINK 可以显示紧凑的“这篇文档解决了你的问题吗？”提示。选择 **已解决** 或
**未解决**
后，结构化结果会立即记录。选择“未解决”时，还可以补充一个可选原因：缺少必要信息、内容错误或过时、操作步骤没有生效，或者内容难以理解。

组件不收集自由文本，也不会为反馈发起网络请求。选择会保存在浏览器本地存储中，因此再次访问时仍可查看或修改。若页面已有 Google
Analytics，同样的固定枚举值也会作为事件上报；没有 Analytics 时，本地交互仍然完整可用。

[Giscus](https://giscus.app/)
仍是独立的 Comments 组件。当前页启用评论时，反馈结果会提供跳转到评论区的链接，供读者补充详情。OINK 不会代替读者写入 Giscus
iframe，也不会创建 GitHub 身份。

### 反馈数据有什么用？ {#how-feedback-data-is-useful}

应结合上下文理解反馈，不能把单一分数当作结论。访问量高且反复收到负面反馈的页面是值得优先复查的候选；高评分页面则可能揭示值得在其他页面验证的模式。

应尽可能采用聚焦的编辑变更。例如，只更新一篇过时教程，或者把一小组页面的代码示例提前，然后在合适的时间范围内比较反馈。同时记录发布事件、流量变化、支持事件和其他可能解释变化的因素。

反馈只能提供方向性证据，不能取代用户研究、无障碍评审、支持数据或技术验证。

### 配置 {#user-feedback-setup}

OINK 默认关闭 Feedback。可以全局开启，并决定负面反馈是否显示原因选项：

```yaml
params:
  ui:
    feedback:
      enable: true
      reasons: true
```

只为一个栏目开启时，使用 cascade；页面配置会覆盖站点默认值：

```yaml
---
title: 文档
cascade:
  feedback: true
---
```

如果只需两个主选项，可全局设置 `reasons: false`，也可以用页面级 map 单独设置：

```yaml
---
title: 简短参考
feedback:
  enable: true
  reasons: false
---
```

旧版原型字段 `yes`、`no`、`max_value`、`endpoint` 与 `max_length`
已经不再使用，应从配置中删除。

### Analytics 事件 {#analytics-event}

页面存在全局 `gtag` 函数时，主选项会发送：

```text
docs_feedback { result, page_path, language }
```

`result` 只可能是 `solved` 或 `not_solved`。选择可选原因时，会再发送一条包含
`reason` 与 `refinement: true` 的 `docs_feedback`
事件。Analytics故障不会阻止界面更新或本地保存。

可以在分析服务商的事件报告中查看
`docs_feedback`，并按需创建页面级报告。没有事件不一定表示没有交互；也可能是 Analytics 被禁用或拦截、用户未同意，或者选择的时间范围不正确。

### 在单个页面覆盖反馈设置 {#disable-feedback-on-one-page}

在页面 Front Matter 中设置 `feedback`。页面设置可从任一方向覆盖全局默认值：

```yaml
---
title: 反馈示例
feedback: true
---
```

全局默认开启时，可用 `feedback: false` 隐藏单个页面的小组件。为保持兼容，未设置
`feedback` 时，`hide_feedback: true` 仍会隐藏小组件。

### 设置所有页面的默认值 {#disable-feedback-on-all-pages}

设置以下站点参数。OINK 默认值为 `false`：

```yaml
params:
  ui:
    feedback:
      enable: false
```

## 使用 Fabform 添加联系表单 {#add-a-contact-form-with-fabform}

Fabform 和类似托管表单端点都是可选在线服务。创建账户并评审其数据处理方式后，站点可以把表单提交到分配的端点：

```html
<form action="https://fabform.io/f/{form-id}" method="post">
  <label for="email">电子邮箱</label>
  <input id="email" name="email" type="email" autocomplete="email" />
  <button type="submit">提交</button>
</form>
```

请替换
`{form-id}`、翻译可见标签、加入隐私说明，并提供错误与成功状态。该表单无法离线使用。如果站点必须让提交内容留在自身边界内，应优先使用本地或第一方端点。

## 搜索引擎优化元数据 {#search-engine-optimization-metadata}

OINK 会按以下优先级为每个页面选择 HTML meta description：

1. 页面 front matter 中的 `description`；
2. 对于非索引页，使用 Hugo 计算出的页面摘要；
3. `params` 中的站点描述。

请为每种语言编写精炼且针对当前页面的描述。不要把英文描述复制到中文页面。搜索元数据无法弥补内容单薄、重复或不准确的问题。

主题还会根据 Hugo 页面译文输出 canonical 与备用语言链接。请使用正确的生产
`baseURL`、稳定的译文路由和显式译文标题 ID。只有主题尚未提供某类 meta 标签时，才应通过站点的
`layouts/_partials/hooks/head-end.html` 覆盖添加。

底层服务与内容概念请参阅 Hugo 的 [Google Analytics
配置][]、[页面摘要][]和 Google 的 [SEO 入门指南][]。

[Google Analytics 配置]:
  https://gohugo.io/templates/embedded/#configuration-google-analytics
[页面摘要]: https://gohugo.io/content-management/summaries/
[SEO 入门指南]:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
