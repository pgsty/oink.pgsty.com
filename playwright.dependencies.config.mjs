import config from './playwright.config.mjs';

export default {
  ...config,
  testMatch: 'dependency-services.spec.mjs',
  testIgnore: [],
  use: { ...config.use, baseURL: 'http://127.0.0.1:4175' },
  webServer: {
    command: 'npm run _serve -- --config hugo.yml,tests/fixtures/browser.yml,tests/fixtures/dependency-services.yml --bind 127.0.0.1 --baseURL http://127.0.0.1:4175/ --port 4175 --noBuildLock --disableLiveReload --watch=false',
    url: 'http://127.0.0.1:4175', reuseExistingServer: false, timeout: 120000,
  },
};
