import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, Handle, Position, type EdgeProps, type Node, type NodeProps } from '@xyflow/react';
import { displayDate, periodRange } from '../data/index.ts';
import { EVENT_H, EVENT_W, PERIOD_H, PERIOD_W, type BandNodeData, type EventNodeData, type PeriodNodeData } from '../graph.ts';

export const EventNode = memo(function EventNode({ data }: NodeProps<Node<EventNodeData>>) {
  const { event, color, ghost, periodName, dimmed, highlighted, selected } = data;
  const cls = ['event-node', event.kind === 'reign' && 'reign', ghost && 'ghost', dimmed && 'dimmed', highlighted && 'highlighted', selected && 'selected']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={{ width: EVENT_W, height: EVENT_H, ['--accent' as string]: color }}>
      <Handle type="target" position={Position.Top} />
      <div className="event-date">
        {event.kind === 'reign' && <span className="crown">♛ </span>}
        {displayDate(event)}
      </div>
      <div className="event-title">{event.title}</div>
      <div className="event-period">
        {ghost === 'cause' && '↑ from '}
        {ghost === 'effect' && '↓ leads into '}
        {periodName}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

export const PeriodNode = memo(function PeriodNode({ data }: NodeProps<Node<PeriodNodeData>>) {
  const { period, color, eventCount, subPeriods } = data;
  return (
    <div className="period-node" style={{ width: PERIOD_W, minHeight: PERIOD_H, ['--accent' as string]: color }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="top-in" />
      <div className="period-range">{periodRange(period)}</div>
      <div className="period-name">{period.name}</div>
      <div className="period-summary">{period.summary}</div>
      <ul className="period-subs">
        {subPeriods.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
      <div className="period-count">{eventCount} events · open →</div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} id="top-out" />
    </div>
  );
});

export const BandNode = memo(function BandNode({ data }: NodeProps<Node<BandNodeData>>) {
  const { label, date, color, odd, width, height } = data;
  return (
    <div className={`band-node ${odd ? 'odd' : ''}`} style={{ width, height, ['--accent' as string]: color }}>
      <div className="band-label">
        <span className="band-name">{label}</span>
        {date && <span className="band-date">{date}</span>}
      </div>
    </div>
  );
});

/** Arc drawn above the row of period cards, for links between non-adjacent periods. */
export function ArcEdge({ id, sourceX, sourceY, targetX, targetY, label, style, markerEnd }: EdgeProps) {
  const h = Math.min(60 + Math.abs(targetX - sourceX) * 0.18, 260);
  const path = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY - h}, ${targetX} ${targetY - h}, ${targetX} ${targetY}`;
  const midX = (sourceX + targetX) / 2;
  const midY = Math.min(sourceY, targetY) - h * 0.75;
  return (
    <>
      <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
      {label && (
        <EdgeLabelRenderer>
          <div className="edge-label" style={{ transform: `translate(-50%, -50%) translate(${midX}px, ${midY}px)` }}>
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const nodeTypes = { event: EventNode, period: PeriodNode, band: BandNode };
export const edgeTypes = { arc: ArcEdge };
