import { APIRoute } from "astro";
import { getDistritos } from "../../../utils/db";

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener el idProvincia del cuerpo de la solicitud
    const body = await request.json();
    const idProvincia = body.idProvincia;
    
    if (!idProvincia) {
      return new Response(
        JSON.stringify("El ID de la provincia es necesario"),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Obtener los distritos para la provincia
    const distritos = await getDistritos(idProvincia);
    
    // Convertir a formato de opciones
    const options = distritos.map((dist) => ({
      value: dist.idDistrito,
      label: dist.nombre,
    }));
    
    // Devolver respuesta con los datos
    return new Response(JSON.stringify(options), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify("Error al obtener la lista de distritos"),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
