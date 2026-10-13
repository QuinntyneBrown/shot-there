import { MAX_JSON_BODY_BYTES } from '@/lib/http/max-json-body-bytes';
import { payloadTooLarge } from '@/lib/http/payload-too-large';
import { unsupportedMediaType } from '@/lib/http/unsupported-media-type';
import { validationFailed } from '@/lib/http/validation-failed';

/** Reads and parses a JSON body, stopping at 1 MB whatever Content-Length claims. Throws 415, 413 or 400. */
export async function readJsonBody(request: Request): Promise<unknown> {
  const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') throw unsupportedMediaType();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (request.body) {
    const reader = request.body.getReader();
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      size += chunk.value.byteLength;
      if (size > MAX_JSON_BODY_BYTES) {
        await reader.cancel();
        throw payloadTooLarge();
      }
      chunks.push(chunk.value);
    }
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw validationFailed([{ field: '', code: 'invalid_format', message: 'Send a JSON body' }]);
  }
}
