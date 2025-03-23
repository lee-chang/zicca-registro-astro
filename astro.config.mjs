// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD
        ? {
            "react-dom/server": "react-dom/server.edge",
          }
        : undefined,
    },
    ssr: {
      // Añade todos los módulos de Node.js necesarios para API routes
      external: [
        'node:buffer', 
        'node:crypto', 
        'node:fs', 
        'node:path', 
        'node:stream', 
        'node:util',
        'node:events',
        'node:os',
        'node:url',
        'node:querystring',
        'node:worker_threads',
        'react', 
        'react-dom'
      ],
    },
  },
  integrations: [react()],
  output: "server",
  adapter: cloudflare({
    imageService: "compile", // Cambiado de "cloudflare" a "compile" para mejor compatibilidad
    platformProxy: {
      enabled: true, // Emula el entorno Cloudflare durante el desarrollo
      configPath: 'wrangler.toml',
      persist: true,
    },
    // Configuración específica para asegurar que las rutas API funcionen
    routes: {
      extend: {
        include: [{ pattern: '/api/*' }], // Asegura que todas las rutas API sean manejadas por SSR
      }
    },
  }),
  image: { service: passthroughImageService() },
});
