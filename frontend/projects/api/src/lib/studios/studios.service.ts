import { Observable } from 'rxjs';

import { StudioListParams } from './studio-list-params';
import { StudioSummary } from './studio-summary';

/** Reads the published studio list. */
export abstract class StudiosService {
  abstract listStudios(params: StudioListParams): Observable<StudioSummary[]>;
}
