import type { ResponsiveImage } from '@shot-there/components';

/**
 * Stand-in photos for the stories: an SVG data URI drawn at the image's own
 * ratio (a wall with two tall windows over a wooden floor), so no image file
 * or external host is needed.
 */
function still(width: number, height: number, wall: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${wall}"/>` +
    `<rect x="${width * 0.14}" y="${height * 0.1}" width="${width * 0.24}" height="${height * 0.52}" fill="#f3eee4"/>` +
    `<rect x="${width * 0.52}" y="${height * 0.1}" width="${width * 0.24}" height="${height * 0.52}" fill="#f3eee4"/>` +
    `<rect y="${height * 0.72}" width="${width}" height="${height * 0.28}" fill="#7a5638"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** A photo that loads. */
export function photo(
  alt: string,
  width: number,
  height: number,
  wall = '#9c6b52',
): ResponsiveImage {
  const url = still(width, height, wall);
  return {
    alt,
    width,
    height,
    sources: [{ format: 'jpeg', srcset: `${url} 960w` }],
    fallbackUrl: url,
  };
}

/** A photo whose files return 404, so the component shows its fallback. */
export function brokenPhoto(alt: string, width: number, height: number): ResponsiveImage {
  return {
    alt,
    width,
    height,
    sources: ['avif', 'webp', 'jpeg'].map((format) => ({
      format,
      srcset: `/missing/photo-960.${format} 960w`,
    })),
    fallbackUrl: '/missing/photo-960.jpeg',
  };
}
