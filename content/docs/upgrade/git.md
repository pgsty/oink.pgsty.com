---
downstream_modified: true
title: Upgrade an Oink Git submodule or clone
linkTitle: Git submodule or clone
aliases: [/docs/update/git/, /docs/updating/updating-submodules/]
weight: 20
icon: fa-solid fa-code-branch
description: Upgrade Oink when its source is a Git submodule or clone.
---

Use the procedure matching the installation: [submodule](#update-the-submodule)
or [clone](#update-the-clone). Pin the target release tag or immutable commit in
both cases.

## Update the submodule

From the site root, fetch tags inside the theme and check out the target ref:

```sh
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
git add themes/oink
git commit -m "Update OINK theme to THEME_REF"
```

Replace `themes/oink` if the site uses another directory name. The parent
repository records the resulting submodule commit. Push that parent commit so CI
and other contributors resolve the same source.

No npm installation is required. If the complete theme has nested source-only
submodules for a particular release, initialize them according to that release's
notes; browser runtime assets in the OINK distribution are already present.

## Update the clone

If the theme directory is a clone tracked or restored by the site, update it to
the target ref:

```sh
git -C themes/oink fetch --tags
git -C themes/oink checkout THEME_REF
```

Commit, archive, or record the updated theme using the same reproducible method
the site already uses. Do not leave production builds following `main`.

If the clone contains local changes, commit them on a branch before switching
refs. Rebase or reapply them after the update and resolve conflicts explicitly.
Prefer moving reusable changes upstream into OINK and keeping only true
site-specific overrides in the consuming site.

Continue with [Review theme overrides](/docs/upgrade/#update-overrides).
