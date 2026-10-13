/** S3-compatible object storage for images. */
export interface ObjectStore {
  putObject(key: string, body: Buffer, contentType: string, cacheControl?: string): Promise<void>;
  getObject(key: string): Promise<Buffer>;
  deleteObjects(keys: string[]): Promise<void>;
}
