import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const alias = { '@': fileURLToPath(new URL('.', import.meta.url)) };

/** Sign-in timing is measured on its own, after the rest, so image encoding on other workers cannot skew it. */
const TIMING_TESTS = 'tests/acceptance/owner-access/sign-in-as-owner.test.ts';

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
    projects: [
      {
        resolve: { alias },
        test: { name: 'acceptance', environment: 'node', include: ['tests/**/*.test.ts'], exclude: [TIMING_TESTS] },
      },
      {
        resolve: { alias },
        test: { name: 'timing', environment: 'node', include: [TIMING_TESTS], sequence: { groupOrder: 1 } },
      },
    ],
  },
});
