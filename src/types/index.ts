export * from "./messages";
export * from "./query";

// Generic Types used across multiple files
export type GameData = {
  url: string;
  referee1: string;
  referee2: string;
  linesman1: string;
  linesman2: string;
  timeKeeper1: string;
  timeKeeper2: string;
};

// This represents a record of game data objects, keyed by string
export type GameDataRecord = Record<string, GameData>;

export interface MaybeDoc {
  type?: string;
  text?: string;
  content?: string;
  voidElement?: boolean;
  name?: string;
  style?: string[];
  attrs?: Record<string, string | boolean | number>;
  children?: MaybeDoc[];
  comment?: string;
}

export interface OfficialNode extends MaybeDoc {
  attrs: {
    readonly: string;
    value: string;
  };
}

export type Official = "referee1" | "referee2" | "linesman1" | "linesman2";

export interface MeasureTextWidthFunction {
  (text: string, font: string): number;
  canvas?: HTMLCanvasElement;
}
