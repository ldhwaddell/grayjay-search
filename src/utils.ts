import { Query, MeasureTextWidthFunction } from "./types";

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

export const retry = async <T, Args extends any[]>(
  func: (...args: Args) => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
  ...args: Args
): Promise<T> => {
  try {
    return await func(...args);
  } catch (error) {
    console.error("Error in function: ", error);
    if (retries > 1) {
      await delay(delayMs);
      return retry(func, retries - 1, delayMs, ...args);
    }
    throw new Error(`Unable to call ${func.name}`);
  }
};

export const getDivById = (gameId: string) => {
  // Find the anchor tag with the specified ID
  const anchor = document.getElementById(gameId);

  // If the anchor exists and its parent is a div, return the parent div
  if (anchor && anchor.parentElement?.tagName === "DIV") {
    return anchor.parentElement;
  }

  // Return null if no matching div is found
  return null;
};

export const measureTextWidth: MeasureTextWidthFunction = (
  text: string,
  font: string
): number => {
  if (!measureTextWidth.canvas) {
    measureTextWidth.canvas = document.createElement("canvas");
  }
  const context = measureTextWidth.canvas.getContext("2d")!;
  context.font = font;
  return context.measureText(text).width;
};
