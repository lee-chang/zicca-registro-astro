import { APIRoute } from "astro";
// Cambiamos la importación para usar el servicio de Cloudflare
import { getDistritos } from "../../utils/db-cloudflare";
import { applyCorsHeaders, handleOptions } from "../../utils/cors";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Usar los bindings de Cloudflare si están disponibles
    // const runtime = locals.runtime;
    
    // Obtener el idProvincia del cuerpo de la solicitud
    const body = await request.json();
    const idProvincia = body.idProvincia;
    
    if (!idProvincia) {
      return applyCorsHeaders(
        new Response(
          JSON.stringify("El ID de la provincia es necesario"),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        ), request
      );
    }
    
    // Obtener los distritos para la provincia usando el servicio compatible con Cloudflare
    const distritos = await getDistritos(idProvincia);
    
    // Convertir a formato de opciones
    const options = distritos.map((dist) => ({
      value: dist.idDistrito,
      label: dist.nombre,
    }));
    
    // Devolver respuesta con los datos y CORS headers
    return applyCorsHeaders(
      new Response(JSON.stringify(options), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }), request
    );
  } catch (error) {
    console.error(error);
    return applyCorsHeaders(
      new Response(
        JSON.stringify("Error al obtener la lista de distritos"),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ), request
    );
  }
};
