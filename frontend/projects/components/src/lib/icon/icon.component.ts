import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from '../types/icon-name';
import { IconSize } from '../types/icon-size';

/**
 * A decorative icon from the DS icon sheet (foundations/iconography.html). Meaning comes from
 * adjacent text or the parent's accessible name. The drawings are CRD icon.md's table.
 */
@Component({
  selector: 'st-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<IconSize>('md');

  protected readonly sizeClass = computed(() =>
    this.size() === 'md' ? null : `icon--${this.size()}`,
  );
}
