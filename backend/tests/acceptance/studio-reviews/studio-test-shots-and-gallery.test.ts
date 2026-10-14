import { describe, expect, it } from 'vitest';
import { aStudio, anImage } from '@/tests/support/builders';
import { useFakeDependencies } from '@/tests/support/fake-dependencies';
import { getStudioPage } from '@/tests/support/get-studio-page';

describe('L2-009 standard test shots', () => {
  it('Given three test shots, when returned, then they come in configured order with their stored alt text and setup caption', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          images: [
            anImage({ role: 'test_shot', sortOrder: 2, altText: 'Backlit portrait', caption: 'Key at 45°' }),
            anImage({ role: 'gallery', sortOrder: 0, altText: 'Gallery shot' }),
            anImage({ role: 'test_shot', sortOrder: 0, altText: 'Window light portrait', caption: 'Window only' }),
            anImage({ role: 'test_shot', sortOrder: 1, altText: 'Strobe portrait', caption: 'One strobe' }),
          ],
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.testShots.map((shot: { image: { alt: string } }) => shot.image.alt)).toEqual([
      'Window light portrait',
      'Strobe portrait',
      'Backlit portrait',
    ]);
    expect(body.testShots[0].caption).toBe('Window only');
    expect(body.testShots[0].image).not.toHaveProperty('caption');
  });
});

describe('L2-010 gallery', () => {
  it('Given eight gallery images, when returned, then all eight are listed in order and no test shot is among them', async () => {
    const gallery = Array.from({ length: 8 }, (_, index) =>
      anImage({ role: 'gallery', sortOrder: 7 - index, altText: `Gallery ${7 - index}` }),
    );
    useFakeDependencies({
      studios: [aStudio({ slug: 's', images: [anImage({ role: 'test_shot', altText: 'Test' }), ...gallery] })],
    });

    const { body } = await getStudioPage('s');

    expect(body.gallery.map((image: { alt: string }) => image.alt)).toEqual(
      Array.from({ length: 8 }, (_, index) => `Gallery ${index}`),
    );
  });
});

describe('L2-072 responsive image sources', () => {
  it('Given an image with variants, when returned, then it offers AVIF, WebP and JPEG srcsets by width with the 960 JPEG as fallback', async () => {
    const image = anImage({ id: 'img1', role: 'gallery', width: 4000, height: 2667 });
    useFakeDependencies({ studios: [aStudio({ slug: 's', images: [image] })] });

    const { body } = await getStudioPage('s');

    expect(body.gallery[0]).toEqual({
      alt: image.altText,
      width: 4000,
      height: 2667,
      sources: (['avif', 'webp', 'jpeg'] as const).map((format) => {
        const extension = format === 'jpeg' ? 'jpg' : format;
        return {
          format,
          srcset: [480, 960, 1440, 2048]
            .map((width) => `https://cdn.example/images/img1/${width}.${extension} ${width}w`)
            .join(', '),
        };
      }),
      fallbackUrl: 'https://cdn.example/images/img1/960.jpg',
    });
  });
});

describe('ICD S-8 images need alt text to be public', () => {
  it('Given a gallery image and a test shot without alt text, when the studio is returned, then neither is served', async () => {
    useFakeDependencies({
      studios: [
        aStudio({
          slug: 's',
          images: [
            anImage({ role: 'test_shot', altText: 'Described test shot', caption: 'Key light' }),
            anImage({ role: 'test_shot', sortOrder: 1, altText: '', caption: 'Rim light' }),
            anImage({ role: 'gallery', altText: 'Described gallery image' }),
            anImage({ role: 'gallery', sortOrder: 1, altText: '' }),
          ],
        }),
      ],
    });

    const { body } = await getStudioPage('s');

    expect(body.testShots.map((shot: { caption: string }) => shot.caption)).toEqual(['Key light']);
    expect(body.gallery.map((image: { alt: string }) => image.alt)).toEqual(['Described gallery image']);
  });
});
