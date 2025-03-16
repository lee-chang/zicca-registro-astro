import sql from "mssql";

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

interface Persona {
  idPersona: number;
  idTipoIdentidad: number;
  idTipoPersona: number;
  nombres: string;
  apellidoPaterno: string;
  nroIdentidad: string;
  apellidoMaterno: string;
  idEstado: number;
  correoelectronico: string;
  direccion: string;
  telefonos: string;
  idEmpresa: number;
  fechaRegistro: Date;
  [key: string]: any;
}

interface PersonaDireccion {
  idPersonaDireccion: number;
  idPersona: number;
  idDepartamento: number;
  idProvincia: number;
  idDistrito: number;
  referencia: string;
  direccion: string;
  esPredeterminado: number;
  idEstado: number;
  [key: string]: any;
}

// Configuración de la base de datos usando variables de entorno
const dbConfig: sql.config = {
  server: import.meta.env.DB_SERVER || "",
  database: import.meta.env.DB_DATABASE || "",
  user: import.meta.env.DB_USER || "",
  password: import.meta.env.DB_PASSWORD || "",
  options: {
    encrypt: import.meta.env.DB_ENCRYPT === "true",
  },
};

export async function getDepartamentos(): Promise<Departamento[]> {
  console.log(dbConfig);
  const pool = await sql.connect(dbConfig);
  try {
    const query = "SELECT * FROM MAN.Departamento";
    const result = await sql.query(query);
    await pool.close();
    return result.recordset;
  } catch (error) {
    console.error(error);
    await pool.close();
    return [];
  }
}

export async function getProvincias(
  idDepartamento: number
): Promise<Provincia[]> {
  const pool = await sql.connect(dbConfig);
  try {
    const query = `SELECT DISTINCT idProvincia, nombre FROM MAN.Provincia WHERE idDepartamento = @idDepartamento`;
    const result = await pool
      .request()
      .input("idDepartamento", sql.Int, idDepartamento)
      .query(query);
    await pool.close();
    return result.recordset;
  } catch (error) {
    console.error(error);
    await pool.close();
    return [];
  }
}

export async function getDistritos(idProvincia: number): Promise<Distrito[]> {
  const pool = await sql.connect(dbConfig);
  try {
    const query = `SELECT * FROM MAN.Distrito WHERE idProvincia=${idProvincia}`;

    const result = await pool.request().query(query);
    await pool.close();
    return result.recordset;
  } catch (error) {
    console.error(error);
    await pool.close();
    return [];
  }
}

export async function lastIdPerson(): Promise<number> {
  const pool = await sql.connect(dbConfig);
  try {
    const query =
      "SELECT * FROM MAN.Persona WHERE idPersona = (SELECT MAX(idPersona) FROM MAN.Persona)";

    const result = await pool.request().query(query);
    await pool.close();
    return result.recordset[0].idPersona;
  } catch (error) {
    console.error(error);
    await pool.close();
    return 0;
  }
}

export async function lastIdPersonDirection(): Promise<number> {
  const pool = await sql.connect(dbConfig);
  try {
    const query =
      "SELECT * FROM MAN.PersonaDireccion WHERE idPersonaDireccion = (SELECT MAX(idPersonaDireccion) FROM MAN.PersonaDireccion)";

    const result = await pool.request().query(query);
    await pool.close();
    return result.recordset[0].idPersonaDireccion;
  } catch (error) {
    console.error(error);
    await pool.close();
    return 0;
  }
}

export async function existUser(
  tipoIdentidad: number,
  nroIdentidad: string
): Promise<Persona[] | false> {
  const pool = await sql.connect(dbConfig);
  try {
    const request = pool.request();

    request.input("tipoIdentidad", sql.SmallInt, tipoIdentidad);
    request.input("nroIdentidad", sql.VarChar(20), nroIdentidad);

    const result = await request.query(
      "SELECT * FROM MAN.Persona WHERE nroIdentidad = @nroIdentidad AND idTipoIdentidad = @tipoIdentidad AND idEstado = 1"
    );
    await pool.close();
    const response = result.recordset.length > 0 ? result.recordset : false;
    return response;
  } catch (error) {
    console.error(error);
    await pool.close();
    return false;
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
  const pool = await sql.connect(dbConfig);
  try {
    const request = pool.request();

    request.input("idPersona", sql.Int, idPersona);
    request.input("tipoIdentidad", sql.SmallInt, tipoIdentidad);
    request.input("nroIdentidad", sql.VarChar(20), nroIdentidad);
    request.input("nombre", sql.VarChar(100), nombre);
    request.input("apellidoPaterno", sql.VarChar(100), apellidoPaterno);
    request.input("apellidoMaterno", sql.VarChar(100), apellidoMaterno);
    request.input("email", sql.VarChar(60), email);
    request.input("dir", sql.VarChar(500), dir);
    request.input("telefonos", sql.VarChar(100), telefonos);
    request.input("fechaRegistro", sql.DateTime, fechaRegistro);

    const result = await request.query(
      "SET IDENTITY_INSERT [MAN].[Persona] ON " +
        " INSERT INTO [MAN].[Persona] (idPersona,idTipoIdentidad,idTipoPersona,nombres,apellidoPaterno,nroIdentidad,apellidoMaterno,idEstado,correoelectronico,direccion,telefonos,idEmpresa,fechaRegistro) " +
        " VALUES(@idPersona,@tipoIdentidad,'150',@nombre,@apellidoPaterno,@nroIdentidad,@apellidoMaterno,'1',@email,@dir,@telefonos,'14',@fechaRegistro) " +
        " SET IDENTITY_INSERT [MAN].[Persona] OFF"
    );
    await pool.close();
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error(error);
    await pool.close();
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
  const pool = await sql.connect(dbConfig);
  try {
    const request = pool.request();

    request.input("idPersonaDireccion", sql.Int, idPersonaDireccion);
    request.input("idPersona", sql.Int, idPersona);
    request.input("idDepartamento", sql.Int, idDepartamento);
    request.input("idProvincia", sql.Int, idProvincia);
    request.input("idDistrito", sql.Int, idDistrito);
    request.input("dir", sql.VarChar(500), dir);

    const result = await request.query(
      "SET IDENTITY_INSERT [MAN].[PersonaDireccion] ON " +
        " INSERT INTO [MAN].[PersonaDireccion] (idPersonaDireccion,idPersona,idDepartamento,idProvincia,idDistrito,referencia,direccion,esPredeterminado,idEstado) " +
        " VALUES(@idPersonaDireccion,@idPersona,@idDepartamento,@idProvincia,@idDistrito,@dir,@dir,1,1) " +
        " SET IDENTITY_INSERT [MAN].[PersonaDireccion] OFF"
    );
    await pool.close();
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error(error);
    await pool.close();
    return false;
  }
}
