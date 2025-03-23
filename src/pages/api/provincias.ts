import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { obtenerProvinciasComoOpciones } from "../../helpers/registro-helpers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { idDepartamento } = body;

    if (!idDepartamento) {
      return applyCorsHeaders(
        new Response(
          JSON.stringify({ error: "El ID del departamento es necesario" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
        request
      );
    }

    // Usar la función helper para obtener provincias como opciones
    const provinciasOpciones = await obtenerProvinciasComoOpciones(idDepartamento);

    return applyCorsHeaders(
      new Response(JSON.stringify(provinciasOpciones), {
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
        JSON.stringify({ error: "Error al obtener las provincias", details: error.message }),
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
