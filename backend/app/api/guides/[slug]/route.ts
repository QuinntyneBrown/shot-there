import { getGuide } from '@/lib/guides/get-guide';
import { notFound } from '@/lib/http/not-found';
import type { SlugParams } from '@/lib/http/slug-params';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (_request: Request, { params }: SlugParams) => {
  const guide = await getGuide((await params).slug);
  return guide ? Response.json(guide) : notFound();
});
