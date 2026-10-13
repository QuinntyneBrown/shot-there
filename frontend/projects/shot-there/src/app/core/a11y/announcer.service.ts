import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Injectable, inject } from '@angular/core';

/** The one entry point for announcing dynamic changes to assistive technology. */
@Injectable({ providedIn: 'root' })
export class AnnouncerService {
  private readonly liveAnnouncer = inject(LiveAnnouncer);

  announcePolite(message: string): void {
    void this.liveAnnouncer.announce(message, 'polite');
  }
}
