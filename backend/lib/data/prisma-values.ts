/** Converts a Prisma Decimal (or null) to a number. */
export function toNumber(value: { toNumber(): number } | null): number | null {
  return value === null ? null : value.toNumber();
}

/** Converts a `@db.Date` column to ISO `YYYY-MM-DD`. */
export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** Converts ISO `YYYY-MM-DD` to a `@db.Date` value. */
export function fromIsoDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}
