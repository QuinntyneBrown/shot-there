The DS price block (`.price-block`, on the host): `st-price-block` shows a studio's all-in cost for a standard 2-hour shoot (`.price-block__allin`), one sentence saying how it was reached, the rate and fees as an `st-description-list`, and the date the prices were last verified (`.price-block__verified`, a `<time>`).

The default slot follows the verified line; the application projects the stale-prices `st-alert` into it. Every figure and sentence arrives formatted from the application.
