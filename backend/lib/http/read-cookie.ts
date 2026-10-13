/** The value of the named cookie on the request, or null. */
export function readCookie(request: Request, name: string): string | null {
  for (const pair of (request.headers.get('cookie') ?? '').split(';')) {
    const separator = pair.indexOf('=');
    if (separator > 0 && pair.slice(0, separator).trim() === name) return pair.slice(separator + 1).trim() || null;
  }
  return null;
}
