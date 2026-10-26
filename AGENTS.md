# Oink project-site guide

Start with `README.md` for this site's build and repository boundary, and
`TRANSLATION.md` for bilingual content rules. Public maintainer contracts,
accepted decisions, dated research, and proposals live under
`content/docs/design/`; this directory is their canonical bilingual source,
not a projection of a second theme-local document tree.

## Current baseline

The documentation target is OINK `v1.4.0`. Verify the actual published theme
version in `go.mod` and public tags before claiming release or deployment.
The Design contracts and release notes describe the 1.4.0 behavior. Use
sibling-checkout Make targets for development; validate the
published pin separately with replacements and both workspaces disabled.
CLI documentation describes the separate local `0.1.0-dev` candidate. Recheck
actual tags, module resolution and deployment before making release claims.

## Repository boundary

- This repository contains the documentation and regression site.
- Theme code belongs in `github.com/pgsty/oink`.
- The optional Go CLI and its native command, artifact, and workspace
  implementation/tests belong in `../oink-cli`. This site owns its public
  bilingual contracts, usage guides, and dated acceptance records.
- This site is the canonical integration, browser, accessibility, responsive,
  and visual-review surface for theme development.
- The site imports the theme in `hugo.yml` and pins it in `go.mod`.
- Site configuration is a single root `hugo.yml`; there is no `config/`
  directory and no per-environment config overlay.
- For sibling-checkout development, set `HUGO_MODULE_REPLACEMENTS` inline for
  the command that needs the local theme; do not generate a workspace from the
  Makefile or commit a filesystem module replacement.
- New consumer sites start from `pgsty/oink-starter`, not this documentation
  and regression repository.

## Content conventions

- Keep English primary and add Simplified Chinese peers as `.zh.md` files.
- Follow `TRANSLATION.md` and the published Design contracts.
- Update both language versions of an affected Design contract in the same
  delivery as its theme implementation and owning checker.
- Preserve explicit stable heading IDs and verify them in rendered HTML.
- Keep changelog, upgrade guidance, current docs, and release messages focused
  on their distinct audiences.
- Current CLI behavior belongs to `content/docs/design/decisions/cli{,.zh}.md`
  with the short introduction at `content/docs/cli{,.zh}.md`. Retired detailed
  guides remain in Git history; proposal roadmaps are not the current command API.

## Design records and PRDs

- Put every new PRD, RFC, or design proposal in
  `content/docs/design/proposals/<slug>.md` with a matching `<slug>.zh.md`.
- Follow the lifecycle and template published at `/docs/design/proposals/`.
  A proposal is non-normative until implementation and acceptance are recorded.
- Put accepted rationale under `content/docs/design/decisions/` and dated,
  non-normative evidence under `content/docs/design/research/`.
- Do not create repository-local `plan/`, `plans/`, `proposal/`, or parallel
  design-document trees. Use Git history and `CHANGELOG.md` for retired drafts.
- When a proposal changes public behavior, update the theme implementation,
  owning checker, and affected English and Chinese contract in one delivery.

## Validation

Use the smallest relevant command from `package.json`. The five Make targets
select different theme sources:

| Target         | Theme source and purpose                                     |
|----------------|--------------------------------------------------------------|
| `make check`   | Sibling `../oink`; complete non-browser site suite           |
| `make browser` | Sibling `../oink`; Playwright and axe suites                 |
| `make dev`     | Sibling `../oink`; fast, memory-rendered development preview |
| `make build`   | Published pin; minified Hugo build                           |
| `make serve`   | Published pin; production preview without fast/live reload   |

Direct `npm test` and `npm run test:browser` do not select the sibling theme
themselves; use the Make targets for local theme acceptance. The local `check`,
`browser`, and `dev` targets disable both workspace mechanisms. `build` and `serve`
do not clear inherited replacements or workspaces; use the published-pin
commands below to establish release identity. Node >= 24 and npm >= 11.16.0
are contributor test dependencies, not ordinary Hugo consumer requirements.
Use OINK v1.4.0 and Hugo Extended 0.168.0 for development, CI, and release
validation. Keep this baseline pinned. Never enable `--panicOnWarning` or
`HUGO_PANICONWARNING`. Warnings remain visible and are reviewed; the upstream
LibSass deprecation warning is accepted. SCSS uses Hugo's built-in LibSass,
with no external Sass installation. Preserve project SCSS hooks and this
dependency boundary. CI uses Node 24 and pins Go 1.27.3. Test
overlays do not change the single-root-config rule for the production site.

For published-pin acceptance, disable environment replacements and both
workspace mechanisms, verify advertised/pinned versions, and build:

```sh
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  npm run test:release-pin
env -u HUGO_MODULE_REPLACEMENTS GOWORK=off HUGO_MODULE_WORKSPACE=off \
  hugo --cleanDestinationDir --gc --minify --environment production \
  --printPathWarnings
```

`make check` uses a development build. Also run the production build above. Review changed Markdown,
LLMS, and favicon output before refreshing goldens; do not update expectations
merely to hide a failed check.

Use this site for rendered EN/ZH, desktop/mobile, light/dark, accessibility,
and interaction review. `A11Y_PATHS` restricts the sitemap scan; report that
scope explicitly. When `PLAYWRIGHT_BASE_URL` points to an existing server,
identify its module source and configuration instead of assuming the test
started the current checkout. CLI command checks remain owned by the CLI's Make targets.

Keep generated `public/`, `resources/`, `tmp/`, caches, and workspace files out
of Git. Preserve unrelated source edits. Local validation, commits, theme/CLI
publication, consumer adoption, and hosted deployment are separate states.

## Git 内容与大文件规则

用户于 2026-10-10 明确的通用仓库规则：

- 仓库默认保存源代码、配置和必要的轻量文档、元数据。构建产物、可执行文件、软件包、容器/虚拟机镜像、下载压缩包、数据库导出和大体积原始数据默认不进入 Git；文本格式的数据大文件同样需要检查。
- 在工作树内下载或生成上述文件之前，先选择仓库外的制品/数据位置，或补上合理的 `.gitignore` 规则并验证实际路径已被忽略，防止暂存和代理恢复/差异快照将它们写入 Git 对象库。
- 暂存、提交前检查新增文件的大小、类型和 staged 文件列表，只加入本次需要的源文件；不得用强制添加绕过忽略规则。优先保留来源清单、校验值及可复现的下载/构建方法。
- 对二进制素材、数据集或生成文件是否应纳入版本控制拿不准时，先问用户，再暂存或提交；确需例外时也先取得用户明确指示。
- 本规则不授权删除已有文件、stash、恢复快照或改写 Git 历史。忽略规则不会清除已存在的 Git 对象，历史清理需要单独明确范围。
