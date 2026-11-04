import config from './playwright.config.mjs';
export default {
  ...config,
  testMatch: 'document-compare-languages.spec.mjs',
  testIgnore: [],
  use: { ...config.use, baseURL: 'http://127.0.0.1:4174' },
  webServer: {
    command: 'npm run _serve -- --config hugo.yml,tests/fixtures/browser.yml,tests/fixtures/compare.yml --bind 127.0.0.1 --port 4174 --noBuildLock --disableLiveReload --watch=false',
    url: 'http://127.0.0.1:4174', reuseExistingServer: false, timeout: 120000,
  },
};
