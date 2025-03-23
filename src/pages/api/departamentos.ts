import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { obtenerDepartamentosComoOpciones } from "../../helpers/registro-helpers";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Usar la función helper para obtener departamentos como opciones
    const departamentosOpciones = await obtenerDepartamentosComoOpciones();
    
    return applyCorsHeaders(
      new Response(JSON.stringify(departamentosOpciones), {
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
        JSON.stringify({ error: "Error al obtener los departamentos", details: error.message }),
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
