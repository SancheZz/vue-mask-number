import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as path from 'path';

const isStrict = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      failOnError: isStrict,
      failOnWarning: isStrict,
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'MaskNumber/MaskNumber.d.ts',
          dest: './',
        },
      ],
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'MaskNumber/plugin.ts'),
      name: 'MaskNumber',
      fileName(format) {
        return `MaskNumber.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
