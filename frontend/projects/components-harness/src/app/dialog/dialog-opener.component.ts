import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DialogService, LightboxComponent, Shot } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';
import { DeleteDialogComponent } from './delete-dialog.component';
import { FiltersSheetComponent } from './filters-sheet.component';

/** Buttons that open a dialog, a sheet and the lightbox through DialogService, and log what they close with. */
@Component({
  selector: 'st-dialog-opener',
  imports: [ActivationLogComponent],
  templateUrl: './dialog-opener.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogOpenerComponent {
  private readonly dialogs = inject(DialogService);
  protected readonly log = signal<readonly string[]>([]);

  private readonly image = {
    alt: 'Close portrait against the brick wall.',
    width: 1600,
    height: 2000,
    sources: [{ format: 'jpeg', srcset: '/test-images/9f2c41/480.jpeg 480w, /test-images/9f2c41/960.jpeg 960w' }],
    fallbackUrl: '/test-images/9f2c41/960.jpeg',
  };
  private readonly shots: readonly Shot[] = [
    { image: this.image, caption: 'Octabox at 45 degrees.', title: 'Standard' },
    { image: this.image, caption: 'Window light only.' },
    { image: this.image, caption: 'Hard light with a grid.' },
  ];

  protected openDialog(): void {
    this.dialogs.open<string>(DeleteDialogComponent).closed.subscribe((result) => this.log.update((log) => [...log, 'dialog closed: ' + result]));
  }

  protected openSheet(): void {
    this.dialogs.open(FiltersSheetComponent, { kind: 'sheet' }).closed.subscribe(() => this.log.update((log) => [...log, 'sheet closed']));
  }

  protected openPhotos(): void {
    this.dialogs
      .open<number>(LightboxComponent, { kind: 'viewer', data: { title: 'Test shots', shots: this.shots, startIndex: 1 } })
      .closed.subscribe((index) => this.log.update((log) => [...log, 'viewer closed at ' + index]));
  }
}
