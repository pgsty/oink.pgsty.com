import assert from 'node:assert/strict';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const siteDir = fileURLToPath(new URL('../../', import.meta.url));
const sections = ['docsy', 'oink', 'release'];
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
    symlinkSync(
      path.join(siteDir, 'content', 'blog'),
      path.join(contentDir, 'blog'),
    );

    const result = spawnSync(
      'hugo',
      [
        '--source',
        siteDir,
        '--contentDir',
        contentDir,
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
      const nested = sections
        .flatMap((section) =>
          itemLinks(path.join(feedDir, section, 'index.xml')),
        )
        .sort();

      assert.equal(new Set(topLevel).size, topLevel.length);
      assert.deepEqual(topLevel, nested);
    }
  } finally {
    rmSync(probeDir, { recursive: true, force: true });
  }
});
