export interface FieldError {
  /** Dotted path of the offending field, e.g. `fees.0.amount`; empty for the whole body. */
  field: string;
  message: string;
}
