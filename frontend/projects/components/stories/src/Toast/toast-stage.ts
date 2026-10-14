import { inject, provideAppInitializer } from '@angular/core';
import { applicationConfig } from '@storybook/angular';

import { ToastService, type ToastOptions } from '@shot-there/components';

/**
 * Stories render templates, which cannot inject. Each story's application
 * captures its own ToastService at bootstrap so its buttons raise toasts into
 * that story's region.
 */
export function toastStage() {
  let service: ToastService | undefined;
  return {
    decorator: applicationConfig({
      providers: [
        provideAppInitializer(() => {
          service = inject(ToastService);
        }),
      ],
    }),
    raise: (options: ToastOptions) => service?.show(options),
  };
}
