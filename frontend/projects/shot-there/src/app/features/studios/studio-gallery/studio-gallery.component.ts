import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input } from '@angular/core';
import { ImageDto } from '@shot-there/api';
import { FallbackImageDirective } from '@shot-there/components';

import { GalleryLightboxDialogComponent } from '../gallery-lightbox-dialog/gallery-lightbox-dialog.component';
import { GalleryLightboxDialogData } from '../gallery-lightbox-dialog/gallery-lightbox-dialog-data';
import { imageSrc, imageSrcset } from '../studio-page/image-srcset';

@Component({
  selector: 'st-studio-gallery',
  imports: [FallbackImageDirective],
  templateUrl: './studio-gallery.component.html',
  styleUrl: './studio-gallery.component.css',
})
export class StudioGalleryComponent {
  private readonly dialog = inject(Dialog);
  readonly gallery = input.required<ImageDto[]>();
  readonly studioName = input.required<string>();
  protected readonly src = imageSrc;
  protected readonly srcset = imageSrcset;

  open(index: number): void {
    this.dialog.open<void, GalleryLightboxDialogData>(GalleryLightboxDialogComponent, {
      data: { studioName: this.studioName(), images: this.gallery(), index },
      ariaLabelledBy: 'lightbox-title',
      ariaDescribedBy: 'lightbox-caption',
      width: '100%',
      height: '100%',
      maxWidth: '100%',
    });
  }
}
