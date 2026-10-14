/** The stable `type` of an ICD §9.2 problem response. */
export type ProblemType =
  | 'urn:shotthere:problem:validation-failed'
  | 'urn:shotthere:problem:csrf-rejected'
  | 'urn:shotthere:problem:not-found'
  | 'urn:shotthere:problem:conflict'
  | 'urn:shotthere:problem:payload-too-large'
  | 'urn:shotthere:problem:unsupported-media-type'
  | 'urn:shotthere:problem:publish-incomplete'
  | 'urn:shotthere:problem:rate-limited'
  | 'urn:shotthere:problem:internal-error';
