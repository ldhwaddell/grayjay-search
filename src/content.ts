import {
  ErrorScrapingLinksMessage,
  GameData,
  ProcessLinksMessage,
  Query,
  QueryChangeMessage,
} from "./types";

import { Cache } from "./Cache";
import { isQueryNull } from "./utils";

const scrapeGameDivs = () =>
  Array.from(document.querySelectorAll(".single-game")) as HTMLElement[];

const scrapeLinks = (retries = 3, delayMs: number = 1000) => {
  try {
    const gameDivs = scrapeGameDivs();
    const links = gameDivs.flatMap((div) =>
      Array.from(div.querySelectorAll("a[href]")).map(
        (link) => (link as HTMLAnchorElement).href
      )
    );

    if (!links || !links.length) {
      throw new Error("Empty list of links received");
    }

    const message: ProcessLinksMessage = { type: "PROCESS_LINKS", links };
    chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error(error);
    if (retries > 1) {
      setTimeout(() => scrapeLinks(retries - 1, delayMs), delayMs);
    } else {
      console.warn("Maximum retries reached for scraping links.");
      const message: ErrorScrapingLinksMessage = {
        type: "ERROR_SCRAPING_LINKS",
      };
      chrome.runtime.sendMessage(message);
    }
  }
};

const matchCondition = (
  query1: string,
  query2: string,
  game1: string,
  game2: string,
  condition: boolean
): boolean => {
  return query1 === ""
    ? query2 === game2
    : query2 === ""
    ? query1 === game1
    : condition
    ? query1 === game1 && query2 === game2
    : query1 === game1 || query2 === game2;
};

const matchesQuery = (query: Query, game: GameData) => {
  const { referee, linesman } = query;

  const refereeMatch = matchCondition(
    referee.referee1,
    referee.referee2,
    game.referee1,
    game.referee2,
    referee.condition
  );

  const linesmanMatch = matchCondition(
    linesman.linesman1,
    linesman.linesman2,
    game.linesman1,
    game.linesman2,
    linesman.condition
  );

  return refereeMatch || linesmanMatch;
};

const showMatches = (query: Query, cachedGames: GameData[]): void => {
  const gameDivs = scrapeGameDivs();

  const matches: Set<number> = cachedGames.reduce(
    (acc: Set<number>, game: GameData) => {
      if (matchesQuery(query, game)) {
        acc.add(game.id);
      }
      return acc;
    },
    new Set<number>()
  );

  if (matches.size === 0) {
    const firstGameDiv = gameDivs[0];
    const clone = firstGameDiv.cloneNode(true) as HTMLElement;

    // Find the game-card element within the clone
    //const gameCard = clone.querySelector(".game-card");

    // Append the modified clone to the DOM, adjust the location as needed
    // For example, appending to the container of the gameDivs
    //firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
  }

  gameDivs.forEach((div) => {
    const anchor = div.querySelector("a[id]") as HTMLAnchorElement;
    const id = Number(anchor.id);
    display(query.matches, div, matches.has(id));
  });
};

const display = (matchType: string, div: HTMLElement, match: boolean): void => {
  switch (matchType) {
    case "Highlight":
      div.style.border = match ? "5px solid green" : "0";
      break;
    case "Display":
      div.style.display = match ? "block" : "none";
      break;
  }
};

const showAllGames = () => {
  const gameDivs = scrapeGameDivs();

  // Clear "no matches found" div here

  gameDivs.forEach((div) => {
    div.style.display = "block";
    div.style.border = "0";
  });
};

const handleQueryChange = async () => {
  const query = await Cache.getQuery();
  // Clear any previous searches if query is null
  if (isQueryNull(query)) {
    console.log("NULL");
    showAllGames();
    return;
  }

  const games = await Cache.get();
  showAllGames();
  showMatches(query, games);
};

// Handle when popupsends message asking to update query results
chrome.runtime.onMessage.addListener(
  (
    message: QueryChangeMessage,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.type) {
      case "QUERY_CHANGE":
        handleQueryChange();
        break;
    }
  }
);

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", () => scrapeLinks());

export {};
