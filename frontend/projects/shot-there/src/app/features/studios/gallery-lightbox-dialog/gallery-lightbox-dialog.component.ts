import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { FallbackImageDirective } from '@shot-there/components';

import { imageSrc, imageSrcset } from '../studio-page/image-srcset';
import { GalleryLightboxDialogData } from './gallery-lightbox-dialog-data';
import { nextIndex, previousIndex } from './gallery-lightbox.view-model';

@Component({
  selector: 'st-gallery-lightbox-dialog',
  imports: [FallbackImageDirective],
  templateUrl: './gallery-lightbox-dialog.component.html',
  styleUrl: './gallery-lightbox-dialog.component.css',
})
export class GalleryLightboxDialogComponent {
  private readonly dialogRef = inject(DialogRef);
  protected readonly data = inject<GalleryLightboxDialogData>(DIALOG_DATA);
  protected readonly index = signal(this.data.index);
  protected readonly image = computed(() => this.data.images[this.index()]);
  protected readonly src = imageSrc;
  protected readonly srcset = imageSrcset;

  next(): void {
    this.index.update((index) => nextIndex(index, this.data.images.length));
  }

  previous(): void {
    this.index.update((index) => previousIndex(index, this.data.images.length));
  }

  close(): void {
    this.dialogRef.close();
  }
}
