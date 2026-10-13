import { OWNER_TOKEN } from '@/tests/support/admin-session';
import { SITE_ORIGIN, ownerHeaders } from '@/tests/support/owner-account';

interface UploadOptions {
  file: Buffer;
  fileName?: string;
  type?: string;
  role?: string;
  locationKind?: string;
  locationId?: string;
  /** Further form fields, e.g. one the endpoint does not declare. */
  extraFields?: Record<string, string>;
  signedIn?: boolean;
}

/** A multipart image upload to `POST /api/admin/images`, signed in as the owner unless `signedIn` is false. */
export function uploadRequest({
  file,
  fileName = 'photo.jpg',
  type = 'image/jpeg',
  role = 'gallery',
  locationKind,
  locationId,
  extraFields = {},
  signedIn = true,
}: UploadOptions): Request {
  const form = new FormData();
  form.set('file', new File([new Uint8Array(file)], fileName, { type }));
  form.set('role', role);
  if (locationKind) form.set('locationKind', locationKind);
  if (locationId) form.set('locationId', locationId);
  for (const [name, value] of Object.entries(extraFields)) form.set(name, value);
  return new Request(`${SITE_ORIGIN}/api/admin/images`, {
    method: 'POST',
    headers: signedIn ? ownerHeaders(OWNER_TOKEN) : { origin: SITE_ORIGIN },
    body: form,
  });
}
