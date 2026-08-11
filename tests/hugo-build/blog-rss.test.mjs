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
const sections = ['docsy', 'oink', 'release', 'rss-probe'];
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

{{< code-group id="rss-install" persist=false >}}
  {{< code-tab title="npm" value="npm" lang="bash" >}}
npm install example
  {{< /code-tab >}}
  {{< code-tab title="pnpm" value="pnpm" lang="bash" >}}
pnpm add example
  {{< /code-tab >}}
{{< /code-group >}}
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
      /data-td-code-group|nav-tabs|data-td-code-copy|data-td-code-status|&lt;button|<button/,
    );
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
});
