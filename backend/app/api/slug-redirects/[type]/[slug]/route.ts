import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { findSlugRedirect } from '@/lib/slugs/find-slug-redirect';
import type { SlugRedirectParams } from '@/lib/slugs/slug-redirect-params';
import { slugRedirectParamsSchema } from '@/lib/slugs/schemas';

export const GET = withRequestLogging(async (_request: Request, { params }: SlugRedirectParams) => {
  const parsed = slugRedirectParamsSchema.safeParse(await params);
  if (!parsed.success) return notFound();
  const redirect = await findSlugRedirect(parsed.data.type, parsed.data.slug);
  return redirect ? Response.json(redirect) : notFound();
});
