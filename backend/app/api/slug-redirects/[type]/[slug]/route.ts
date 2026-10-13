import { notFound } from '@/lib/http/not-found';
import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { findSlugRedirect } from '@/lib/slugs/find-slug-redirect';
import type { SlugRedirectParams } from '@/lib/slugs/slug-redirect-params';
import { slugRedirectParamsSchema } from '@/lib/slugs/schemas';

export const GET = withRequestLogging(async (_request: Request, { params }: SlugRedirectParams) => {
  const { type, slug } = parseWithSchema(slugRedirectParamsSchema, await params);
  const redirect = await findSlugRedirect(type, slug);
  return redirect ? Response.json(redirect) : notFound();
});
