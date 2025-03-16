/**
 * Genera encabezados CORS permitiendo cualquier origen
 */
export function getCorsHeaders(request: Request) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Maneja solicitudes OPTIONS para el preflight CORS
 */
export function handleOptions(request: Request) {
  const corsHeaders = getCorsHeaders(request);
  
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

/**
 * Aplica encabezados CORS a una respuesta existente
 */
export function applyCorsHeaders(response: Response, request: Request): Response {
  const corsHeaders = getCorsHeaders(request);
  const newResponse = new Response(response.body, response);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });
  
  return newResponse;
}
