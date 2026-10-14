import { ImageDto } from '@shot-there/api';

/** "a-480.jpg 480w, a-1200.jpg 1200w" over every stored size. */
export function imageSrcset(image: ImageDto): string {
  return image.variants.map((variant) => `${variant.url} ${variant.width}w`).join(', ');
}

/** The largest stored size, for browsers that ignore srcset. */
export function imageSrc(image: ImageDto): string {
  return image.variants.reduce((largest, variant) =>
    variant.width > largest.width ? variant : largest,
  ).url;
}
