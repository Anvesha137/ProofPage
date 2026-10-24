import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
            try {
              const { default: apiHandler } = await import('./api/index.js');
              await apiHandler(req, res);
            } catch (err) {
              console.error('API Error in dev server:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || String(err) }));
            }
          } else {
            next();
          }
        });
      }
    }
  ]
});
