import { Locator } from '@playwright/test';

/** An st-icon: one decorative <svg class="icon"> from the DS icon sheet. */
export class IconComponent {
  readonly svg: Locator;

  constructor(scope: Locator) {
    this.svg = scope.locator('svg.icon').first();
  }

  /** The rendered width and height in whole CSS pixels. */
  async size(): Promise<{ width: number; height: number } | null> {
    const box = await this.svg.boundingBox();
    return box && { width: Math.round(box.width), height: Math.round(box.height) };
  }

  /** The drawing as markup without Angular's attributes, e.g. `<path d="M6 6l12 12M18 6 6 18"/>`. */
  drawing(): Promise<string> {
    return this.svg.evaluate((svg) =>
      Array.from(svg.children)
        .map((shape) => {
          const attributes = Array.from(shape.attributes)
            .filter((a) => !a.name.startsWith('_ng'))
            .map((a) => ` ${a.name}="${a.value}"`)
            .join('');
          return `<${shape.tagName.toLowerCase()}${attributes}/>`;
        })
        .join(''),
    );
  }

  /** The stroke colour as `rgb(r, g, b)`. */
  stroke(): Promise<string> {
    return this.svg.evaluate((svg) => {
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = getComputedStyle(svg).stroke;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${r}, ${g}, ${b})`;
    });
  }

  /** WCAG contrast ratio of the stroke against the nearest ancestor with an opaque background. */
  strokeContrast(): Promise<number> {
    return this.svg.evaluate((svg) => {
      const rgba = (colour: string) => {
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.fillStyle = colour;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data);
      };
      const luminance = ([r, g, b]: number[]) => {
        const [lr, lg, lb] = [r, g, b].map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
      };
      let ground: Element | null = svg.parentElement;
      while (ground && getComputedStyle(ground).backgroundColor.match(/rgba\(.*, 0\)|transparent/)) ground = ground.parentElement;
      const fg = luminance(rgba(getComputedStyle(svg).stroke));
      const bg = luminance(rgba(getComputedStyle(ground ?? document.body).backgroundColor));
      return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
    });
  }

  /** True when every shape has painted area, so the drawing renders as SVG rather than unknown elements. */
  rendersShapes(): Promise<boolean> {
    return this.svg.evaluate((svg) =>
      Array.from(svg.children).every((shape) => {
        const box = (shape as SVGGraphicsElement).getBBox?.();
        return !!box && (box.width > 0 || box.height > 0);
      }),
    );
  }
}
