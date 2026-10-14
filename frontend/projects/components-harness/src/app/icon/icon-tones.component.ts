import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '@shot-there/components';

/** Status glyphs in the contexts that colour them: a warning alert, an error empty-state circle, a success toast. */
@Component({
  selector: 'st-icon-tones',
  imports: [IconComponent],
  templateUrl: './icon-tones.component.html',
  styleUrl: './icon-tones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconTonesComponent {}
