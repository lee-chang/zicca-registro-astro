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

// Esta variable se usa para determinar si estamos ejecutando en el servidor o en el cliente
// En un servidor Astro, import.meta.env.SSR será true
const isServer = import.meta.env.SSR === true;

// URL base para las solicitudes de API
// En el cliente usamos la URL relativa, en el servidor usamos la URL completa
const API_BASE_URL = isServer
  ? `${import.meta.env.PUBLIC_API_URL || import.meta.env.SITE || "http://localhost:4321"}/api`
  : "/api";

// IMPORTANTE: Evitar bucle infinito al detectar si estamos siendo llamados desde una API
// Si estamos en servidor y detectamos que venimos desde una API (comprobando la URL),
// usaremos la versión directa de las funciones (db.ts)
import * as directDb from "./db";

// Utilidad para manejar errores
const handleFetchError = (error: any) => {
  console.error("Error en la solicitud:", error);
  throw new Error(`Error en la solicitud: ${error.message}`);
};

// Función para determinar si estamos siendo llamados desde un endpoint de API
// para evitar el bucle infinito
function isCalledFromApiEndpoint() {
  // Solo relevante en el servidor
  if (!isServer) return false;
  
  try {
    // En Astro, podemos intentar analizar la pila de llamadas
    const stackTrace = new Error().stack || '';
    const isApi = stackTrace.includes('/api/') && stackTrace.includes('.ts');
    
    // Verificar si estamos en una ruta de API (esto es más confiable en Cloudflare)
    const currentUrl = new URL(import.meta.url);
    const isApiUrl = currentUrl.pathname.includes('/api/');
    
    return isApi || isApiUrl;
  } catch (error) {
    console.error('Error al detectar API endpoint:', error);
    return false;
  }
}

// Implementaciones que evitan bucles infinitos
export async function getDepartamentos(): Promise<Departamento[]> {
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.getDepartamentos();
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.getProvincias(idDepartamento);
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.getDistritos(idProvincia);
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.existUser(tipoIdentidad, nroIdentidad);
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.lastIdPerson();
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.lastIdPersonDirection();
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.postCreateRowInPerson(
      idPersona, 
      tipoIdentidad, 
      nroIdentidad, 
      nombre, 
      apellidoPaterno,
      apellidoMaterno, 
      email, 
      dir, 
      telefonos, 
      fechaRegistro
    );
  }
  
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
  // Si estamos en un endpoint API, usar la versión directa para evitar el bucle
  if (isCalledFromApiEndpoint()) {
    return directDb.postCreateRowInDirectionPerson(
      idPersonaDireccion,
      idPersona,
      idDepartamento,
      idProvincia,
      idDistrito,
      dir
    );
  }
  
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
