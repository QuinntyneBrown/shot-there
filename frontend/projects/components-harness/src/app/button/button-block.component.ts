import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** A block primary button in a 320px container. */
@Component({
  selector: 'st-button-block',
  imports: [ButtonComponent],
  templateUrl: './button-block.component.html',
  styleUrl: './button-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonBlockComponent {}
