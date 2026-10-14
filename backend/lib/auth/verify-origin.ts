import { HttpProblem } from '@/lib/http/http-problem';

/** Refuses with 403 unless the request's `Origin` is the site's own (ICD S-2, S-3). */
export function verifyOrigin(request: Request): void {
  const siteOrigin = process.env.SITE_ORIGIN;
  if (!siteOrigin || request.headers.get('origin') !== siteOrigin) {
    throw new HttpProblem(403, 'urn:shotthere:problem:csrf-rejected');
  }
}
