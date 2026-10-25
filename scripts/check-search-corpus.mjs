// Real documentation corpus acceptance and reproducible local CPU measurements.
// Build with the desired search scope first. No consumer build step is added.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { gzipSync } from 'node:zlib';
import os from 'node:os';

const require = createRequire(import.meta.url);
const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function option(key, fallback) { const n = args.indexOf(key); return n < 0 ? fallback : args[n + 1]; }
const directory = resolve(option('--index-dir', resolve(site, 'public')));
const scope = option('--scope', 'summary');
const prefix = option('--prefix', '');
const enginePath = resolve(option('--engine', resolve(site, '../oink/assets/js/search-engine.js')));
const baselinePath = option('--baseline-engine', '');
const baselineDirectory = option('--baseline-index-dir', '');
global.window = {};
const lunr = require(resolve(site, '../oink/assets/js/third_party/lunr.min.js'));
const api = require(enginePath);
const baselineApi = baselinePath ? require(resolve(baselinePath)) : null;
const queries = JSON.parse(readFileSync(resolve(site, 'tests/search/queries.json'))).filter(q => q.scope === scope);
const report = { scope, environment: { node: process.version, platform: process.platform,
  arch: process.arch, cpu: os.cpus()[0].model, timing: 'performance.now, Node CPU only; no network, debounce, or DOM',
  warmup: 3, rounds: 30, engine: enginePath, baselineEngine: baselinePath || null }, languages: {} };

function load(dir, lang) {
  const name = readdirSync(dir).find(name => new RegExp(`^offline-search-index\\.${lang}(\\.|\\.json)`).test(name));
  assert.ok(name, `missing ${lang} index in ${dir}`);
  const bytes = readFileSync(resolve(dir, name));
  const docs = JSON.parse(bytes);
  return { docs, pages: docs.length, sections: docs.reduce((n, d) => n + (d.sections?.length || 0), 0),
    raw: bytes.length, gzip: gzipSync(bytes, { level: 9, mtime: 0 }).length };
}
function measure(module, docs, cases) {
  const start = performance.now();
  const engine = module.create(docs, lunr, 10);
  const initMs = performance.now() - start;
  const coldStart = performance.now();
  const coldQuery = cases.find(c => c.query.split(/\s+/).some(t => /^[a-z]{3,}$/i.test(t)))?.query || cases[0].query;
  engine.query(coldQuery);
  const firstQueryMs = performance.now() - coldStart;
  const warmStart = performance.now();
  for (let n = 0; n < 3; n++) for (const c of cases) engine.query(c.query, c.root ? {root:c.root} : undefined);
  const warmupMs = performance.now() - warmStart;
  const durations = [];
  for (let n = 0; n < 30; n++) for (const c of cases) {
    const t = performance.now();
    engine.query(c.query, c.root ? {root:c.root} : undefined);
    durations.push(performance.now() - t);
  }
  durations.sort((a,b) => a-b);
  return { engine, initMs, coldQuery, firstQueryMs, warmupMs, samples: durations.length,
    medianMs: durations[Math.floor(durations.length / 2)], p95Ms: durations[Math.floor(durations.length * .95)] };
}
for (const lang of ['en', 'zh']) {
  const current = load(directory, lang);
  const cases = queries.filter(q => q.lang === lang);
  const { engine, ...timing } = measure(api, current.docs, cases);
  const previous = baselineDirectory ? load(baselineDirectory, lang) : current;
  const old = baselineApi ? measure(baselineApi, previous.docs, cases) : null;
  const results = cases.map(c => {
    const hits = engine.query(c.query, c.root ? {root:c.root} : undefined);
    const rank = hits.findIndex(r => r.doc.ref === prefix + c.path) + 1;
    if (c.empty) assert.equal(hits.length, 0, `${lang}: ${c.query} should be empty in ${scope}`);
    else {
      assert.ok(rank > 0 && rank <= (c.top || 5), `${lang}: ${c.query}: expected ${c.path} in top ${c.top || 5}; got ${hits.map(h=>h.ref)}`);
      const hit = hits[rank-1];
      if (c.anchor) assert.equal(hit.ref, prefix + c.path + '#' + c.anchor, c.query);
      if (c.partial !== undefined) assert.equal(hit.partial, c.partial, c.query);
    }
    assert.equal(new Set(hits.map(r => r.doc.ref)).size, hits.length, 'duplicate pages');
    assert.ok(hits.every(h => lang === 'zh' ? h.doc.ref.startsWith(prefix + '/zh/') : !h.doc.ref.startsWith(prefix + '/zh/')));
    if (c.root) assert.ok(hits.every(h => h.doc.root === c.root), 'scope before limiting');
    const oldHits = old?.engine.query(c.query) || [];
    const oldRank = oldHits.findIndex(r => r.doc.ref === c.path) + 1;
    return { query:c.query, expected:c.path || null, rank, previousRank: old ? oldRank : null,
      partial:hits[0]?.partial || false, top: hits.slice(0,5).map(r=>r.ref),
      previousTop: old ? oldHits.slice(0,5).map(r=>r.doc.ref) : undefined };
  });
  const withinBudget = current.raw <= 2*1024*1024 && current.gzip <= 512*1024;
  // The maintained site uses summary. Content is an explicit diagnostic of
  // the full research-heavy corpus; report its excess, never silently truncate.
  if (scope === 'summary') assert.ok(withinBudget, `${lang} index exceeds budget`);
  const { docs, ...sizes } = current;
  const { docs: oldDocs, ...previousSizes } = previous;
  const { engine: oldEngine, ...previousTiming } = old || {};
  report.languages[lang] = { ...sizes, withinBudget, timing, results,
    previous: old ? {...previousSizes, timing:previousTiming} : null };
}
console.log(JSON.stringify(report, null, 2));
