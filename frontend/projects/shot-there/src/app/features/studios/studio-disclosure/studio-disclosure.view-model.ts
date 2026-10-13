import { StudioDisclosureDto } from '@shot-there/api';

/** The disclosure sentence for how the session was paid for (L2-012). */
export function disclosureMessage(disclosure: StudioDisclosureDto): string {
  switch (disclosure.kind) {
    case 'paidFull':
      return $localize`I paid the full rate for this session. No studio pays for placement or scores.`;
    case 'discounted':
      return $localize`This session was discounted by ${disclosure.provider}:provider:. That did not affect the scores.`;
    case 'comped':
      return $localize`This session was provided free of charge by ${disclosure.provider}:provider:. That did not affect the scores.`;
  }
}
