import type { PublicationStatusDto } from '@/lib/publishing/publication-status-dto';
import type { LocationStatus } from '@/lib/publishing/location-status';

export function toPublicationStatusDto(item: { status: LocationStatus; publishedAt: Date | null }): PublicationStatusDto {
  return { status: item.status, publishedAt: item.publishedAt?.toISOString() ?? null };
}
