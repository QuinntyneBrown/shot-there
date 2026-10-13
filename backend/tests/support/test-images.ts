import sharp from 'sharp';

/** A solid-colour raster image of the given size and format, generated in memory. */
export function aRasterImage(width: number, height: number, format: 'jpeg' | 'png' | 'webp' = 'jpeg'): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: { r: 120, g: 90, b: 60 } } })
    .toFormat(format)
    .toBuffer();
}

export const SVG_IMAGE = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400"/></svg>',
);

/** The first bytes of a Windows executable. */
export const EXE_FILE = Buffer.concat([Buffer.from('MZ'), Buffer.alloc(510, 0x90)]);
