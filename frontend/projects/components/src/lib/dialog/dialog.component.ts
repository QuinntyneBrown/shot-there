import { DialogRef } from '@angular/cdk/dialog';
import { _IdGenerator } from '@angular/cdk/a11y';
import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { DialogSize } from '../types/dialog-size';

/** The DS dialog panel: title, description, body, footer and a close button; busy blocks every way to close it. */
@Component({
  selector: 'st-dialog',
  imports: [IconButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dialog__panel',
    '[class.dialog__panel--sm]': "size() === 'sm'",
    '[class.dialog__panel--form]': "size() === 'form'",
    '[class.dialog__panel--lg]': "size() === 'lg'",
    '[class.dialog__panel--full]': 'fullScreenBelowSm()',
    '[attr.title]': 'null',
  },
})
export class DialogComponent {
  private readonly ref = inject(DialogRef, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly size = input<DialogSize>('md');
  readonly fullScreenBelowSm = input(false, { transform: booleanAttribute });
  readonly busy = input(false, { transform: booleanAttribute });
  readonly closeLabel = input($localize`:@@st.dialog.close:Close`);
  readonly describedBy = input<string | null>(null);

  protected readonly titleId = inject(_IdGenerator).getId('st-dialog-') + '-title';
  protected readonly descId = inject(_IdGenerator).getId('st-dialog-') + '-desc';

  constructor() {
    effect(() => {
      if (this.ref) this.ref.disableClose = this.busy();
    });
    afterNextRender(() => {
      const container = this.host.nativeElement.closest('.cdk-dialog-container');
      container?.setAttribute('aria-labelledby', this.titleId);
      const describing = this.description() !== null ? this.descId : this.describedBy();
      if (describing) container?.setAttribute('aria-describedby', describing);
    });
  }

  protected close(): void {
    if (!this.busy()) this.ref?.close();
  }
}
