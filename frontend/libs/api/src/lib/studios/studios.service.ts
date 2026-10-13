import { Observable } from 'rxjs';

import { StudioSummary } from './studio-summary';

/** Reads the published studio list. */
export abstract class StudiosService {
  abstract listStudios(): Observable<StudioSummary[]>;
}
