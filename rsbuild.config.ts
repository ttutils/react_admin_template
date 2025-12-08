import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import path from 'path';

let ENV_url;

try {
    const {ENV_url: importedUrl} = require('./url.config');
    ENV_url = importedUrl;
} catch (error) {
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
        module: true,
        legalComments: 'none',
        distPath: {
            root: 'dist',
            js: '',
            jsAsync: '',
            css: '',
            cssAsync: '',
            image: '',
            font: '',
            svg: '',
            favicon: '',
            assets: '',
        },
        inlineScripts({size}) {
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
        printFileSize: {
            diff: true,
        },
    },
});
