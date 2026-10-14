import { ToastOptions } from '../types/toast-options';

/** What the region renders for one raised toast. */
export interface ToastEntry {
  readonly id: number;
  readonly options: ToastOptions;
}
