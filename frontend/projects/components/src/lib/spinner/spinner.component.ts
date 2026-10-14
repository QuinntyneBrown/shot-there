import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The DS spinner: a ring turning while a short wait has no amount, plus a visually hidden label. */
@Component({
  selector: 'st-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input($localize`:@@st.spinner.label:Loading`);
}
