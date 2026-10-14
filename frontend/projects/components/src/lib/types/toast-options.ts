import { Tone } from './tone';

/** `actionLabel` needs `action` or `actionLink`. */
export interface ToastOptions {
  tone: Exclude<Tone, 'neutral'>;
  title: string;
  text?: string;
  actionLabel?: string;
  /** Runs, then the toast dismisses. */
  action?: () => void;
  /** An application path: the action is a link. Wins over `action`. */
  actionLink?: string;
}
