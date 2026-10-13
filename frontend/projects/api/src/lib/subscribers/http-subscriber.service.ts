import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { SubscribeRequest } from './subscribe-request';
import { SubscriberService } from './subscriber.service';

@Injectable()
export class HttpSubscriberService extends SubscriberService {
  private readonly http = inject(HttpClient);

  subscribe(request: SubscribeRequest): Observable<void> {
    return this.http.post('/api/subscribers', request).pipe(map(() => undefined));
  }
}
