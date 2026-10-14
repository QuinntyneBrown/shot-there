import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { inject, Injectable, Type } from '@angular/core';
import { DialogOptions } from '../types/dialog-options';

/** Opens every dialog, sheet and viewer, so backdrop, panel, scroll blocking, focus return and Escape are the same everywhere. */
@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly dialog = inject(Dialog);
  private readonly document = inject(DOCUMENT);

  open<R = unknown, D = unknown, C = unknown>(component: Type<C>, options: DialogOptions<D> = {}): DialogRef<R, C> {
    const kind = options.kind ?? 'dialog';
    const invoker = this.document.activeElement as HTMLElement | null;
    const ref = this.dialog.open<R, D, C>(component, {
      data: options.data,
      hasBackdrop: true,
      backdropClass: 'backdrop',
      panelClass: ['st-dialog-pane', 'st-dialog-pane--' + kind],
      role: 'dialog',
      ariaModal: true,
      autoFocus: 'first-tabbable',
      restoreFocus: false,
      closeOnNavigation: true,
    });
    ref.closed.subscribe(() => this.returnFocus(options.returnFocusTo, invoker));
    return ref;
  }

  private returnFocus(target: HTMLElement | string | undefined, invoker: HTMLElement | null): void {
    const element = typeof target === 'string' ? this.document.querySelector<HTMLElement>(target) : (target ?? invoker);
    element?.focus();
  }
}
