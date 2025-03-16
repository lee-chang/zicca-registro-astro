import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../../utils/cors";
import { getDepartamentos } from "../../../utils/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    const departamentos = await getDepartamentos();
    
    return applyCorsHeaders(
      new Response(JSON.stringify(departamentos), {
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
