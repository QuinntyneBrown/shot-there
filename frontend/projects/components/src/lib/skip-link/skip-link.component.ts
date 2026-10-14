import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** The DS skip link: the first tab stop, parked above the screen until focused; activating it focuses the target. */
@Component({
  selector: 'st-skip-link',
  templateUrl: './skip-link.component.html',
  styleUrl: './skip-link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLinkComponent {
  private readonly document = inject(DOCUMENT);

  readonly targetId = input('main');
  readonly label = input($localize`:@@st.skipLink.label:Skip to content`);

  protected jump(event: Event): void {
    const target = this.document.getElementById(this.targetId());
    if (target) {
      event.preventDefault();
      target.focus();
    }
  }
}
