export const SESSION_COOKIE = 'st_session';
export const CSRF_COOKIE = 'st_csrf';

/** `st_session`: HttpOnly so scripts cannot read it. */
export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

/** `st_csrf`: readable by the admin app, which echoes it in `X-CSRF-Token`. */
export function csrfCookie(csrfToken: string): string {
  return `${CSRF_COOKIE}=${csrfToken}; Path=/; Secure; SameSite=Lax`;
}
