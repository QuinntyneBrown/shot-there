import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SiteFooterComponent } from '@shot-there/components';

/** A footer with a tagline, links including an external one, and a copy line. */
@Component({
  selector: 'st-site-footer-default',
  imports: [SiteFooterComponent],
  templateUrl: './site-footer-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterDefaultComponent {
  protected readonly links = [
    { label: 'Editorial policy', link: '/editorial-policy' },
    { label: 'YouTube channel', link: 'https://www.youtube.com/@shotthere', external: true },
  ];
}
