---
title: 博客
description: Oink 工程实践、设计笔记与阅读外壳指南
search_keywords: [OINK 博客, 工程实践, 沉浸式阅读, 画廊, 设计笔记]
weight: 50
type: blog
icon: fa-solid fa-blog
aliases: [/blog/oink/]
sidebar_root_for: self
sidebar_root_link_self: true
footer_style: fat
comments: true
blog_index: cards
blog_index_toggle: true
# 栏目根页是一份文章索引而不是落点：反向链接属于它列出的那些文章，所以这一页
# 退出站点级默认。
backlinks: false
# The Book/Blog reading shells keep the title bar pinned: long-form reading
# should not make the navbar appear and disappear under the pointer.
navbar_autohide: false
images: [/images/oink.webp]
# 分区身份：博客用紫色。暗色显式指定，让分区保持期望的紫色而不依赖派生色调。
cascade:
  theme_color: '#6d28d9'
  theme_color_dark: '#a78bfa'
  type: blog
  navbar_autohide: false
  images: [/images/oink.webp]
  # 另一种题图模式：标题上方展示 16:9 带框横幅。
  featured_image: banner
  footer_style: fat
  comments: true
  reading_time: true
  # 博客栏目的文末分享条：每项都是普通分享链接，只携带本页地址与标题，
  # 不引入第三方 SDK、iframe、脚本或计数，外加一个本地复制链接按钮。
  share: [x, bluesky, mastodon, reddit, hackernews, email, copy]
  feedback: false
  search_boost: 0.9
  sidebar_menu_compact: false
  sidebar_expand_levels: 3
---
