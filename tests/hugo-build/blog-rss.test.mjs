import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const sections = ['oink', 'release', 'rss-probe'];
const moduleWorkspace = path.join(siteDir, 'go.work');

function itemLinks(file) {
  const rss = readFileSync(file, 'utf8');
  return [...rss.matchAll(/<item>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/g)]
    .map((match) => match[1])
    .sort();
}

test('top-level blog RSS recursively includes every section feed', () => {
  const probeDir = mkdtempSync(path.join(tmpdir(), 'oink-blog-rss-'));
  const contentDir = path.join(probeDir, 'content');
  const publicDir = path.join(probeDir, 'public');

  try {
    mkdirSync(contentDir);
    const probe = path.join(contentDir, 'blog', 'rss-probe');
    mkdirSync(probe, { recursive: true });
    writeFileSync(
      path.join(probe, '_index.md'),
      '---\ntitle: RSS probe\ndescription: Code Group feed probe.\n---\n',
    );
    writeFileSync(
      path.join(probe, 'primitive-summary.md'),
      `---
title: RSS primitive summary
date: 2020-08-09
---

Summary before {{< badge text="Before more" tone="info" >}}.

<!--more-->

RSS_MUST_NOT_INCLUDE_AFTER_MORE {{< badge text="After more" tone="danger" >}}.
      `,
    );
    writeFileSync(
      path.join(probe, 'front-summary.md'),
      `---
title: RSS front matter summary
date: 2020-08-08
summary: Front matter summary must win.
---

RSS_MUST_NOT_REPLACE_FRONT_SUMMARY {{< badge text="Body only" tone="danger" >}}.
`,
    );
    writeFileSync(
      path.join(probe, 'automatic-summary.md'),
      `---
title: RSS automatic summary
date: 2020-08-07
---

RSS_AUTO_SUMMARY_MUST_APPEAR {{< badge text="Automatic badge" tone="success" >}} followed by enough ordinary words to exceed the configured summary target without requiring the next paragraph. This sentence deliberately continues with stable filler words for the feed regression test under the pinned Hugo toolchain: alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima mike november oscar papa quebec romeo sierra tango uniform victor whiskey xray yankee zulu amber birch cedar dogwood elm fir ginkgo hazel ivy juniper koa linden maple nutmeg oak pine quince redwood spruce teak umber violet willow yew zephyr. These words keep the automatic summary boundary inside the first paragraph without relying on the full article body.

RSS_AUTO_SUMMARY_MUST_NOT_INCLUDE appears only after the first long paragraph.
`,
    );
    const overlayConfig = path.join(probeDir, 'rss-probe.yml');
    writeFileSync(
      overlayConfig,
      `module:
  mounts:
    - source: ${JSON.stringify(contentDir)}
      target: content
    - source: content
      target: content
      sites: { matrix: { languages: [en, zh] } }
`,
    );
    writeFileSync(
      path.join(probe, 'code-group.md'),
      `---
title: RSS Code Group
date: 2020-08-11
description: Feed-safe grouped code.
---

\`\`\`bash {tab="npm" group="rss-install" value="npm"}
npm install example
\`\`\`

\`\`\`bash {tab="pnpm" value="pnpm"}
pnpm add example
\`\`\`
`,
    );
    writeFileSync(
      path.join(probe, 'ordinary-code.md'),
      `---
title: RSS ordinary code
date: 2020-08-10
description: Feed-safe ordinary code.
---

\`\`\`bash
echo rss-safe
\`\`\`

<!--more-->

The complete article continues here.
`,
    );

    const result = spawnSync(
      'hugo',
      [
        '--source',
        siteDir,
        '--config',
        `hugo.yml,${overlayConfig}`,
        '--destination',
        publicDir,
        '--baseURL',
        'http://localhost',
        '--cleanDestinationDir',
        '--logLevel',
        'warn',
        '--noBuildLock',
      ],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          ...(existsSync(moduleWorkspace)
            ? { HUGO_MODULE_WORKSPACE: moduleWorkspace }
            : {}),
        },
      },
    );
    assert.equal(
      result.status,
      0,
      `Blog-only Hugo build failed:\n${result.stdout}${result.stderr}`,
    );

    for (const languagePrefix of ['', 'zh']) {
      const feedDir = path.join(publicDir, languagePrefix, 'blog');
      const topLevel = itemLinks(path.join(feedDir, 'index.xml'));
      const languageSections = languagePrefix
        ? sections.filter((section) => section !== 'rss-probe')
        : sections;
      const nested = languageSections
        .flatMap((section) =>
          itemLinks(path.join(feedDir, section, 'index.xml')),
        )
        .sort();

      assert.equal(new Set(topLevel).size, topLevel.length);
      assert.deepEqual(topLevel, nested);
    }

    const probeFeed = readFileSync(
      path.join(publicDir, 'blog', 'rss-probe', 'index.xml'),
      'utf8',
    );
    assert.match(probeFeed, /npm install example/);
    assert.match(probeFeed, /pnpm add example/);
    assert.match(probeFeed, /rss-safe/);
    assert.doesNotMatch(
      probeFeed,
      /data-td-code-group|data-td-tabs|nav-tabs|data-td-code-copy|data-td-code-status|&lt;button|<button/,
    );
    assert.match(probeFeed, /Before more/);
    assert.doesNotMatch(
      probeFeed,
      /RSS_MUST_NOT_INCLUDE_AFTER_MORE|After more/,
    );
    assert.match(probeFeed, /Front matter summary must win/);
    assert.doesNotMatch(
      probeFeed,
      /RSS_MUST_NOT_REPLACE_FRONT_SUMMARY|Body only/,
    );
    assert.match(probeFeed, /RSS_AUTO_SUMMARY_MUST_APPEAR/);
    assert.match(probeFeed, /Automatic badge/);
    assert.doesNotMatch(probeFeed, /RSS_AUTO_SUMMARY_MUST_NOT_INCLUDE/);
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
});
