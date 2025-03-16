import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Verificamos si estamos en el entorno de Cloudflare
  // if (context.locals.runtime) {
  //   // Agregar información del entorno a locals para usar en los componentes/endpoints
  //   context.locals.isCloudflare = true;
  // } else {
  //   context.locals.isCloudflare = false;
  // }
  
  // Permitimos todas las solicitudes API
  if (context.request.url.includes('/api/')) {
    return next();
  }
  
  // Para solicitudes no-API que no sean GET, verificamos el origen
  if (context.request.method !== "GET") {
    const originHeader = context.request.headers.get("Origin");
    const hostHeader = context.request.headers.get("Host");
    if (
      !originHeader ||
      !hostHeader ||
      !verifyRequestOrigin(originHeader, [hostHeader])
    ) {
      return new Response(null, {
        status: 403,
      });
    }
  }

  return next();
});

// Necesitamos agregar esta función que estaba siendo usada pero no estaba definida
function verifyRequestOrigin(origin: string, allowedHosts: string[]): boolean {
  try {
    const url = new URL(origin);
    return allowedHosts.some(host => url.host === host);
  } catch {
    return false;
  }
}
