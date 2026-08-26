import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.ROXY_API_KEY!);

/**
 * BaZi API: the Four Pillars of Destiny for one birth moment. Four pillars of
 * stem over branch, the hidden stems inside each branch, the Ten Gods measured
 * from the Day Master, the Na Yin sound element, the five element balance, and
 * the clashes and combinations between the pillars.
 *
 * The demo below is the reason this endpoint types its conventions. A birth at
 * 23:30 falls in the zi hour, where three living schools disagree about which
 * sexagenary day it belongs to. Ask for each in turn and the chart moves.
 */
const BIRTH = {
  date: '1990-06-15',
  time: '23:30:00',
  timezone: 'Asia/Shanghai',
} as const;

const DAY_BOUNDARIES = ['split-zi', 'midnight', 'early-zi'] as const;

async function chart(dayBoundary: (typeof DAY_BOUNDARIES)[number]) {
  const { data, error } = await roxy.chineseAstrology.generateBaziChart({
    body: { ...BIRTH, dayBoundary },
  });
  if (error || !data) throw new Error(error?.error ?? 'no data returned');
  return data;
}

async function main() {
  const bazi = await chart('split-zi');

  console.log(`Birth: ${bazi.birthData.date} ${bazi.birthData.time} at UTC${bazi.birthData.timezone >= 0 ? '+' : ''}${bazi.birthData.timezone}`);
  console.log(`Conventions applied: ${Object.entries(bazi.conventions).map(([k, v]) => `${k}=${v}`).join('  ')}`);
  console.log(`Day Master: ${bazi.dayMaster.stem} (${bazi.dayMaster.polarity} ${bazi.dayMaster.element}), year animal ${bazi.zodiacAnimal}`);

  console.log('\nFour Pillars');
  console.log(`  ${'position'.padEnd(9)}${'pillar'.padEnd(10)}${'ten god'.padEnd(19)}${'hidden stems'.padEnd(22)}na yin`);
  for (const p of bazi.pillars) {
    const hidden = p.hiddenStems.map((h) => `${h.stem.id}(${h.role[0]})`).join(' ');
    console.log(`  ${p.position.padEnd(9)}${p.id.padEnd(10)}${p.tenGod.name.padEnd(19)}${hidden.padEnd(22)}${p.naYin}`);
  }

  console.log('\nFive element balance');
  for (const e of bazi.fiveElements) {
    console.log(`  ${e.element.padEnd(7)}${String(e.count).padEnd(3)}${e.level}`);
  }

  console.log(`\nInteractions between the pillars: ${bazi.interactions.length}`);
  for (const i of bazi.interactions) {
    console.log(`  ${i.type.padEnd(12)}${i.members.join(' + ').padEnd(12)}${i.positions.join(' / ').padEnd(16)}${i.quality}`);
  }

  console.log(`\n${bazi.summary}`);

  // The three day boundary schools, same birth moment, three charts.
  console.log('\nSame birth, three day boundary schools');
  console.log(`  ${'dayBoundary'.padEnd(14)}${'year'.padEnd(10)}${'month'.padEnd(10)}${'day'.padEnd(10)}${'hour'.padEnd(10)}day master`);
  for (const boundary of DAY_BOUNDARIES) {
    const c = await chart(boundary);
    const [year, month, day, hour] = c.pillars;
    const dm = `${c.dayMaster.stem} (${c.dayMaster.polarity} ${c.dayMaster.element})`;
    console.log(`  ${c.conventions.dayBoundary.padEnd(14)}${year.id.padEnd(10)}${month.id.padEnd(10)}${day.id.padEnd(10)}${hour.id.padEnd(10)}${dm}`);
  }
  console.log('\n  Every response carries the conventions it was computed under, so a stored');
  console.log('  chart can be reproduced exactly rather than guessed at.');
}

main().catch(console.error);
