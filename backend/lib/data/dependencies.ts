import type { OwnerRepository } from '@/lib/auth/owner-repository';
import type { OwnerSessionRepository } from '@/lib/auth/owner-session-repository';
import type { SignInAttemptRepository } from '@/lib/auth/sign-in-attempt-repository';
import type { Clock } from '@/lib/shared/clock';
import type { GuideRepository } from '@/lib/guides/guide-repository';
import type { SlugRedirectRepository } from '@/lib/slugs/slug-redirect-repository';
import type { SpotRepository } from '@/lib/spots/spot-repository';
import type { StudioRepository } from '@/lib/studios/studio-repository';
import type { SubscriberRepository } from '@/lib/subscribers/subscriber-repository';

/** Everything outside the process that application functions reach through. Tests replace it with fakes. */
export interface Dependencies {
  probeDatabase(): Promise<void>;
  clock: Clock;
  studios: StudioRepository;
  spots: SpotRepository;
  guides: GuideRepository;
  slugRedirects: SlugRedirectRepository;
  subscribers: SubscriberRepository;
  owners: OwnerRepository;
  ownerSessions: OwnerSessionRepository;
  signInAttempts: SignInAttemptRepository;
}
