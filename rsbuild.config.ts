import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import path from 'path';

let ENV_url: string;

try {
  const {ENV_url: importedUrl} = require('./url.config');
  ENV_url = importedUrl;
} catch (error) {
  // 如果导入文件失败，将 ENV_url 设置为空字符串
  console.error('没有url.config.js文件:', error);
  ENV_url = '';
}

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx'
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './')
    }
  },
  plugins: [pluginReact(), pluginSass()],
  server: {
    proxy: {
      '/api': {
        target: ENV_url,
        changeOrigin: true,
      }
    }
  },
  output: {
    distPath: {
      root: 'dist',
    },
    inlineScripts({ size }) {
      return size < 10 * 1000;
    },
  },
  performance: {
    chunkSplit: {
      // 代码拆分
      strategy: 'split-by-size',
      minSize: 30000, // 30k
      maxSize: 500000, // 50k
    },
  },
});
