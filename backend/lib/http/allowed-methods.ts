/** Each API route's methods, in the order they are listed in `Allow` (ICD T-5). */
const ROUTE_METHODS: ReadonlyArray<readonly [RegExp, string]> = [
  [/^\/api\/admin\/(studios|spots|guides)$/, 'GET, POST'],
  [/^\/api\/admin\/(studios|spots|guides)\/[^/]+$/, 'GET, PUT, DELETE'],
  [/^\/api\/admin\/(studios|spots|guides)\/[^/]+\/publish$/, 'POST, DELETE'],
  [/^\/api\/admin\/(dashboard|guide-candidates)$/, 'GET'],
  [/^\/api\/admin\/images$/, 'POST'],
  [/^\/api\/admin\/images\/[^/]+$/, 'DELETE'],
  [/^\/api\/auth\/(sign-in|sign-out)$/, 'POST'],
  [/^\/api\/subscribers$/, 'POST'],
  [/^\/api\/(studios|spots|guides)(\/[^/]+)?$/, 'GET'],
  [/^\/api\/(auth\/session|compare|health|map\/locations|public-routes|sitemap-entries)$/, 'GET'],
  [/^\/api\/slug-redirects\/[^/]+\/[^/]+$/, 'GET'],
];

/** The `Allow` value of the route at this path, or null when no route matches. */
export function allowedMethods(path: string): string | null {
  return ROUTE_METHODS.find(([pattern]) => pattern.test(path))?.[1] ?? null;
}
