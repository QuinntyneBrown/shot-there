/** The body of POST /api/subscribers. */
export interface SubscribeRequest {
  email: string;
  /** The path of the page the visitor subscribed from. */
  sourcePath: string;
  /** The honeypot field; people leave it empty. */
  website: string;
}
