export type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

export type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

