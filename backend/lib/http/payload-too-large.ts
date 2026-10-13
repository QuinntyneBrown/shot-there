import { HttpProblem } from '@/lib/http/http-problem';

export function payloadTooLarge(): HttpProblem {
  return new HttpProblem(413, 'urn:shotthere:problem:payload-too-large');
}
