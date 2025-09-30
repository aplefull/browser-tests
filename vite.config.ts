import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from 'fs';

const redirectsPlugin = (): Plugin => {
  return {
    name: 'redirects',
    apply: 'build',
    writeBundle(options) {
      if (!options.dir) return;

      const dest = path.resolve(options.dir, '_redirects');
      const redirectsContent = '/* /index.html 200';

      fs.writeFileSync(dest, redirectsContent);
    },
  };
};

const scriptImportPlugin = (): Plugin => {
  let config: ResolvedConfig | null = null;
  const files = new Map<string, string>();

  return {
    name: 'script-import',
    enforce: 'pre',
    resolveId: {
      order: 'pre',
      async handler(id, importer, options) {
        if (id.endsWith('?script')) {
          if (config?.command === 'build') {
            const resolvedPath = path.resolve(path.dirname(importer || ''), id).replace(/\?script$/, '.ts');

            const assetId = this.emitFile({
              type: 'chunk',
              id: resolvedPath,
              fileName: resolvedPath.includes('serviceWorker') ? 'serviceWorker.js' : undefined,
            });

            files.set(id, assetId);

            return id;
          }

          if (config?.command === 'serve') {
            const transformedPath = `${id.replace(/\?script$/, '.ts')}?url`;

            return await this.resolve(transformedPath, importer, {
              skipSelf: true,
              ...options,
            });
          }
        }
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

export default defineConfig({
  plugins: [
    react(),
    scriptImportPlugin(),
    tsconfigPaths(),
    redirectsPlugin(),
    visualizer({
      template: 'treemap',
      open: false,
      gzipSize: true,
    }),
  ],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp', '**/*.adts', '**/*.tiff', '**/*.bmp', '**/*.cur'],
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
    alias: {
      '@mixins': path.resolve(__dirname, 'src/app/styles/mixins.scss'),
      '@variables': path.resolve(__dirname, 'src/app/styles/variables.scss'),
      '@assets/*': 'src/assets/*',
      '@data/*': 'src/assets/data/*',
      '@utils': path.resolve(__dirname, 'src/utils/utils.ts'),
      '@math': path.resolve(__dirname, 'src/utils/math.ts'),
    },
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor_react';
            }
            return 'vendor_other';
          }
        }
      }
    }
  },
});
