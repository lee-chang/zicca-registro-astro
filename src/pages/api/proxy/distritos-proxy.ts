import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../../utils/cors";
import { getDistritos } from "../../../utils/db";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { idProvincia } = body;

    if (!idProvincia) {
      return applyCorsHeaders(
        new Response(
          JSON.stringify({ error: "El ID de la provincia es necesario" }),
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

    const distritos = await getDistritos(idProvincia);

    return applyCorsHeaders(
      new Response(JSON.stringify(distritos), {
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
        JSON.stringify({ error: "Error al obtener los distritos", details: error.message }),
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
