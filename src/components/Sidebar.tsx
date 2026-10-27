import { useMemo, useState } from 'react';
import {
  childPeriods,
  displayDate,
  events,
  eventsIn,
  isReign,
  periodColor,
  eventColor,
  periodPath,
  periodRange,
  topPeriods,
} from '../data/index.ts';

interface Props {
  scope: string | null;
  onScope: (id: string | null) => void;
  onPickEvent: (id: string) => void;
}

export function Sidebar({ scope, onScope, onPickEvent }: Props) {
  const [query, setQuery] = useState('');
  const activePath = scope ? periodPath(scope).map((p) => p.id) : [];

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return events
      .filter((e) => e.title.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q))
      .slice(0, 30);
  }, [query]);

  return (
    <aside className="sidebar">
      <header>
        <h1>Sri Lanka</h1>
        <p className="subtitle">A causal history</p>
      </header>

      <input
        className="search"
        type="search"
        placeholder="Search events…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 ? (
        <ul className="search-results">
          {results.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => {
                  onPickEvent(e.id);
                  setQuery('');
                }}
                style={{ ['--accent' as string]: eventColor(e) }}
              >
                <span className="r-title">{e.title}</span>
                <span className="r-date">{displayDate(e)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : query.trim().length >= 2 ? (
        <p className="muted">No matches.</p>
      ) : (
        <nav className="tree">
          <button className={`tree-item ${scope === null ? 'active' : ''}`} onClick={() => onScope(null)}>
            Overview of all periods
          </button>
          {topPeriods.map((p) => {
            const open = activePath.includes(p.id);
            return (
              <div key={p.id} className="tree-group" style={{ ['--accent' as string]: periodColor(p.id) }}>
                <button className={`tree-item top ${scope === p.id ? 'active' : ''}`} onClick={() => onScope(p.id)}>
                  <span className="swatch" />
                  <span className="t-name">{p.name}</span>
                  <span className="t-count">{eventsIn(p.id).filter((e) => !isReign(e)).length}</span>
                  <span className="t-range">{periodRange(p)}</span>
                </button>
                {open &&
                  childPeriods(p.id).map((c) => (
                    <button
                      key={c.id}
                      className={`tree-item sub ${scope === c.id ? 'active' : ''}`}
                      onClick={() => onScope(c.id)}
                    >
                      <span className="t-name">{c.name}</span>
                      <span className="t-count">{eventsIn(c.id).filter((e) => !isReign(e)).length}</span>
                      <span className="t-range">{periodRange(c)}</span>
                    </button>
                  ))}
              </div>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
