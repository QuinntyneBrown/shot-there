import { z } from 'zod';

/** Zod field builders shared by the owner's editor schemas. */

const WEB_ADDRESS = /^https?:\/\/[^\s/$.?#][^\s]*$/i;

export const requiredText = (message: string, max = 200) =>
  z.string({ error: message }).trim().min(1, { error: message }).max(max, { error: `Use ${max} characters or fewer` });

export const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max, { error: `Use ${max} characters or fewer` })
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .default(null);

/** An ISO date that is not after today. */
export const pastOrTodayDate = (today: string, futureMessage: string) =>
  z.iso
    .date({ error: 'Enter a date as YYYY-MM-DD' })
    .refine((value) => value <= today, { error: futureMessage, params: { code: 'date_in_future' } });

/** A lowercase, hyphenated URL slug. */
export const slugField = () =>
  z
    .string({ error: 'Use lowercase letters, numbers and single hyphens' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: 'Use lowercase letters, numbers and single hyphens' })
    .max(100);

/** A superRefine check that items do not repeat a key; a repeat is reported on `<index>.<keyName>`, or `<index>` for plain values. */
export const uniqueBy =
  <T>(key: (item: T) => unknown, keyName: string | null, message: string) =>
  (items: T[], context: z.RefinementCtx) => {
    const seen = new Set<unknown>();
    items.forEach((item, index) => {
      const value = key(item);
      if (seen.has(value)) context.addIssue({ code: 'custom', message, path: keyName ? [index, keyName] : [index], params: { code: 'duplicate' } });
      seen.add(value);
    });
  };

/* ICD §15 field builders. Every property must be present (ICD C-7); nullable ones accept null. */

/** Trimmed text of 1 to `max` characters, or null; an empty string becomes null (ICD C-14). */
export const nullableText = (max: number) =>
  z
    .string({ error: 'Enter text' })
    .trim()
    .max(max, { error: `Use ${max} characters or fewer` })
    .transform((value) => (value === '' ? null : value))
    .nullable();

/** A number within the bounds, or null. `decimals` limits the decimal places; `above` excludes the minimum. */
export const nullableNumber = (bounds: { min: number; max: number; above?: boolean; decimals?: number; integer?: boolean }) =>
  boundedNumber(bounds).nullable();

export const boundedNumber = ({
  min,
  max,
  above = false,
  decimals,
  integer = false,
}: {
  min: number;
  max: number;
  above?: boolean;
  decimals?: number;
  integer?: boolean;
}) => {
  const range = `Enter a number ${above ? 'greater than' : 'from'} ${min}${above ? ` and at most ${max}` : ` to ${max}`}`;
  let schema = z.number({ error: 'Enter a number' });
  if (integer) schema = schema.int({ error: 'Enter a whole number' });
  schema = (above ? schema.gt(min, { error: range }) : schema.min(min, { error: range })).max(max, { error: range });
  return decimals === undefined ? schema : schema.multipleOf(10 ** -decimals, { error: `Use at most ${decimals} decimal places` });
};

/** Canadian dollars from 0 to 10,000 with at most two decimal places. */
export const cad = () => boundedNumber({ min: 0, max: 10_000, decimals: 2 });

export const nullableEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { error: `Choose one of ${values.join(', ')}` }).nullable();

export const nullableBoolean = () => z.boolean({ error: 'Choose yes or no' }).nullable();

/** An absolute http or https URL of at most 2,048 characters, or null; empty becomes null. */
export const nullableUrl = () =>
  z
    .string({ error: 'Enter a web address' })
    .trim()
    .max(2048, { error: 'Use 2048 characters or fewer' })
    .refine((value) => value === '' || (WEB_ADDRESS.test(value) && URL.canParse(value)), {
      error: 'Enter a valid web address starting with http:// or https://',
      params: { code: 'invalid_format' },
    })
    .transform((value) => (value === '' ? null : value))
    .nullable();

/** A superRefine check that a latitude and longitude are both set or both null. */
export function requireBothCoordinates(
  location: { latitude: number | null; longitude: number | null },
  context: z.RefinementCtx,
): void {
  if ((location.latitude === null) === (location.longitude === null)) return;
  const missing = location.latitude === null ? 'latitude' : 'longitude';
  context.addIssue({ code: 'custom', path: [missing], message: 'Enter both coordinates or neither', params: { code: 'required' } });
}
