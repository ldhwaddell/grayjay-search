import {
  GameDataRecord,
  GameData,
  Query,
  QueryChangeMessage,
  InjectTooltipMessage,
} from "./types";

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
    gameCard.classList.add("no-matches");
    gameCard.innerHTML = `<div>No Matches Found</div>`;

    // Insert the clone before the first game div
    firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
  } else if (!show && noMatchesDiv) {
    noMatchesDiv.remove();
  }
};

const buildTooltip = (game: GameData, bottomOffset: string): HTMLDivElement => {
  const tooltip = document.createElement("div");
  tooltip.classList.add("matches-tooltip-container");
  tooltip.style.bottom = parseInt(bottomOffset, 10) + 5 + "px";

  tooltip.innerHTML = ` 
    <header class="matches-tooltip-header-container">
      <h1>Officials</h1>
    </header>
    <div class="official-inputs">
      <label>Referee #1: <input type="text" value="${game.referee1}" readonly /></label>
      <label>Referee #2: <input type="text" value="${game.referee2}" readonly /></label>
      <label>Linesman #1: <input type="text" value="${game.linesman1}" readonly /></label>
      <label>Linesman #2: <input type="text" value="${game.linesman2}" readonly /></label>
    </div>
  `;

  return tooltip;
};

const getDivById = (gameId: string) => {
  // Find the anchor tag with the specified ID
  const anchor = document.getElementById(gameId);

  // If the anchor exists and its parent is a div, return the parent div
  if (anchor && anchor.parentElement?.tagName === "DIV") {
    return anchor.parentElement;
  }

  // Return null if no matching div is found
  return null;
};

const injectTooltip = (div: HTMLElement, game: GameData) => {
  const gameCard = div.querySelector(".game-card");
  const headerRow = gameCard?.querySelector(".col-12 .row");
  const colRight = headerRow?.querySelector(".col-6.text-right");

  if (gameCard && headerRow && colRight) {
    const bottomOffset = window.getComputedStyle(headerRow).height;
    const textStyle = window.getComputedStyle(colRight);

    const logo = document.createElement("img");
    logo.classList.add("injected-logo", "matches-tooltip-trigger");
    logo.src = "/framework/assets/admin/img/hockey/icon_color/referee-2.png";
    logo.alt = "Referee Logo";
    logo.style.position = "relative";
    logo.style.height = textStyle.lineHeight;
    logo.style.width = "auto";
    logo.style.marginRight = "5px";

    colRight.prepend(logo);

    const tooltip = buildTooltip(game, bottomOffset);
    logo.after(tooltip);
  } else {
    throw new Error("Unable to locate required HTML element to inject tooltip");
  }
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

  if (gameDiv) {
    injectTooltip(gameDiv, game[gameId]);
    return;
  }

  console.warn("Unable to find gameDiv with id: ", gameId);
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

// const buildTooltip = (
//   game: GameData,
//   refereeMatchedFields: { query1: boolean; query2: boolean },
//   linesmanMatchedFields: { query1: boolean; query2: boolean }
// ): HTMLDivElement => {
//   const tooltip = document.createElement("div");
//   tooltip.classList.add("matches-tooltip-container");

//   tooltip.innerHTML = `
//     <header class="matches-tooltip-header-container">
//       <h1>Officials</h1>
//     </header>
//     <div class="official-inputs">
//       <label>Referee #1: <input class="${
//         refereeMatchedFields.query1 ? "matches-official" : ""
//       }" type="text" value="${game.referee1}" readonly /></label>
//       <label>Referee #2: <input class="${
//         refereeMatchedFields.query2 ? "matches-official" : ""
//       }" type="text" value="${game.referee2}" readonly /></label>
//       <label>Linesman #1: <input class="${
//         linesmanMatchedFields.query1 ? "matches-official" : ""
//       }" type="text" value="${game.linesman1}" readonly /></label>
//       <label>Linesman #2: <input class="${
//         linesmanMatchedFields.query2 ? "matches-official" : ""
//       }" type="text" value="${game.linesman2}" readonly /></label>
//     </div>
//   `;

//   return tooltip;
// };

// const displayMatch = (
//   matchType: "Highlight" | "Display",
//   div: HTMLElement,
//   tooltip: HTMLDivElement,
//   match: boolean
// ): void => {
//   // Query the game card for existing elements
//   const gameCard = div.querySelector(".game-card") as HTMLElement;
//   const headerRow = gameCard.querySelector(".col-12 .row") as HTMLElement;
//   const logoCol = gameCard.querySelector("#logo-column") as HTMLElement;
//   let existingTooltip = gameCard.querySelector(
//     ".matches-tooltip-container"
//   ) as HTMLElement;

//   // Check if the logo column exists
//   if (!logoCol) {
//     const logoCol = document.createElement("div");
//     logoCol.id = "logo-column";
//     logoCol.classList.add("col-2");
//     Object.assign(logoCol.style, {
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     });

//     // Create and insert the logo
//     const logo = document.createElement("img");
//     logo.classList.add("injected-logo", "matches-tooltip-trigger");
//     Object.assign(logo, {
//       src: "/framework/assets/admin/img/hockey/icon_color/referee-2.png",
//       alt: "Ref Logo",
//       height: 25,
//       width: 25,
//     });

//     // Adjust the width of existing columns
//     const colLeft = headerRow.children[0] as HTMLElement;
//     const colRight = headerRow.children[1] as HTMLElement;
//     colLeft.classList.replace("col-6", "col-5");
//     colRight.classList.replace("col-6", "col-5");

//     // Append the logo and tooltip to the new column
//     logoCol.appendChild(logo);
//     logoCol.appendChild(tooltip);
//     headerRow.insertBefore(logoCol, colRight);
//   }

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
