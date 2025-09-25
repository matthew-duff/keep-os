import { defineConfig } from 'wxt';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: "Keep",
    description: "My extension description",
    permissions: [
      'activeTab',
      'scripting',
      'tabs'
    ],
    host_permissions: [
      '<all_urls>',
      'http://localhost:*/*',
      'http://127.0.0.1:*/*'
    ],
    web_accessible_resources: [
      {
        resources: ["dashboard.html"],
        matches: ["*://*/*"]
      }
    ],
    // entrypoints: {
    //   // Existing entry points
    //   background: 'src/entrypoints/background.ts',
    //   popup: 'src/entrypoints/popup/popup.ts',
    //   dashboard: 'src/entrypoints/dashboard/dashboard.ts',
    //   // Updated content script entry point
    //   content: 'src/entrypoints/content/content.ts'
    // },
  },
  vite: () => ({
    plugins: [
      wasm(),
      topLevelAwait(),
      tailwindcss()
    ],
  }),

  runner: {
    startUrls: ['https://www.google.com'],
    binaries: {
      chromium: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      // If you use Chromium instead of Chrome, use the line below instead:
      // chromium: '/Applications/Chromium.app/Contents/MacOS/Chromium'
    },
    // Persist and reuse a fixed profile so the extension stays installed/pinned
    keepProfileChanges: true,
    chromiumProfile: '/Users/matthewduff/Programs/prod-keep/frontend/.wxt-dev-profile'
  }
});
