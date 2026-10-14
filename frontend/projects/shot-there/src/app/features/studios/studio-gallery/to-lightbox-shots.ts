import { ImageDto } from '@shot-there/api';
import { ResponsiveImage, Shot } from '@shot-there/components';

import { imageSrc, imageSrcset } from '../studio-page/image-srcset';

export function toLightboxShots(images: ImageDto[]): Shot[] {
  return images.map((image) => ({
    image: {
      alt: image.alt,
      width: 800,
      height: 1000,
      sources: [{ format: 'jpeg', srcset: imageSrcset(image) }],
      fallbackUrl: imageSrc(image),
    } satisfies ResponsiveImage,
    caption: image.caption ?? image.alt,
  }));
}
