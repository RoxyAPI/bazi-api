[![BaZi API](banner.png)](https://roxyapi.com/products/chinese-astrology-api)

# BaZi API

> BaZi API for the Four Pillars of Destiny. Year, month, day and hour pillars with every Heavenly Stem and Earthly Branch, the hidden stems inside each branch, the Ten Gods measured from the Day Master, the Na Yin sound element of each pair, the five element balance, and the clashes and combinations running between the pillars. The day boundary, year boundary and hour clock are typed request parameters, and every response echoes the conventions it was computed under. One key covers 14+ spiritual domains. MCP-first.

[![Get API Key](https://img.shields.io/badge/Get_API_Key-RoxyAPI-14b8a6?style=for-the-badge&logo=key&logoColor=white)](https://roxyapi.com/pricing)
[![Try Live](https://img.shields.io/badge/Try_API_Live-Free_in_browser-22c55e?style=for-the-badge&logo=swagger&logoColor=white)](https://roxyapi.com/api-reference)
[![Conventions](https://img.shields.io/badge/Conventions-Typed_and_echoed-f59e0b?style=for-the-badge)](https://roxyapi.com/methodology)
[![MCP Server](https://img.shields.io/badge/MCP_Server-Streamable_HTTP-8b5cf6?style=for-the-badge&logo=anthropic&logoColor=white)](https://roxyapi.com/docs/mcp)
[![SDK](https://img.shields.io/badge/SDK-TypeScript_+_Python_+_PHP_+_C%23_+_Go_+_WordPress-3b82f6?style=for-the-badge&logo=npm&logoColor=white)](https://roxyapi.com/docs/sdk)

## What is BaZi API

BaZi, the Four Pillars of Destiny, reads a birth moment as eight characters: a Heavenly Stem and an Earthly Branch for the year, the month, the day and the hour. This repo ships working TypeScript, JavaScript and Python samples against the RoxyAPI BaZi endpoint, the Four Pillars of Destiny API inside the wider Chinese astrology API. Pass a birth date, a birth time and a timezone, and the BaZi API returns all four pillars with their stems and branches, the hidden stems stored inside each branch, the Ten God relation every stem holds to the Day Master, the Na Yin sound element of each stem and branch pair, the count of each phase across the eight characters, and every combination, clash, harm and punishment the four pillars form with each other.

The part most callers come here for is reproducibility. A Four Pillars chart is not one calculation, it is a family of them, and three separate school splits decide which chart you get. This BaZi calculator API types all three as request parameters with named defaults and echoes the applied set back in a `conventions` object on every response, so a chart says which reading it is instead of leaving you to guess. Point it at a published chart and you can reproduce that chart rather than argue with it.

One subscription unlocks 14+ spiritual domains and 200+ endpoints: Western astrology, Vedic astrology, Forecast, Human Design, Chinese astrology, Feng Shui, numerology, tarot, biorhythm, I Ching, crystals, dreams, angel numbers and location.

## Why this API

| Property | Value |
|----------|-------|
| Coverage | 14+ spiritual domains and 200+ endpoints in one subscription |
| Reproducibility | `dayBoundary`, `yearBoundary` and `hourClock` are typed request parameters with named defaults, echoed in a `conventions` object on every response |
| Depth per call | Four pillars, hidden stems, Ten Gods, Na Yin, five element balance and pillar interactions in one request |
| Languages | Ten on this domain: English plus nine locales, including Simplified and Traditional Chinese |
| MCP server | `https://roxyapi.com/mcp/chinese-astrology` (Streamable HTTP, no local setup) |
| SDKs | TypeScript on npm `@roxyapi/sdk`, Python on PyPI `roxy-sdk`, PHP on Packagist `roxyapi/sdk`, C# on NuGet `RoxyApi.Sdk`, Go `github.com/RoxyAPI/sdk-go`, WordPress plugin `roxyapi` |
| Pricing | One key, flat per call, from $39/mo |
| Licensing | Personal and commercial use, including closed source apps. No AGPL or GPL entanglement. [Full terms](https://roxyapi.com/policy/license) |
| Last verified | 2026-Q3 |

## Quick start

1. Get a key at [roxyapi.com/pricing](https://roxyapi.com/pricing)
2. Pick a language below
3. Copy the snippet, run, ship

A BaZi chart is driven by the birth clock, not the observer position, so latitude and longitude are optional. Send the birth date, the birth time and the timezone and you have a chart. Prefer the IANA timezone name: it resolves to the offset that was actually in force on the birth date, which matters more often than people expect. The sample below is a Shanghai birth in June 1990, and it comes back as UTC plus 9 because China was on summer time that year.

Longitude only becomes required when you switch `hourClock` to `local-mean` or `solar`, which read the hour branch from the sun over the birth place instead of from the civil clock.

### cURL

```bash
curl -X POST https://roxyapi.com/api/v2/chinese-astrology/bazi/chart \
  -H "X-API-Key: $ROXY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "1990-06-15",
    "time": "23:30:00",
    "timezone": "Asia/Shanghai",
    "dayBoundary": "split-zi",
    "yearBoundary": "li-chun",
    "hourClock": "clock"
  }'
```

### Python

```python
import os
from roxy_sdk import create_roxy

roxy = create_roxy(os.environ["ROXY_API_KEY"])

# Four Pillars of Destiny chart for one birth moment
result = roxy.chinese_astrology.generate_bazi_chart(
    date="1990-06-15",
    time="23:30:00",
    timezone="Asia/Shanghai",
    day_boundary="split-zi",
)

print("Day Master:", result["dayMaster"]["stem"], result["dayMaster"]["element"])
for p in result["pillars"]:
    print(f"{p['position']:<6} {p['id']:<10} {p['tenGod']['name']:<18} {p['naYin']}")
```

### JavaScript (Node)

```js
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

// Four Pillars of Destiny chart for one birth moment
const { data, error } = await roxy.chineseAstrology.generateBaziChart({
  body: {
    date: '1990-06-15',
    time: '23:30:00',
    timezone: 'Asia/Shanghai',
    dayBoundary: 'split-zi',
  },
});

if (error) throw new Error(error.error);

console.log('Day Master:', data.dayMaster.stem, data.dayMaster.element);
data.pillars.forEach(p => console.log(p.position, p.id, p.tenGod.name, p.naYin));
```

### TypeScript

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

// Four Pillars of Destiny chart for one birth moment
const { data, error } = await roxy.chineseAstrology.generateBaziChart({
  body: {
    date: '1990-06-15',
    time: '23:30:00',
    timezone: 'Asia/Shanghai',
    dayBoundary: 'split-zi',
  },
});

if (error) throw new Error(error.error);

console.log(`Day Master: ${data.dayMaster.stem} (${data.dayMaster.polarity} ${data.dayMaster.element})`);
console.log(`Conventions: ${Object.values(data.conventions).join(', ')}`);
for (const p of data.pillars) {
  console.log(`${p.position.padEnd(6)} ${p.id.padEnd(10)} ${p.tenGod.name.padEnd(18)} ${p.naYin}`);
}
```

## Request schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | yes | Birth date in YYYY-MM-DD format. Sets the year, month and day pillars. The year pillar turns at Beginning of Spring rather than on 1 January, and the month pillar turns at each of the twelve minor solar terms rather than at a calendar month boundary |
| `time` | string | yes | Birth time in 24-hour HH:MM:SS format. Sets the hour pillar. Each Earthly Branch covers two hours, so a birth within a few minutes of an odd hour can land in either |
| `timezone` | number or string | yes | Decimal hours from UTC (e.g. -5, 5.5) OR an IANA name (e.g. "Asia/Shanghai", "Asia/Taipei"). An IANA name resolves to the offset in force on the birth date, and the resolved number comes back in `birthData.timezone` |
| `latitude` | number | no | Birth latitude in decimal degrees. Accepted for consistency with the other birth data endpoints and does not affect any part of a BaZi chart. Defaults to 0 |
| `longitude` | number | no | Birth longitude in decimal degrees. Positive is East, negative is West. Required when `hourClock` is `local-mean` or `solar`, and ignored when it is `clock` |
| `dayBoundary` | string | no | Which instant starts the sexagenary day. `split-zi` (default), `midnight` or `early-zi`. Only matters for a birth between 23:00 and 23:59 |
| `yearBoundary` | string | no | Which instant starts the sexagenary year. `li-chun` (default here, Beginning of Spring around 4 February, the rule the BaZi texts use) or `lunar-new-year` (the folk rule people mean when they name their animal) |
| `hourClock` | string | no | Which clock the hour branch is read from. `clock` (default, civil time as recorded), `local-mean` (mean sun over the birth longitude, up to 59 minutes of shift) or `solar` (adds the equation of time, up to a further 16 minutes) |
| `lang` | query | no | Response language. `en`, `tr`, `de`, `es`, `hi`, `pt`, `fr`, `ru`, `zh-Hans`, `zh-Hant`. Adds a `*Localized` field beside each canonical English one |

## Response shape

```json
{
  "birthData": {
    "date": "1990-06-15",
    "time": "23:30:00",
    "timezone": 9,
    "latitude": 0
  },
  "conventions": {
    "dayBoundary": "split-zi",
    "yearBoundary": "li-chun",
    "hourClock": "clock"
  },
  "pillars": [
    {
      "position": "year",
      "id": "geng-wu",
      "number": 7,
      "stem": { "id": "geng", "pinyin": "gēng", "element": "Metal", "polarity": "yang" },
      "branch": { "id": "wu", "pinyin": "wǔ", "animal": "horse", "element": "Fire", "polarity": "yang" },
      "tenGod": {
        "id": "rob-wealth",
        "name": "Rob Wealth",
        "category": "peer",
        "keynote": "Drive, nerve, and competition for the same ground"
      },
      "hiddenStems": [
        {
          "stem": { "id": "ding", "element": "Fire", "polarity": "yin" },
          "role": "principal",
          "tenGod": { "id": "seven-killings", "name": "Seven Killings", "category": "influence" }
        },
        {
          "stem": { "id": "ji", "element": "Earth", "polarity": "yin" },
          "role": "middle",
          "tenGod": { "id": "indirect-resource", "name": "Indirect Resource", "category": "resource" }
        }
      ],
      "naYin": "Earth by the Roadside",
      "naYinElement": "Earth"
    },
    {
      "position": "day",
      "id": "xin-hai",
      "number": 48,
      "stem": { "id": "xin", "pinyin": "xīn", "element": "Metal", "polarity": "yin" },
      "branch": { "id": "hai", "pinyin": "hài", "animal": "pig", "element": "Water", "polarity": "yin" },
      "tenGod": {
        "id": "day-master",
        "name": "Day Master",
        "category": "self",
        "keynote": "The self the whole chart is read from"
      },
      "hiddenStems": [
        {
          "stem": { "id": "ren", "element": "Water", "polarity": "yang" },
          "role": "principal",
          "tenGod": { "id": "hurting-officer", "name": "Hurting Officer", "category": "output" }
        },
        {
          "stem": { "id": "jia", "element": "Wood", "polarity": "yang" },
          "role": "middle",
          "tenGod": { "id": "direct-wealth", "name": "Direct Wealth", "category": "wealth" }
        }
      ],
      "naYin": "Metal of Hairpin and Bracelet",
      "naYinElement": "Metal"
    }
  ],
  "dayMaster": {
    "stem": "xin",
    "pinyin": "xīn",
    "element": "Metal",
    "polarity": "yin",
    "nature": "Jewel, coin and finished blade rather than raw ore: cool, smooth and already refined."
  },
  "zodiacAnimal": "horse",
  "fiveElements": [
    {
      "element": "Wood",
      "count": 0,
      "level": "deficient",
      "reading": "No Wood in the chart. Nothing pushes for growth on its own initiative, so plans tend to wait for an external reason to start and flexibility has to be decided on rather than felt."
    },
    {
      "element": "Metal",
      "count": 3,
      "level": "excess",
      "reading": "Metal is concentrated. Precision, judgement, and follow-through are strong, and the risk is severity: enough is cut away that little is left to grow from."
    }
  ],
  "interactions": [
    {
      "type": "clash",
      "id": "wu-zi",
      "quality": "challenging",
      "positions": ["year", "hour"],
      "members": ["wu", "zi"],
      "meaning": "Two Earthly Branches directly opposite on the cycle, six positions apart. A clash moves things: it breaks what was settled, and what it breaks is whatever the two positions govern. Not simply bad, and never quiet."
    }
  ],
  "summary": "This chart has a Metal Day Master born in a Fire month."
}
```

Abridged for reading. The live response returns all four pillars, one `fiveElements` entry per phase, every detected interaction, the full `dayMaster.nature` and `summary` paragraphs, and a `chinese` and `pinyin` field beside every identifier.

| Field | Type | Description |
|-------|------|-------------|
| `birthData` | object | Echo of the birth moment the chart was computed from, with `timezone` resolved to the decimal offset actually applied |
| `conventions` | object | The three school conventions this result was computed under. Returned on every BaZi response so a chart is self describing |
| `conventions.dayBoundary` | string | Day boundary applied: `split-zi`, `midnight` or `early-zi`. Echoes the request, or the default when it was omitted. Always English, safe to compare against in code |
| `conventions.yearBoundary` | string | Year boundary applied: `li-chun` or `lunar-new-year` |
| `conventions.hourClock` | string | Hour clock applied: `clock`, `local-mean` or `solar` |
| `pillars` | array | The four pillars, year first, then month, day and hour |
| `pillars[].position` | string | `year`, `month`, `day` or `hour`. The year pillar reads ancestry and early life, the month career and parents, the day the self and the partner, the hour later life and children |
| `pillars[].id` | string | Pillar identifier, the stem id and the branch id joined by a hyphen. Always English pinyin |
| `pillars[].number` | number | Position of this pillar in the sexagenary cycle, 1 to 60, where jia-zi is 1 |
| `pillars[].stem` | object | The Heavenly Stem: `id`, `chinese`, `pinyin`, `element`, `polarity` |
| `pillars[].branch` | object | The Earthly Branch: `id`, `chinese`, `pinyin`, `animal`, `element`, `polarity` |
| `pillars[].tenGod` | object | Relation the pillar stem holds to the Day Master, with `id`, `name`, `category` and a one line `keynote`. The day pillar carries `day-master`, because the day stem is the reference point rather than a relation to itself |
| `pillars[].hiddenStems` | array | The stems stored inside the branch, principal first. These carry the qi a branch holds without showing it, and they are where a Day Master finds a root |
| `pillars[].hiddenStems[].role` | string | Rank inside the branch: `principal`, `middle` or `residual`. A branch holds one to three. Compare on rank, since some schools label the same positions by function instead |
| `pillars[].naYin` | string | Na Yin sound element of the pillar, an older elemental reading assigned to each of the 30 stem and branch pairs, with the hanzi name in `naYinChinese` |
| `pillars[].naYinElement` | string | Element the Na Yin resolves to. Independent of the stem element and often different from it, which is why it is reported separately |
| `dayMaster` | object | The day stem, which is the subject of the whole chart: `stem`, `chinese`, `pinyin`, `element`, `polarity` and a `nature` paragraph in the imagery the tradition uses to separate the yang and yin form of one element |
| `zodiacAnimal` | string | Zodiac animal of the year branch, under the year boundary this request applied. A stable English value, never localized |
| `fiveElements` | array | Element balance across the eight chart characters, one entry per phase, each with `element`, `count`, `level` and a `reading` |
| `fiveElements[].count` | number | How many of the eight characters carry this phase, counting the four stems and the four branch elements one point each. Hidden stems are deliberately not counted here, because a weighted total is a different quantity |
| `fiveElements[].level` | string | `deficient` (absent from all eight), `balanced` (one or two) or `excess` (three or more) |
| `interactions` | array | Combinations, clashes, harms and punishments running between the four pillars. An empty array means the pillars stand independently, which is common and is not a defect |
| `interactions[].type` | string | `stem-combination`, `six-combination`, `trine`, `clash`, `harm`, `punishment` or `stem-clash`. A stable English value |
| `interactions[].quality` | string | `harmonious` for combinations and trines, `challenging` for clashes, harms and punishments |
| `interactions[].positions` | array | The chart positions taking part, in the same order as `members` |
| `summary` | string | One paragraph composed from the Day Master nature and the seasonal state of its element in the birth month. The narrative entry point for a chart |

Every identifier is canonical English so it stays safe to switch on. Set `?lang=` and a `*Localized` sibling appears beside it for display, for example `zodiacAnimalLocalized` beside `zodiacAnimal`. Read `nameLocalized ?? name` and never compare against the translated value.

## Reproduce a chart: the three day boundary schools

This is the section no other README can print, and it is the reason to use a typed API rather than a fixed one.

A birth between 23:00 and 23:59 lands in the zi hour, the double hour that straddles midnight, and three living conventions disagree about which sexagenary day it belongs to. Send the same birth moment three times, changing only `dayBoundary`, and watch the chart move. The example below is a birth on 15 June 1990 at 23:30 in `Asia/Shanghai`, and `example.ts`, `example.js` and `example.py` in this repo all run exactly this comparison.

```bash
for BOUNDARY in split-zi midnight early-zi; do
  curl -s -X POST https://roxyapi.com/api/v2/chinese-astrology/bazi/chart \
    -H "X-API-Key: $ROXY_API_KEY" -H "Content-Type: application/json" \
    -d "{\"date\":\"1990-06-15\",\"time\":\"23:30:00\",\"timezone\":\"Asia/Shanghai\",\"dayBoundary\":\"$BOUNDARY\"}" \
    | jq -c '{dayBoundary: .conventions.dayBoundary, day: .pillars[2].id, hour: .pillars[3].id, dayMaster: .dayMaster.stem}'
done
```

| `dayBoundary` | Year | Month | Day | Hour | Day Master |
|---------------|------|-------|-----|------|------------|
| `split-zi` (default) | geng-wu | ren-wu | xin-hai | geng-zi | xin, yin Metal |
| `midnight` | geng-wu | ren-wu | xin-hai | wu-zi | xin, yin Metal |
| `early-zi` | geng-wu | ren-wu | ren-zi | geng-zi | ren, yang Water |

Three answers, all correct under their own rule.

- `midnight` keeps the day at 00:00 and treats 23:00 to 23:59 as the late zi hour of the day that is ending, so the hour stem is taken from that day. The hour pillar moves.
- `early-zi` turns the whole day at 23:00, so the day pillar moves too, and with it the Day Master. Yin Metal becomes yang Water, and every Ten God in the chart is now measured from a different element. This is not a rounding difference, it is a different reading.
- `split-zi` is the compromise most software implements and the default here: the day still turns at 00:00, but the hour stem is taken from the next day.

For every birth outside that one hour the three agree exactly. The other two switches work the same way: `yearBoundary` separates a late January or early February birth (the year pillar and the zodiac animal change), and `hourClock` shifts the hour branch by up to 75 minutes for a birth near the edge of a wide time zone. Because `conventions` comes back on every response, a stored chart carries its own provenance and can be recomputed years later without guessing.

## Common use cases

| Use case | Endpoint flow |
|----------|---------------|
| BaZi chart screen | POST to `/chinese-astrology/bazi/chart`, render `pillars[]` as four columns of stem over branch, with `hiddenStems` under each |
| Ten Gods table | Read `pillars[].tenGod` and `pillars[].hiddenStems[].tenGod`, group by `category` to show peer, output, wealth, influence and resource at a glance |
| Element balance bar | Plot `fiveElements[].count`, colour by `level`, and quote `reading` under the chart |
| Practitioner reconciliation | Let a user pick `dayBoundary`, `yearBoundary` and `hourClock`, store `conventions` beside the saved chart so it can be recomputed identically |
| Na Yin and sexagenary reference | Read `naYin`, `naYinElement` and `number` per pillar for the classical pair readings |
| Strong or weak verdict | Follow with `/chinese-astrology/bazi/day-master` for the three factor assessment and the favourable element lists |
| Ten year timeline | Follow with `/chinese-astrology/bazi/luck-pillars` for the luck pillars, which need `gender` for the direction rule |

## Related endpoints in this domain

- `POST /chinese-astrology/bazi/day-master` (`calculateDayMasterStrength`) - the strong or weak verdict, with the three classical factors published separately and each contribution summing into `score`, so a caller can re-weight instead of trusting a black box. Returns the favourable and unfavourable element lists that follow from it
- `POST /chinese-astrology/bazi/luck-pillars` (`calculateLuckPillars`) - the luck pillars, the ten year cycle timeline. Needs `gender`, because the direction rule depends on it and cannot be derived from the chart alone
- `POST /chinese-astrology/bazi/compatibility` (`calculateBaziCompatibility`) - two charts read against each other for matchmaking and relationship apps: Day Master relation, the interactions between the two sets of pillars, and a score with harmonious and challenging counts
- `POST /chinese-astrology/bazi/annual-forecast` (`calculateAnnualForecast`) - the Liu Nian yearly pillar against the natal chart, with the year branch relation and the `benMingNian` flag for a zodiac year of birth

## Use this in your AI agent

Connect Claude, GPT, Gemini or Cursor to RoxyAPI through the remote MCP server. No Docker. No self hosting. The full MCP tool catalog for this domain is at `https://roxyapi.com/mcp/chinese-astrology`, and the tool for this endpoint is `post_chinese_astrology_bazi_chart`.

```json
{
  "mcpServers": {
    "chinese-astrology": {
      "url": "https://roxyapi.com/mcp/chinese-astrology",
      "headers": { "X-API-Key": "$ROXY_API_KEY" }
    }
  }
}
```

See [docs/mcp](https://roxyapi.com/docs/mcp) for Claude Desktop, Cursor, Windsurf, VS Code and Claude Code setup.

## For AI coding agents

This repo ships an [AGENTS.md](AGENTS.md) execution playbook. Cursor, Claude Code, Aider, Codex, Windsurf, RooCode and Gemini CLI will pick it up automatically. Top level overview lives at [roxyapi.com/AGENTS.md](https://roxyapi.com/AGENTS.md).

## Resources

- [Methodology and gold standard tests](https://roxyapi.com/methodology)
- [Chinese astrology API product page](https://roxyapi.com/products/chinese-astrology-api)
- [Full API reference](https://roxyapi.com/api-reference) interactive Scalar UI
- [TypeScript SDK on npm](https://www.npmjs.com/package/@roxyapi/sdk)
- [Python SDK on PyPI](https://pypi.org/project/roxy-sdk/)
- [PHP SDK on Packagist](https://packagist.org/packages/roxyapi/sdk)
- [C# SDK on NuGet](https://www.nuget.org/packages/RoxyApi.Sdk)
- [Go SDK on pkg.go.dev](https://pkg.go.dev/github.com/RoxyAPI/sdk-go)
- [WordPress plugin](https://wordpress.org/plugins/roxyapi/)
- [llms.txt](https://roxyapi.com/llms.txt) full LLM citation index
- [Top level AGENTS.md](https://roxyapi.com/AGENTS.md)

## Other RoxyAPI samples

[![Natal Chart API](https://img.shields.io/badge/Natal_Chart_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/natal-chart-api)
[![Transit Forecast API](https://img.shields.io/badge/Transit_Forecast_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/transit-forecast-api)
[![Human Design API](https://img.shields.io/badge/Human_Design_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/human-design-api)
[![Numerology API](https://img.shields.io/badge/Numerology_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/numerology-api)
[![Biorhythm API](https://img.shields.io/badge/Biorhythm_API-RoxyAPI-14b8a6?style=flat-square)](https://github.com/RoxyAPI/biorhythm-api)

## License

MIT for this sample repo. See [LICENSE](LICENSE).

**Catalog licensing:** Personal and commercial use, including closed source proprietary apps. No AGPL or GPL entanglement. RoxyAPI APIs and SDKs are safe to embed in commercial products. Full terms at [roxyapi.com/policy/license](https://roxyapi.com/policy/license).

## Contact

- Site: [roxyapi.com](https://roxyapi.com)
- Status: [roxyapi.com/api-reference](https://roxyapi.com/api-reference)
