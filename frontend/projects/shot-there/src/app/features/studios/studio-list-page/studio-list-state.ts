import { StudioSummary } from '@shot-there/api';

export type StudioListState =
  | { status: 'loading' }
  | { status: 'loaded'; studios: StudioSummary[] }
  | { status: 'error' };
