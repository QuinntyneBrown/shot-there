import { OWNER_TOKEN } from '@/tests/support/admin-session';
import { SITE_ORIGIN, ownerHeaders } from '@/tests/support/owner-account';

interface UploadOptions {
  file: Buffer;
  fileName?: string;
  type?: string;
  role?: string;
  studioId?: string;
  spotId?: string;
  signedIn?: boolean;
}

/** A multipart image upload to `POST /api/admin/images`, signed in as the owner unless `signedIn` is false. */
export function uploadRequest({
  file,
  fileName = 'photo.jpg',
  type = 'image/jpeg',
  role = 'gallery',
  studioId,
  spotId,
  signedIn = true,
}: UploadOptions): Request {
  const form = new FormData();
  form.set('file', new File([new Uint8Array(file)], fileName, { type }));
  form.set('role', role);
  if (studioId) form.set('studioId', studioId);
  if (spotId) form.set('spotId', spotId);
  return new Request(`${SITE_ORIGIN}/api/admin/images`, {
    method: 'POST',
    headers: signedIn ? ownerHeaders(OWNER_TOKEN) : { origin: SITE_ORIGIN },
    body: form,
  });
}
