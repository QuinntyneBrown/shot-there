import { booleanAttribute, ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { HeadingLevel } from '../types/heading-level';

/** The DS collapsible editor section: a details element whose summary holds the heading and an error count. */
@Component({
  selector: 'st-editor-section',
  imports: [SkeletonComponent],
  templateUrl: './editor-section.component.html',
  styleUrl: './editor-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.title]': 'null' },
})
export class EditorSectionComponent {
  readonly title = input.required<string>();
  readonly headingLevel = input<HeadingLevel>(2);
  readonly open = model(true);
  readonly errorText = input<string | null>(null);
  readonly loading = input(false, { transform: booleanAttribute });

  protected toggled(event: Event): void {
    this.open.set((event.target as HTMLDetailsElement).open);
  }
}
