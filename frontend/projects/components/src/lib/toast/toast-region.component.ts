import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ToastItemComponent } from './toast-item.component';
import { ToastService } from './toast.service';

/** The DS toast region: rendered once by the shell, shows the newest three toasts the ToastService holds. */
@Component({
  selector: 'st-toast-region',
  imports: [ToastItemComponent],
  templateUrl: './toast-region.component.html',
  styleUrl: './toast-region.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'toast-region', role: 'status', 'aria-live': 'polite' },
})
export class ToastRegionComponent {
  private readonly service = inject(ToastService);

  protected readonly visible = computed(() => this.service.toasts().slice(-3));

  protected dismiss(id: number): void {
    this.service.dismiss(id);
  }
}
