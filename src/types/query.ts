export type Condition = "AND" | "OR";

export interface RefereeQuery {
  referee1: string;
  referee2: string;
  condition: Condition;
}

export interface LinesmanQuery {
  linesman1: string;
  linesman2: string;
  condition: Condition;
}

export interface Query {
  referee: RefereeQuery;
  linesman: LinesmanQuery;
  matches: string;
}

export const defaultQuery: Query = {
  referee: {
    referee1: "",
    referee2: "",
    condition: "AND",
  },
  linesman: {
    linesman1: "",
    linesman2: "",
    condition: "AND",
  },
  matches: "Highlight",
};
