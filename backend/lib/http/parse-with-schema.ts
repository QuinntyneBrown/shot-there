import type { z } from 'zod';
import { validationFailed } from '@/lib/http/validation-failed';

/** Parses input with a strict schema, or throws a 400 listing each field path and message, unknown keys included. */
export function parseWithSchema<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  throw validationFailed(
    result.error.issues.flatMap((issue) =>
      issue.code === 'unrecognized_keys'
        ? issue.keys.map((key) => ({ field: [...issue.path, key].join('.'), message: 'This field is not allowed' }))
        : [{ field: issue.path.join('.'), message: issue.message }],
    ),
  );
}
