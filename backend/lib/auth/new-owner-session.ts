export interface NewOwnerSession {
  /** Raw session token for the `st_session` cookie. */
  token: string;
  /** Anti-forgery token for the `st_csrf` cookie. */
  csrfToken: string;
}
