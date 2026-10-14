import { DialogRef } from '@angular/cdk/dialog';
import { _IdGenerator } from '@angular/cdk/a11y';
import { afterNextRender, booleanAttribute, ChangeDetectionStrategy, Component, effect, ElementRef, inject, input } from '@angular/core';
import { IconButtonComponent } from '../icon-button/icon-button.component';

/** The DS sheet: a full-height panel (phone filters, the site menu) that is a side sheet from MD. */
@Component({
  selector: 'st-sheet',
  imports: [IconButtonComponent],
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sheet', '[attr.title]': 'null' },
})
export class SheetComponent {
  private readonly ref = inject(DialogRef, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly title = input.required<string>();
  readonly description = input<string | null>(null);
  readonly describedBy = input<string | null>(null);
  readonly closeLabel = input($localize`:@@st.dialog.close:Close`);
  readonly busy = input(false, { transform: booleanAttribute });

  protected readonly titleId = inject(_IdGenerator).getId('st-sheet-') + '-title';
  protected readonly descId = inject(_IdGenerator).getId('st-sheet-') + '-desc';

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
