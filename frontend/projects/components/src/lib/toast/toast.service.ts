import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ToastOptions } from '../types/toast-options';
import { ToastRef } from '../types/toast-ref';
import { ToastEntry } from './toast-entry';

/** Raises toasts. The application renders one st-toast-region in the shell, which shows what this service holds. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private nextId = 1;
  private readonly held = signal<readonly ToastEntry[]>([]);

  /** The toasts held now, oldest first. */
  readonly toasts = this.held.asReadonly();

  show(options: ToastOptions): ToastRef {
    const id = this.nextId++;
    if (this.browser) {
      this.held.update((held) => [...held, { id, options }]);
    }
    return { dismiss: () => this.dismiss(id) };
  }

  dismiss(id: number): void {
    this.held.update((held) => held.filter((entry) => entry.id !== id));
  }
}
