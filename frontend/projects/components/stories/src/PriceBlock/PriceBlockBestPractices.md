## Best practices

### Layout

- The price block is the first section of every studio review and fills the main column; the "Pricing" heading and its section are the application's.
- Project only the stale warning into the slot: an `st-alert` with `tone="warning"` and `role="status"`. Every price stays visible beside it.

### Content

- CAD with a dollar sign and two decimals ("$145.00"); no "CAD" and no "/h" in the panel.
- `allInText` names how the figure was reached: "All-in for a standard 2-hour shoot: 2 hours at $60.00 plus the mandatory cleaning fee."
- Every fee says whether it counts: badge "Mandatory" or "Optional, not in all-in". With no fees, a row "Extra fees" / "None".
- The verified line uses the long date: "Prices verified 22 September 2026".

### Accessibility

- The block is not interactive and announces nothing itself; it reads in order, figure first.
- The stale alert is the status region, present at load.
