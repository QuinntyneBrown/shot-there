const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const CORRELATION_HEADER = 'x-correlation-id';

/** The request's own correlation ID when it is a UUID, otherwise a new UUID v4 (ICD O-2). */
export function correlationIdFor(request: Request): string {
  const incoming = request.headers.get(CORRELATION_HEADER);
  return incoming && UUID.test(incoming) ? incoming : crypto.randomUUID();
}
