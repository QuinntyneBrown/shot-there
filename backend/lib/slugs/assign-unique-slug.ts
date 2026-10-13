import { toSlug } from '@/lib/slugs/to-slug';

/** The slug of `name`, with `-2`, `-3` and onward appended until `isTaken` says no row holds it. */
export async function assignUniqueSlug(
  name: string,
  fallback: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = toSlug(name) || fallback;
  let candidate = base;
  for (let suffix = 2; await isTaken(candidate); suffix++) candidate = `${base}-${suffix}`;
  return candidate;
}
