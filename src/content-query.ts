import { GameData, Query, QueryChangeMessage } from "./types";

import { Cache } from "./Cache";
import { isQueryNull, scrapeGameDivs } from "./utils";

const showNoMatchesDiv = (gameDivs: HTMLElement[]) => {
  const firstGameDiv = gameDivs[0];
  const clone = firstGameDiv.cloneNode(true) as HTMLElement;
  clone.id = "no-match-div";

  // Find the game-card element within the clone
  const gameCard = clone.querySelector(".game-card") as HTMLElement;

  gameCard.innerHTML = "";
  Object.assign(gameCard.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "25px",
    fontSize: "24px",
    fontWeight: "600",
    boxShadow: "inset 0 0 0 5px rgb(44, 123, 229)",
  });

  // Create a new div to hold the "No matches found" text
  const noMatchesDiv = document.createElement("div");
  noMatchesDiv.textContent = "No Matches Found";

  // Append the new div to the game-card
  gameCard.appendChild(noMatchesDiv);
  firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
};

const removeNoMatchesDiv = () => {
  const noMatchesDiv = document.getElementById("no-match-div");
  noMatchesDiv?.remove();
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

const matchesQuery = (game: GameData, query: Query) => {
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
      if (matchesQuery(game, query)) {
        acc.add(game.id);
      }
      return acc;
    },
    new Set<number>()
  );

  if (matches.size === 0) {
    showNoMatchesDiv(gameDivs);
  }

  gameDivs.forEach((div) => {
    const anchor = div.querySelector("a[id]") as HTMLAnchorElement;
    const id = Number(anchor.id);

    displayMatch(query.matches, div, matches.has(id));
  });
};

const displayMatch = (
  matchType: "Highlight" | "Display",
  div: HTMLElement,
  match: boolean
): void => {
  switch (matchType) {
    case "Highlight":
      const gameCard = div.querySelector(".game-card") as HTMLElement;
      gameCard.style.boxShadow = match
        ? "inset 0 0 0 5px rgb(44, 123, 229)"
        : "none";
      break;
    case "Display":
      div.style.display = match ? "block" : "none";
      break;
  }
};

const clearMatches = () => {
  const gameDivs = scrapeGameDivs();
  removeNoMatchesDiv();

  gameDivs.forEach((div) => {
    // Ensure border is removed
    const gameCard = div.querySelector(".game-card") as HTMLElement;
    gameCard.style.boxShadow = "none";

    // And div isn't hidden
    div.style.display = "block";
  });
};

const handleQueryChange = async () => {
  const query: Query = await Cache.get("query");

  // Clear any previous searches if query is null
  if (isQueryNull(query)) {
    clearMatches();
    return;
  }

  const games: GameData[] = await Cache.get("games");
  clearMatches();
  showMatches(query, games);
};

// Handle when popup sends message asking to update query results
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

export {};
