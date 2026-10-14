import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastRegionComponent, ToastService } from '@shot-there/components';
import { ActivationLogComponent } from '../activation-log/activation-log.component';

/** Buttons raising each kind of toast, and the region. */
@Component({
  selector: 'st-toast-shell',
  imports: [ToastRegionComponent, ActivationLogComponent],
  templateUrl: './toast-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastShellComponent {
  private readonly toasts = inject(ToastService);
  protected readonly log = signal<readonly string[]>([]);

  protected success(): void {
    this.toasts.show({
      tone: 'success',
      title: 'Studio is published',
      text: 'It appears in lists soon.',
      actionLabel: 'View public page',
      actionLink: '/studios/corktown',
    });
  }

  protected failure(): void {
    this.toasts.show({
      tone: 'danger',
      title: 'Could not save',
      actionLabel: 'Try again',
      action: () => this.log.update((log) => [...log, 'retry']),
    });
  }

  protected info(n: number): void {
    this.toasts.show({ tone: 'info', title: 'Toast ' + n });
  }
}
