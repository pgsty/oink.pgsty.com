---
title: 定制外观
linkTitle: 定制外观
weight: 50
icon: fa-solid fa-palette
description: 字体预设、配色与样式覆盖。
cascade:
  categories: [外观]
---

OINK 的外观定制建立在语义化 CSS 自定义属性之上：站点覆盖少量变量即可换肤，不需要复制主题的组件选择器。

## 本章内容 {#in-this-chapter}

- [字体预设](typography/)：七个语义字体角色与两个内置预设
- [样式覆盖](styling/)：配色、布局与 Sass 变量
- [进阶定制](customize/)：模板覆盖与站点自有组件

## 定制的优先级 {#precedence}

从低到高：

1. 主题默认值
2. 预设（`typography.preset`）
3. `_variables_project.scss` 里的 Sass 变量
4. `_styles_project.scss` 里的自定义属性覆盖

站点设置永远优先于预设默认值。
