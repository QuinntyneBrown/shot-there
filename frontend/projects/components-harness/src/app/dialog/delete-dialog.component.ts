import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonComponent, DialogComponent } from '@shot-there/components';

/** A confirm dialog content component: Cancel closes, Delete studio goes busy and then closes with a result. */
@Component({
  selector: 'st-delete-dialog',
  imports: [DialogComponent, ButtonComponent],
  templateUrl: './delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteDialogComponent {
  private readonly ref = inject<DialogRef<string>>(DialogRef);
  protected readonly busy = signal(false);

  protected cancel(): void {
    this.ref.close('cancelled');
  }

  protected remove(): void {
    this.busy.set(true);
  }

  protected finish(): void {
    this.ref.close('deleted');
  }
}
