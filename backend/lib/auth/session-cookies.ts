export const SESSION_COOKIE = 'st_session';
export const CSRF_COOKIE = 'st_csrf';

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

/** `st_session`: HttpOnly so scripts cannot read it, and sent only to the API (ICD §8.1). */
export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${SEVEN_DAYS_SECONDS}`;
}

/** `st_csrf`: readable by the admin app, which echoes it in `X-CSRF-Token`. */
export function csrfCookie(csrfToken: string): string {
  return `${CSRF_COOKIE}=${csrfToken}; Secure; SameSite=Lax; Path=/; Max-Age=${SEVEN_DAYS_SECONDS}`;
}

/** Expires both cookies in the browser. */
export function clearedCookies(): string[] {
  return [
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0`,
    `${CSRF_COOKIE}=; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ];
}
