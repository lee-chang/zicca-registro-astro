import { APIRoute } from "astro";
import { getProvincias } from "../../../utils/db";

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener el idDepartamento del cuerpo de la solicitud
    const body = await request.json();
    const idDepartamento = body.idDepartamento;
    console.log(idDepartamento);
    
    if (!idDepartamento) {
      return new Response(
        JSON.stringify("El ID del departamento es necesario"),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // Obtener las provincias para el departamento
    const provincias = await getProvincias(idDepartamento);
    
    // Convertir a formato de opciones
    const options = provincias.map((prov) => ({
      value: prov.idProvincia,
      label: prov.nombre,
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
      JSON.stringify("Error al obtener la lista de provincias"),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
