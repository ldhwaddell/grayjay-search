import { GameDataRecord } from ".";

export type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

export type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

export type QueryChangeMessage = {
  type: "QUERY_CHANGE";
};

export type InjectTooltipMessage = {
  type: "INJECT_TOOLTIP";
  game: GameDataRecord;
};
