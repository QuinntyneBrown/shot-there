/** A 404 with a generic body that leaks no identifiers. */
export function notFound(): Response {
  return Response.json({ status: 404 }, { status: 404 });
}
