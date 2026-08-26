import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY);

/**
 * BaZi API: the Four Pillars of Destiny for one birth moment. Four pillars,
 * hidden stems, the Ten Gods measured from the Day Master, the Na Yin sound
 * element and the five element balance. A birth at 23:30 falls in the zi hour,
 * where three living schools disagree about which day it belongs to, so the
 * same birth is sent three times to show the chart move.
 */
const BIRTH = {
  date: '1990-06-15',
  time: '23:30:00',
  timezone: 'Asia/Shanghai',
};

const DAY_BOUNDARIES = ['split-zi', 'midnight', 'early-zi'];

async function chart(dayBoundary) {
  const { data, error } = await roxy.chineseAstrology.generateBaziChart({
    body: { ...BIRTH, dayBoundary },
  });
  if (error || !data) throw new Error(error ? error.error : 'no data returned');
  return data;
}

async function main() {
  const bazi = await chart('split-zi');

  console.log(`Birth: ${bazi.birthData.date} ${bazi.birthData.time}, resolved offset ${bazi.birthData.timezone}`);
  console.log(`Day Master: ${bazi.dayMaster.stem} (${bazi.dayMaster.polarity} ${bazi.dayMaster.element})`);

  console.log('\nFour Pillars');
  for (const p of bazi.pillars) {
    console.log(`  ${p.position}  ${p.id}  ${p.tenGod.name}  na yin ${p.naYin}`);
  }

  console.log('\nFive element balance');
  for (const e of bazi.fiveElements) {
    console.log(`  ${e.element} ${e.count} ${e.level}`);
  }

  console.log('\nSame birth, three day boundary schools');
  for (const boundary of DAY_BOUNDARIES) {
    const c = await chart(boundary);
    const ids = c.pillars.map(p => p.id).join('  ');
    console.log(`  ${c.conventions.dayBoundary}  ${ids}  day master ${c.dayMaster.stem}`);
  }
}

main().catch(console.error);
