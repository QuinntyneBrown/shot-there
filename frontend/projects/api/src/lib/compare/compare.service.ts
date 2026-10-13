import { Observable } from 'rxjs';

import { ComparisonDto } from './comparison-dto';

/** Reads a side-by-side comparison of published studios. */
export abstract class CompareService {
  abstract getComparison(slugs: string[]): Observable<ComparisonDto>;
}
