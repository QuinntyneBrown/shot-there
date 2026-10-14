import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SiteHeaderComponent, ButtonComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** A public header with links, an external link, a sign-out action and the menu button. */
@Component({
  selector: 'st-site-header-default',
  imports: [SiteHeaderComponent, ButtonComponent, ActivationLogComponent],
  templateUrl: './site-header-default.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeaderDefaultComponent {
  protected readonly links = [
    { label: 'Studios', link: '/studios' },
    { label: 'Spots', link: '/spots' },
    { label: 'YouTube', link: 'https://www.youtube.com/@shotthere', external: true },
  ];
  protected readonly log = signal<readonly string[]>([]);
}
