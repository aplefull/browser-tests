import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, Plugin } from 'vite';
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
  plugins: [react(), tsconfigPaths(), redirectsPlugin(), visualizer(
    {
      template: "treemap",
      open: true,
      gzipSize: true,
    }
  )],
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
      '@mixins': './src/app/mixins.scss',
      '@variables': './src/app/colors.scss',
      '@assets/*': './src/assets/*',
    },
  },
});
