import { DeleteObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { ObjectStore } from '@/lib/storage/object-store';

/** An S3-compatible bucket configured from the STORAGE_* environment variables. */
export class S3ObjectStore implements ObjectStore {
  private readonly client = new S3Client({
    endpoint: process.env.STORAGE_ENDPOINT || undefined,
    region: process.env.STORAGE_REGION ?? 'auto',
    forcePathStyle: Boolean(process.env.STORAGE_ENDPOINT),
    credentials: {
      accessKeyId: process.env.STORAGE_ACCESS_KEY ?? '',
      secretAccessKey: process.env.STORAGE_SECRET_KEY ?? '',
    },
  });

  private readonly bucket = process.env.STORAGE_BUCKET ?? '';

  async putObject(key: string, body: Buffer, contentType: string, cacheControl?: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType, CacheControl: cacheControl }),
    );
  }

  async deleteObjects(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.client.send(
      new DeleteObjectsCommand({ Bucket: this.bucket, Delete: { Objects: keys.map((key) => ({ Key: key })) } }),
    );
  }
}
