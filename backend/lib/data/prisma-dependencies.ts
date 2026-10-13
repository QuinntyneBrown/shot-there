import type { Dependencies } from '@/lib/data/dependencies';
import { prismaClient } from '@/lib/data/prisma-client';
import { PrismaStudioRepository } from '@/lib/data/prisma-studio-repository';
import { torontoClock } from '@/lib/shared/toronto-clock';

export function createPrismaDependencies(): Dependencies {
  const prisma = prismaClient();
  return {
    probeDatabase: async () => {
      await prisma.$queryRaw`SELECT 1`;
    },
    clock: torontoClock,
    studios: new PrismaStudioRepository(prisma),
  };
}
