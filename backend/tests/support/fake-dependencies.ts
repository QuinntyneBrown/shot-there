import { setDependencies } from '@/lib/data/dependency-container';
import type { Dependencies } from '@/lib/data/dependencies';
import type { GuideRecord } from '@/lib/guides/guide-record';
import type { SpotRecord } from '@/lib/spots/spot-record';
import type { StudioRecord } from '@/lib/studios/studio-record';
import { fixedClock } from '@/tests/support/fixed-clock';
import { InMemoryGuideRepository } from '@/tests/support/in-memory-guide-repository';
import { InMemorySpotRepository } from '@/tests/support/in-memory-spot-repository';
import { InMemoryStudioRepository } from '@/tests/support/in-memory-studio-repository';

export interface FakeSeed {
  today?: string;
  studios?: StudioRecord[];
  spots?: SpotRecord[];
  guides?: GuideRecord[];
  probeDatabase?: () => Promise<void>;
}

/** Installs in-memory dependencies seeded with the given data. No database is involved. */
export function useFakeDependencies(seed: FakeSeed = {}): Dependencies {
  const dependencies: Dependencies = {
    probeDatabase: seed.probeDatabase ?? (async () => {}),
    clock: fixedClock(seed.today ?? '2026-10-13'),
    studios: new InMemoryStudioRepository(seed.studios ?? []),
    spots: new InMemorySpotRepository(seed.spots ?? []),
    guides: new InMemoryGuideRepository(seed.guides ?? []),
  };
  setDependencies(dependencies);
  return dependencies;
}
