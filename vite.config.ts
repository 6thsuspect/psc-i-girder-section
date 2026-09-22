import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === 'electron') {
    const electron = (await import('vite-plugin-electron/simple')).default;
    plugins.push(
      electron({
        main: { entry: 'electron/main.ts' },
        preload: { input: path.join(rootDir, 'electron/preload.ts') },
      }),
    );
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.join(rootDir, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      allowedHosts: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
    base: './',
  };
});
