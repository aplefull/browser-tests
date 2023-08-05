import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import fs from 'fs';

const scssPlugin = (): Plugin => {
  return {
    name: 'scss-transform',
    apply: 'build',
    transform(code, id) {},
  };
};

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
  plugins: [react(), tsconfigPaths(), redirectsPlugin()],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp', '**/*.tiff', '**/*.bmp'],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  resolve: {
    alias: {
      '@mixins': './src/app/mixins.scss',
      '@assets/*': './src/assets/*',
    },
  },
});
