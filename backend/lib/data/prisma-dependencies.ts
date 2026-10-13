import type { Dependencies } from '@/lib/data/dependencies';
import { prismaClient } from '@/lib/data/prisma-client';

export function createPrismaDependencies(): Dependencies {
  const prisma = prismaClient();
  return {
    probeDatabase: async () => {
      await prisma.$queryRaw`SELECT 1`;
    },
  };
}
