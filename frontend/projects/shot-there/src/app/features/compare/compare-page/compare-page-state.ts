import { ComparisonViewModel } from './comparison-view-model-type';

export type ComparePageState =
  { status: 'loading' } | { status: 'too-few' } | { status: 'loaded'; view: ComparisonViewModel };
