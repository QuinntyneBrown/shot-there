import type { PageRevalidator } from '@/lib/publishing/page-revalidator';

/** Records each revalidation request instead of calling a hosting provider. */
export class RecordingPageRevalidator implements PageRevalidator {
  readonly routes: string[][] = [];

  async revalidate(routes: string[]): Promise<void> {
    this.routes.push(routes);
  }
}
