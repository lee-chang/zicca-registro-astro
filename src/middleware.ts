import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  // Agregar información del entorno a locals de manera segura
  try {
    // Verificar si estamos en entorno Cloudflare de forma segura
    // En lugar de depender de runtime, usaremos una aproximación más robusta
    context.locals.isCloudflare = typeof context.locals.runtime !== 'undefined';
    
    // Obtener información del entorno de manera segura
    const isDev = typeof import.meta.env.DEV !== 'undefined' 
      ? import.meta.env.DEV 
      : (import.meta.env.MODE === 'development');
    
    // Para solicitudes API, envolver en try-catch para mejor depuración
    if (context.request.url.includes('/api/')) {
      try {
        return await next();
      } catch (error) {
        console.error('Error en API:', error);
        
        // Convertir cualquier error a un objeto Error
        const err = error instanceof Error ? error : new Error(String(error));
        
        // Devolver respuesta de error para depuración
        return new Response(
          JSON.stringify({
            error: 'Error interno del servidor',
            message: err.message,
            stack: isDev ? err.stack : undefined
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }
    }

    // Para solicitudes OPTIONS (CORS preflight), responder inmediatamente
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
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
        return new Response('Origen no permitido', {
          status: 403,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }

    return next();
  } catch (error) {
    console.error('Error en middleware:', error);
    
    // Para errores no controlados, devolver un error 500
    return new Response('Error interno del servidor', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});

// Verificar origen de la solicitud de manera segura
function verifyRequestOrigin(origin: string, allowedHosts: string[]): boolean {
  try {
    const url = new URL(origin);
    return allowedHosts.some(host => {
      // Manejar hosts con o sin puertos
      const hostOnly = host.split(':')[0];
      return url.host === host || url.host.startsWith(hostOnly + ':');
    });
  } catch {
    return false;
  }
}
