import AxeBuilder from '@axe-core/playwright';
import { Locator, Page } from '@playwright/test';

export type HarnessTheme = 'light' | 'dark';

const PLACEHOLDER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="#ccc"/></svg>';

/** A components-harness route: one library component state (ICD-002 D-12). */
export class HarnessPage {
  /** Console errors and uncaught exceptions, including hydration mismatches, since the page object was made. */
  readonly errors: string[] = [];

  constructor(readonly page: Page) {
    page.on('console', (message) => message.type() === 'error' && this.errors.push(message.text()));
    page.on('pageerror', (error) => this.errors.push(error.message));
  }

  /**
   * Opens `<component>/<state>` at a viewport width (CSS px) in a colour scheme. Images under
   * /test-images/ load as a placeholder and external https sites are stubbed, so nothing reaches the network.
   */
  async open(path: string, options: { width?: number; theme?: HarnessTheme; hydrationDelayMs?: number } = {}): Promise<void> {
    const { width = 1280, theme = 'light', hydrationDelayMs = 0 } = options;
    if (hydrationDelayMs > 0) {
      // Holding back the scripts lets the server-rendered page settle (images load or fail) before Angular hydrates.
      await this.page.route('**/*.js', async (route) => {
        await new Promise((done) => setTimeout(done, hydrationDelayMs));
        await route.continue();
      });
    }
    await this.page.route('**/test-images/**', (route) => route.fulfill({ contentType: 'image/svg+xml', body: PLACEHOLDER_SVG }));
    // Every external site (the YouTube player, booking sites, maps, permit sources) is a stub page,
    // including in tabs the page opens.
    await this.page.context().route('https://**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>external</title>' }),
    );
    await this.page.setViewportSize({ width, height: 800 });
    await this.page.emulateMedia({ colorScheme: theme });
    await this.page.goto(`/${path}`);
  }

  /** One example on a harness route: a `<section aria-label>` wrapping a component state. */
  example(name: string): Locator {
    return this.page.getByRole('region', { name, exact: true });
  }

  /** What the harness's listeners received, oldest first: each line names one event (`click: Save changes`). */
  activations(): Promise<string[]> {
    return this.page.getByRole('log', { name: 'Activations' }).getByRole('listitem').allInnerTexts();
  }

  /** The harness's own status line (role="status"), where a route reports what the component changed. */
  status(): Locator {
    return this.page.getByRole('status');
  }

  /** Flips a harness checkbox that drives a component input (for example "Busy"). */
  async toggle(label: string): Promise<void> {
    await this.page.getByRole('checkbox', { name: label, exact: true }).click();
  }

  hasHorizontalScroll(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  }

  /** A colour token's current value as `rgb(r, g, b)`, for comparing with computed colours. */
  tokenColour(token: string): Promise<string> {
    return this.page.evaluate((name) => {
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${r}, ${g}, ${b})`;
    }, token);
  }

  /**
   * Presses Tab `count` times from the top of the page and returns each focused element as
   * `<tag> <accessible name>`, so specs can see what takes focus and in what order.
   */
  async tabSequence(count: number): Promise<string[]> {
    await this.page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    const stops: string[] = [];
    for (let i = 0; i < count; i++) {
      await this.page.keyboard.press('Tab');
      stops.push(
        await this.page.evaluate(() => {
          const el = document.activeElement;
          const name = el?.getAttribute('aria-label') ?? (el as HTMLElement | null)?.innerText ?? '';
          return `${el?.tagName.toLowerCase()} ${name.replace(/\s+/g, ' ').trim()}`;
        }),
      );
    }
    return stops;
  }

  /**
   * Loads a route roughly as Lighthouse's mobile profile does (412px wide, CPU slowed 4x) and returns
   * Largest Contentful Paint in ms and the Cumulative Layout Shift once the page has settled (L2-071).
   */
  async loadMetrics(path: string): Promise<{ lcp: number; cls: number }> {
    const cdp = await this.page.context().newCDPSession(this.page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await this.open(path, { width: 412 });
    return this.page.evaluate(
      () =>
        new Promise<{ lcp: number; cls: number }>((resolve) => {
          let lcp = 0;
          let cls = 0;
          new PerformanceObserver((list) => list.getEntries().forEach((e) => (lcp = e.startTime))).observe({
            type: 'largest-contentful-paint',
            buffered: true,
          });
          new PerformanceObserver((list) =>
            list.getEntries().forEach((e) => {
              const shift = e as PerformanceEntry & { value: number; hadRecentInput: boolean };
              if (!shift.hadRecentInput) cls += shift.value;
            }),
          ).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve({ lcp, cls }), 1500);
        }),
    );
  }

  /**
   * Runs an interaction with the CPU slowed 4x and returns the longest event duration it produced, in ms:
   * the page's interaction-to-next-paint for that interaction (L2-071). Events under 16 ms count as 0.
   */
  async interactionLatency(interaction: () => Promise<void>): Promise<number> {
    const cdp = await this.page.context().newCDPSession(this.page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await this.page.evaluate(() => {
      const w = window as unknown as { __longestInteraction: number };
      w.__longestInteraction = 0;
      new PerformanceObserver((list) =>
        list.getEntries().forEach((e) => {
          if ((e as PerformanceEntry & { interactionId?: number }).interactionId) {
            w.__longestInteraction = Math.max(w.__longestInteraction, e.duration);
          }
        }),
      ).observe({ type: 'event', durationThreshold: 16, buffered: true } as PerformanceObserverInit);
    });
    await interaction();
    await this.page.waitForTimeout(500);
    const latency = await this.page.evaluate(() => (window as unknown as { __longestInteraction: number }).__longestInteraction);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    return latency;
  }

  async accessibilityViolations(): Promise<string[]> {
    const results = await new AxeBuilder({ page: this.page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    return results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
  }
}
