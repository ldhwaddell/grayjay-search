import {
  GameDataRecord,
  GameData,
  Query,
  QueryChangeMessage,
  InjectTooltipMessage,
} from "./types";

import { Cache } from "./Cache";
import {
  isQueryNull,
  scrapeGameDivs,
  measureTextWidth,
  getDivById,
} from "./utils";

const toggleNoMatchesDiv = (gameDivs: HTMLElement[], show: boolean) => {
  // Get the existing no-match-div or create a new one if not present
  const noMatchesDiv = document.getElementById("no-match-div");

  if (show && !noMatchesDiv) {
    const firstGameDiv = gameDivs[0];
    const clone = firstGameDiv.cloneNode(true) as HTMLElement;
    clone.id = "no-match-div";

    // Find the game-card element within the clone and style it
    const gameCard = clone.querySelector(".game-card") as HTMLElement;
    gameCard.classList.add("no-matches");
    gameCard.innerHTML = `<div>No Matches Found</div>`;

    // Insert the clone before the first game div
    firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
  } else if (!show && noMatchesDiv) {
    noMatchesDiv.remove();
  }
};

const generateLeftOffset = (
  text: string,
  logoWidth: number,
  colWidth: number,
  fontStyle: string
) => {
  const textWidth = measureTextWidth(text, fontStyle);
  // Assuming colPadding and rowPadding are constants, they could be defined outside this function
  const colPadding = 15;
  const rowPadding = 4;
  const logoMargin = 5;

  return (
    colWidth -
    (textWidth + colPadding + rowPadding + logoMargin + logoWidth / 2)
  );
};

const injectTooltip = (div: HTMLElement, game: GameData) => {
  const gameCard = div.querySelector(".game-card");
  const headerRow = gameCard?.querySelector(".col-12 .row");
  const colRight = headerRow?.querySelector(".col-6.text-right");

  if (!gameCard) {
    throw new Error("Game card element not found.");
  }
  if (!headerRow) {
    throw new Error("Header row within game card not found.");
  }
  if (!colRight) {
    throw new Error("Column right within header row not found.");
  }

  const fontStyle = getComputedStyle(document.body).font;
  const text = (colRight.textContent as string).trim();
  const logoWidth = parseFloat(getComputedStyle(colRight).lineHeight);

  const leftOffset = generateLeftOffset(
    text,
    logoWidth,
    colRight.clientWidth,
    fontStyle
  );

  // Create and insert the logo
  const logo = new Image(logoWidth, logoWidth);
  logo.classList.add("injected-logo", "matches-tooltip-trigger");
  logo.src = "/framework/assets/admin/img/hockey/icon_color/referee-2.png";
  logo.alt = "Referee Logo";
  logo.style.position = "relative";
  logo.style.marginRight = "5px";

  colRight.prepend(logo);

  // Wait for logo to load before adding tooltip
  logo.onload = () => {
    const bottomOffset = window.getComputedStyle(headerRow).height;
    const tooltip = document.createElement("div");
    tooltip.classList.add("matches-tooltip-container");
    tooltip.style.bottom = parseInt(bottomOffset, 10) + 5 + "px";
    tooltip.style.left = leftOffset + "px";

    tooltip.innerHTML = ` 
      <header class="matches-tooltip-header-container">
        <h1>Officials</h1>
      </header>
      <div class="official-inputs">
        <label>Referee #1: <input id="referee1" type="text" value="${game.referee1}" readonly /></label>
        <label>Referee #2: <input id="referee2" type="text" value="${game.referee2}" readonly /></label>
        <label>Linesman #1: <input id="linesman1" type="text" value="${game.linesman1}" readonly /></label>
        <label>Linesman #2: <input id="linesman2" type="text" value="${game.linesman2}" readonly /></label>
      </div>
    `;
    logo.after(tooltip);
  };
};

const injectCachedTooltips = async () => {
  const cachedGames = await Cache.get("games");
  if (!cachedGames) {
    return;
  }

  const gameDivs = scrapeGameDivs();

  for (const div of gameDivs) {
    const anchor = div.querySelector("a[id]");
    const { id } = anchor as HTMLAnchorElement;
    const game = cachedGames[id];

    if (!game) {
      console.log("Skipping, no game found for ID:", id);
      continue;
    }

    try {
      injectTooltip(div, game);
    } catch (error) {
      console.error("Unable to inject tooltip for game ID: ", id, error);
    }
  }
};

const handleQueryChange = async () => {
  const query: Query = await Cache.get("query");

  //   // Clear any previous searches if query is null
  //   if (isQueryNull(query)) {
  //     clearMatches();
  //     return;
  //   }

  //   const games: GameDataRecord = await Cache.get("games");
  //   clearMatches();
  //   showMatches(query, games);
};

const handleInjectTooltip = (message: InjectTooltipMessage) => {
  const { game } = message;
  const [gameId] = Object.keys(game);
  const gameDiv = getDivById(gameId);

  if (!gameDiv) {
    console.warn("Unable to find gameDiv with id: ", gameId);
    return;
  }

  try {
    injectTooltip(gameDiv, game[gameId]);
  } catch (error) {
    console.error("Unable to inject tooltip for game ID: ", gameId, error);
  }
};

// Handle when popup sends message asking to update query results
chrome.runtime.onMessage.addListener(
  (
    message: QueryChangeMessage | InjectTooltipMessage,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.type) {
      case "QUERY_CHANGE":
        handleQueryChange();
        break;
      case "INJECT_TOOLTIP":
        handleInjectTooltip(message);
        break;
    }
  }
);

window.addEventListener("load", () => injectCachedTooltips());

export {};

// const displayMatch = (
//   matchType: "Highlight" | "Display",
//   div: HTMLElement,
//   tooltip: HTMLDivElement,
//   match: boolean
// ): void => {

//   if (existingTooltip) {
//     existingTooltip.replaceWith(tooltip);
//   }

//   switch (matchType) {
//     case "Highlight":
//       gameCard.style.boxShadow = match
//         ? "inset 0 0 0 5px rgb(44, 123, 229)"
//         : "none";
//       break;
//     case "Display":
//       div.style.display = match ? "block" : "none";
//       break;
//   }
// };

// const clearMatches = () => {
//   const gameDivs = scrapeGameDivs();
//   toggleNoMatchesDiv(gameDivs, false);

//   gameDivs.forEach((div) => {
//     // Ensure border is removed
//     const gameCard = div.querySelector(".game-card") as HTMLElement;
//     gameCard.style.boxShadow = "none";
//     // Remove injected logo and tool tip?

//     // Need function to fox the header

//     // And div isn't hidden
//     div.style.display = "block";
//   });
// };

// const matchCondition = (
//   query1: string,
//   query2: string,
//   game1: string,
//   game2: string,
//   condition: boolean
// ) => {
//   const match1 = query1 === game1;
//   const match2 = query2 === game2;

//   const match =
//     query1 === ""
//       ? query2 === game2
//       : query2 === ""
//       ? query1 === game1
//       : condition
//       ? query1 === game1 && query2 === game2
//       : query1 === game1 || query2 === game2;

//   return {
//     match,
//     matchedFields: {
//       query1: match1,
//       query2: match2,
//     },
//   };
// };

// const matchesQuery = (game: GameData, query: Query) => {
//   const { referee, linesman } = query;

//   const { match: refereeMatch, matchedFields: refereeMatchedFields } =
//     matchCondition(
//       referee.referee1,
//       referee.referee2,
//       game.referee1,
//       game.referee2,
//       referee.condition
//     );

//   const { match: linesmanMatch, matchedFields: linesmanMatchedFields } =
//     matchCondition(
//       linesman.linesman1,
//       linesman.linesman2,
//       game.linesman1,
//       game.linesman2,
//       linesman.condition
//     );

//   return {
//     isMatch: refereeMatch || linesmanMatch,
//     refereeMatchedFields,
//     linesmanMatchedFields,
//   };
// };

// const showMatches = (query: Query, cachedGames: GameDataRecord): void => {
//   const gameDivs = scrapeGameDivs();

//   // for (const div of gameDivs) {
//   //   const { id } = div.querySelector("a[id]") as HTMLAnchorElement;
//   //   const game = cachedGames[id];

//   //   const { isMatch, refereeMatchedFields, linesmanMatchedFields } =
//   //     matchesQuery(game, query);

//   //   const tooltip = buildTooltip(
//   //     game,
//   //     refereeMatchedFields,
//   //     linesmanMatchedFields
//   //   );

//   //   displayMatch(query.matches, div, tooltip, isMatch);
//   // }
// };
