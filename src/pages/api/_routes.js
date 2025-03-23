// Este archivo ayuda a Astro a identificar correctamente el directorio de API
export function GET() {
  return new Response(JSON.stringify({
    message: "API routes configured correctly"
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
