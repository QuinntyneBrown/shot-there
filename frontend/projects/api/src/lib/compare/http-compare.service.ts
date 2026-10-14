import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CompareService } from './compare.service';
import { ComparisonDto } from './comparison-dto';

@Injectable()
export class HttpCompareService extends CompareService {
  private readonly http = inject(HttpClient);

  getComparison(slugs: string[]): Observable<ComparisonDto> {
    return this.http.get<ComparisonDto>('/api/compare', { params: { studios: slugs.join(',') } });
  }
}
