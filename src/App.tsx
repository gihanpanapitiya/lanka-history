import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useReactFlow,
  useStore,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import {
  causalClosure,
  childPeriods,
  eventById,
  effectsOf,
  events,
  periodPath,
  periodRange,
  periodById,
  type Tag,
} from './data/index.ts';
import { buildOverview, buildScope, scopeExists, scopeForEvent, EVENT_W, EVENT_H, type LayoutMode } from './graph.ts';
import { nodeTypes, edgeTypes } from './components/nodes.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { DetailPanel } from './components/DetailPanel.tsx';

type TraceMode = 'direct' | 'chain';
const TAGS: Tag[] = ['political', 'military', 'religious', 'economic', 'cultural', 'social', 'environmental', 'external'];

interface ViewState {
  scope: string | null;
  event: string | null;
}

function readHash(): ViewState {
  const params = new URLSearchParams(location.hash.slice(1));
  const scope = params.get('period');
  const event = params.get('event');
  return {
    scope: scopeExists(scope) ? scope : null,
    event: event && eventById.has(event) ? event : null,
  };
}

function writeHash(v: ViewState) {
  const params = new URLSearchParams();
  if (v.scope) params.set('period', v.scope);
  if (v.event) params.set('event', v.event);
  const next = '#' + params.toString();
  if (location.hash !== next) history.pushState(null, '', next);
}

export function App() {
  const [view, setView] = useState<ViewState>(readHash);
  const [layout, setLayout] = useState<LayoutMode>('chronological');
  const [showContext, setShowContext] = useState(true);
  const [trace, setTrace] = useState<TraceMode>('chain');
  const [tag, setTag] = useState<Tag | null>(null);
  // Bumped when the graph should pan to the selected event (picked from search or the detail panel).
  const [focusTick, setFocusTick] = useState(0);

  useEffect(() => writeHash(view), [view]);
  useEffect(() => {
    const onPop = () => setView(readHash());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setScope = useCallback((scope: string | null) => setView({ scope, event: null }), []);

  const pickEvent = useCallback((id: string) => {
    setView((v) => ({ scope: scopeForEvent(id, v.scope), event: id }));
    setFocusTick((t) => t + 1);
  }, []);

  const focus = useMemo(() => {
    if (view.event) {
      const ids =
        trace === 'chain'
          ? new Set([...causalClosure(view.event, 'causes'), ...causalClosure(view.event, 'effects')])
          : new Set([...(eventById.get(view.event)?.causes ?? []), ...(effectsOf.get(view.event) ?? [])]);
      ids.add(view.event);
      return ids;
    }
    if (tag) return new Set(events.filter((e) => e.tags?.includes(tag)).map((e) => e.id));
    return null;
  }, [view.event, trace, tag]);

  const graph = useMemo(
    () => (view.scope ? buildScope(view.scope, layout, showContext, { selected: view.event, focus }) : buildOverview()),
    [view.scope, view.event, layout, showContext, focus],
  );

  const onNodeClick: NodeMouseHandler<Node> = useCallback(
    (_, node) => {
      if (node.type === 'period') return setScope(node.id);
      if (node.data.ghost) return pickEvent(node.id);
      setView((v) => ({ ...v, event: v.event === node.id ? null : node.id }));
    },
    [setScope, pickEvent],
  );

  const scopePath = view.scope ? periodPath(view.scope) : [];
  const top = scopePath[0];
  const current = view.scope ? periodById.get(view.scope)! : null;

  return (
    <div className="app">
      <Sidebar scope={view.scope} onScope={setScope} onPickEvent={pickEvent} />

      <main className="main">
        <div className="toolbar">
          <div className="crumbs">
            <button className="link" onClick={() => setScope(null)}>
              All periods
            </button>
            {scopePath.map((p) => (
              <span key={p.id}>
                {' › '}
                <button className="link" onClick={() => setScope(p.id)}>
                  {p.name}
                </button>
              </span>
            ))}
            {current && <span className="range">{periodRange(current)}</span>}
          </div>

          {top && (
            <div className="chips">
              <button className={`chip ${view.scope === top.id ? 'active' : ''}`} onClick={() => setScope(top.id)}>
                Whole period
              </button>
              {childPeriods(top.id).map((c) => (
                <button key={c.id} className={`chip ${view.scope === c.id ? 'active' : ''}`} onClick={() => setScope(c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {view.scope && (
            <div className="controls">
              <label>
                Layout
                <select value={layout} onChange={(e) => setLayout(e.target.value as LayoutMode)}>
                  <option value="chronological">Chronological</option>
                  <option value="causal">Causal (compact)</option>
                </select>
              </label>
              <label>
                Highlight
                <select value={trace} onChange={(e) => setTrace(e.target.value as TraceMode)}>
                  <option value="chain">Full causal chain</option>
                  <option value="direct">Direct links only</option>
                </select>
              </label>
              <label>
                Theme
                <select value={tag ?? ''} onChange={(e) => setTag((e.target.value || null) as Tag | null)}>
                  <option value="">All</option>
                  {TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check">
                <input type="checkbox" checked={showContext} onChange={(e) => setShowContext(e.target.checked)} />
                Show links to other periods
              </label>
            </div>
          )}
        </div>

        <div className="canvas">
          <ReactFlow
            key={`${view.scope}|${layout}|${showContext}`}
            nodes={graph.nodes}
            edges={graph.edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={() => setView((v) => ({ ...v, event: null }))}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll={!!view.scope}
            zoomOnScroll={!view.scope}
            fitView={!view.scope}
            fitViewOptions={{ padding: 0.12, maxZoom: 1.2 }}
            minZoom={0.1}
            defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 } }}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} />
            <Controls showInteractive={false} />
            {view.scope && (
              <MiniMap
                pannable
                zoomable
                bgColor="var(--panel)"
                maskColor="rgb(127 127 127 / 0.15)"
                style={{ width: 220, height: 130 }}
                nodeColor={(n) => (n.data.color as string) ?? '#888'}
              />
            )}
            <ViewportController nodes={graph.nodes} overview={!view.scope} eventId={view.event} tick={focusTick} />
          </ReactFlow>
          {!view.scope && (
            <div className="hint">
              Each card is a period; arrows count the cause → effect links between periods. Click a period to explore its
              events.
            </div>
          )}
        </div>
      </main>

      {view.event && (
        <DetailPanel
          eventId={view.event}
          onPickEvent={pickEvent}
          onScope={setScope}
          onClose={() => setView((v) => ({ ...v, event: null }))}
        />
      )}
    </div>
  );
}

/**
 * Sets the initial viewport when a graph mounts, and pans to the selected event on request.
 * Period graphs are long causal chains, so instead of shrinking them to fit we open at a readable
 * zoom, anchored at the selected event or at the start of the period.
 */
function ViewportController({
  nodes,
  overview,
  eventId,
  tick,
}: {
  nodes: Node[];
  overview: boolean;
  eventId: string | null;
  tick: number;
}) {
  const rf = useReactFlow();
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  const [initialised, setInitialised] = useState(false);

  const centerOn = useCallback(
    (id: string, duration: number) => {
      const n = nodes.find((x) => x.id === id);
      if (n) rf.setCenter(n.position.x + EVENT_W / 2, n.position.y + EVENT_H / 2, { zoom: 0.9, duration });
    },
    [nodes, rf],
  );

  useEffect(() => {
    if (initialised || !width || !height || !nodes.length) return;
    setInitialised(true);
    if (overview) return; // handled by the fitView prop, which waits for nodes to be measured
    if (eventId && nodes.some((n) => n.id === eventId)) return centerOn(eventId, 0);

    const xs = nodes.map((n) => n.position.x);
    const ys = nodes.map((n) => n.position.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const bw = Math.max(...xs) + EVENT_W - minX;
    const bh = Math.max(...ys) + EVENT_H - minY;
    // Fit the width; the graph grows downwards and is read by scrolling.
    const zoom = Math.min(1, Math.max(0.6, ((width - 80) / bw) * 0.95));
    const x = bw * zoom < width ? (width - bw * zoom) / 2 - minX * zoom : 40 - minX * zoom;
    const y = bh * zoom < height ? (height - bh * zoom) / 2 - minY * zoom : 30 - minY * zoom;
    rf.setViewport({ x, y, zoom });
  }, [initialised, width, height, nodes, overview, eventId, rf, centerOn]);

  // Pan when an event is picked from search or the detail panel (the tick changes).
  useEffect(() => {
    if (tick && eventId && initialised) centerOn(eventId, 500);
  }, [tick]);

  return null;
}
