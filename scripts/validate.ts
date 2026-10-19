// Checks the event data for broken references and chronological inconsistencies.
// Run with: npm run validate
import { events, eventById, periods, periodById, childPeriods } from '../src/data/index.ts';

const errors: string[] = [];
const warnings: string[] = [];

const ids = new Set<string>();
for (const e of events) {
  if (ids.has(e.id)) errors.push(`Duplicate event id: ${e.id}`);
  ids.add(e.id);

  const p = periodById.get(e.period);
  if (!p) errors.push(`${e.id}: unknown period "${e.period}"`);
  else {
    if (childPeriods(p.id).length) warnings.push(`${e.id}: attached to non-leaf period "${p.id}"`);
    if (e.year < p.start || e.year > p.end)
      warnings.push(`${e.id}: year ${e.year} outside its period ${p.id} (${p.start}–${p.end})`);
  }

  for (const c of e.causes ?? []) {
    const cause = eventById.get(c);
    if (!cause) errors.push(`${e.id}: unknown cause "${c}"`);
    else if (cause.year > e.year) errors.push(`${e.id} (${e.year}) is caused by later event ${c} (${cause.year})`);
    if (c === e.id) errors.push(`${e.id}: causes itself`);
  }
}

for (const p of periods) {
  if (p.parent && !periodById.has(p.parent)) errors.push(`Period ${p.id}: unknown parent "${p.parent}"`);
  if (p.start > p.end) errors.push(`Period ${p.id}: start after end`);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`${events.length} events, ${periods.length} periods – ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
