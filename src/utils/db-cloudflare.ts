// Este servicio utilizará fetch para comunicarse con una API externa o un servicio proxy
// ya que no podemos usar 'mssql' directamente en Cloudflare Workers

// Interfaces para las entidades
interface Departamento {
  idDepartamento: number;
  nombre: string;
  [key: string]: any;
}

interface Provincia {
  idProvincia: number;
  nombre: string;
  idDepartamento: number;
  [key: string]: any;
}

interface Distrito {
  idDistrito: number;
  nombre: string;
  idProvincia: number;
  [key: string]: any;
}

// URL base para las solicitudes de API (podría ser una API proxy que tú mismo implementes)
// O podría ser un servicio como Supabase, Firebase, etc.
const API_BASE_URL = import.meta.env.API_BASE_URL || 
  "https://registro.zicca.pe/api"; // Reemplaza con tu URL real

// Utilidad para manejar errores
const handleFetchError = (error: any) => {
  console.error("Error en la solicitud:", error);
  throw new Error(`Error en la solicitud: ${error.message}`);
};

// Implementaciones que usan fetch en lugar de conexión directa a SQL
export async function getDepartamentos(): Promise<Departamento[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/departamentos`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProvincias(idDepartamento: number): Promise<Provincia[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/provincias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idDepartamento })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDistritos(idProvincia: number): Promise<Distrito[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/distritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idProvincia })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function existUser(
  tipoIdentidad: number,
  nroIdentidad: string
): Promise<any | false> {
  try {
    const response = await fetch(`${API_BASE_URL}/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipoIdentidad, nroIdentidad })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.exists ? data.user : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function lastIdPerson(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/last-id-person`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.lastId;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function lastIdPersonDirection(): Promise<number> {
  try {
    const response = await fetch(`${API_BASE_URL}/last-id-person-direction`);
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.lastId;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export async function postCreateRowInPerson(
  idPersona: number,
  tipoIdentidad: number,
  nroIdentidad: string,
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  email: string,
  dir: string,
  telefonos: string,
  fechaRegistro: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/create-person`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPersona, tipoIdentidad, nroIdentidad, nombre, apellidoPaterno,
        apellidoMaterno, email, dir, telefonos, fechaRegistro
      })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function postCreateRowInDirectionPerson(
  idPersonaDireccion: number,
  idPersona: number,
  idDepartamento: number,
  idProvincia: number,
  idDistrito: number,
  dir: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/create-person-direction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPersonaDireccion, idPersona, idDepartamento,
        idProvincia, idDistrito, dir
      })
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error(error);
    return false;
  }
}
