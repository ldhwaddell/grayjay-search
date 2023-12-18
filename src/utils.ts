import { Query } from "./types";

// Various helper functions
const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

export const isValidUrl = (url: string): boolean => regex.test(url);

export const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  return tab;
};

export const isQueryNull = (query: Query): boolean => {
  // Strictly check if referee1 and referee2 are ""
  const areRefereesNull =
    query.referee.referee1 === "" && query.referee.referee2 === "";

  // Strictly check if linesman1 and linesman2 are ""
  const areLinesmenNull =
    query.linesman.linesman1 === "" && query.linesman.linesman2 === "";

  // Return true if all are strictly "", false otherwise
  return areRefereesNull && areLinesmenNull;
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const scrapeGameDivs = (): HTMLElement[] =>
  Array.from(document.querySelectorAll(".single-game")) as HTMLElement[];

export const clone = (obj: any) => JSON.parse(JSON.stringify(obj));
