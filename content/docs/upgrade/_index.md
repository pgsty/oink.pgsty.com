---
title: Upgrade and migrate
linkTitle: Upgrade
weight: 80
icon: fa-solid fa-arrow-up-right-dots
description: Upgrade the OINK version, or migrate from Docsy.
---

## In this chapter {#in-this-chapter}

- [Upgrade OINK](upgrade/): version-to-version steps and breaking changes
- [Migrate from Docsy](from-docsy/): move an existing Docsy site to OINK

## Principles {#principles}

- Production sites **pin a release tag** rather than following `main`.
- Read the target version's breaking changes before upgrading.
- Upgrade on a branch, verify fully, then merge.
- A green local build **is not** permission to publish: preview deployment and
  hosted smoke tests are separate gates.
