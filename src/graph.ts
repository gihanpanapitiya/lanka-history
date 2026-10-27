import { Graph, layout as dagreLayout } from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import {
  effectsOf,
  eventById,
  eventsIn,
  isWithin,
  periodById,
  periodColor,
  eventColor,
  periodPath,
  topPeriodOf,
  topPeriods,
  childPeriods,
  events,
  byTime,
  isReign,
  predecessorsOf,
  successorOf,
  reigns,
  displayDate,
  type HistEvent,
  type Period,
} from './data/index.ts';

export type LayoutMode = 'causal' | 'chronological';

export const EVENT_W = 230;
export const EVENT_H = 92;
export const PERIOD_W = 260;
export const PERIOD_H = 150;

export interface EventNodeData extends Record<string, unknown> {
  event: HistEvent;
  color: string;
  /** Set for events outside the current scope, shown for context. */
  ghost?: 'cause' | 'effect';
  periodName: string;
  dimmed: boolean;
  highlighted: boolean;
  selected: boolean;
}

/** Background stripe marking one reign's span in the chronological layout. */
export interface BandNodeData extends Record<string, unknown> {
  label: string;
  date: string;
  color: string;
  odd: boolean;
  width: number;
  height: number;
}

export interface PeriodNodeData extends Record<string, unknown> {
  period: Period;
  color: string;
  eventCount: number;
  subPeriods: Period[];
}

export interface Highlight {
  selected: string | null;
  /** Ids to keep at full opacity; null = everything. */
  focus: Set<string> | null;
}

/** Overview: one node per top-level period, edges weighted by causal links crossing between them. */
export function buildOverview(): { nodes: Node<PeriodNodeData>[]; edges: Edge[] } {
  const nodes: Node<PeriodNodeData>[] = topPeriods.map((p) => ({
    id: p.id,
    type: 'period',
    position: { x: 0, y: 0 },
    data: { period: p, color: periodColor(p.id), eventCount: eventsIn(p.id).filter((e) => !isReign(e)).length, subPeriods: childPeriods(p.id) },
  }));

  const counts = new Map<string, number>();
  for (const e of events) {
    for (const c of e.causes ?? []) {
      const from = topPeriodOf(eventById.get(c)!.period).id;
      const to = topPeriodOf(e.period).id;
      if (from !== to) counts.set(`${from}|${to}`, (counts.get(`${from}|${to}`) ?? 0) + 1);
    }
  }
  const index = new Map(topPeriods.map((p, i) => [p.id, i]));
  const edges: Edge[] = [...counts].map(([key, n]) => {
    const [source, target] = key.split('|');
    const adjacent = Math.abs(index.get(source)! - index.get(target)!) === 1;
    return {
      id: key,
      source,
      target,
      label: `${n} link${n > 1 ? 's' : ''}`,
      style: { strokeWidth: Math.min(1 + n, 6) },
      className: 'overview-edge',
      // Long-range links arc over the row instead of cutting through the cards in between.
      ...(adjacent ? {} : { type: 'arc', sourceHandle: 'top-out', targetHandle: 'top-in' }),
    };
  });

  // Periods are laid out left-to-right in chronological order; arcs show long-range links.
  nodes.forEach((n, i) => (n.position = { x: i * (PERIOD_W + 90), y: 0 }));
  return { nodes, edges };
}

/** Event graph for a scope (a period id), including out-of-scope causes/effects as ghost nodes. */
export function buildScope(
  scope: string,
  mode: LayoutMode,
  showContext: boolean,
  showReigns: boolean,
  hl: Highlight,
): { nodes: Node<EventNodeData | BandNodeData>[]; edges: Edge[] } {
  // Scopes with a line of rulers are split into one band per reign.
  const banded = mode === 'chronological' && eventsIn(scope).some(isReign);
  const inScope = eventsIn(scope).filter((e) => showReigns || !isReign(e));
  const inIds = new Set(inScope.map((e) => e.id));
  const ghosts = new Map<string, 'cause' | 'effect'>();

  if (showContext) {
    for (const e of inScope) {
      for (const c of e.causes ?? []) if (!inIds.has(c)) ghosts.set(c, 'cause');
      for (const f of effectsOf.get(e.id) ?? []) if (!inIds.has(f)) ghosts.set(f, 'effect');
      // The reigns just before and after the scope, so the line of rulers visibly continues.
      if (e.succeeds && !inIds.has(e.succeeds)) ghosts.set(e.succeeds, 'cause');
      const next = successorOf.get(e.id);
      if (next && !inIds.has(next)) ghosts.set(next, 'effect');
    }
  }

  const all = [...inScope, ...[...ghosts.keys()].map((id) => eventById.get(id)!)].sort(byTime);
  const visible = new Set(all.map((e) => e.id));

  const edges: Edge[] = [];
  for (const e of all) {
    for (const c of predecessorsOf(e)) {
      if (!visible.has(c)) continue;
      // Don't draw edges between two ghosts; they belong to other views.
      if (ghosts.has(c) && ghosts.has(e.id)) continue;
      const succession = c === e.succeeds;
      const on = hl.focus ? hl.focus.has(c) && hl.focus.has(e.id) : false;
      edges.push({
        id: `${c}${succession ? '=>' : '->'}${e.id}`,
        source: c,
        target: e.id,
        className: [
          succession ? 'edge-succession' : '',
          on ? 'edge-on' : '',
          hl.focus && !on ? 'edge-dim' : '',
          ghosts.has(c) || ghosts.has(e.id) ? 'edge-ghost' : '',
        ]
          .filter(Boolean)
          .join(' '),
      });
    }
  }

  const { positions, parents, bands } =
    mode === 'causal'
      ? { positions: layoutCausal(all, edges), parents: new Map<string, string>(), bands: [] }
      : layoutChronological(all, visible, banded);

  const nodes: Node<EventNodeData>[] = all.map((e) => {
    const path = periodPath(e.period);
    return {
      id: e.id,
      type: 'event',
      position: positions.get(e.id)!,
      // Banded layouts nest each event inside its reign's band; the position is then relative to the band.
      ...(parents.has(e.id) ? { parentId: parents.get(e.id), extent: 'parent' as const } : {}),
      data: {
        event: e,
        color: eventColor(e),
        ghost: ghosts.get(e.id),
        periodName: (ghosts.has(e.id) ? path[0].name + ' › ' : '') + path[path.length - 1].name,
        dimmed: hl.focus ? !hl.focus.has(e.id) : false,
        highlighted: hl.focus ? hl.focus.has(e.id) : false,
        selected: hl.selected === e.id,
      },
    };
  });

  return { nodes: [...bands, ...nodes], edges };
}

function layoutCausal(all: HistEvent[], edges: Edge[]): Map<string, { x: number; y: number }> {
  const g = new Graph();
  g.setGraph({ rankdir: 'TB', nodesep: 30, ranksep: 50, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const e of all) g.setNode(e.id, { width: EVENT_W, height: EVENT_H });
  for (const ed of edges) g.setEdge(ed.source, ed.target);
  dagreLayout(g);
  const out = new Map<string, { x: number; y: number }>();
  for (const e of all) {
    const n = g.node(e.id);
    out.set(e.id, { x: n.x - EVENT_W / 2, y: n.y - EVENT_H / 2 });
  }
  return out;
}

/** Max events side by side in the chronological layout, so the graph fits the screen width. */
const LANES = 4;
/** The middle column, kept for the line of rulers when reigns are shown. */
const CENTER = 2;
const COL = EVENT_W + 40;
const ROW = EVENT_H + 50;
const BAND_PAD_X = 24;
const BAND_PAD_Y = 22;
const BAND_GAP = 6;

interface Band {
  key: string;
  label: string;
  date: string;
  reign?: HistEvent;
  items: HistEvent[];
}

/** The reign an event falls in: the last reign to begin on or before it. */
function bandKeyOf(e: HistEvent): string {
  if (isReign(e)) return e.id;
  let r: HistEvent | undefined;
  for (const x of reigns) {
    if (x.year > e.year) break;
    r = x;
  }
  if (!r) return 'before';
  if (!successorOf.has(r.id) && e.year > (r.endYear ?? r.year)) return 'after';
  return r.id;
}

/** Splits the (time-sorted) events into one band per reign, plus bands before and after the line of rulers. */
function reignBands(all: HistEvent[]): Band[] {
  const byKey = new Map<string, HistEvent[]>();
  for (const e of all) {
    const k = bandKeyOf(e);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(e);
  }
  const bands: Band[] = [];
  const first = reigns.find((r) => byKey.has(r.id));
  const last = reigns.filter((r) => byKey.has(r.id)).at(-1);
  if (byKey.has('before')) bands.push({ key: 'before', label: first ? `Before ${first.title}` : 'Earlier', date: '', items: byKey.get('before')! });
  for (const r of reigns) {
    if (byKey.has(r.id)) bands.push({ key: r.id, label: r.title, date: displayDate(r), reign: r, items: byKey.get(r.id)! });
  }
  if (byKey.has('after')) bands.push({ key: 'after', label: last ? `After ${last.title}` : 'Later', date: '', items: byKey.get('after')! });
  return bands;
}

/**
 * Rows never go backwards in time, and an event is always below its causes.
 * Unrelated, chronologically adjacent events share a row to keep the graph compact.
 * Lanes (columns) are chosen to sit near the event's causes. Reigns, when present, get the
 * middle column so the line of rulers reads straight down, with events on either side.
 * When `banded`, the graph is split into horizontal bands, one per reign; each band is a parent
 * node and its events are child nodes positioned relative to it, with the king centred in it.
 * Otherwise everything shares a single, invisible band.
 */
function layoutChronological(
  all: HistEvent[],
  visible: Set<string>,
  banded: boolean,
): { positions: Map<string, { x: number; y: number }>; parents: Map<string, string>; bands: Node<BandNodeData>[] } {
  const withReigns = all.some(isReign);
  const eventLanes = withReigns ? [0, 1, 2, 3, 4].filter((l) => l !== CENTER) : [0, 1, 2, 3];
  const bands = banded ? reignBands(all) : [{ key: 'all', label: '', date: '', items: all }];
  const width = (withReigns ? LANES + 1 : LANES) * COL - 40 + 2 * BAND_PAD_X;
  const positions = new Map<string, { x: number; y: number }>();
  const parents = new Map<string, string>();
  const bandNodes: Node<BandNodeData>[] = [];
  const lane = new Map<string, number>();
  let top = 0;

  for (const [i, band] of bands.entries()) {
    const row = new Map<string, number>(); // rows are counted within the band
    const occupied = new Map<number, Set<number>>();
    const reignRows = new Set<number>();
    let prevRow = 0;

    for (const e of band.items) {
      const deps = predecessorsOf(e).filter((c) => visible.has(c));
      let r = prevRow;
      // Causes in earlier bands are already above this band.
      for (const k of deps) if (row.has(k)) r = Math.max(r, row.get(k)! + 1);
      if (isReign(e)) {
        // The king's column is separate, so events of the same moment can share the king's row.
        while (reignRows.has(r)) r++;
        reignRows.add(r);
        row.set(e.id, r);
        lane.set(e.id, CENTER);
        continue;
      }
      while ((occupied.get(r)?.size ?? 0) >= LANES) r++;
      prevRow = r;
      row.set(e.id, r);

      const causes = deps.filter((k) => lane.has(k));
      const want = causes.length
        ? causes.reduce((s, k) => s + lane.get(k)!, 0) / causes.length
        : (eventLanes[0] + eventLanes[eventLanes.length - 1]) / 2;
      const taken = occupied.get(r) ?? new Set<number>();
      const free = eventLanes.filter((l) => !taken.has(l));
      const l = free.reduce((best, x) => (Math.abs(x - want) < Math.abs(best - want) ? x : best));
      taken.add(l);
      occupied.set(r, taken);
      lane.set(e.id, l);
    }

    const rows = Math.max(...row.values()) + 1;
    const ys = new Map(row);
    if (banded && band.reign && row.has(band.reign.id)) {
      // Centre the king vertically, but keep the reign below its causes and above its effects in the band.
      const id = band.reign.id;
      const effects = band.items.filter((e) => predecessorsOf(e).includes(id)).map((e) => row.get(e.id)!);
      const hi = effects.length ? Math.min(...effects) - 1 : rows - 1;
      ys.set(id, Math.min(Math.max((rows - 1) / 2, row.get(id)!), hi));
    }

    const pad = banded ? BAND_PAD_Y : 0;
    const height = rows * ROW - (ROW - EVENT_H) + 2 * pad;
    const bandId = `band:${band.key}`;
    for (const e of band.items) {
      if (banded) {
        parents.set(e.id, bandId);
        positions.set(e.id, { x: BAND_PAD_X + lane.get(e.id)! * COL, y: pad + ys.get(e.id)! * ROW });
      } else {
        positions.set(e.id, { x: lane.get(e.id)! * COL, y: ys.get(e.id)! * ROW });
      }
    }

    if (banded) {
      bandNodes.push({
        id: bandId,
        type: 'band',
        position: { x: -BAND_PAD_X, y: top },
        zIndex: -1,
        selectable: false,
        focusable: false,
        data: {
          label: band.label,
          date: band.date,
          color: band.reign ? periodColor(band.reign.period) : 'var(--muted)',
          odd: i % 2 === 1,
          width,
          height,
        },
      });
    }
    top += height + BAND_GAP;
  }

  return { positions, parents, bands: bandNodes };
}

/** Which scope to show an event in, staying at the same depth as the current scope where possible. */
export function scopeForEvent(eventId: string, currentScope: string | null): string {
  const e = eventById.get(eventId)!;
  if (currentScope && isWithin(e.period, currentScope)) return currentScope;
  const depth = currentScope ? periodPath(currentScope).length - 1 : 0;
  const path = periodPath(e.period);
  return path[Math.min(depth, path.length - 1)].id;
}

export function scopeExists(id: string | null): boolean {
  return !!id && periodById.has(id);
}
