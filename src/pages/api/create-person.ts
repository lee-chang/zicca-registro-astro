import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { postCreateRowInPerson } from "../../utils/db-cloudflare";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      idPersona,
      tipoIdentidad,
      nroIdentidad,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      dir,
      telefonos,
      fechaRegistro
    } = body;

    // Validar campos requeridos
    if (!idPersona || !tipoIdentidad || !nroIdentidad || !nombre || !apellidoPaterno) {
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

    const success = await postCreateRowInPerson(
      idPersona,
      tipoIdentidad,
      nroIdentidad,
      nombre,
      apellidoPaterno,
      apellidoMaterno || "",
      email || "",
      dir || "",
      telefonos || "",
      fechaRegistro
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
        JSON.stringify({ error: "Error al crear la persona", details: error.message }),
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
