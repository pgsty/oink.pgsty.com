---
title: OINK 1.3.2 and Hugo 0.168 consumer inventory
linkTitle: 2026-10-18 build baseline
description: Local inventory of 37 maintained OINK sites using v1.3.2 and Hugo Extended 0.168.0, with visible warnings and separate publication evidence.
date: 2026-10-18
weight: 13
design_kind: research
design_status: recorded
---

This dated inventory records local checkouts under `~/pgsty` and `~/www`.
The current build policy is owned by the [architecture contract](/docs/design/architecture/#hugo-toolchain)
and [diagnostics decision](/docs/design/decisions/diagnostics/).

## Baseline {#baseline}

OINK [v1.3.2](https://github.com/pgsty/oink/releases/tag/v1.3.2) was published
on 2026-10-18 at 13:37 UTC. Its tag resolves to
`bd2e856e6e2f7027a9189af009701f5b8cf562cf`.
All maintained sites use this release and Hugo Extended 0.168.0. CI, local
checks, preview, and deployment commands omit the warning-fatal flag;
`HUGO_PANICONWARNING` must also remain unset. Warnings stay visible for review.
The upstream LibSass deprecation notice is accepted. No external Sass compiler
is required, and older Hugo versions are no longer development targets.

The observed local tools were Hugo `0.168.0+extended+withdeploy` on macOS arm64
and Go `1.27.2`. Module verification disabled environment replacements and
both Go and Hugo workspaces. Classic consumers were compared with the release's
runtime sources. All 37 builds preserved Paper and the explicit four-preset
reader menu.

## Sites {#sites}

Paths are relative to the home directory. Every row uses OINK v1.3.2 and Hugo
Extended 0.168.0. “Module” means the resolved public module; “copy” and
“submodule” identify classic `themes/oink` consumers.

| Checkout | Theme source | Local production build |
| --- | --- | --- |
| `pgsty/barn.pgsty.com` | module | Passed |
| `pgsty/boar.pgsty.com` | module | Passed |
| `pgsty/caps.vonng.com` | module | Passed |
| `pgsty/cloudexit.org` | module | Passed |
| `pgsty/exp.pgsty.com` | module | Passed |
| `pgsty/oink-starter` | module | Passed |
| `pgsty/oink.pgsty.com` | module | Passed |
| `pgsty/pgetcd.pgsty.com` | module | Passed |
| `pgsty/pgext` | module | Passed |
| `pgsty/pgredis.pgsty.com` | module | Passed |
| `pgsty/pgsilo.pgsty.com` | module | Passed |
| `pgsty/pgsty.com` | module | Passed with local report data; see below |
| `pgsty/pgsty.pro` | module | Passed |
| `pgsty/pig.pgsty.com` | module | Passed |
| `pgsty/pigsty.cc` | module | Passed |
| `pgsty/pigsty.io` | module | Passed |
| `pgsty/repo.pgsty.com` | module | Passed |
| `pgsty/silo.pgsty.com` | module | Passed |
| `pgsty/sow.pgsty.com` | module | Passed |
| `pgsty/wok.pgsty.com` | module | Passed |
| `www/aiempire` | module | Passed |
| `www/ca.vonng.com` | submodule | Passed |
| `www/ddia` | module | Passed |
| `www/dharma` | module | Passed |
| `www/doc.pg.center` | module | Passed |
| `www/fzb/site` | copy | Passed |
| `www/lzj` | module | Passed |
| `www/muse.vonng.com` | copy | Passed |
| `www/pg-internal` | module | Passed |
| `www/pg36g` | module | Passed |
| `www/pgweekly` | module | Passed |
| `www/piglet.run` | module | Passed |
| `www/sg.vonng.com` | submodule | Passed |
| `www/tpme` | module | Passed |
| `www/us.vonng.com` | submodule | Passed |
| `www/vonng.com` | module | Passed |
| `www/zj` | module | Passed |

## Boundaries {#boundaries}

- `pgsty.com` could not fetch its separately published report manifest: the
  remote request returned an unexpected EOF or timed out. Its build passed
  with the existing local report dataset and `HUGO_REPOORT_USE_LOCAL=1`.
  This validates the OINK/Hugo baseline, not remote report delivery.
- `sow.pgsty.com` was checked on its existing publication-review branch.
  No branch was switched. Non-Git and source-copy consumers were validated
  in place; their source identity does not imply a Git commit.
- `pgsilo/work/silo-docs` is a frozen delivery baseline, as its owning
  repository documents. It is excluded from maintained-site upgrades.
  Archived copies, linked worktrees, and historical release/research records
  are not current support targets.
- These are local source, module-resolution, build, and rendered-menu checks.
  They do not establish a push, hosting configuration change, or deployment.
  The already published v1.3.2 tag is unchanged.
