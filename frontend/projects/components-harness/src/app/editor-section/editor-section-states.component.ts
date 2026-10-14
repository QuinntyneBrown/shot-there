import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EditorSectionComponent, TextFieldComponent } from '@shot-there/components';

/** An open section, a collapsed one with an error count and a loading one. */
@Component({
  selector: 'st-editor-section-states',
  imports: [EditorSectionComponent, TextFieldComponent],
  templateUrl: './editor-section-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorSectionStatesComponent {
  protected readonly open = signal(true);
}
