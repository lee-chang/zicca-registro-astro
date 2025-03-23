import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { lastIdPersonDirection } from "../../utils/db-cloudflare";

export const GET: APIRoute = async ({ request }) => {
  try {
    const lastId = await lastIdPersonDirection();
    
    return applyCorsHeaders(
      new Response(
        JSON.stringify({ lastId }), 
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
        JSON.stringify({ error: "Error al obtener el último ID de dirección de persona", details: error.message }),
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
