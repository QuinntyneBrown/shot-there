export type ColourPart = 'text' | 'border' | 'outline' | 'stroke';

/**
 * WCAG contrast ratio of one painted part of an element against what is behind it. Text is measured
 * against the element's own fill when it has one; edges, rings and strokes against the nearest opaque
 * ground around the element. Self-contained, so component objects pass it to `locator.evaluate`.
 */
export function contrastOf(el: Element, part: ColourPart): number {
  const rgba = (colour: string): number[] => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, 1, 1);
    return Array.from(ctx.getImageData(0, 0, 1, 1).data);
  };
  const luminance = ([r, g, b]: number[]): number => {
    const [lr, lg, lb] = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };
  const style = getComputedStyle(el);
  const foreground = { text: style.color, border: style.borderTopColor, outline: style.outlineColor, stroke: style.stroke }[part];
  let ground: Element | null = part === 'text' ? el : el.parentElement;
  while (ground && rgba(getComputedStyle(ground).backgroundColor)[3] === 0) ground = ground.parentElement;
  const fg = luminance(rgba(foreground));
  const bg = luminance(rgba(getComputedStyle(ground ?? document.documentElement).backgroundColor));
  return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
}

/** A computed colour as `rgb(r, g, b)`. Self-contained, for `locator.evaluate`. */
export function colourOf(el: Element, property: 'color' | 'backgroundColor' | 'borderTopColor' | 'outlineColor' | 'stroke'): string {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = getComputedStyle(el)[property];
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}
