/// <reference types="astro/client" />

type Env = {
  NODE_ENV: string;
  // Añade aquí otras variables de entorno que necesites
};

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    // Puedes añadir propiedades adicionales aquí si lo necesitas
    isCloudflare?: boolean;
    runtime?: any;
  }
}
