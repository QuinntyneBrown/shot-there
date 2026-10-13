export interface CycWallDto {
  present: boolean | null;
  /** Only set when a cyc wall is present. */
  condition: string | null;
}
