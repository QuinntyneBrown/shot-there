import { getComparison } from '@/lib/compare/get-comparison';
import { compareQuerySchema } from '@/lib/compare/schemas';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const GET = withRequestLogging(async (request: Request) => {
  const { studios } = compareQuerySchema.parse({ studios: new URL(request.url).searchParams.get('studios') ?? undefined });
  return Response.json(await getComparison(studios));
});
