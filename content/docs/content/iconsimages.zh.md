---
title: Logo 与图片
weight: 70
icon: fa-solid fa-images
description: 配置 Logo、页面图标、favicon 与图片。
cSpell:ignore: imgproc
---

## 添加品牌标识 {#add-your-logo}

Oink 默认使用 `assets/icons/logo.svg` 作为品牌图标。通过 `params.logo`
可以替换它；如果页头应显示完整字标，而不是“图标 + 站点标题”，则设置
`params.wordmark`：

```yaml
params:
  logo: icons/product.svg
  wordmark: images/product-wordmark.svg
```

两个参数都可以指向 Hugo asset 或公开路径。需要主题处理的文件优先放入
`assets/`；必须原样复制的文件放入
`static/`。源 SVG 应紧贴图形边缘裁切，以便页头、侧栏和页脚采用一致尺寸。

品牌字体、尺寸与项目 SCSS 的说明请参阅[外观与风格][]。

## 使用图标 {#use-icons}

Oink 内置 Font Awesome Free，并从站点本地提供字体。为页面 front matter 设置
`icon`，即可给页面及其导航入口提供稳定的视觉提示：

```yaml
---
title: 部署站点
icon: fa-solid fa-cloud-arrow-up
---
```

请使用内置免费图标集中的图标。主题 [`VENDOR.json`][]
记录了准确的依赖版本；菜单图标规则请参阅[导航与菜单][]。

## 添加 favicon {#add-your-favicons}

Oink 不强制使用某个产品 favicon，而是发现消费端站点 `static/`
目录中采用约定名称的文件，并在每个页面中添加对应的 `<link>` 元素。

| 文件                       | 生成的链接                                |
| -------------------------- | ----------------------------------------- |
| `favicon.ico`              | `rel="icon"`                              |
| `favicon.svg`              | `rel="icon"` 与 `type="image/svg+xml"`    |
| `favicon-NxN.png`          | `rel="icon"`、PNG 类型与 `sizes="NxN"`    |
| `apple-touch-icon.png`     | `rel="apple-touch-icon"`                  |
| `apple-touch-icon-NxN.png` | `rel="apple-touch-icon"` 与 `sizes="NxN"` |

带数字的方形变体会按尺寸升序输出。实用的最小组合是 `favicon.ico`、`favicon.svg`
和 `apple-touch-icon.png`。

如需 Web App Manifest 或其他 head 元数据，请在
[`layouts/_partials/hooks/head-end.html`][] 中添加标记。如需改变发现规则，请覆盖
[`layouts/_partials/favicons.html`][]，并使用 `relURL`
保证子路径部署时 URL 正确。

### 生成 favicon {#generate-favicons}

可通过已经审查的图形工作流、ImageMagick、[favicon.io][] 或
[RealFaviconGenerator][]
生成这些文件。Oink 的生产构建不依赖 Node.js 或 favicon 生成器；Hugo 只发布
`static/` 中已经存在的文件。

## 添加图片 {#add-images}

只属于某个页面的图片应放在对应页面包中，让源文档与媒体保持在一起，并允许 Hugo 处理该资源。简单图片可以使用普通 Markdown；需要调整尺寸、裁切或显示选项时，使用
[`imgproc` 短代码][]。

### 落地页封面 {#landing-pages}

[`blocks/cover` 短代码][]会选择页面资源中首个文件名包含 `background`
的图片。对于栅格图，Oink 会生成 1920x1080 与 960x540 两种响应式变体。使用
`image_anchor` 控制裁切位置，并用 `height` 选择 `auto`、`min`、`med`、`max` 或
`full`：

```go-html-template
{{%/* blocks/cover
  title="Welcome to Oink"
  image_anchor="center"
  height="min"
*/%}}
让文档回归内容本身。
{{%/* /blocks/cover */%}}
```

### 静态图片 {#other-pages}

文件需要固定公开路径且不需要 Hugo 图片处理时，将其放入
`static/`。使用根路径相对 URL 引用，并确认站点以生产 `baseURL`
构建后同一 URL 仍可访问。具体取舍请参阅[添加静态内容][]。

[添加静态内容]: /zh/docs/content/adding-content/#adding-static-content
[`blocks/cover` 短代码]: /zh/docs/content/shortcodes/#blocks-cover
[favicon.io]: https://favicon.io/
[`imgproc` 短代码]: /zh/docs/content/shortcodes/#imgproc
[`layouts/_partials/favicons.html`]:
  https://github.com/pgsty/oink/blob/main/layouts/_partials/favicons.html
[`layouts/_partials/hooks/head-end.html`]:
  https://github.com/pgsty/oink/blob/main/layouts/_partials/hooks/head-end.html
[外观与风格]: /zh/docs/appearance/styling/#styling-your-project-logo-and-name
[导航与菜单]: /zh/docs/configure/navigation/#adding-icons-to-the-side-nav
[RealFaviconGenerator]: https://realfavicongenerator.net/
[`VENDOR.json`]: https://github.com/pgsty/oink/blob/main/VENDOR.json
