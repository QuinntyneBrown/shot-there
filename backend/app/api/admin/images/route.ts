import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { notFound } from '@/lib/http/not-found';
import { readUpload } from '@/lib/images/read-upload';
import { uploadImage } from '@/lib/images/upload-image';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const POST = withRequestLogging(async (request: Request) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const image = await uploadImage(await readUpload(request));
  return image ? Response.json(image, { status: 201 }) : notFound();
});
