/** `link` is an application path, or an absolute URL when `external` is true. */
export interface NavLink {
  label: string;
  link: string;
  external?: boolean;
  exact?: boolean;
}
