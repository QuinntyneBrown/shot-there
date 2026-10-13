import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { StudioDetailDto } from './studio-detail-dto';
import { StudioService } from './studio.service';

@Injectable()
export class HttpStudioService extends StudioService {
  private readonly http = inject(HttpClient);

  getStudio(slug: string): Observable<StudioDetailDto> {
    return this.http.get<StudioDetailDto>(`/api/studios/${encodeURIComponent(slug)}`);
  }
}
