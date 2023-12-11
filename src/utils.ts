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
  // Strictly check if referee1 and referee2 are null
  const areRefereesNull =
    query.referee.referee1 === null && query.referee.referee2 === null;

  // Strictly check if linesman1 and linesman2 are null
  const areLinesmenNull =
    query.linesman.linesman1 === null && query.linesman.linesman2 === null;

  // Return true if all are strictly null, false otherwise
  return areRefereesNull && areLinesmenNull;
};
