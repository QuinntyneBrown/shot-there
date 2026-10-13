import { setDependencies } from '@/lib/data/dependency-container';
import type { Dependencies } from '@/lib/data/dependencies';

export function useFakeDependencies(overrides: Partial<Dependencies> = {}): Dependencies {
  const dependencies: Dependencies = {
    probeDatabase: async () => {},
    ...overrides,
  };
  setDependencies(dependencies);
  return dependencies;
}
