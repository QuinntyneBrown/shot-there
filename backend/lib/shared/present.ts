/**
 * A value the publish check guarantees on published content. Null here means a published item lost part of its
 * standard data set, which saves refuse (L2-002), so it is treated as an internal error.
 */
export function present<T>(value: T | null, field: string): T {
  if (value === null) throw new Error(`Published content is missing ${field}`);
  return value;
}
