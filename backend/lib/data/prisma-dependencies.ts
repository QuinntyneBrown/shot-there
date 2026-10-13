import type { Dependencies } from '@/lib/data/dependencies';
import { prismaClient } from '@/lib/data/prisma-client';
import { PrismaOwnerRepository } from '@/lib/data/prisma-owner-repository';
import { PrismaOwnerSessionRepository } from '@/lib/data/prisma-owner-session-repository';
import { PrismaSignInAttemptRepository } from '@/lib/data/prisma-sign-in-attempt-repository';
import { PrismaGuideRepository } from '@/lib/data/prisma-guide-repository';
import { PrismaSlugRedirectRepository } from '@/lib/data/prisma-slug-redirect-repository';
import { PrismaSpotRepository } from '@/lib/data/prisma-spot-repository';
import { PrismaStudioRepository } from '@/lib/data/prisma-studio-repository';
import { PrismaSubscriberRepository } from '@/lib/data/prisma-subscriber-repository';
import { torontoClock } from '@/lib/shared/toronto-clock';

export function createPrismaDependencies(): Dependencies {
  const prisma = prismaClient();
  return {
    probeDatabase: async () => {
      await prisma.$queryRaw`SELECT 1`;
    },
    clock: torontoClock,
    studios: new PrismaStudioRepository(prisma),
    spots: new PrismaSpotRepository(prisma),
    guides: new PrismaGuideRepository(prisma),
    slugRedirects: new PrismaSlugRedirectRepository(prisma),
    subscribers: new PrismaSubscriberRepository(prisma),
    owners: new PrismaOwnerRepository(prisma),
    ownerSessions: new PrismaOwnerSessionRepository(prisma),
    signInAttempts: new PrismaSignInAttemptRepository(prisma),
  };
}
