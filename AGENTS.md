# AGENTS.md for BaZi API

This repo teaches AI coding agents (Cursor, Claude Code, Aider, Codex, Windsurf, RooCode, Gemini CLI) how to use the RoxyAPI BaZi chart endpoint, the Four Pillars of Destiny calculator.

## Endpoint
- Method: `POST`
- URL: `https://roxyapi.com/api/v2/chinese-astrology/bazi/chart`
- Auth: `X-API-Key` header
- Domain: `chinese-astrology` (one of 14+ in the RoxyAPI catalog)
- Operation ID: `generateBaziChart` matches the SDK method name in camelCase
- MCP tool: `post_chinese_astrology_bazi_chart` on `https://roxyapi.com/mcp/chinese-astrology`

## TypeScript SDK
```ts
import { createRoxy } from '@roxyapi/sdk';
const roxy = createRoxy(process.env.ROXY_API_KEY!);
const { data, error } = await roxy.chineseAstrology.generateBaziChart({
  body: {
    date: '1990-06-15',
    time: '23:30:00',
    timezone: 'Asia/Shanghai',
    dayBoundary: 'split-zi',
    yearBoundary: 'li-chun',
    hourClock: 'clock',
  },
});
```

## Python SDK
```python
import os
from roxy_sdk import create_roxy
roxy = create_roxy(os.environ["ROXY_API_KEY"])
result = roxy.chinese_astrology.generate_bazi_chart(
    date="1990-06-15",
    time="23:30:00",
    timezone="Asia/Shanghai",
    day_boundary="split-zi",
    year_boundary="li-chun",
    hour_clock="clock",
)
```

## Setup step (coordinates not required)
This endpoint does not need coordinates, and neither does any other endpoint in this domain. A BaZi chart is read from the birth clock, so `latitude` is accepted only for consistency with the other birth data endpoints and changes nothing in the response. Do not call `/location/search` for this endpoint. Pass `date`, `time` and `timezone` directly, and prefer an IANA timezone name, which the server resolves to the offset in force on the birth date and echoes back as a number in `birthData.timezone`.

`longitude` is the one exception and it is conditional: it is required only when `hourClock` is `local-mean` or `solar`, which read the hour branch from the sun over the birth place. Sending either without `longitude` returns 400 with a message naming the field to add. With the default `hourClock` of `clock`, longitude is ignored.

## Request fields
- `date` (string, required): birth date YYYY-MM-DD. Sets the year, month and day pillars. The year pillar turns at Beginning of Spring, not 1 January, and the month pillar turns at each of the twelve minor solar terms, not at a calendar month boundary
- `time` (string, required): birth time HH:MM:SS, 24-hour. Sets the hour pillar. Each Earthly Branch covers two hours, so a birth within a few minutes of an odd hour can land in either
- `timezone` (number or IANA string, required): UTC offset (e.g. 8, 5.5) or IANA name (e.g. "Asia/Shanghai", "Asia/Taipei"). Server resolves the offset in force on the birth date and returns the resolved number
- `latitude` (number, optional): -90 to 90. Does not affect a BaZi chart. Defaults to 0
- `longitude` (number, optional): -180 to 180, positive East. Required when `hourClock` is `local-mean` or `solar`, ignored when it is `clock`
- `dayBoundary` (string, optional): `split-zi` (default), `midnight` or `early-zi`
- `yearBoundary` (string, optional): `li-chun` (default) or `lunar-new-year`
- `hourClock` (string, optional): `clock` (default), `local-mean` or `solar`
- `lang` (query, optional): `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`

## Response top level keys
- `birthData`: echoed input with `timezone` resolved to the decimal offset actually applied
- `conventions`: the three school switches this result was computed under, `dayBoundary`, `yearBoundary` and `hourClock`. Present on every response in the BaZi family
- `pillars[]`: the four pillars, year first, then month, day and hour. Each has `position`, `id`, `number` (1 to 60 in the sexagenary cycle), `stem`, `branch`, `tenGod`, `hiddenStems[]`, `naYin`, `naYinChinese` and `naYinElement`
- `dayMaster`: the day stem, which is the subject of the whole chart. `stem`, `chinese`, `pinyin`, `element`, `polarity` and a `nature` paragraph
- `zodiacAnimal`: animal of the year branch under the year boundary that was applied
- `fiveElements[]`: one entry per phase with `element`, `count`, `level` and `reading`
- `interactions[]`: combinations, clashes, harms and punishments between the four pillars, each with `type`, `id`, `quality`, `positions[]`, `members[]` and `meaning`. An empty array is normal
- `summary`: one paragraph composed from the Day Master nature and the seasonal state of its element

## Domain rules
- Coordinates are not part of a BaZi chart. Never call `/location/search` for this endpoint, and never invent a latitude to satisfy a schema.
- The three convention switches are the point of this endpoint. Send them explicitly when reproducing a specific chart, and store the returned `conventions` object beside any chart you persist. Two calculators can produce different pillars for one birth and both be correct, and `conventions` is what says which reading you are holding.
- `dayBoundary` only changes anything for a birth between 23:00 and 23:59. Under `early-zi` the day pillar moves, which moves the Day Master, which re-labels every Ten God in the chart. Under `midnight` only the hour stem moves. Under `split-zi` the day holds and the hour stem is taken from the next day.
- `yearBoundary` only changes anything for a birth between Lunar New Year and Beginning of Spring, which is a few weeks each year. `li-chun` is the default on this endpoint. The folk zodiac route `/chinese-astrology/zodiac/sign` defaults to `lunar-new-year` instead, so the two can disagree for the same birth by design.
- `hourClock` of `local-mean` or `solar` needs `longitude`. Together they can move the hour branch by up to 75 minutes, which matters for a birth near an odd hour or near the edge of a wide time zone.
- Every identifier is canonical English: `stem.id`, `branch.id`, `tenGod.id`, `conventions.*`, `type`, `quality`, `level`, `role`, `position`, `zodiacAnimal`. Branch on those. With `?lang=` set, a `*Localized` sibling appears for display only. Read `nameLocalized ?? name` and never compare against the translated value.
- `hiddenStems[].role` is a rank, `principal` then `middle` then `residual`. Some schools label the same three positions by function rather than by rank, which swaps two of the labels on the storage branches, so compare on rank.
- `fiveElements[].count` weighs the four stems and the four branch elements one point each and deliberately excludes hidden stems. A weighted total including hidden stems is a different quantity, so do not mix the two.
- The endpoint is deterministic. The same birth moment under the same conventions always produces the same chart, so a result is safe to cache on your side and keyed by birth plus conventions.

## Related endpoints
- `POST /chinese-astrology/bazi/day-master` (`calculateDayMasterStrength`): the strong or weak verdict, with the three classical factors published separately and summing into `score`, plus the favourable and unfavourable element lists
- `POST /chinese-astrology/bazi/luck-pillars` (`calculateLuckPillars`): the ten year luck pillar timeline. Requires `gender`, because the direction rule depends on it
- `POST /chinese-astrology/bazi/compatibility` (`calculateBaziCompatibility`): two charts read against each other, with the Day Master relation, the cross interactions and a score
- `POST /chinese-astrology/bazi/annual-forecast` (`calculateAnnualForecast`): the Liu Nian yearly pillar against the natal chart, with the `benMingNian` flag
- `GET /chinese-astrology/calendar/solar-terms/{year}` (`listSolarTerms`): the 24 solar terms with exact instants, which is what settles a month pillar boundary dispute

## Verified
2026-Q3 against `https://roxyapi.com/api/v2/openapi.json`. Re-fetch the spec for ground truth before changing this file.

## Discovery
- Full catalog: https://roxyapi.com/AGENTS.md
- LLM index: https://roxyapi.com/llms.txt
- Methodology: https://roxyapi.com/methodology
