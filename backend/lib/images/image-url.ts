/** The public CDN URL of a stored object. */
export function imageUrl(key: string): string {
  return `${(process.env.IMAGE_CDN_BASE_URL ?? '').replace(/\/$/, '')}/${key}`;
}
