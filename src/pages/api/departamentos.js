// Endpoint para obtener departamentos

export async function GET({ request, locals }) {
  try {
    // Aquí implementarías la lógica para obtener departamentos de la base de datos
    // Por ahora, devolvemos datos de ejemplo
    const departamentos = [
      { idDepartamento: "1", nombre: "Lima" },
      { idDepartamento: "2", nombre: "Arequipa" },
      { idDepartamento: "3", nombre: "Cusco" },
      { idDepartamento: "4", nombre: "Trujillo" },
      { idDepartamento: "5", nombre: "Piura" }
    ];
    
    return new Response(JSON.stringify(departamentos), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error al obtener departamentos:", error);
    
    return new Response(JSON.stringify({ 
      error: true, 
      message: error.message || "Error al obtener departamentos" 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
