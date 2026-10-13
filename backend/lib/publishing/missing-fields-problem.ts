/** The 422 body of a refused publish, listing each missing standard field. */
export interface MissingFieldsProblem {
  status: 422;
  missingFields: string[];
}
