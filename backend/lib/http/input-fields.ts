import { z } from 'zod';

/** Zod field builders shared by the owner's editor schemas. Every optional field defaults to null. */

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

export const amount = () =>
  z.number({ error: 'Enter an amount of 0 or more' }).finite().min(0, { error: 'Enter an amount of 0 or more' });

export const optionalAmount = () => amount().nullable().default(null);

export const optionalPositive = (message: string) =>
  z.number({ error: message }).finite().positive({ error: message }).nullable().default(null);

export const optionalWholeNumber = (min: number, max: number, message: string) =>
  z.number({ error: message }).int({ error: message }).min(min, { error: message }).max(max, { error: message }).nullable().default(null);

export const optionalRange = (min: number, max: number, message: string) =>
  z.number({ error: message }).finite().min(min, { error: message }).max(max, { error: message }).nullable().default(null);

export const optionalWebAddress = () =>
  z
    .string({ error: 'Enter a valid web address starting with http:// or https://' })
    .trim()
    .max(2000)
    .refine((value) => value === '' || (WEB_ADDRESS.test(value) && URL.canParse(value)), {
      error: 'Enter a valid web address starting with http:// or https://',
    })
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .default(null);

/** An ISO date that is not after today. */
export const pastOrTodayDate = (today: string, futureMessage: string) =>
  z.iso
    .date({ error: 'Enter a date as YYYY-MM-DD' })
    .refine((value) => value <= today, { error: futureMessage });

export const optionalEnum = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).nullable().default(null);

export const optionalBoolean = () => z.boolean().nullable().default(null);
