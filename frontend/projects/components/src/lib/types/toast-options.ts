import { Tone } from './tone';

export interface ToastOptions {
  tone: Exclude<Tone, 'neutral'>;
  title: string;
  text?: string;
  actionLabel?: string;
  /** Required when `actionLabel` is set. */
  action?: () => void;
}
