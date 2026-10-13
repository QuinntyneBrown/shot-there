import { requireOwnerSession } from '@/lib/auth/require-owner-session';
import { verifyCsrf } from '@/lib/auth/verify-csrf';
import { notFound } from '@/lib/http/not-found';
import { readUpload } from '@/lib/images/read-upload';
import { toImageDto } from '@/lib/images/to-image-dto';
import { uploadImage } from '@/lib/images/upload-image';
import type { UploadedImageDto } from '@/lib/images/uploaded-image-dto';
import { withRequestLogging } from '@/lib/logging/with-request-logging';

export const POST = withRequestLogging(async (request: Request) => {
  verifyCsrf(request, await requireOwnerSession(request));
  const image = await uploadImage(await readUpload(request));
  if (!image) return notFound();
  const body: UploadedImageDto = { imageId: image.id, role: image.role, preview: toImageDto(image) };
  return Response.json(body, { status: 201, headers: { location: `/api/admin/images/${image.id}` } });
});
