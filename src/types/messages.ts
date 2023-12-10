import { Query } from "./query";

export type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

export type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

export type QueryChangeMessage = {
  type: "QUERY_CHANGE";
  query: Query;
};
