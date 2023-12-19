import { GameData, Query, QueryChangeMessage } from "./types";

import { Cache } from "./Cache";
import { isQueryNull, scrapeGameDivs } from "./utils";

const toggleNoMatchesDiv = (gameDivs: HTMLElement[], show: boolean) => {
  // Get the existing no-match-div or create a new one if not present
  const noMatchesDiv = document.getElementById("no-match-div");

  if (show && !noMatchesDiv) {
    const firstGameDiv = gameDivs[0];
    const clone = firstGameDiv.cloneNode(true) as HTMLElement;
    clone.id = "no-match-div";

    // Find the game-card element within the clone and style it
    const gameCard = clone.querySelector(".game-card") as HTMLElement;
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

    gameCard.innerHTML = `<div>No Matches Found</div>`;

    // Insert the clone before the first game div
    firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
  } else if (!show && noMatchesDiv) {
    noMatchesDiv.remove();
  }
};

const buildTooltip = () => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("matches-tooltip-container");

  const test = {
    id: 54543,
    linesman1: "john ahaha",
    linesman2: "iocwsiocmewoisnoisdvnsoidvnsdoivnsdoivi",
    referee1: "- Not Set -",
    referee2: "Brian Bailkowski",
    timeKeeper1: "- Not Set -",
    timeKeeper2: "- Not Set -",
    url: "https://grayjayleagues.com/47/115/173/311/0/officials/games/landing/54543",
  };

  const tooltipHTML = ` 
    <header class="matches-tooltip-header-container">
      <h1>Officials</h1>
    </header>
    <div class="official-inputs">
      <label>Referee #1: <input class="matches-official" type="text" value="${test.referee1}" readonly /></label>
      <label>Referee #2: <input type="text" value="${test.referee2}" readonly /></label>
      <label>Linesman #1: <input type="text" value="${test.linesman1}" readonly /></label>
      <label>Linesman #2: <input type="text" value="${test.linesman2}" readonly /></label>
    </div>
  `;

  tooltip.innerHTML = tooltipHTML;

  const tooltipStyle = document.createElement("style") as HTMLStyleElement;
  const tooltipCSS = `
  .matches-tooltip-container {
    visibility: hidden;
    color: black;
    text-align: center;
    border-radius: 4px;
    position: absolute;
    z-index: 100;
    bottom: 30px;
    left: 50%;
    background-color: #fff;
    transform: translateX(-50%);
    white-space: nowrap;
    width: 280px;
    border: 2px solid #0b3e80;
  }
  
  .matches-tooltip-header-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0b3e80;
    height: 30px;
  }
  
  .matches-tooltip-header-container h1 {
    font-family: "Montserrat", sans-serif;
    font-weight: 600;
    font-size: 16px;
    color: #fff;
    margin: 0;
  }
  
  .official-inputs {
    padding: 5px;
    margin: 0;
  }
  
  .official-inputs label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    margin: 0;
    padding: 0;
  }
  
  .official-inputs input[type="text"] {
    margin-left: 10px;
    margin-bottom: 5px;
    padding: 5px 10px;
    width: 160px;
  }
  
  .matches-official {
    border: 2px solid #49a949;
    border-radius: 4px;
    background-color: #7dc67d;
  }
  
  .official-inputs label:last-child input[type="text"] {
    margin-bottom: 0;
  }
  
  .matches-tooltip-trigger:hover + .matches-tooltip-container {
    visibility: visible;
  }
  
  .matches-tooltip-container::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #0b3e80;
  }
  `;

  // Check if the style tag already exists to prevent duplicate tags
  if (!document.head.querySelector(".matches-tooltip-style")) {
    tooltipStyle.classList.add("matches-tooltip-style");
    tooltipStyle.appendChild(document.createTextNode(tooltipCSS));

    // Append the style element to the head
    document.head.appendChild(tooltipStyle);
  }

  return tooltip;
};

const displayMatch = (
  matchType: "Highlight" | "Display",
  div: HTMLElement,
  match: boolean
): void => {
  // Inject logo here
  const gameCard = div.querySelector(".game-card") as HTMLElement;

  const headerRow = gameCard.querySelector(".col-12 .row") as HTMLElement;
  const colLeft = headerRow.children[0] as HTMLElement;
  const colRight = headerRow.children[1] as HTMLElement;

  // Make them narrower to allow for ref popup
  colLeft.classList.replace("col-6", "col-5");
  colRight.classList.replace("col-6", "col-5");

  // Create new column for logo
  const logoCol = document.createElement("div");
  logoCol.classList.add("col-2");
  Object.assign(logoCol.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  // Create ref logo image
  const logo = document.createElement("img");
  logo.classList.add("injected-logo", "matches-tooltip-trigger");
  Object.assign(logo, {
    src: "/framework/assets/admin/img/hockey/icon_color/referee-2.png",
    alt: "Ref Logo",
    height: colLeft.offsetHeight,
    width: colLeft.offsetHeight,
  });

  const tooltip = buildTooltip();

  logoCol.appendChild(logo);
  logoCol.appendChild(tooltip);
  headerRow.insertBefore(logoCol, colRight);

  switch (matchType) {
    case "Highlight":
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
  toggleNoMatchesDiv(gameDivs, false);

  gameDivs.forEach((div) => {
    // Ensure border is removed
    const gameCard = div.querySelector(".game-card") as HTMLElement;
    gameCard.style.boxShadow = "none";
    // Remove injected logo and tool tip?

    // And div isn't hidden
    div.style.display = "block";
  });
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

  // Maybe just do a for loop
  /**
   * for each cached game
   * send the info to the tool tip
   */

  



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
    toggleNoMatchesDiv(gameDivs, true);
  }

  gameDivs.forEach((div) => {
    const anchor = div.querySelector("a[id]") as HTMLAnchorElement;
    const id = Number(anchor.id);

    displayMatch(query.matches, div, matches.has(id));
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
