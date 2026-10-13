import { StudioDetailDto } from '@shot-there/api';

export type StudioPageState =
  | { status: 'loading' }
  | { status: 'loaded'; studio: StudioDetailDto }
  | { status: 'not-found' };
