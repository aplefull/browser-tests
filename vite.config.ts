import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  assetsInclude: ['**/*.avi', '**/*.mpeg', '**/*.3gp'],
  resolve: {
    alias: {
      '@mixins': './src/app/mixins.scss',
    },
  },
});
