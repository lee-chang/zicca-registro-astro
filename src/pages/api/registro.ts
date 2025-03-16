import { APIRoute } from "astro";
// Cambiamos las importaciones para usar el servicio de Cloudflare
import {
  existUser,
  lastIdPerson,
  lastIdPersonDirection,
  postCreateRowInDirectionPerson,
  postCreateRowInPerson,
} from "../../utils/db-cloudflare";
import { applyCorsHeaders, handleOptions } from "../../utils/cors";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Usar los bindings de Cloudflare si están disponibles
    // const runtime = locals.runtime;
    
    // Obtener valores de la solicitud POST
    const {
      tipoIdentidad,
      nombre,
      apellidoPaterno,
      nroIdentidad,
      apellidoMaterno,
      email,
      telefonos,
      departamentos,
      provincias,
      distritos,
      referencia,
      direccion,
    } = await request.json();

    // Verificar si el usuario ya existe
    const isExistUser = await existUser(tipoIdentidad, nroIdentidad);
    // console.log(isExistUser);
    if (isExistUser) throw new Error("El usuario ya existe");

    // Obtener el id de la persona
    const idPersona = (await lastIdPerson()) + 1;

    // Obtener el id de la persona dirección
    const idPersonaDireccion = (await lastIdPersonDirection()) + 1;

    // Obtener la fecha de registro
    const fechaRegistro = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const newDireccion = direccion + ". Referencia: " + referencia;

    // Insertar los datos en la tabla Persona usando el servicio compatible con Cloudflare
    const resCreatePerson = await postCreateRowInPerson(
      idPersona,
      tipoIdentidad,
      nroIdentidad,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      newDireccion,
      telefonos,
      fechaRegistro
    );

    // Insertar los datos en la tabla PersonaDirección usando el servicio compatible con Cloudflare
    const resCreateDirectionPerson = await postCreateRowInDirectionPerson(
      idPersonaDireccion,
      idPersona,
      departamentos,
      provincias,
      distritos,
      newDireccion
    );

    if (!resCreatePerson)
      throw new Error("Error al insertar los datos personales");
    if (!resCreateDirectionPerson)
      throw new Error("Error al insertar los datos de dirección");

    // Aplicar CORS a la respuesta exitosa
    return applyCorsHeaders(new Response("OK", { status: 200 }), request);
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);

    let message = err.message ? err.message : "Error al insertar los datos";
    // Aplicar CORS a la respuesta de error
    return applyCorsHeaders(new Response(message, { status: 500 }), request);
  }
};
