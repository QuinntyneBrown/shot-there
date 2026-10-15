import { Component, computed, inject, input } from '@angular/core';
import { ImageDto } from '@shot-there/api';
import { DialogService, LightboxComponent, LightboxData, ShotGridComponent } from '@shot-there/components';

import { toLightboxShots } from '../studio-gallery/to-lightbox-shots';

@Component({
  selector: 'app-studio-test-shots',
  imports: [ShotGridComponent],
  templateUrl: './studio-test-shots.component.html',
})
export class StudioTestShotsComponent {
  private readonly dialog = inject(DialogService);
  readonly testShots = input.required<ImageDto[]>();
  protected readonly setup = $localize`Same setup in every studio: one Godox AD600 in a 120 cm octabox at 45°, 1.5 m from the subject · f/8 · 1/160 s · ISO 100 · 85 mm.`;
  protected readonly shots = computed(() => toLightboxShots(this.testShots()).map((shot, index) => ({
    ...shot,
    title: `${index + 1} · ${shot.caption}`,
    caption: '',
  })));

  open(index: number): void {
    this.dialog.open<number, LightboxData>(LightboxComponent, {
      kind: 'viewer',
      data: {
        title: $localize`Photo viewer: standard test shots`,
        shots: toLightboxShots(this.testShots()),
        startIndex: index,
      },
    });
  }
}
