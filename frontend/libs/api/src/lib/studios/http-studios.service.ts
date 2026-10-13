import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { StudioSummary } from './studio-summary';
import { StudiosService } from './studios.service';

@Injectable()
export class HttpStudiosService extends StudiosService {
  private readonly http = inject(HttpClient);

  listStudios(): Observable<StudioSummary[]> {
    return this.http.get<StudioSummary[]>('/api/studios');
  }
}
