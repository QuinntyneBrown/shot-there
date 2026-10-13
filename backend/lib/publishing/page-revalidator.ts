/** Asks the hosting provider to re-render and purge public routes. */
export interface PageRevalidator {
  revalidate(routes: string[]): Promise<void>;
}
