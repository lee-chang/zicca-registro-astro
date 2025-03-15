import { APIRoute } from "astro";
import {
  existUser,
  lastIdPerson,
  lastIdPersonDirection,
  postCreateRowInDirectionPerson,
  postCreateRowInPerson,
} from "../../../utils/db";

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
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

    // Insertar los datos en la tabla Persona
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

    // Insertar los datos en la tabla PersonaDirección
    const resCreateDirectionPerson = await postCreateRowInDirectionPerson(
      idPersonaDireccion,
      idPersona,
      departamentos,
      provincias,
      distritos,
      newDireccion
    );

    // console.log({idPersona,idPersonaDireccion,fechaRegistro, tipoIdentidad, nroIdentidad, nombre, apellidoPaterno, apellidoMaterno, email, newDireccion, telefonos, departamentos, provincias, distritos});

    // console.log(resCreatePerson);
    // console.log(resCreateDirectionPerson);

    if (!resCreatePerson)
      throw new Error("Error al insertar los datos personales");
    if (!resCreateDirectionPerson)
      throw new Error("Error al insertar los datos de dirección");

    // Ejemplo de respuesta en caso de éxito
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Error al ejecutar la consulta:", err);
    // Ejemplo de respuesta en caso de error

    let message = err.message ? err.message : "Error al insertar los datos";
    return new Response(message, { status: 500 });
  }
};
