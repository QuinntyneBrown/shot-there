import { notFound } from '@/lib/http/not-found';
import type { SlugParams } from '@/lib/http/slug-params';
import { withRequestLogging } from '@/lib/logging/with-request-logging';
import { getStudio } from '@/lib/studios/get-studio';

export const GET = withRequestLogging(async (_request: Request, { params }: SlugParams) => {
  const studio = await getStudio((await params).slug);
  return studio ? Response.json(studio) : notFound();
});
