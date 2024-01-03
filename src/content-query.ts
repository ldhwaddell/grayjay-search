import {
  GameDataRecord,
  GameData,
  Query,
  QueryChangeMessage,
  InjectTooltipMessage,
} from "./types";

import { Cache } from "./cache";
import {
  isQueryEmpty,
  scrapeGameDivs,
  measureTextWidth,
  getDivById,
} from "./utils";

const colPadding = 15;
const rowPadding = 4;
const logoMargin = 5;
const tooltipPadding = 7;

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
  const text = colRight.textContent?.trim();

  if (!text) {
    throw new Error("Unable to extract text to calculate tooltip offset");
  }

  const logoWidth = parseFloat(getComputedStyle(colRight).lineHeight);
  const logo = createLogo(logoWidth);
  colRight.prepend(logo);

  const textWidth = measureTextWidth(text, fontStyle);

  const leftOffset =
    colRight.clientWidth -
    (textWidth + colPadding + rowPadding + logoMargin + logoWidth / 2);

  logo.onload = () => {
    const tooltip = createTooltip(game, headerRow, leftOffset);
    logo.after(tooltip);
  };
};

const createLogo = (logoWidth: number) => {
  const logo = new Image(logoWidth, logoWidth);
  logo.classList.add("injected-logo", "matches-tooltip-trigger");
  logo.src = "/framework/assets/admin/img/hockey/icon_color/referee-2.png";
  logo.alt = "Referee Logo";
  Object.assign(logo.style, {
    position: "relative",
    marginRight: "5px",
  });
  return logo;
};

const createTooltip = (
  game: GameData,
  headerRow: Element,
  leftOffset: number
) => {
  const bottomOffset = window.getComputedStyle(headerRow).height;
  const tooltip = document.createElement("div");
  tooltip.classList.add("matches-tooltip-container");
  Object.assign(tooltip.style, {
    bottom: parseInt(bottomOffset) + tooltipPadding + "px",
    left: leftOffset + "px",
  });

  const header = document.createElement("header");
  header.classList.add("matches-tooltip-header-container");
  const title = document.createElement("h1");
  title.textContent = "Officials";
  header.appendChild(title);

  const inputs = document.createElement("div");
  inputs.classList.add("official-inputs");

  // Dynamically create input elements for each official
  ["referee1", "referee2", "linesman1", "linesman2"].forEach((role) => {
    const label = document.createElement("label");
    label.textContent = `${
      role.charAt(0).toUpperCase() + role.slice(1).replace(/\d+/, " #$&")
    }: `;
    const input = document.createElement("input");
    input.type = "text";
    input.value = game[role as keyof GameData];
    input.readOnly = true;
    label.appendChild(input);
    inputs.appendChild(label);
  });

  tooltip.appendChild(header);
  tooltip.appendChild(inputs);
  return tooltip;
};

const injectCachedTooltips = async () => {
  const cachedGames = await Cache.get("games");
  if (!cachedGames) {
    return;
  }

  const gameDivs = scrapeGameDivs();

  for (const div of gameDivs) {
    const anchor = div.querySelector("a[id]");

    if (!anchor) {
      console.log("Skipping, no ID anchor tag found for div: ", div);
      continue;
    }

    const { id } = anchor;
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

const toggleNoMatchesDiv = (gameDivs: HTMLElement[], show: boolean) => {
  // Get the existing no-match-div or create a new one if not present
  const noMatchesDiv = document.getElementById("no-match-div");

  if (!show && noMatchesDiv) {
    noMatchesDiv.remove();
    return;
  }

  if (show && !noMatchesDiv) {
    const firstGameDiv = gameDivs[0];
    const clone = firstGameDiv.cloneNode(true) as HTMLElement;
    clone.style.display = "block";
    clone.id = "no-match-div";

    // Find the game-card element within the clone and style it
    const gameCard = clone.querySelector(".game-card") as HTMLElement;
    gameCard.classList.add("no-matches");
    gameCard.innerHTML = `<div>No Matches Found</div>`;

    const links = clone.getElementsByTagName("a");
    for (const link of Array.from(links)) {
      link.removeAttribute("href");
      // Optional: you could also disable the link entirely
      link.style.pointerEvents = "none";
      link.style.cursor = "default";
    }

    // Insert the clone before the first game div
    firstGameDiv.parentNode?.insertBefore(clone, firstGameDiv);
  }
};

const clearMatches = () => {
  const gameDivs = scrapeGameDivs();
  toggleNoMatchesDiv(gameDivs, false);

  gameDivs.forEach((div) => {
    // Ensure border is removed
    const gameCard = div.querySelector(".game-card") as HTMLElement;
    gameCard.style.boxShadow = "none";
    // And div isn't hidden
    div.style.display = "block";
  });
};

const matchesCondition = (
  query1: string,
  query2: string,
  game1: string,
  game2: string,
  condition: boolean
) => {
  if (query1 === "" && query2 !== "") {
    return query2 === game2;
  }

  if (query2 === "" && query1 !== "") {
    return query1 === game1;
  }

  return condition
    ? query1 === game1 && query2 === game2
    : query1 === game1 || query2 === game2;
};

const satisfiesQuery = (game: GameData, query: Query) => {
  const matchesReferee = matchesCondition(
    query.referee.referee1,
    query.referee.referee2,
    game.referee1,
    game.referee2,
    query.referee.condition
  );

  const matchesLinesman = matchesCondition(
    query.linesman.linesman1,
    query.linesman.linesman2,
    game.linesman1,
    game.linesman2,
    query.linesman.condition
  );

  return matchesReferee || matchesLinesman;
};

const displayMatch = (
  div: HTMLElement,
  matchType: "Highlight" | "Display",
  isMatch: boolean
): void => {
  switch (matchType) {
    case "Highlight":
      const gameCard = div.querySelector(".game-card") as HTMLElement;
      gameCard.style.boxShadow = isMatch
        ? "inset 0 0 0 5px rgb(44, 123, 229)"
        : "none";
      break;
    case "Display":
      div.style.display = isMatch ? "block" : "none";
      break;
  }
};

const showMatches = (query: Query, games: GameDataRecord) => {
  const gameDivs = scrapeGameDivs();
  let foundMatch = false;

  for (const div of gameDivs) {
    const { id } = div.querySelector("a[id]") as HTMLAnchorElement;
    const game = games[id];

    const isMatch = satisfiesQuery(game, query);
    if (isMatch) foundMatch = true;
    displayMatch(div, query.matches, isMatch);
  }

  if (!foundMatch) {
    toggleNoMatchesDiv(gameDivs, true);
  }
};

const handleQueryChange = async () => {
  const query: Query = await Cache.get("query");

  // Clear any previous searches if query is empty
  if (isQueryEmpty(query)) {
    clearMatches();
    return;
  }

  const games: GameDataRecord = await Cache.get("games");
  clearMatches();
  showMatches(query, games);
};

const handleInjectTooltip = (message: InjectTooltipMessage) => {
  const { game } = message;
  const [id] = Object.keys(game);
  const gameDiv = getDivById(id);

  if (!gameDiv) {
    console.warn("Unable to find gameDiv with id: ", id);
    return;
  }

  try {
    injectTooltip(gameDiv, game[id]);
  } catch (error) {
    console.error("Unable to inject tooltip for game ID: ", id, error);
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
