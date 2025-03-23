export function GET(context) {
  const { runtime } = context.locals;
  
  return new Response(JSON.stringify({
    message: "La API está funcionando correctamente",
    env: runtime.env.NODE_ENV
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
