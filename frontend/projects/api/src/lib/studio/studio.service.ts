import { Observable } from 'rxjs';

import { StudioDetailDto } from './studio-detail-dto';

/** Reads one published studio review. Errors with HTTP 404 when no published studio has the slug. */
export abstract class StudioService {
  abstract getStudio(slug: string): Observable<StudioDetailDto>;
}
