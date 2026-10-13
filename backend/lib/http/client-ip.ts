/** The client address from the first `x-forwarded-for` entry set by the CDN, or `unknown`. */
export function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}
