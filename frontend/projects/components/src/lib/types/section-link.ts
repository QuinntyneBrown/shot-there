/** `exact` asks for exact RouterLinkActive matching; `attention` renders the row's data-highlight. */
export interface SectionLink {
  label: string;
  meta?: string;
  link: string;
  exact?: boolean;
  attention?: boolean;
}
