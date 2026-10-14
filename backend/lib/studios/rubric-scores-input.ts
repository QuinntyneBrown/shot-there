/** The six rubric scores, integers from 1 to 5; null until scored. */
export interface RubricScoresInput {
  value: number | null;
  light: number | null;
  space: number | null;
  gear: number | null;
  logistics: number | null;
  condition: number | null;
}
