import { createFilter, defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from 'fs';

const scssPlugin = (): Plugin => {
  return {
    name: 'scss-transform',
    apply: 'build',
    transform(code, id) {
      const scssModulesFilter = createFilter(/\.module\.scss$/);
      const scssFilter = createFilter(/(?<!\.module)\.scss$/);

      console.log('LOG', id);

      if (scssModulesFilter(id)) {
        console.log('scss-modules', id);
      }

      if (scssFilter(id)) {
        console.log('scss', id);
      }
    },
  };
};

const redirectsPlugin = (): Plugin => {
  return {
    name: 'redirects',
    apply: 'build',
    writeBundle(options) {
      const dest = path.resolve(options.dir, '_redirects');
      const redirectsContent = '/* /index.html 200';

      fs.writeFileSync(dest, redirectsContent);
    },
  };
};

export default defineConfig({
  plugins: [react(), tsconfigPaths(), redirectsPlugin() /*scssPlugin()*/],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp'],
  resolve: {
    alias: {
      '@mixins': './src/app/mixins.scss',
    },
  },
  rollupInputOptions: {
    input: {
      exclude: ['**/*.scss'],
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
      },
    },
  },
});
