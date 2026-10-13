/** The photo after `index`; after the last photo comes the first. */
export function nextIndex(index: number, count: number): number {
  return (index + 1) % count;
}

/** The photo before `index`; before the first photo comes the last. */
export function previousIndex(index: number, count: number): number {
  return (index - 1 + count) % count;
}
