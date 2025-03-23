// Endpoint para obtener distritos

export async function POST({ request, locals }) {
  try {
    const { idProvincia } = await request.json();
    
    // Aquí implementarías la lógica para obtener distritos de la base de datos
    // Por ahora, devolvemos datos de ejemplo basados en el idProvincia
    const distritos = [
      { idDistrito: "1001", nombre: "Distrito 1 de Provincia " + idProvincia },
      { idDistrito: "1002", nombre: "Distrito 2 de Provincia " + idProvincia },
      { idDistrito: "1003", nombre: "Distrito 3 de Provincia " + idProvincia }
    ];
    
    return new Response(JSON.stringify(distritos), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error al obtener distritos:", error);
    
    return new Response(JSON.stringify({ 
      error: true, 
      message: error.message || "Error al obtener distritos" 
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
