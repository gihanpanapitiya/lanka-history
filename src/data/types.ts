/** Years are astronomical-ish integers: negative = BCE, positive = CE. */
export type Year = number;

export type Tag =
  | 'political'
  | 'military'
  | 'religious'
  | 'economic'
  | 'cultural'
  | 'social'
  | 'environmental'
  | 'external';

export interface Period {
  id: string;
  name: string;
  start: Year;
  end: Year;
  /** Parent period id; omit for top-level periods. */
  parent?: string;
  summary: string;
  /** Accent colour used for this period's nodes. Children inherit if unset. */
  color?: string;
}

export interface HistEvent {
  id: string;
  /** 'reign' nodes form the line of rulers; omitted for ordinary events. */
  kind?: 'reign';
  /** Reigns only: id of the preceding reign. Drawn as a succession edge rather than a cause. */
  succeeds?: string;
  /** Reigns only: a foreign ruler who took the throne by invasion or usurpation. */
  invader?: boolean;
  title: string;
  /** Sort key and position on the timeline. For reigns, the year of accession. */
  year: Year;
  /** For reigns, the last year of the reign. */
  endYear?: Year;
  /** Display override for the date, e.g. "c. 38,000 BP" or "traditional 543 BCE". */
  date?: string;
  /** Id of the (leaf) period this event belongs to. */
  period: string;
  summary: string;
  /** English Wikipedia article title, optionally with a "#Section" anchor. */
  wiki?: string;
  /** Ids of events that caused or directly enabled this one. */
  causes?: string[];
  tags?: Tag[];
}
