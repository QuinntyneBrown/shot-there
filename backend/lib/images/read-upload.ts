import { parseWithSchema } from '@/lib/http/parse-with-schema';
import { payloadTooLarge } from '@/lib/http/payload-too-large';
import { validationFailed } from '@/lib/http/validation-failed';
import { MAX_UPLOAD_BYTES } from '@/lib/images/max-upload-bytes';
import { uploadFieldsSchema } from '@/lib/images/schemas';
import type { UploadImageInput } from '@/lib/images/upload-image-input';

/** Reads the body, stopping at 20 MB whatever Content-Length claims. */
async function readBody(request: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (request.body) {
    const reader = request.body.getReader();
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      size += chunk.value.byteLength;
      if (size > MAX_UPLOAD_BYTES) {
        reader.releaseLock();
        throw payloadTooLarge();
      }
      chunks.push(chunk.value);
    }
  }
  return Buffer.concat(chunks);
}

/** Reads a multipart image upload, or throws 413 or 400. */
export async function readUpload(request: Request): Promise<UploadImageInput> {
  const body = await readBody(request);
  const form = await new Response(new Uint8Array(body), {
    headers: { 'content-type': request.headers.get('content-type') ?? '' },
  })
    .formData()
    .catch(() => {
      throw validationFailed([{ field: 'file', code: 'invalid_format', message: 'Send the image as multipart form data' }]);
    });

  const file = form.get('file');
  if (!(file instanceof File)) throw validationFailed([{ field: 'file', code: 'required', message: 'Choose an image to upload' }]);
  const fields = Object.fromEntries([...form.entries()].filter(([name]) => name !== 'file'));
  const { role, studioId, spotId } = parseWithSchema(uploadFieldsSchema, fields);

  return {
    owner: studioId ? { kind: 'studio', id: studioId } : { kind: 'spot', id: spotId ?? '' },
    role,
    bytes: Buffer.from(await file.arrayBuffer()),
    declaredType: file.type,
    originalName: file.name,
  };
}
