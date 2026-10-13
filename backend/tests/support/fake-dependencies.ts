import { setDependencies } from '@/lib/data/dependency-container';
import type { OwnerRecord } from '@/lib/auth/owner-record';
import type { OwnerSessionRecord } from '@/lib/auth/owner-session-record';
import type { SignInAttemptRecord } from '@/lib/auth/sign-in-attempt-record';
import type { Dependencies } from '@/lib/data/dependencies';
import type { GuideRecord } from '@/lib/guides/guide-record';
import type { SlugRedirectRecord } from '@/lib/slugs/slug-redirect-record';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';
import type { SubscriberRecord } from '@/lib/subscribers/subscriber-record';
import { fixedClock } from '@/tests/support/fixed-clock';
import { InMemoryImageRepository } from '@/tests/support/in-memory-image-repository';
import { InMemoryObjectStore } from '@/tests/support/in-memory-object-store';
import { InMemoryOwnerRepository } from '@/tests/support/in-memory-owner-repository';
import { InMemoryOwnerSessionRepository } from '@/tests/support/in-memory-owner-session-repository';
import { InMemorySignInAttemptRepository } from '@/tests/support/in-memory-sign-in-attempt-repository';
import { InMemoryGuideRepository } from '@/tests/support/in-memory-guide-repository';
import { InMemorySlugRedirectRepository } from '@/tests/support/in-memory-slug-redirect-repository';
import { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';
import { InMemorySubscriberRepository } from '@/tests/support/in-memory-subscriber-repository';
import { RecordingPageRevalidator } from '@/tests/support/recording-page-revalidator';

export interface FakeSeed {
  today?: string;
  studios?: StudioRecord[];
  spots?: SpotRecord[];
  guides?: GuideRecord[];
  slugRedirects?: SlugRedirectRecord[];
  subscribers?: SubscriberRecord[];
  owners?: OwnerRecord[];
  ownerSessions?: OwnerSessionRecord[];
  signInAttempts?: SignInAttemptRecord[];
  probeDatabase?: () => Promise<void>;
}

/** Installs in-memory dependencies seeded with the given data. No database is involved. */
export function useFakeDependencies(seed: FakeSeed = {}): Dependencies {
  const studios = new InMemoryStudioRepository(seed.studios ?? []);
  const spots = new InMemorySpotRepository(seed.spots ?? []);
  const dependencies: Dependencies = {
    probeDatabase: seed.probeDatabase ?? (async () => {}),
    clock: fixedClock(seed.today ?? '2026-10-13'),
    studios,
    spots,
    guides: new InMemoryGuideRepository(seed.guides ?? []),
    slugRedirects: new InMemorySlugRedirectRepository(seed.slugRedirects ?? []),
    subscribers: new InMemorySubscriberRepository(seed.subscribers ?? []),
    owners: new InMemoryOwnerRepository(seed.owners ?? []),
    ownerSessions: new InMemoryOwnerSessionRepository(seed.ownerSessions ?? []),
    signInAttempts: new InMemorySignInAttemptRepository(seed.signInAttempts ?? []),
    images: new InMemoryImageRepository(studios, spots),
    objectStore: new InMemoryObjectStore(),
    pageRevalidator: new RecordingPageRevalidator(),
  };
  setDependencies(dependencies);
  return dependencies;
}
