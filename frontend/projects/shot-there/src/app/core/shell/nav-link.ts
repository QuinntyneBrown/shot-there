/** One header, menu or footer link. */
export interface NavLink {
  path: string;
  label: string;
  /** The one-line summary the site menu shows under the label. */
  description: string;
}
