import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { verificarUsuarioExistente } from "../../helpers/registro-helpers";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tipoIdentidad, nroIdentidad } = body;

    if (!tipoIdentidad || !nroIdentidad) {
      return applyCorsHeaders(
        new Response(
          JSON.stringify({ error: "El tipo y número de identidad son necesarios" }),
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

    // Usar la función helper para verificar si el usuario existe
    const userExists = await verificarUsuarioExistente(tipoIdentidad, nroIdentidad);

    return applyCorsHeaders(
      new Response(
        JSON.stringify({ 
          exists: !!userExists, 
          user: userExists
        }), 
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ),
      request
    );
  } catch (error) {
    console.error(error);
    return applyCorsHeaders(
      new Response(
        JSON.stringify({ error: "Error al verificar el usuario", details: error.message }),
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
