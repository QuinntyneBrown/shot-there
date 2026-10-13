/** One server-computed fact about a guide entry; `label` is the data-point key the frontend localizes. */
export interface GuideDataPointDto {
  label: 'allInCost2h' | 'overallScore' | 'permitSummary';
  value: number | string | null;
}
