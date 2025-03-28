// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

import vercel from '@astrojs/vercel';

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
        // Módulos que pueden causar problemas en Cloudflare
        'mssql',
        'tedious',
        'tarn',
      ],
      noExternal: ['clsx', 'tailwind-merge'],
    },
    // Optimizaciones adicionales para Cloudflare
    build: {
      minify: false, // Desactivamos la minificación para mejor depuración
    }
  },
  output: "server",
  adapter: vercel(),
  image: { service: passthroughImageService() },
});