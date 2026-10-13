/** Thrown to end a request early with a prepared error response, e.g. 400 or 413. */
export class HttpProblem extends Error {
  constructor(readonly response: Response) {
    super(`HTTP ${response.status}`);
    this.name = 'HttpProblem';
  }
}
