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

const matchesQuery = (query: Query, game: GameData) => {
  // Needs a total revamp
  const { referee: queryReferee, linesman: queryLinesman } = query;

  const {
    referee1: queryReferee1,
    referee2: queryReferee2,
    condition: refereeCondition,
  } = queryReferee;

  const {
    linesman1: queryLinesman1,
    linesman2: queryLinesman2,
    condition: linesmanCondition,
  } = queryLinesman;

  let refereeMatch, linesmanMatch;

  if (queryReferee1 === null) {
    refereeMatch = queryReferee2 === game.referee2;
  } else if (queryReferee2 === null) {
    refereeMatch = queryReferee1 === game.referee1;
  } else {
    refereeMatch =
      refereeCondition === "AND"
        ? queryReferee1 === game.referee1 && queryReferee2 === game.referee2
        : queryReferee1 === game.referee1 || queryReferee2 === game.referee2;
  }

  if (queryLinesman1 === null) {
    linesmanMatch = queryLinesman2 === game.linesman2;
  } else {
    linesmanMatch =
      linesmanCondition === "AND"
        ? queryLinesman1 === game.linesman1 && queryLinesman2 === game.linesman2
        : queryLinesman1 === game.linesman1 ||
          queryLinesman2 === game.linesman2;
  }

  // return refereeMatch && linesmanMatch;
  return refereeMatch;
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

    // Modify the clone to display "no matches"
    clone.style.border = "5px solid orange";

    // Insert the clone at the beginning of the parent container
    // firstGameDiv.parentNode?.insertBefore(
    //   clone,
    //   firstGameDiv.parentNode.firstChild
    // );
    return;
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

  gameDivs.forEach((div) => {
    div.style.display = "block";
    div.style.border = "0";
  });
};

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", () => scrapeLinks());

// Handle when popupsends message asking to update query results
chrome.runtime.onMessage.addListener(
  (
    message: QueryChangeMessage,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.type) {
      case "QUERY_CHANGE":
        const { query } = message;

        // Clear any prev searches if query is null, don't bother accessing cache
        if (isQueryNull(query)) {
          showAllGames();
          break;
        }

        Cache.get().then((games) => {
          // Clear previous matches before showing query results
          showAllGames();
          showMatches(query, games);
        });

        break;
    }
  }
);

export {};

// ADD LITTLE REF LOGOS TO EACH GAME WITH WHOS ON IT
// CREATE READ ME
// COMMENT ALL CODE
// ADD LOGIC TO SHOW MATCHES
// FIX WEIRD ORPHAN CONTENT SCRIPT ISSUE (REINJECT?)
// FIX CSS (HELL)
//
