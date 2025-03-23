// Importamos directamente desde db.ts para evitar bucles cuando lo usamos en endpoints API
import {
  existUser,
  lastIdPerson,
  lastIdPersonDirection,
  postCreateRowInDirectionPerson,
  postCreateRowInPerson,
  getDepartamentos,
  getProvincias,
  getDistritos
} from "../utils/db";

// Función para obtener los departamentos y formatearlos como opciones
export async function obtenerDepartamentosComoOpciones() {
  const departamentos = await getDepartamentos();
  return departamentos.map((dep) => ({
    value: dep.idDepartamento,
    label: dep.nombre,
  }));
}

// Función para obtener las provincias y formatearlas como opciones
export async function obtenerProvinciasComoOpciones(idDepartamento: number) {
  if (!idDepartamento) {
    throw new Error("El ID del departamento es necesario");
  }
  
  const provincias = await getProvincias(idDepartamento);
  return provincias.map((prov) => ({
    value: prov.idProvincia,
    label: prov.nombre,
  }));
}

// Función para obtener los distritos y formatearlos como opciones
export async function obtenerDistritosComoOpciones(idProvincia: number) {
  if (!idProvincia) {
    throw new Error("El ID de la provincia es necesario");
  }
  
  const distritos = await getDistritos(idProvincia);
  return distritos.map((dist) => ({
    value: dist.idDistrito,
    label: dist.nombre,
  }));
}

// Función para verificar si un usuario existe
export async function verificarUsuarioExistente(tipoIdentidad: number, nroIdentidad: string) {
  return await existUser(tipoIdentidad, nroIdentidad);
}

// Función para registrar un nuevo usuario completo (persona y dirección)
export async function registrarUsuarioCompleto(datosUsuario: {
  tipoIdentidad: number;
  nombre: string;
  apellidoPaterno: string;
  nroIdentidad: string;
  apellidoMaterno?: string;
  email?: string;
  telefonos?: string;
  departamentos: number;
  provincias: number;
  distritos: number;
  referencia?: string;
  direccion: string;
}) {
  // Verificar si el usuario ya existe
  const isExistUser = await existUser(datosUsuario.tipoIdentidad, datosUsuario.nroIdentidad);
  if (isExistUser) {
    throw new Error("El usuario ya existe");
  }

  // Obtener los IDs
  const idPersona = (await lastIdPerson()) + 1;
  const idPersonaDireccion = (await lastIdPersonDirection()) + 1;

  // Obtener la fecha de registro
  const fechaRegistro = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Combinar dirección y referencia
  const newDireccion = datosUsuario.direccion + 
    (datosUsuario.referencia ? ". Referencia: " + datosUsuario.referencia : "");

  // Insertar los datos en la tabla Persona
  const resCreatePerson = await postCreateRowInPerson(
    idPersona,
    datosUsuario.tipoIdentidad,
    datosUsuario.nroIdentidad,
    datosUsuario.nombre,
    datosUsuario.apellidoPaterno,
    datosUsuario.apellidoMaterno || "",
    datosUsuario.email || "",
    newDireccion,
    datosUsuario.telefonos || "",
    fechaRegistro
  );

  // Insertar los datos en la tabla PersonaDirección
  const resCreateDirectionPerson = await postCreateRowInDirectionPerson(
    idPersonaDireccion,
    idPersona,
    datosUsuario.departamentos,
    datosUsuario.provincias,
    datosUsuario.distritos,
    newDireccion
  );

  if (!resCreatePerson) {
    throw new Error("Error al insertar los datos personales");
  }
  
  if (!resCreateDirectionPerson) {
    throw new Error("Error al insertar los datos de dirección");
  }

  return {
    success: true,
    idPersona,
    idPersonaDireccion
  };
}
