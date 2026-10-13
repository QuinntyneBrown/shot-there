const PRIVATE_PREFIXES = ['/api/auth/', '/api/admin/', '/api/subscribers', '/api/health'];

/** The ICD §10 `Cache-Control` value: public reads that succeed or miss are cacheable for 60 s, everything else is never stored. */
export function cachePolicy(method: string, path: string, status: number): string {
  const publicRead =
    method === 'GET' && (status === 200 || status === 404) && !PRIVATE_PREFIXES.some((prefix) => path.startsWith(prefix));
  return publicRead ? 'public, max-age=60' : 'no-store';
}
