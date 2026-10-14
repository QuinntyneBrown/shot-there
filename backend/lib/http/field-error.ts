import type { FieldErrorCode } from '@/lib/http/field-error-code';

export interface FieldError {
  /** Dotted path of the offending field, e.g. `fees.0.amount`; empty for the whole body. */
  field: string;
  code: FieldErrorCode;
  /** English diagnostic text; never shown to users. */
  message: string;
}
