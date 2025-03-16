import { APIRoute } from "astro";
// Cambiamos la importación para usar el servicio de Cloudflare
import { getProvincias } from "../../utils/db-cloudflare";
import { applyCorsHeaders, handleOptions } from "../../utils/cors";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Usar los bindings de Cloudflare si están disponibles
    // const runtime = locals.runtime;
    
    // Obtener el idDepartamento del cuerpo de la solicitud
    const body = await request.json();
    const idDepartamento = body.idDepartamento;

    if (!idDepartamento) {
      return applyCorsHeaders(
        new Response(JSON.stringify("El ID del departamento es necesario"), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }),
        request
      );
    }

    // Obtener las provincias para el departamento usando el servicio compatible con Cloudflare
    const provincias = await getProvincias(idDepartamento);

    // Convertir a formato de opciones
    const options = provincias.map((prov) => ({
      value: prov.idProvincia,
      label: prov.nombre,
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
      new Response(JSON.stringify("Error al obtener la lista de provincias"), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      request
    );
  }
};
