import { HttpProblem } from '@/lib/http/http-problem';

export function unsupportedMediaType(): HttpProblem {
  return new HttpProblem(415, 'urn:shotthere:problem:unsupported-media-type');
}
