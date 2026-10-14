import { StudioSummary } from '@shot-there/api';

export type HomePageState =
  | { status: 'loading' }
  | { status: 'loaded'; latestStudios: StudioSummary[] }
  | { status: 'error' };
