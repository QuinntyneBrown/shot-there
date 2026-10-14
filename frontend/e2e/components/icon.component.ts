import { Locator } from '@playwright/test';
import { colourOf, contrastOf } from './contrast';

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
    return this.svg.evaluate(colourOf, 'stroke');
  }

  /** WCAG contrast ratio of the stroke against the nearest opaque ground around the icon. */
  strokeContrast(): Promise<number> {
    return this.svg.evaluate(contrastOf, 'stroke');
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
