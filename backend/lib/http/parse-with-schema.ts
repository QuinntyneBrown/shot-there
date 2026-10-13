import type { z } from 'zod';
import type { FieldErrorCode } from '@/lib/http/field-error-code';
import { validationFailed } from '@/lib/http/validation-failed';

/** Parses input with a strict schema, or throws a 400 listing each field path, code and message, unknown keys included. */
export function parseWithSchema<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input, { reportInput: true });
  if (result.success) return result.data;
  throw validationFailed(
    result.error.issues.flatMap((issue) =>
      issue.code === 'unrecognized_keys'
        ? issue.keys.map((key) => ({
            field: [...issue.path, key].join('.'),
            code: 'unrecognized_key' as const,
            message: 'This field is not allowed',
          }))
        : [{ field: issue.path.join('.'), code: fieldErrorCode(issue), message: issue.message }],
    ),
  );
}

function fieldErrorCode(issue: z.core.$ZodIssue): FieldErrorCode {
  switch (issue.code) {
    case 'invalid_type':
      return issue.input === undefined || issue.input === null ? 'required' : 'invalid_type';
    case 'too_small':
      return issue.origin === 'string' && Number(issue.minimum) === 1 ? 'required' : 'out_of_range';
    case 'too_big':
      return 'out_of_range';
    case 'invalid_format':
    case 'not_multiple_of':
      return 'invalid_format';
    case 'custom':
      return (issue.params?.code as FieldErrorCode | undefined) ?? 'invalid_value';
    default:
      return 'invalid_value';
  }
}
