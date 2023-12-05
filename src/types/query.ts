export type Condition = "AND" | "OR";

export interface RefereeQuery {
  referee1: string | null;
  referee2: string | null;
  condition: Condition;
}

export interface LinesmanQuery {
  linesman1: string | null;
  linesman2: string | null;
  condition: Condition;
}

export interface Query {
  referee: RefereeQuery;
  linesman: LinesmanQuery;
  matches: string
}
