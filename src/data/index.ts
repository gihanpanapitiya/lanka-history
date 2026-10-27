import type { HistEvent, Period } from './types.ts';
import { periods } from './periods.ts';
import { prehistoricEvents } from './events/prehistoric.ts';
import { anuradhapuraEvents } from './events/anuradhapura.ts';
import { anuradhapuraReigns } from './events/anuradhapura-kings.ts';
import { polonnaruwaEvents } from './events/polonnaruwa.ts';
import { polonnaruwaReigns } from './events/polonnaruwa-kings.ts';
import { transitionalEvents } from './events/transitional.ts';
import { colonialEvents } from './events/colonial.ts';

export type { HistEvent, Period, Tag, Year } from './types.ts';
export { periods };

const allEvents: HistEvent[] = [
  ...prehistoricEvents,
  ...anuradhapuraEvents,
  ...anuradhapuraReigns,
  ...polonnaruwaEvents,
  ...polonnaruwaReigns,
  ...transitionalEvents,
  ...colonialEvents,
];

export const eventById = new Map(allEvents.map((e) => [e.id, e]));

/** Causes plus, for reigns, the preceding reign. */
export function predecessorsOf(e: HistEvent): string[] {
  return e.succeeds ? [...(e.causes ?? []), e.succeeds] : e.causes ?? [];
}

/** Length of the longest cause (or succession) chain leading to each event. */
const depth = new Map<string, number>();
function depthOf(id: string, visiting = new Set<string>()): number {
  if (depth.has(id)) return depth.get(id)!;
  if (visiting.has(id)) return 0; // cycle; reported by the validator
  visiting.add(id);
  const e = eventById.get(id);
  const causes = (e ? predecessorsOf(e) : []).filter((c) => eventById.has(c));
  const d = causes.length ? 1 + Math.max(...causes.map((c) => depthOf(c, visiting))) : 0;
  depth.set(id, d);
  return d;
}

/** Chronological order; events in the same year are ordered so causes come before effects. */
export function byTime(a: HistEvent, b: HistEvent): number {
  return a.year - b.year || depthOf(a.id) - depthOf(b.id);
}

export const events: HistEvent[] = allEvents.sort(byTime);
export const periodById = new Map(periods.map((p) => [p.id, p]));

export const topPeriods = periods.filter((p) => !p.parent);

export function childPeriods(id: string): Period[] {
  return periods.filter((p) => p.parent === id);
}

/** Effects: the inverse of `causes`. */
export const effectsOf = new Map<string, string[]>();
for (const e of events) {
  for (const c of e.causes ?? []) {
    if (!effectsOf.has(c)) effectsOf.set(c, []);
    effectsOf.get(c)!.push(e.id);
  }
}

export const isReign = (e: HistEvent) => e.kind === 'reign';

/** Reigns in order of succession. */
export const reigns: HistEvent[] = events.filter(isReign);

/** Successor: the inverse of `succeeds`. */
export const successorOf = new Map<string, string>();
for (const r of reigns) if (r.succeeds) successorOf.set(r.succeeds, r.id);

/** The reign(s) in progress in a given year. */
export function reignsAt(year: number): HistEvent[] {
  return reigns.filter((r) => r.year <= year && year <= (r.endYear ?? r.year));
}

/** Ordinary events that happened during a reign. */
export function eventsDuring(reign: HistEvent): HistEvent[] {
  const end = reign.endYear ?? reign.year;
  return events.filter((e) => !isReign(e) && e.year >= reign.year && e.year <= end);
}

/** Chain from top-level period down to `id`. */
export function periodPath(id: string): Period[] {
  const path: Period[] = [];
  let p = periodById.get(id);
  while (p) {
    path.unshift(p);
    p = p.parent ? periodById.get(p.parent) : undefined;
  }
  return path;
}

export function isWithin(periodId: string, ancestorId: string): boolean {
  return periodPath(periodId).some((p) => p.id === ancestorId);
}

export function topPeriodOf(periodId: string): Period {
  return periodPath(periodId)[0];
}

export function periodColor(periodId: string): string {
  const path = periodPath(periodId);
  for (let i = path.length - 1; i >= 0; i--) if (path[i].color) return path[i].color!;
  return '#888';
}

/** Accent colour for an event's node: invaders' reigns stand out in red, everything else takes its period's colour. */
export const INVADER_COLOR = '#d32f2f';
export function eventColor(e: HistEvent): string {
  return e.invader ? INVADER_COLOR : periodColor(e.period);
}

export function eventsIn(periodId: string): HistEvent[] {
  return events.filter((e) => isWithin(e.period, periodId));
}

export function formatYear(y: number): string {
  if (y < -10000) return `${Math.round(-y / 1000).toLocaleString()}k BCE`;
  return y < 0 ? `${-y} BCE` : `${y} CE`;
}

export function displayDate(e: HistEvent): string {
  return e.date ?? formatYear(e.year);
}

export function periodRange(p: Period): string {
  return `${formatYear(p.start)} – ${p.end >= new Date().getFullYear() ? 'present' : formatYear(p.end)}`;
}

/** All transitive causes (ancestors) or effects (descendants) of an event. */
export function causalClosure(id: string, direction: 'causes' | 'effects'): Set<string> {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    const next = direction === 'causes' ? eventById.get(cur)?.causes ?? [] : effectsOf.get(cur) ?? [];
    for (const n of next) {
      if (!seen.has(n)) {
        seen.add(n);
        stack.push(n);
      }
    }
  }
  return seen;
}
