export interface StoredObject {
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}
