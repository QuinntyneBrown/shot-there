import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FileUploadComponent } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** A file upload with a hint and refused-file errors; selected files are logged. */
@Component({
  selector: 'st-file-upload-states',
  imports: [FileUploadComponent, ActivationLogComponent],
  templateUrl: './file-upload-states.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadStatesComponent {
  protected readonly log = signal<readonly string[]>([]);
}
