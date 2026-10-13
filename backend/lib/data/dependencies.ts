import type { Clock } from '@/lib/shared/clock';
import type { GuideRepository } from '@/lib/guides/guide-repository';
import type { SpotRepository } from '@/lib/spots/spot-repository';
import type { StudioRepository } from '@/lib/studios/studio-repository';

/** Everything outside the process that application functions reach through. Tests replace it with fakes. */
export interface Dependencies {
  probeDatabase(): Promise<void>;
  clock: Clock;
  studios: StudioRepository;
  spots: SpotRepository;
  guides: GuideRepository;
}
