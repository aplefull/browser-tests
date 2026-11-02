import path from 'node:path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, ResolvedConfig } from 'vite';

const scriptImportPlugin = (): Plugin => {
  let config: ResolvedConfig | null = null;
  const files = new Map<string, string>();

  return {
    name: 'script-import',
    enforce: 'pre',
    resolveId: {
      order: 'pre',
      async handler(id, importer, options) {
        if (!id.endsWith('?script')) return;

        const resolved = await this.resolve(id.replace(/\?script$/, '.ts'), importer, {
          ...options,
          skipSelf: true,
        });

        if (!resolved) return;

        if (config?.command === 'serve') {
          return await this.resolve(`${resolved.id}?url`, importer, {
            ...options,
            skipSelf: true,
          });
        }

        const scriptId = `\0script:${resolved.id}`;

        if (!files.has(scriptId)) {
          const referenceId = this.emitFile({
            type: 'chunk',
            id: resolved.id,
            fileName: path.basename(resolved.id) === 'serviceWorker.ts' ? 'serviceWorker.js' : undefined,
          });

          files.set(scriptId, referenceId);
        }

        return scriptId;
      },
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    load(id) {
      if (files.has(id)) {
        return `export default import.meta.ROLLUP_FILE_URL_${files.get(id)};`;
      }
    },
  };
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    scriptImportPlugin(),
    mode === 'stats' &&
      visualizer({
        template: 'treemap',
        open: false,
        gzipSize: true,
      }),
  ],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp', '**/*.adts', '**/*.tiff', '**/*.bmp', '**/*.cur', '**/*.jxl'],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "sass:color"; @use "@variables" as *; @use "@mixins" as *;`,
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@mixins': path.resolve(import.meta.dirname, 'src/app/styles/mixins.scss'),
      '@variables': path.resolve(import.meta.dirname, 'src/app/styles/variables.scss'),
    },
  },
  build: {
    cssCodeSplit: true,
    cssMinify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor_react';
            }
            return 'vendor_other';
          }
        },
      },
    },
  },
}));
