import { Graph, layout as dagreLayout } from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import {
  effectsOf,
  eventById,
  eventsIn,
  isWithin,
  periodById,
  periodColor,
  periodPath,
  topPeriodOf,
  topPeriods,
  childPeriods,
  events,
  byTime,
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
    data: { period: p, color: periodColor(p.id), eventCount: eventsIn(p.id).length, subPeriods: childPeriods(p.id) },
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
  hl: Highlight,
): { nodes: Node<EventNodeData>[]; edges: Edge[] } {
  const inScope = eventsIn(scope);
  const inIds = new Set(inScope.map((e) => e.id));
  const ghosts = new Map<string, 'cause' | 'effect'>();

  if (showContext) {
    for (const e of inScope) {
      for (const c of e.causes ?? []) if (!inIds.has(c)) ghosts.set(c, 'cause');
      for (const f of effectsOf.get(e.id) ?? []) if (!inIds.has(f)) ghosts.set(f, 'effect');
    }
  }

  const all = [...inScope, ...[...ghosts.keys()].map((id) => eventById.get(id)!)].sort(byTime);
  const visible = new Set(all.map((e) => e.id));

  const edges: Edge[] = [];
  for (const e of all) {
    for (const c of e.causes ?? []) {
      if (!visible.has(c)) continue;
      // Don't draw edges between two ghosts; they belong to other views.
      if (ghosts.has(c) && ghosts.has(e.id)) continue;
      const on = hl.focus ? hl.focus.has(c) && hl.focus.has(e.id) : false;
      edges.push({
        id: `${c}->${e.id}`,
        source: c,
        target: e.id,
        className: [on ? 'edge-on' : '', hl.focus && !on ? 'edge-dim' : '', ghosts.has(c) || ghosts.has(e.id) ? 'edge-ghost' : '']
          .filter(Boolean)
          .join(' '),
      });
    }
  }

  const positions = mode === 'causal' ? layoutCausal(all, edges) : layoutChronological(all, visible);

  const nodes: Node<EventNodeData>[] = all.map((e) => {
    const path = periodPath(e.period);
    return {
      id: e.id,
      type: 'event',
      position: positions.get(e.id)!,
      data: {
        event: e,
        color: periodColor(e.period),
        ghost: ghosts.get(e.id),
        periodName: (ghosts.has(e.id) ? path[0].name + ' › ' : '') + path[path.length - 1].name,
        dimmed: hl.focus ? !hl.focus.has(e.id) : false,
        highlighted: hl.focus ? hl.focus.has(e.id) : false,
        selected: hl.selected === e.id,
      },
    };
  });

  return { nodes, edges };
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

/**
 * Rows never go backwards in time, and an event is always below its causes.
 * Unrelated, chronologically adjacent events share a row to keep the graph compact.
 * Lanes (columns) are chosen to sit near the event's causes.
 */
function layoutChronological(all: HistEvent[], visible: Set<string>): Map<string, { x: number; y: number }> {
  const row = new Map<string, number>();
  const lane = new Map<string, number>();
  const occupied = new Map<number, Set<number>>();
  let prevRow = 0;

  for (const e of all) {
    const causes = (e.causes ?? []).filter((c) => visible.has(c));
    let r = prevRow;
    for (const k of causes) r = Math.max(r, row.get(k)! + 1);
    while ((occupied.get(r)?.size ?? 0) >= LANES) r++;
    prevRow = r;
    row.set(e.id, r);

    const want = causes.length
      ? Math.round(causes.reduce((s, k) => s + lane.get(k)!, 0) / causes.length)
      : Math.floor((LANES - 1) / 2);
    const taken = occupied.get(r) ?? new Set<number>();
    const free = [...Array(LANES).keys()].filter((l) => !taken.has(l));
    const l = free.reduce((best, x) => (Math.abs(x - want) < Math.abs(best - want) ? x : best));
    taken.add(l);
    occupied.set(r, taken);
    lane.set(e.id, l);
  }

  const out = new Map<string, { x: number; y: number }>();
  for (const e of all) out.set(e.id, { x: lane.get(e.id)! * (EVENT_W + 40), y: row.get(e.id)! * (EVENT_H + 50) });
  return out;
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
