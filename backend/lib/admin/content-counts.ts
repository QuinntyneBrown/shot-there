import type { StatusCounts } from '@/lib/admin/status-counts';

export interface ContentCounts {
  studios: StatusCounts;
  spots: StatusCounts;
  guides: StatusCounts;
}
