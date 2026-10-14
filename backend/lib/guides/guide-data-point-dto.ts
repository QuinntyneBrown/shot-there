import type { GuideDataPointKey } from '@/lib/guides/guide-data-point-key';

/** One server-computed fact about a guide entry; the frontend builds its label from `key`. */
export interface GuideDataPointDto {
  key: GuideDataPointKey;
  value: number;
}
