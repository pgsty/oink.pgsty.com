---
title: ansible-vms.pages.dev
linkTitle: ansible-vms
description: >-
  ansible-vms 是基于 Ansible 与 libvirt 管理 KVM 虚拟机的中英双语自动化手册，采用 OINK Paper 风格部署于 Cloudflare Pages。
images: [featured.webp]
site_url: https://ansible-vms.pages.dev/
case_group: community
weight: 290
date: 2026-11-13
search_keywords: [ansible-vms.pages.dev, Ansible, KVM, libvirt, Paper 风格, 社区案例]
tags: [社区, 文档, 运维]
---

[ansible-vms.pages.dev](https://ansible-vms.pages.dev/) 是声明式 KVM 与 libvirt 虚拟机编排工具集 **ansible-vms** 的中英双语文档站，源码位于 [`mars-base/ansible-vms`](https://github.com/mars-base/ansible-vms)。站点与 `pgcli.pages.dev` 保持同一套 OINK `paper` 家族视觉，共 28 页文档，涵盖 CSV 虚拟机清单、云镜像、网桥、快照与防火墙自动化。

## 它展示了什么 {#what-it-demonstrates}

- 在多个姊妹基础设施项目中复用一致的 OINK Paper 风格与 Cloudflare Pages 发布流水线。
- 在 Ansible 运维仓库中轻量共置双语文档并同步输出 `llms.txt`。

→ [从 Starter 起步](/zh/docs/start/starter/) · [部署上线](/zh/docs/admin/deploy/) · [全部 OINK 案例](/zh/case/)
