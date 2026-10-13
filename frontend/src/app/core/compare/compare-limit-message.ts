export const COMPARE_LIMIT_TITLE = $localize`You can compare up to 4 studios`;

/** "Remove one from the bar to add Ossington Blackbox." */
export function compareLimitHint(name: string): string {
  return $localize`Remove one from the bar to add ${name}:name:.`;
}
