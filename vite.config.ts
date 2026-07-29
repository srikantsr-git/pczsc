import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

function saveSiteStatePlugin(): Plugin {
  return {
    name: 'save-site-state-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-site-state', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const targetFile = path.resolve(__dirname, './src/data/userSiteState.json');
              fs.writeFileSync(targetFile, JSON.stringify(data, null, 2), 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Saved to userSiteState.json' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), saveSiteStatePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
