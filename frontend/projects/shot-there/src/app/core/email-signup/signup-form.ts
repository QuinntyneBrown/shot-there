import { SignupState } from './signup-state';

/** The browser-side check of a signup address (L2-039); the server checks again. Returns the message, or null when valid. */
export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) {
    return $localize`Enter your email address`;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return $localize`Enter a valid email address, like name@example.com`;
  }
  return null;
}

/** The form state for a finished request's HTTP status (L2-041). */
export function toSignupState(status: number): SignupState {
  if (status >= 200 && status < 300) {
    return 'success';
  }
  return status === 429 ? 'rate-limited' : 'failed';
}
