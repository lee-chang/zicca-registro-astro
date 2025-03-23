import { APIRoute } from "astro";
import { applyCorsHeaders } from "../../utils/cors";
import { registrarUsuarioCompleto } from "../../helpers/registro-helpers";

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener valores de la solicitud POST
    const datosUsuario = await request.json();

    // Usar la función helper para registrar al usuario
    const resultado = await registrarUsuarioCompleto(datosUsuario);

    // Aplicar CORS a la respuesta exitosa
    return applyCorsHeaders(
      new Response(
        JSON.stringify({ 
          success: true, 
          message: "Registro completado exitosamente",
          data: resultado
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      ),
      request
    );
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    const message = err.message ? err.message : "Error al insertar los datos";
    
    return applyCorsHeaders(
      new Response(
        JSON.stringify({ error: message }),
        { 
          status: err.message?.includes("ya existe") ? 400 : 500, 
          headers: { "Content-Type": "application/json" } 
        }
      ),
      request
    );
  }
};
