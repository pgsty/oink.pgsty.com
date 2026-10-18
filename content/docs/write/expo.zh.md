---
title: 用 Expo 创建图片相册
linkTitle: Expo 相册
description: 创建图片相册，补充可选元数据，选择布局，并使用图片查看器。
weight: 55
icon: fa-solid fa-images
search_keywords: [expo, 相册, 画廊, 图片, GIF, 展墙, 卡片, 无缝, 缩放]
---

Expo 用相册展示图片收藏。侧栏组织相册，主区域显示所选相册中的图片。
点击图片即可打开查看器。

> [!NOTE] OINK 1.3.0 新增
> Expo 随 OINK v1.3.0 提供。

打开[示例相册](/zh/expo/)即可体验这些控件。若要在文字页面中插入图片网格，
使用 [Gallery 组件](/zh/docs/components/gallery/)。

## 创建相册 {#create-an-album}

每个相册使用一个目录。图片放在目录内的 `images/` 文件夹中，用一个 `index.md`
描述相册。图片默认使用文件名生成标题，无需逐图创建 Markdown 或 YAML 文件。

```text
content/photos/
├── _index.md
├── nature/
│   ├── _index.md
│   └── field-notes/
│       ├── index.md
│       └── images/
│           ├── 01-fern.jpg
│           └── 02-river.gif
└── buildings/
    ├── index.md
    └── images/
        └── arch.jpg
```

1. 创建分区入口：

   ```yaml {title="content/photos/_index.md"}
   ---
   title: 图片相册
   type: expo
   cascade:
     type: expo
   ---
   ```

2. 为每组相册创建主题入口：

   ```yaml {title="content/photos/nature/_index.md"}
   ---
   title: 自然
   weight: 10
   ---
   ```

3. 创建相册页面：

   ```markdown {title="content/photos/nature/field-notes/index.md"}
   ---
   title: 野外札记
   description: 一次野外观察中的植物与河流。
   weight: 10
   ---

   摄于北侧小径。
   ```

4. 将图片放入相册的 `images/` 文件夹。

分区页面列出下级主题与相册，侧栏沿用同一棵内容树。窄屏上打开导航抽屉选择相册。
相册正文可以省略；提供正文时，它显示在图片上方。

大型收藏请拆成多个相册。Expo 不会自动给图片分页。分区中的相册卡片用排序后的
第一张图片作为封面；没有自身图片的主题会从下级相册中选取首张可用图片。
封面填满 4:3 的画框，因此预览可能被裁切。

## 添加图片元数据 {#image-metadata}

图片需要标题、说明、署名或指定顺序时，在相册 front matter 中添加 `resources`
条目。`src` 路径相对于相册目录。

```yaml {title="相册 front matter"}
resources:
  - src: images/01-fern.jpg
    title: 蕨叶
    params:
      id: fern
      alt: 从上方观察的一片绿色蕨叶
      caption: 北侧小径旁分叉生长的叶片。
      byline: Alex Chen
      weight: 10
```

| 字段 | 用途 |
| --- | --- |
| `title` | 图片标题；省略时由文件名生成 |
| `params.alt` | 描述图片的替代文字；省略或为空时使用标题 |
| `params.caption` | 纯文本说明 |
| `params.byline` | 纯文本署名 |
| `params.weight` | 图片排序数值；越小越靠前，默认为 `0` |
| `params.id` | 相册内稳定的图片 ID |
| `params.original` | 可选，指向同一相册页面包内另一张图片的路径 |

权重相同时沿用资源名称顺序。需要完整指定顺序时，为每张图片都设置权重。
没有权重的图片排在正权重图片之前。

ID 必须以 ASCII 字母或数字开头，后续字符还可使用 `_` 和 `-`。同一相册内的 ID 必须唯一。
示例生成 `/photos/nature/field-notes/#img-fern`。只要相册 URL 和显式 ID 不变，
修改文件名后这条链接仍然有效。未指定 ID 时，Expo 使用文件名哈希；重命名文件会改变链接。

若要提供独立原图，将其放入 `originals/`，并设置
`params.original: originals/fern.jpg`。预览图与原图应保持相同宽高比。
原图路径应在 `expo.images` 匹配范围之外，以免重复列出。
Expo 读取页面包内的图片，不会为相册抓取远程文件。

## 设置默认值 {#defaults}

在 `hugo.yml` 中设置站点默认值：

```yaml {title="hugo.yml"}
params:
  ui:
    expo:
      images: images/*
      mode: wall
      size: 240
```

| 键 | 可选值 | 内置默认值 |
| --- | --- | --- |
| `images` | 相册页面包内图片资源的匹配模式 | `images/*` |
| `mode` | `wall`、`cards` 或 `seamless` | `wall` |
| `size` | `160` 至 `360` 的整数，单位为 CSS 像素 | `240` |

在相册 front matter 顶层写入 `expo` 块，覆盖站点配置：

```yaml {title="相册 front matter"}
expo:
  images: images/*
  mode: cards
  size: 280
```

此设置替换整个配置块。省略的字段使用内置默认值，不继承站点块中的对应值。
分区也可通过 `cascade` 提供这个配置块。`size` 是布局计算的目标尺寸，不是每张图片
固定的宽度和高度。

浏览器按站点来源保存读者选择的布局和尺寸。这些选择优先于作者默认值，刷新页面、
切换相册或切换外观后仍然保留。浏览器存储不可用时，页面加载后使用作者默认值。

## 选择布局 {#layouts}

| 模式 | 显示方式 |
| --- | --- |
| `wall` | 展墙：按行排列图片块，间距为 6 CSS 像素 |
| `cards` | 卡片：按列排列，显示标题、说明与署名 |
| `seamless` | 无缝：按行排列图片块，块之间没有间距 |

工具栏依次提供三个布局图标、播放／暂停按钮和图片尺寸滑杆。在有鼠标的设备上，
展墙与无缝模式在悬浮或键盘聚焦时显示说明。宽高比极端的图片可能在图片块内留白。
相册中的图片块会完整容纳图片。

GIF 默认播放。点击暂停可切换到静态预览。若系统要求减少动态效果，Expo 默认使用
静态预览，读者仍可点击播放。没有 GIF 的相册会禁用播放按钮。图片在接近可见区域时
加载；体积较大的 GIF 仍需传输完整文件。

## 使用图片查看器 {#viewer}

点击图片打开查看器。小图以原尺寸显示，大图缩小到宽、高都能放入可用显示区域。

| 控件 | 操作 |
| --- | --- |
| 重置 | 恢复初始尺寸，并将图片居中 |
| 放大至适屏 | 缩放图片，直到受限边与显示区域对应边等长 |
| 缩小／放大 | 将当前缩放比例除以或乘以 `1.25` |
| 打开原图 | 在新标签页中打开原图文件 |
| 在相册中定位 | 关闭查看器，移动到相册中的这张图片 |
| 上一张／下一张 | 显示同一相册中的相邻图片 |
| 关闭 | 关闭查看器，将焦点返回图片链接 |

放大至适屏会完整显示图片，不会切换浏览器全屏。手动放大可以让图片超出查看区域。
按住鼠标左键拖动，即可移动放大后的图片，移到图片边界后停止。触摸屏上的放大图片
保留原生滚动。图片完整放入显示区域时，单指横向滑动可切换图片；双指缩放保留
浏览器原生行为。双击在初始适应尺寸与近看之间切换：缩小显示的图片以 100%
显示，并保持指针下的位置；已按原尺寸显示的图片则放大至适屏。

切换图片会重置缩放比例和位置。上一张／下一张到达相册首尾后停止。
缩放百分比按 CSS 像素计算：100% 时，一个原图像素对应一个 CSS 像素。

## 使用快捷键 {#shortcuts}

以下快捷键在查看器打开时生效，优先于页面的单键导航。它们不接管文字输入、输入法
组合输入或 Ctrl／Command／Alt 组合键。

| 按键 | 操作 |
| --- | --- |
| W / A / S / D | 将放大后的图片向上／左／下／右移动 |
| Q 或 H | 上一张 |
| E 或 L | 下一张 |
| J 或 − | 缩小 |
| K 或 + | 放大 |
| R 或 0 | 重置尺寸和位置 |
| F | 放大至适屏 |
| Escape | 关闭查看器 |

WASD 每次移动图片 80 CSS 像素，只沿超出显示区域的方向生效。不需要横向滚动时，
左右方向键用于切换图片；图片宽于显示区域时，方向键保留原生滚动行为。
`keyboard_nav` 设置控制页面快捷键，不会禁用查看器控件。

## 使用站点外观 {#appearance}

Expo 采用 Paper、Slate、Ink、Terminal 四种预设，并沿用站点的亮色或暗色模式。
这些选项位于共享导航中。相册主体使用图片工具栏，不显示文章操作菜单。

要提供四种预设并保持顶部导航栏可见，使用：

```yaml {title="hugo.yml"}
params:
  ui:
    preset: paper
    preset_menu: [paper, slate, ink, terminal]
    navbar_enabled: true
    navbar_autohide: false
```

Expo 默认使用页面的全部可用宽度，没有右侧大纲。需要较窄的主体时，在页面
front matter 中设置 `page_width`。若站点覆盖了 `params.ui.shell_types`，请在列表中
保留 `expo`，以启用它的侧栏。

## 翻译与导出相册 {#translations-and-outputs}

在 `index.md` 旁添加 `index.zh.md`，即可创建中文相册。每个翻译后的分区也要添加
`_index.zh.md`。两种语言可以共用图片文件。分别翻译各页的标题、描述与资源元数据。
同一张图片在两种语言中应使用相同 ID。

没有 JavaScript 时，HTML 页面仍然可用：图片链接直接打开原图，说明保持可见。
启用对应输出后，Print 使用静态预览，Markdown 与 LLMSFULL 包含图片链接及元数据，
RSS 包含静态图片说明。输出配置见[打印](/zh/docs/customize/print/)与
[智能体输出](/zh/docs/customize/agents/)。

## 检查相册 {#check-an-album}

1. 使用包含 Expo 的主题版本运行 `hugo --printPathWarnings`。
2. 打开每个相册，确认图片顺序、标题与说明。
3. 检查小图、宽图、长图，以及相册中的 GIF。
4. 检查重置、放大至适屏、缩放、拖动、快捷键导航和相册定位。
5. 检查两种语言、窄屏、四种外观预设，以及亮暗模式。

相册为空时，检查 `type`、页面包结构和 `expo.images` 匹配模式。默认值似乎未生效时，
检查浏览器保存的读者选择，以及配置块整体替换规则。具体行为与维护者检查见
[Expo 契约](/zh/docs/design/expo/)和[设计决策](/zh/docs/design/decisions/expo/)。
