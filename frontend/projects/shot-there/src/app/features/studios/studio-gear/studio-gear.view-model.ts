import { GearCategory, GearItemDto } from '@shot-there/api';

const CATEGORY_LABELS: Record<GearCategory, string> = {
  lights: $localize`Lights`,
  modifiers: $localize`Modifiers`,
  stands: $localize`Stands`,
  other: $localize`Other`,
};

const CATEGORY_ORDER: readonly GearCategory[] = ['lights', 'modifiers', 'stands', 'other'];

/** "Godox AD600 strobe × 2", or the bare name when no quantity is recorded. */
export function gearItemLabel(item: GearItemDto): string {
  return item.quantity === null
    ? item.name
    : $localize`${item.name}:name: × ${item.quantity}:quantity:`;
}

/** Included gear grouped by category, in a fixed category order, skipping empty categories. */
export function groupIncludedGear(items: GearItemDto[]): { category: string; items: string }[] {
  return CATEGORY_ORDER.map((category) => ({
    category: CATEGORY_LABELS[category],
    items: items
      .filter((item) => item.category === category)
      .map(gearItemLabel)
      .join(' · '),
  })).filter((group) => group.items !== '');
}
