---
title: 使用 giscus 添加评论
linkTitle: giscus 评论
description: 使用 giscus 添加 GitHub 评论。
weight: 40
aliases: [/docs/content/giscus/, /docs/feature/giscus/]
cSpell:ignore:
  giscus repoId categoryId reactionsEnabled emitMetadata inputPosition ariaLabel
  errorMessage
---

OINK 在 `params.comments` 下提供[与 Hextra 兼容的评论配置][]，并通过该配置支持
[giscus][]。giscus 会为每个内容页关联一条由 [GitHub Discussions][]
保存的评论线程，读者通过 GitHub OAuth 登录后即可发表评论。

## giscus 如何工作 {#how-giscus-works}

页面加载时，giscus 会在配置的仓库中查找与当前页面匹配的 Discussion。如果没有找到，读者首次发表评论或表态时，giscus
bot 会自动创建一条。维护者直接在 GitHub Discussions 中审核和管理评论。

所有人都可以阅读公开评论。读者发表评论时，选择
**使用 GitHub 登录**，并授权 giscus
app 代表自己发帖。OINK 不会索取或保存读者的 GitHub 密码或访问令牌。

> [!IMPORTANT] 外部服务
>
> giscus 是需要显式启用的在线集成。启用评论的页面会从 `https://giscus.app`
> 加载脚本和 iframe，因此无法在网络隔离环境中运行。必要时，请在消费站点的隐私与安全政策中说明这条外部数据边界。

## 准备 GitHub 仓库 {#prepare-github}

配置 OINK 前，请完成以下准备：

1. 使用 **公开** GitHub 仓库保存评论线程。访客无法读取私有仓库中的 Discussions。
2. 在仓库的 **Settings > Features** 中[启用 GitHub Discussions][]。
3. 为该仓库安装 [giscus GitHub App][]。没有此 App，访客无法评论或表态。
4. 选择一个 Discussion 分类。giscus 推荐使用 **Announcements**
   类型，以便只有维护者和 giscus bot 能创建新的 Discussions。

仓库 ID 与分类 ID 是公开标识符，不是凭据。不要在 Hugo 配置中加入 GitHub personal
access token、OAuth secret 或密码。

## 生成仓库配置 {#generate-repository-settings}

打开 [giscus.app][giscus] 并填写配置表单：

1. 选择界面语言。
2. 以 `OWNER/REPOSITORY` 格式填写仓库，并等待验证成功。
3. 选择页面与 Discussion 的映射方式。OINK 默认使用 `pathname`。
4. 选择 Discussion 分类和可选功能。
5. 找到生成的 `<script>` 代码块。

把以下生成值复制到 OINK 配置中：

| 生成的属性         | OINK 配置键  |
| ------------------ | ------------ |
| `data-repo`        | `repo`       |
| `data-repo-id`     | `repoId`     |
| `data-category`    | `category`   |
| `data-category-id` | `categoryId` |

### 选择稳定的映射方式 {#choose-a-stable-mapping}

映射方式决定每个页面对应哪一条 Discussion。如果发布路径稳定，而且同一个仓库需要服务多个域名或预览环境，`pathname`
是合适的默认值。

修改
`mapping`、移动页面或变更永久 URL，可能让 giscus 查找另一条 Discussion。应在开始收集评论前选定映射方式；迁移时保留重定向或 Discussion 标题。如果相似页面路径可能误选线程，请启用严格匹配。

## 全站启用评论 {#enable-comments-site-wide}

把生成的标识符加入消费站点的 `hugo.yml`，并设置 `enable: true`：

```yaml
params:
  comments:
    enable: true
    type: giscus
    giscus:
      repo: OWNER/REPOSITORY
      repoId: REPOSITORY_ID
      category: Announcements
      categoryId: CATEGORY_ID
      mapping: pathname
      strict: 0
      reactionsEnabled: 1
      emitMetadata: 0
      inputPosition: top
      theme: auto
      loading: lazy
```

请用 giscus.app 生成的准确值替换所有大写占位符。OINK 只有在
`repo`、`repoId`、`category` 和 `categoryId`
全部存在时才会渲染 giscus。必填值缺失或只有空白字符时，Hugo 会发出警告并跳过 giscus，而不会让构建失败。

## 配置参考 {#configuration-reference}

| 配置键             | 默认值       | 用途                                               |
| ------------------ | ------------ | -------------------------------------------------- |
| `enable`           | `false`      | 在全站启用所选评论服务。                           |
| `type`             | `giscus`     | 选择 giscus；目前不支持其他服务商名称。            |
| `repo`             | —            | `OWNER/REPOSITORY` 格式的公开仓库。                |
| `repoId`           | —            | giscus.app 生成的仓库 node ID。                    |
| `category`         | —            | GitHub Discussions 分类名称。                      |
| `categoryId`       | —            | giscus.app 生成的分类 node ID。                    |
| `mapping`          | `pathname`   | 把当前页面映射到 Discussion。                      |
| `term`             | —            | 为 `specific` 或 `number` 等映射方式提供所需参数。 |
| `strict`           | `0`          | 设为 `1` 时严格匹配 Discussion 标题。              |
| `reactionsEnabled` | `1`          | 显示 Discussion 主帖的表态。                       |
| `emitMetadata`     | `0`          | 向父页面发送 Discussion 元数据消息。               |
| `inputPosition`    | `top`        | 把评论编辑器放在 `top` 或 `bottom`。               |
| `theme`            | `auto`       | 跟随 OINK 主题，或选择内置/自定义 giscus 主题。    |
| `lang`             | 当前页面语言 | 覆盖自动选择的 giscus 界面语言。                   |
| `loading`          | `lazy`       | 读者接近评论区时才加载 iframe。                    |
| `ariaLabel`        | `Comments`   | 为辅助技术标记评论区域。                           |
| `errorMessage`     | 加载错误文本 | 替换 giscus 无法加载时显示的消息。                 |

功能开关值既可以使用 YAML 布尔值，也可以使用 giscus 风格的 `0` 和 `1`。

## 语言、主题与无障碍文本 {#locale-theme-and-accessible-text}

OINK 会根据当前 Hugo 语言选择 giscus
locale。简体中文、繁体中文和香港繁体中文会分别映射到对应的 giscus
locale；不支持的语言会回退到英文。只有自动选择不合适时，才需要设置 `lang`。

使用 `theme: auto`
时，iframe 会跟随 OINK 的明暗主题选择器和浏览器首选配色。设置内置 giscus 主题名称或自定义主题 URL 后，将不再自动切换。

多语言站点应在每种语言的参数中翻译评论区域标签和加载失败文本。语言参数会与全局仓库配置合并：

```yaml
languages:
  en:
    params:
      comments:
        giscus:
          ariaLabel: Comments
          errorMessage: Comments could not be loaded.
  zh:
    params:
      comments:
        giscus:
          ariaLabel: 评论
          errorMessage: 评论加载失败。
```

## 覆盖单个页面 {#override-one-page}

front matter 中的 `comments` 字段可以从任一方向覆盖全局开关。

### 启用单个页面 {#enable-one-page}

在 `hugo.yml` 中保留完整仓库配置、关闭全局开关，然后让选定页面显式启用评论：

```yaml
---
title: 社区设计笔记
comments: true
---
```

### 禁用单个页面 {#disable-one-page}

全局启用评论后，可让不适合评论的静态页面显式退出：

```yaml
---
title: 安全政策
comments: false
---
```

显式设置 `comments: false` 会同时禁用该页的 giscus 和旧版 Disqus。

## 与 Disqus 共存 {#coexist-with-disqus}

迁移期间，OINK 会保持与现有 Hugo
Disqus 配置兼容。当某页的有效 giscus 配置处于启用状态时，OINK 会抑制 Disqus，确保只渲染一套评论系统。如果启用了 giscus，但必填设置不完整，OINK 会发出警告、跳过 giscus，并可保留已配置的 Disqus 作为回退。

迁移完成并确认所有预期页面都使用 giscus 后，再删除 Disqus 服务配置。

## 内容安全策略 {#content-security-policy}

严格的内容安全策略（CSP）必须同时在 `script-src` 和 `frame-src`
中允许 giscus。请把以下来源合并到站点现有策略中，不要替换其他指令：

```text
script-src 'self' https://giscus.app;
frame-src 'self' https://giscus.app;
```

OINK 初始化器仍是同源打包资源，而且只会加入启用 giscus 的页面。如果外部脚本加载失败或没有创建 iframe，OINK 会结束加载状态，并在实时状态区域显示
`errorMessage`。

## 验证集成 {#verify-the-integration}

1. 构建站点，并确认没有必填键缺失警告：

   ```sh
   hugo --minify
   ```

2. 启动本地预览，打开应启用评论的页面：

   ```sh
   hugo server --disableFastRender
   ```

3. 确认 giscus iframe 显示 **使用 GitHub 登录**，并采用当前页面语言。
4. 在 OINK 的明暗主题之间切换；使用 `theme: auto` 时，评论组件应同步切换。
5. 打开设置了 `comments: false` 的页面，确认其中没有 giscus 或 Disqus 组件。
6. 提交一条测试评论，然后确认预期 Discussion 出现在指定分类中，并可在 GitHub 上管理。

首次评论或表态创建 Discussion 之前，浏览器控制台提示找不到 Discussion 属于正常现象。

## 故障排查 {#troubleshooting}

- **构建警告缺少必填键**：在 giscus.app 重新生成配置，并原样复制四个必填标识符。
- **评论组件没有出现**：检查
  `params.comments.enable`、`params.comments.type`、页面的 `comments` front
  matter，以及 Hugo 警告输出。
- **GitHub 登录或发帖失败**：确认仓库公开、已启用 Discussions，而且已为该仓库安装 giscus
  GitHub App。
- **浏览器阻止 giscus**：检查控制台和响应头，并在适用的 CSP 指令中允许
  `https://giscus.app`。
- **找不到已有评论线程**：恢复原来的映射方式和页面路径，或者在修改 URL 前有计划地重命名或迁移 Discussion。
- **界面语言不正确**：检查 Hugo 语言名称与 locale，或显式设置
  `params.comments.giscus.lang`。

[启用 GitHub Discussions]:
  https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/enabling-or-disabling-github-discussions-for-a-repository
[giscus]: https://giscus.app/zh-CN
[giscus GitHub App]: https://github.com/apps/giscus
[GitHub Discussions]: https://docs.github.com/zh/discussions
[与 Hextra 兼容的评论配置]:
  https://imfing.github.io/hextra/zh-cn/docs/advanced/comments/
