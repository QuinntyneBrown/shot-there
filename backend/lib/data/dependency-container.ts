import type { Dependencies } from '@/lib/data/dependencies';
import { createPrismaDependencies } from '@/lib/data/prisma-dependencies';

let current: Dependencies | undefined;

export function getDependencies(): Dependencies {
  current ??= createPrismaDependencies();
  return current;
}

/** Replaces the production dependencies; used by tests. */
export function setDependencies(dependencies: Dependencies): void {
  current = dependencies;
}
