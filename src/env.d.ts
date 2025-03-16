/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DB_SERVER: string;
  readonly DB_DATABASE: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_ENCRYPT: string;
  readonly DB_ENABLE_ARITH_ABORT: string;
  readonly API_BASE_URL: string; // URL del API proxy si decides usarlo
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Tipo para el runtime de Cloudflare
type ENV = {
  // Puedes agregar bindings específicos de Cloudflare aquí si los necesitas
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {
    // Puedes agregar propiedades adicionales aquí
  }
}
