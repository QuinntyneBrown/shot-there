import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { ToastOptions } from '../types/toast-options';

const AUTO_DISMISS_MS = 8000;

/** Internal: one toast. Non-danger tones dismiss after 8 s, pausing while hovered or focused. Not exported. */
@Component({
  selector: 'st-toast-item',
  imports: [IconComponent, RouterLink],
  templateUrl: './toast-item.component.html',
  styleUrl: './toast-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'toast toast--' + options().tone",
    '[attr.role]': "options().tone === 'danger' ? 'alert' : null",
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'resume()',
    '(focusin)': 'pause()',
    '(focusout)': 'resume()',
  },
})
export class ToastItemComponent {
  readonly options = input.required<ToastOptions>();
  readonly dismissed = output<void>();

  protected readonly dismissLabel = $localize`:@@st.toast.dismiss:Dismiss`;

  private remaining = AUTO_DISMISS_MS;
  private startedAt = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    queueMicrotask(() => this.resume());
  }

  protected persistent(): boolean {
    return this.options().tone === 'danger';
  }

  protected pause(): void {
    if (this.timer === undefined) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    this.remaining -= Date.now() - this.startedAt;
  }

  protected resume(): void {
    if (this.persistent() || this.timer !== undefined) return;
    this.startedAt = Date.now();
    this.timer = setTimeout(() => this.dismissed.emit(), Math.max(0, this.remaining));
  }

  protected act(): void {
    this.options().action?.();
    this.dismissed.emit();
  }
}
