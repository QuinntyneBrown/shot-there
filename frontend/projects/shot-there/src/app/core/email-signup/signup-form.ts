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
