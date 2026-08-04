import { copyFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const page = (file: string) => resolve(process.cwd(), file);

function sitesStaticWorker() {
  return {
    name: 'sites-static-worker',
    apply: 'build' as const,
    async closeBundle() {
      const serverDirectory = page('dist/server');
      await mkdir(serverDirectory, { recursive: true });
      await copyFile(
        page('src/app/hosting/static-worker.js'),
        resolve(serverDirectory, 'index.js')
      );
    }
  };
}

export default defineConfig({
  cacheDir: '.cache/vite',
  plugins: [react(), sitesStaticWorker()],
  publicDir: 'public',
  server: {
    // Some local browser profiles block Vite's inline React Refresh preamble.
    // Disabling HMR keeps TSX compilation working without affecting site motion.
    hmr: false
  },
  build: {
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        intro: page('index.html'),
        home: page('html/index.html'),
        connect: page('html/connect.html'),
        contact: page('html/contact.html'),
        about: page('html/about.html'),
        faq: page('html/faq.html'),
        process: page('html/process.html'),
        projects: page('html/projects.html'),
        services: page('html/services.html'),
        testimonials: page('html/testimonials.html'),
        scheduleStep1: page('html/schedule-step-1.html'),
        scheduleStep2: page('html/schedule-step-2.html'),
        scheduleStep3: page('html/schedule-step-3.html'),
        scheduleStep4: page('html/schedule-step-4.html')
      }
    }
  }
});
