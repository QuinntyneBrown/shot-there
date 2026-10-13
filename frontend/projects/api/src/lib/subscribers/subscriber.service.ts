import { Observable } from 'rxjs';

import { SubscribeRequest } from './subscribe-request';

/** Subscribes a visitor to new-review emails. */
export abstract class SubscriberService {
  abstract subscribe(request: SubscribeRequest): Observable<void>;
}
