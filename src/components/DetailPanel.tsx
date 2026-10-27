import {
  displayDate,
  effectsOf,
  eventById,
  eventsDuring,
  isReign,
  eventColor,
  periodPath,
  reignsAt,
  successorOf,
  type HistEvent,
} from '../data/index.ts';

interface Props {
  eventId: string;
  onPickEvent: (id: string) => void;
  onScope: (id: string) => void;
  onClose: () => void;
}

export function DetailPanel({ eventId, onPickEvent, onScope, onClose }: Props) {
  const e = eventById.get(eventId);
  if (!e) return null;
  const causes = (e.causes ?? []).map((id) => eventById.get(id)!);
  const effects = (effectsOf.get(e.id) ?? []).map((id) => eventById.get(id)!);
  const reign = isReign(e);
  const next = successorOf.get(e.id);

  return (
    <aside className="detail" style={{ ['--accent' as string]: eventColor(e) }}>
      <button className="close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="crumbs">
        {periodPath(e.period).map((p, i) => (
          <span key={p.id}>
            {i > 0 && ' › '}
            <button className="link" onClick={() => onScope(p.id)}>
              {p.name}
            </button>
          </span>
        ))}
      </div>
      <h2>{e.title}</h2>
      <div className="d-date">{displayDate(e)}</div>
      {e.tags && (
        <div className="tags">
          {e.tags.map((t) => (
            <span key={t} className={`tag tag-${t}`}>
              {t}
            </span>
          ))}
        </div>
      )}
      <p className="d-summary">{e.summary}</p>

      {reign ? (
        <>
          <EventList title="Preceded by" items={e.succeeds ? [eventById.get(e.succeeds)!] : []} empty="First of the line." onPick={onPickEvent} />
          <EventList title="Succeeded by" items={next ? [eventById.get(next)!] : []} empty="Last of the line." onPick={onPickEvent} />
          <EventList title="During this reign" items={eventsDuring(e)} empty="No recorded events." onPick={onPickEvent} />
          {causes.length > 0 && <EventList title="Caused by" items={causes} empty="" onPick={onPickEvent} />}
          {effects.length > 0 && <EventList title="Led to" items={effects} empty="" onPick={onPickEvent} />}
        </>
      ) : (
        <>
          <EventList title="Caused by" items={causes} empty="No recorded causes – a starting point." onPick={onPickEvent} />
          <EventList title="Led to" items={effects} empty="No recorded effects yet." onPick={onPickEvent} />
          {reignsAt(e.year).length > 0 && (
            <EventList title="Reign" items={reignsAt(e.year)} empty="" onPick={onPickEvent} />
          )}
        </>
      )}
    </aside>
  );
}

function EventList({
  title,
  items,
  empty,
  onPick,
}: {
  title: string;
  items: HistEvent[];
  empty: string;
  onPick: (id: string) => void;
}) {
  return (
    <section className="d-list">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="muted">{empty}</p>
      ) : (
        <ul>
          {items.map((x) => (
            <li key={x.id}>
              <button onClick={() => onPick(x.id)} style={{ ['--accent' as string]: eventColor(x) }}>
                <span className="r-title">{x.title}</span>
                <span className="r-date">{displayDate(x)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
