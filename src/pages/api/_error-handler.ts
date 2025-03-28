import { applyCorsHeaders } from "../../utils/cors";

/**
 * Utilidad para manejar errores de API de manera consistente
 */
export function handleApiError(error: unknown, request: Request) {
  // Asegurar que tenemos un objeto de error para trabajar
  const err = error instanceof Error ? error : new Error(String(error));
  
  console.error("Error en API:", err);
  
  // Determinar si es un error de cliente (400) o servidor (500)
  const errorMessage = err.message.toLowerCase();
  const isClientError = 
    errorMessage.includes('ya existe') || 
    errorMessage.includes('requerido') ||
    errorMessage.includes('inválido') ||
    errorMessage.includes('no encontrado') ||
    errorMessage.includes('obligatorio') ||
    errorMessage.includes('necesario');
  
  const status = isClientError ? 400 : 500;
  
  // En desarrollo, incluir más detalles para depuración
  // Usar true por defecto si no podemos determinar el modo
  const env = (import.meta as any).env;
  const isDev = typeof env.DEV !== 'undefined' 
    ? env.DEV 
    : (env.MODE === 'development');
  
  // Crear un objeto de detalles seguro (evitando información sensible en producción)
  const details = isDev ? {
    message: err.message,
    stack: err.stack,
    name: err.name
  } : undefined;
  
  // Respuesta amigable y segura
  return applyCorsHeaders(
    new Response(
      JSON.stringify({ 
        error: err.message || "Error del servidor", 
        details: details
      }),
      {
        status: status,
        headers: {
          "Content-Type": "application/json",
        },
      }
    ),
    request
  );
}
