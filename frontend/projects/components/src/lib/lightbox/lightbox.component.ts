import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { _IdGenerator } from '@angular/cdk/a11y';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ResponsiveImageComponent } from '../responsive-image/responsive-image.component';
import { LightboxData } from '../types/lightbox-data';

/** The library's viewer dialog content: one shot at a time with its count, arrows, keys and caption. Closes with the index shown last. */
@Component({
  selector: 'st-lightbox',
  imports: [IconButtonComponent, ResponsiveImageComponent],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'viewer lightbox',
    '(keydown.arrowleft)': 'step(-1)',
    '(keydown.arrowright)': 'step(1)',
  },
})
export class LightboxComponent {
  private readonly ref = inject<DialogRef<number>>(DialogRef);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly data = inject<LightboxData>(DIALOG_DATA);
  protected readonly index = signal(this.data.startIndex);
  protected readonly titleId = inject(_IdGenerator).getId('st-lightbox-') + '-title';

  protected readonly closeLabel = $localize`:@@st.lightbox.close:Close`;
  protected readonly previousLabel = $localize`:@@st.lightbox.previous:Previous photo`;
  protected readonly nextLabel = $localize`:@@st.lightbox.next:Next photo`;
  protected readonly previousText = $localize`:@@st.lightbox.pagerPrevious:Previous`;
  protected readonly nextText = $localize`:@@st.lightbox.pagerNext:Next`;
  protected readonly sizes = '100vw';

  constructor() {
    afterNextRender(() => this.host.nativeElement.closest('.cdk-dialog-container')?.setAttribute('aria-labelledby', this.titleId));
  }

  protected countText(): string {
    return $localize`:@@st.lightbox.count:Photo ${this.index() + 1}:current: of ${this.data.shots.length}:total:`;
  }

  protected step(delta: number): void {
    const count = this.data.shots.length;
    this.index.set((this.index() + delta + count) % count);
  }

  protected close(): void {
    this.ref.close(this.index());
  }
}
