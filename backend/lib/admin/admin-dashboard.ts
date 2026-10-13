import type { ContentCounts } from '@/lib/admin/content-counts';
import type { VerificationItem } from '@/lib/admin/verification-item';

export interface AdminDashboard {
  counts: ContentCounts;
  /** Stale and due-soon entries, oldest first. */
  verification: VerificationItem[];
}
