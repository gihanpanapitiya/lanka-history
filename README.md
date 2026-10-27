# Sri Lanka History Graph

An interactive causal graph of Sri Lankan history: each event links to the events that caused it,
organised into periods and sub-periods.

```sh
npm install
npm run dev        # http://localhost:5173
npm run validate   # check the data for broken links / chronology errors
npm run build
```

## Using it

- **Overview** – one card per top-level period; arrows count the cause → effect links between periods.
- **Period view** – click a period (or a sub-period chip) to see its events.
  - The graph grows downwards: scroll to move through time (pinch or Ctrl+scroll to zoom).
  - Dashed cards are events from *other* periods that caused, or were caused by, events here.
    Click one to jump to its period.
  - Click an event to see its details and highlight its full causal chain (or only direct links).
  - *Layout*: **Chronological** keeps time flowing top → bottom; **Causal** packs the graph tighter.
  - *Theme* dims everything except events with that tag (political, religious, economic, …).
- **Search** in the sidebar works across all periods.
- The URL keeps the current period and event (`#period=dutch&event=siyam-nikaya`), so views can be bookmarked and shared.

## Data

| File | Contents |
| --- | --- |
| `src/data/types.ts` | `Period` and `HistEvent` types |
| `src/data/periods.ts` | Period hierarchy (top-level periods have no `parent`) |
| `src/data/events/*.ts` | Events, one file per top-level period |

An event looks like:

```ts
{
  id: 'dutugemunu',
  title: 'Dutugemunu defeats Elara',
  year: -161,                       // negative = BCE; used for ordering
  date: '161 BCE (traditional)',    // optional display text
  period: 'early-anuradhapura',     // a leaf period id
  summary: '…',
  causes: ['elara', 'ruhuna-rise', 'mahavihara'],  // may point into any period
  tags: ['military', 'political'],
}
```

Effects are derived automatically from `causes`. Run `npm run validate` after editing: it reports
unknown ids, causes dated after their effects, and events outside their period's date range.

Early dates follow the traditional Mahavamsa chronology and are approximate.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` validates, builds and publishes `dist/` on every push to `main`.
One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.
The site is then served at `https://<user>.github.io/<repo>/`; `base: './'` in `vite.config.ts`
keeps asset paths relative so it works from that subpath.
