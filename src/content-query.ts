import {
  ErrorScrapingLinksMessage,
  GameData,
  ProcessLinksMessage,
  Query,
  QueryChangeMessage,
} from "./types";

import { Cache } from "./Cache";
import { isQueryNull, delay } from "./utils";

const scrapeGameDivs = (): HTMLElement[] =>
  Array.from(document.querySelectorAll(".single-game")) as HTMLElement[];

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
  const query = await Cache.get("query");

  // Clear any previous searches if query is null
  if (isQueryNull(query)) {
    showAllGames();
    return;
  }

  const games = await Cache.get("games");
  showAllGames();
  showMatches(query, games);
};

// Handle when popup sends message asking to update query results
chrome.runtime.onMessage.addListener(
  (
    message: QueryChangeMessage,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log(message);
    switch (message.type) {
      case "QUERY_CHANGE":
        handleQueryChange();
        break;
    }
  }
);

export {};
