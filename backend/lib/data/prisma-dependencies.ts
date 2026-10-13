import type { Dependencies } from '@/lib/data/dependencies';
import { prismaClient } from '@/lib/data/prisma-client';
import { PrismaOwnerRepository } from '@/lib/data/prisma-owner-repository';
import { PrismaOwnerSessionRepository } from '@/lib/data/prisma-owner-session-repository';
import { PrismaSignInAttemptRepository } from '@/lib/data/prisma-sign-in-attempt-repository';
import { PrismaImageRepository } from '@/lib/data/prisma-image-repository';
import { PrismaGuideRepository } from '@/lib/data/prisma-guide-repository';
import { PrismaSlugRedirectRepository } from '@/lib/data/prisma-slug-redirect-repository';
import { PrismaSpotRepository } from '@/lib/data/prisma-spot-repository';
import { PrismaStudioRepository } from '@/lib/data/prisma-studio-repository';
import { PrismaSubscriberRepository } from '@/lib/data/prisma-subscriber-repository';
import { loggingPageRevalidator } from '@/lib/publishing/logging-page-revalidator';
import { S3ObjectStore } from '@/lib/storage/s3-object-store';
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
    images: new PrismaImageRepository(prisma),
    objectStore: new S3ObjectStore(),
    pageRevalidator: loggingPageRevalidator,
  };
}
