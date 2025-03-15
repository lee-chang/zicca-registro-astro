import { APIRoute } from "astro";
import { getDepartamentos } from "../../../utils/db";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Obtener los departamentos de la base de datos
    const departamentos = await getDepartamentos();
    
    // Convertir a formato de opciones
    const options = departamentos.map((depto) => ({
      value: depto.idDepartamento,
      label: depto.nombre,
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
      JSON.stringify("Error al obtener la lista de departamentos", error),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
