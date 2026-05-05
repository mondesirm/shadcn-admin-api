// Lightweight helper for constructing JSON Responses in serverless functions.
// Avoids relying on a non-standard static Response.json factory.
export function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
}
