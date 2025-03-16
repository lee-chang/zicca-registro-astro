import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
// Cambiamos la importación para usar el servicio de Cloudflare
import { getDepartamentos } from "../../utils/db-cloudflare";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Usar los bindings de Cloudflare si están disponibles
    // const runtime = locals.runtime;

    // Obtener los departamentos usando el servicio compatible con Cloudflare
    const departamentos = await getDepartamentos();
    
    // Convertir a formato de opciones
    const options = departamentos.map((dep) => ({
      value: dep.idDepartamento,
      label: dep.nombre,
    }));

    // Devolver respuesta con los datos y CORS headers
    return applyCorsHeaders(
      new Response(JSON.stringify(options), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      request
    );
  } catch (error) {
    console.error(error);
    return applyCorsHeaders(
      new Response(
        JSON.stringify("Error al obtener la lista de departamentos"),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      request
    );
  }
};
