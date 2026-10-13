/** Lowercases, turns each run of non-alphanumerics into one hyphen and trims edge hyphens: "The Junction Loft" → `the-junction-loft`. */
export function toSlug(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
