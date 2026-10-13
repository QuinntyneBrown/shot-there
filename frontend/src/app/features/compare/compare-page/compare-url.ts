/** "a, b,,c" → ["a", "b", "c"]: trimmed, non-empty slugs in URL order. */
export function parseCompareSlugs(value: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((slug) => slug.trim())
    .filter((slug) => slug !== '');
}
