import { AsyncLocalStorage } from 'node:async_hooks';

/** Holds the current request's correlation ID so application code can log with it. */
export const correlationContext = new AsyncLocalStorage<string>();

export function currentCorrelationId(): string {
  return correlationContext.getStore() ?? 'none';
}
