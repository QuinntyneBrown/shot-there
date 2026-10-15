import { Component, computed, inject, input } from '@angular/core';
import { ImageDto } from '@shot-there/api';
import { DialogService, LightboxComponent, LightboxData, ShotGridComponent } from '@shot-there/components';

import { toLightboxShots } from './to-lightbox-shots';

@Component({
  selector: 'st-studio-gallery',
  imports: [ShotGridComponent],
  templateUrl: './studio-gallery.component.html',
})
export class StudioGalleryComponent {
  private readonly dialog = inject(DialogService);
  readonly gallery = input.required<ImageDto[]>();
  readonly studioName = input.required<string>();
  protected readonly shots = computed(() => toLightboxShots(this.gallery()).map((shot) => ({
    ...shot,
    caption: '',
  })));

  open(index: number): void {
    this.dialog.open<number, LightboxData>(LightboxComponent, {
      kind: 'viewer',
      data: {
        title: $localize`Photo viewer: ${this.studioName()}:studioName:`,
        shots: toLightboxShots(this.gallery()),
        startIndex: index,
      },
    });
  }
}
