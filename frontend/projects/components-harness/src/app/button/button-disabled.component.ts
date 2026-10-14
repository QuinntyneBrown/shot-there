import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '@shot-there/components';

/** The published studio's status panel: "Unpublish", and "Delete studio" natively disabled with its hint. */
@Component({
  selector: 'st-button-disabled',
  imports: [ButtonComponent],
  templateUrl: './button-disabled.component.html',
  styleUrl: './button-disabled.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDisabledComponent {}
