import { notFound } from '@/lib/http/not-found';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

/** Any API path that matches no route answers a 404 problem (ICD §9.1). */
const unknownRoute = withRequestLogging(async () => notFound());

export const GET = unknownRoute;
export const POST = unknownRoute;
export const PUT = unknownRoute;
export const DELETE = unknownRoute;
