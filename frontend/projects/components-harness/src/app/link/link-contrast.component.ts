import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LinkComponent } from '@shot-there/components';

/** Inline, standalone and external links on the page, a guide entry, the map popup and a sunken panel. */
@Component({
  selector: 'st-link-contrast',
  imports: [LinkComponent],
  templateUrl: './link-contrast.component.html',
  styleUrl: './link-contrast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkContrastComponent {
  protected readonly surfaces = ['page', 'guide entry', 'map popup', 'sunken panel'];
}
