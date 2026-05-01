import { defineConfig } from 'vite';
import { resolve } from 'path';

// Common config
const commonConfig = {
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
};

export default defineConfig(({ mode }) => {
  if (mode === 'content') {
    return {
      ...commonConfig,
      build: {
        emptyOutDir: false,
        lib: {
          entry: resolve(__dirname, 'src/content/index.js'),
          name: 'content',
          formats: ['iife'],
          fileName: () => 'src/content/index.js',
        },
        rollupOptions: {
          output: {
            extend: true,
            assetFileNames: 'assets/[name].[ext]',
          },
        },
      },
    };
  }

  return {
    ...commonConfig,
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup/popup.html'),
          options: resolve(__dirname, 'src/options/options.html'),
          background: resolve(__dirname, 'src/background/index.js'),
        },
        output: {
          entryFileNames: 'src/[name]/index.js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  };
});
