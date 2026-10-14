import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '@shot-there/components';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

/** A textarea and one with a 20-character limit. */
@Component({
  selector: 'st-textarea-states',
  imports: [TextareaComponent, ReactiveFormsModule],
  templateUrl: './textarea-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaStatesComponent {
  protected readonly intro = new FormControl('', { nonNullable: true });
}
