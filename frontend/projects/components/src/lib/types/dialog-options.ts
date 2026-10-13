import { DialogKind } from './dialog-kind';

export interface DialogOptions<D = unknown> {
  /** Default 'dialog'. */
  kind?: DialogKind;
  data?: D;
  /** An element or CSS selector; default: the invoking element. */
  returnFocusTo?: HTMLElement | string;
}
