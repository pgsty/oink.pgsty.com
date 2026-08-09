---
title: 更新 OINK Git submodule 或克隆
linkTitle: Git submodule 或克隆
aliases: [/docs/updating/updating-submodules/]
weight: 3
description: 更新以 Git submodule 或克隆形式保存的 OINK 主题。
---

请根据安装方式选择相应步骤：[submodule](#update-the-submodule)
或[克隆](#update-the-clone)。两种方式都必须固定到目标版本标签或不可变的 commit。

## 更新 submodule {#update-the-submodule}

在站点根目录进入主题仓库获取标签，并 checkout 目标 ref：

```sh
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
git add themes/oink
git commit -m "Update OINK theme to THEME_REF"
```

如果站点使用其他目录名，请相应替换 `themes/oink`。父仓库会记录最终的 submodule
commit。请推送这次父仓库提交，确保 CI 和其他贡献者解析到完全相同的源码。

无需安装任何 npm 软件包。如果某个发行版的完整主题包含仅供源码使用的嵌套 submodule，请按照该版本的说明初始化；OINK 发行物所需的浏览器运行时资源已经包含在内。

## 更新克隆 {#update-the-clone}

如果主题目录是由站点跟踪或恢复的克隆，请将其更新到目标 ref：

```sh
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
```

沿用站点现有的可复现方式，提交、归档或记录更新后的主题。不要让生产构建持续跟随
`main`。

如果克隆中包含本地修改，请在切换 ref 前把它们提交到分支。更新后再通过 rebase 或其他方式重新应用，并显式解决冲突。可复用的修改应尽量回馈 OINK；消费站点只保留真正属于站点的覆盖。

随后继续[审查主题覆盖](/zh/docs/update/#update-overrides)。
