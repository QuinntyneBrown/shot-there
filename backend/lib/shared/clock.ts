export interface Clock {
  /** Today's date in Toronto as `YYYY-MM-DD`. */
  today(): string;
  now(): Date;
}
