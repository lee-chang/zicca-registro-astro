import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../../utils/cors";
import { postCreateRowInDirectionPerson } from "../../../utils/db";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      idPersonaDireccion,
      idPersona,
      idDepartamento,
      idProvincia,
      idDistrito,
      dir
    } = body;

    // Validar campos requeridos
    if (!idPersonaDireccion || !idPersona || !idDepartamento || !idProvincia || !idDistrito) {
      return applyCorsHeaders(
        new Response(
          JSON.stringify({ error: "Faltan campos requeridos" }),
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

    const success = await postCreateRowInDirectionPerson(
      idPersonaDireccion,
      idPersona,
      idDepartamento,
      idProvincia,
      idDistrito,
      dir || ""
    );

    return applyCorsHeaders(
      new Response(
        JSON.stringify({ success }), 
        {
          status: success ? 200 : 500,
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
        JSON.stringify({ error: "Error al crear la dirección de la persona", details: error.message }),
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
