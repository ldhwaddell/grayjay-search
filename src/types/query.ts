export interface RefereeQuery {
  referee1: string;
  referee2: string;
  condition: boolean;
}

export interface LinesmanQuery {
  linesman1: string;
  linesman2: string;
  condition: boolean;
}

export interface Query {
  referee: RefereeQuery;
  linesman: LinesmanQuery;
  matches: "Highlight" | "Display";
}

export const defaultQuery: Query = {
  referee: {
    referee1: "",
    referee2: "",
    condition: true,
  },
  linesman: {
    linesman1: "",
    linesman2: "",
    condition: true,
  },
  matches: "Highlight",
};
