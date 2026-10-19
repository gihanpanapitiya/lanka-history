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
  title: string;
  /** Sort key and position on the timeline. */
  year: Year;
  endYear?: Year;
  /** Display override for the date, e.g. "c. 38,000 BP" or "traditional 543 BCE". */
  date?: string;
  /** Id of the (leaf) period this event belongs to. */
  period: string;
  summary: string;
  /** Ids of events that caused or directly enabled this one. */
  causes?: string[];
  tags?: Tag[];
}
