/** Everything outside the process that application functions reach through. Tests replace it with fakes. */
export interface Dependencies {
  probeDatabase(): Promise<void>;
}
