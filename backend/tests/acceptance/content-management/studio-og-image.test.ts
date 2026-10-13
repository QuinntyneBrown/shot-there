import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { POST as publishStudio } from '@/app/api/admin/studios/[id]/publish/route';
import type { Dependencies } from '@/lib/data/dependencies';
import { adminRequest, idParams, stubSiteOriginPerTest, useSignedInOwner } from '@/tests/support/admin-session';
import { aStudio, anImage } from '@/tests/support/builders';
import { getStudioPage } from '@/tests/support/get-studio-page';
import type { InMemoryObjectStore } from '@/tests/support/in-memory-object-store';

stubSiteOriginPerTest();

const publish = (id: string) =>
  publishStudio(adminRequest(`/api/admin/studios/${id}/publish`, { method: 'POST' }), idParams(id));
const objects = (dependencies: Dependencies) => (dependencies.objectStore as InMemoryObjectStore).objects;

async function solid(width: number, height: number, background: { r: number; g: number; b: number }) {
  return sharp({ create: { width, height, channels: 3, background } }).jpeg().toBuffer();
}

function draftStudioWithGallery() {
  return aStudio({
    id: 's1',
    slug: 'loft',
    status: 'draft',
    publishedAt: null,
    images: [
      anImage({ id: 't', role: 'test_shot' }),
      anImage({ id: 'second', role: 'gallery', sortOrder: 1, storageKey: 'images/second/original' }),
      anImage({ id: 'first', role: 'gallery', sortOrder: 0, storageKey: 'images/first/original' }),
    ],
  });
}

describe('L2-076 Open Graph image', () => {
  it("Given a studio with gallery images, when the owner publishes it, then its Open Graph image is the first gallery image at 1200 by 630 and the public page links to it", async () => {
    const dependencies = useSignedInOwner({ studios: [draftStudioWithGallery()] });
    await dependencies.objectStore.putObject('images/first/original', await solid(2000, 1500, { r: 220, g: 20, b: 20 }), 'image/jpeg');
    await dependencies.objectStore.putObject('images/second/original', await solid(2000, 1500, { r: 20, g: 20, b: 220 }), 'image/jpeg');

    expect((await publish('s1')).status).toBe(200);

    const { body } = await getStudioPage('loft');
    const key = [...objects(dependencies).keys()].find((candidate) => candidate.startsWith('images/og/'));
    expect(key).toMatch(/^images\/og\/[0-9a-f]{16}\.jpg$/);
    expect(body.ogImageUrl).toMatch(new RegExp(`${key}$`));
    const og = objects(dependencies).get(key ?? '');
    expect(og).toMatchObject({ contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000, immutable' });
    const metadata = await sharp(og?.body).metadata();
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['jpeg', 1200, 630]);
    const [red, , blue] = (await sharp(og?.body).stats()).channels;
    expect(red.mean).toBeGreaterThan(blue.mean);
  });

  it('Given the gallery original cannot be read, when the owner publishes the studio, then publishing still succeeds without an Open Graph image', async () => {
    useSignedInOwner({ studios: [draftStudioWithGallery()] });

    expect((await publish('s1')).status).toBe(200);

    expect((await getStudioPage('loft')).body.ogImageUrl).toBeNull();
  });
});
