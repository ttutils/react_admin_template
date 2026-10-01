import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss';
import { createRequire } from 'node:module';
import path from 'path';

const require = createRequire(import.meta.url);
let ENV_url = '';

try {
    const {ENV_url: importedUrl} = require('./url.config');
    ENV_url = importedUrl || '';
} catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND') {
        console.error('读取 url.config.ts 失败:', error);
    }
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
    plugins: [pluginReact({reactCompiler: true}), pluginSass(), pluginTailwindcss()],
    server: ENV_url ? {
        proxy: {
            '/api': {
                target: ENV_url,
                changeOrigin: true,
            }
        }
    } : {},
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
        printFileSize: {
            diff: true,
        },
    },
    optimization: {
        chunkIds: 'compat-hashed',
        moduleIds: 'compat-hashed',
    },
});
