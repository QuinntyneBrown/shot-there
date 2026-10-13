import { Component, input } from '@angular/core';
import { ImageDto } from '@shot-there/api';
import { FallbackImageDirective } from '@shot-there/components';

import { imageSrc, imageSrcset } from '../studio-page/image-srcset';

@Component({
  selector: 'st-studio-test-shots',
  imports: [FallbackImageDirective],
  templateUrl: './studio-test-shots.component.html',
  styleUrl: './studio-test-shots.component.css'
})
export class StudioTestShotsComponent {
  readonly testShots = input.required<ImageDto[]>();
  protected readonly src = imageSrc;
  protected readonly srcset = imageSrcset;
}
