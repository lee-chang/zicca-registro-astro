// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Módulos de Node.js con prefijo node:
      external: [
        'node:timers',
        'node:stream',
        'node:crypto',
        'node:os',
        'node:tls',
        'node:net',
        'node:dns',
        'node:constants',
        'node:util',
        'node:dgram',
        'node:url',
        'node:buffer',
        'node:events',
        'node:fs',
        'node:path',
        'node:querystring',
        'node:worker_threads',
      ],
    },
    // Optimizaciones adicionales para Cloudflare
    build: {
      minify: false, // Desactivamos la minificación para mejor depuración
    }
  },
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml',
      persist: true,
    },
  }),
  image: { service: passthroughImageService() },
});
