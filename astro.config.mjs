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
      // Añade aquí cualquier módulo de Node.js que necesites
      external: ['node:buffer', 'node:crypto', 'node:fs', 'node:path', 'node:stream', 'node:util'],
    },
  },
  integrations: [react()],
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true, // Emula el entorno Cloudflare durante el desarrollo
    },
    routes: {
      extend: {
        include: [
          { pattern: '/api/*' }, // Asegura que todas las rutas API se procesen correctamente
        ],
      }
    },
    // Habilitamos el soporte para módulos Cloudflare (.wasm, .bin, .txt)
    cloudflareModules: true,
  }),
  image: { service: passthroughImageService() },
});
