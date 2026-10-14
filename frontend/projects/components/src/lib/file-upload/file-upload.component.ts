import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { _IdGenerator } from '@angular/cdk/a11y';
import { inject } from '@angular/core';

/** The DS file upload: a drop area whose label is the visible trigger for a visually hidden file input. */
@Component({
  selector: 'st-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
  readonly buttonLabel = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly accept = input('');
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly errors = input<readonly string[]>([]);
  readonly filesSelected = output<File[]>();

  protected readonly inputId = inject(_IdGenerator).getId('st-file-');

  protected picked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length) this.filesSelected.emit(files);
  }

  protected dropped(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (files.length) this.filesSelected.emit(this.multiple() ? files : files.slice(0, 1));
  }

  protected dragged(event: DragEvent): void {
    event.preventDefault();
  }
}
