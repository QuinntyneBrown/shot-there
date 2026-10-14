import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SaveState } from '../types/save-state';

/** The DS save status: a polite live line saying whether the editor has unsaved, saving, saved or refused changes. */
@Component({
  selector: 'st-save-status',
  templateUrl: './save-status.component.html',
  styleUrl: './save-status.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'save-status',
    '[class.save-status--saved]': "state() === 'saved'",
    '[class.save-status--error]': "state() === 'error'",
    role: 'status',
  },
})
export class SaveStatusComponent {
  readonly state = input<SaveState>('idle');
  readonly text = input('');
}
