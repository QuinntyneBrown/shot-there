import { Component, inject, input } from '@angular/core';
import { ImageDto } from '@shot-there/api';
import { DialogService, FallbackImageDirective, LightboxComponent, LightboxData } from '@shot-there/components';

import { imageSrc, imageSrcset } from '../studio-page/image-srcset';
import { toLightboxShots } from './to-lightbox-shots';

@Component({
  selector: 'st-studio-gallery',
  imports: [FallbackImageDirective],
  templateUrl: './studio-gallery.component.html',
  styleUrl: './studio-gallery.component.css',
})
export class StudioGalleryComponent {
  private readonly dialog = inject(DialogService);
  readonly gallery = input.required<ImageDto[]>();
  readonly studioName = input.required<string>();
  protected readonly src = imageSrc;
  protected readonly srcset = imageSrcset;

  open(index: number): void {
    this.dialog.open<number, LightboxData>(LightboxComponent, {
      kind: 'viewer',
      data: {
        title: `Photo viewer: ${this.studioName()}`,
        shots: toLightboxShots(this.gallery()),
        startIndex: index,
      },
    });
  }
}
