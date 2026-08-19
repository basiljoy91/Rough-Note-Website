import { copyFile, mkdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const page = (file: string) => resolve(process.cwd(), file);
const deploymentTarget = process.env.DEPLOY_TARGET ?? 'hostinger';

if (deploymentTarget !== 'hostinger' && deploymentTarget !== 'sites') {
  throw new Error(
    `Unsupported DEPLOY_TARGET "${deploymentTarget}". Use "hostinger" or "sites".`
  );
}

function pageTurnBootstrap() {
  const style = `
    @view-transition { navigation: auto; }
    html, body { min-height: 100%; background: #f5efdf; }
  `;
  return {
    name: 'page-turn-bootstrap',
    transformIndexHtml: {
      order: 'pre' as const,
      handler() {
        return [
          {
            tag: 'style',
            attrs: { 'data-rn-page-turn-bootstrap-style': '' },
            children: style,
            injectTo: 'head-prepend' as const
          },
          {
            tag: 'script',
            attrs: {
              'data-rn-page-turn-bootstrap': '',
              src: '/assets/js/page-turn-bootstrap.js'
            },
            injectTo: 'head-prepend' as const
          }
        ];
      }
    }
  };
}

function sitesStaticWorker() {
  return {
    name: 'sites-static-worker',
    apply: 'build' as const,
    async closeBundle() {
      const serverDirectory = page('dist/server');
      const hostingDirectory = page('dist/.openai');
      await mkdir(serverDirectory, { recursive: true });
      await mkdir(hostingDirectory, { recursive: true });
      await copyFile(
        page('src/app/hosting/static-worker.js'),
        resolve(serverDirectory, 'index.js')
      );
      await copyFile(
        page('.openai/hosting.json'),
        resolve(hostingDirectory, 'hosting.json')
      );
    }
  };
}

function localNotFoundFallback() {
  return {
    name: 'local-not-found-fallback',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
          try {
            let urlPath = req.url?.split('?')[0] || '/';
            if (urlPath === '/' || urlPath.endsWith('/')) {
              urlPath += 'index.html';
            }

            const filePath = join(server.config.root, urlPath);

            // If the requested HTML file exists on disk, let Vite serve it normally
            if (existsSync(filePath)) {
              return next();
            }

            // Otherwise, it is a genuine 404 missing route
            const content = readFileSync(resolve(server.config.root, 'html/pagenotfound.html'), 'utf-8');
            const transformed = await server.transformIndexHtml(req.url || '/', content);
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(transformed);
          } catch (e) {
            next(e);
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  cacheDir: '.cache/vite',
  plugins: [
    pageTurnBootstrap(),
    react(),
    ...(deploymentTarget === 'sites' ? [sitesStaticWorker()] : []),
    localNotFoundFallback()
  ],
  publicDir: 'public',
  server: {
    // Some local browser profiles block Vite's inline React Refresh preamble.
    // Disabling HMR keeps TSX compilation working without affecting site motion.
    hmr: false,
    proxy: {
      '/api': 'http://127.0.0.1:3000'
    }
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
        work: page('html/work.html'),
        careers: page('html/careers.html'),
        privacy: page('html/privacy.html'),
        terms: page('html/terms.html'),
        testimonials: page('html/testimonials.html'),
        scheduleStep1: page('html/schedule-step-1.html'),
        scheduleStep2: page('html/schedule-step-2.html'),
        scheduleStep3: page('html/schedule-step-3.html'),
        scheduleStep4: page('html/schedule-step-4.html'),
        scheduleSuccess: page('html/schedule-success.html'),
        pagenotfound: page('html/pagenotfound.html')
      }
    }
  }
});
