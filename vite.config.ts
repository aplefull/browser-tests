import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin, splitVendorChunkPlugin } from 'vite';
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

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    redirectsPlugin(),
    visualizer({
      template: 'treemap',
      open: true,
      gzipSize: true,
    }),
    splitVendorChunkPlugin(),
  ],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp', '**/*.adts', '**/*.tiff', '**/*.bmp'],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@variables"; @import "@mixins";`,
      },
    },
  },
  resolve: {
    alias: {
      '@mixins': './src/app/styles/mixins.scss',
      '@variables': './src/app/styles/colors.scss',
      '@assets/*': './src/assets/*',
    },
  },
});
