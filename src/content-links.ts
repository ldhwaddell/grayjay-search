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

const scrapeLinks = async (retries = 3, delayMs: number = 1000) => {
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

    return links;
  } catch (error) {
    console.error(`Error scraping game links: ${error}`);

    if (retries > 1) {
      await delay(delayMs);
      scrapeLinks(retries - 1, delayMs);
      return;
    }

    throw new Error(`Unable to scrape game links after ${retries} retries`);
  }
};

const getNewGamesToScrape = (
  scrapedLinks: string[],
  cachedGames: GameData[]
) => {
  // Extract id property from game objects
  const cachedIds: Set<number> = new Set(cachedGames.map((game) => game.id));
  const newGamesToScrape = scrapedLinks.filter(
    (link) => !cachedIds.has(Number(link.split("/").pop()))
  );

  return newGamesToScrape;
};

const getoldGamesToRemove = (
  scrapedLinks: string[],
  cachedGames: GameData[]
): number[] => {
  // Extract IDs from URLs
  const currentIds: Set<number> = new Set(
    scrapedLinks.map((game) => Number(game.split("/").pop()))
  );
  // Return IDs of games to remove
  const oldGamesToRemove = cachedGames
    .filter((game) => !currentIds.has(game.id))
    .map((game) => game.id);

  return oldGamesToRemove;
};

const updateLinks = async () => {
  try {
    const scrapedLinks = (await scrapeLinks()) as [];
    const cachedGames = await Cache.get("games");

    if (!cachedGames) {
      const message: ProcessLinksMessage = {
        type: "PROCESS_LINKS",
        links: scrapedLinks,
      };
      chrome.runtime.sendMessage(message);
      return;
    }

    const newGamesToScrape = getNewGamesToScrape(scrapedLinks, cachedGames);
    const oldGamesToRemove = getoldGamesToRemove(scrapedLinks, cachedGames);

    const message: ProcessLinksMessage = {
      type: "PROCESS_LINKS",
      links: newGamesToScrape,
    };
    chrome.runtime.sendMessage(message);
    Cache.removeGames(oldGamesToRemove);
  } catch (error) {
    // more of a "ERROR_UPDATING_LINKS"
    console.log(error);
    const message: ErrorScrapingLinksMessage = {
      type: "ERROR_SCRAPING_LINKS",
    };
    chrome.runtime.sendMessage(message);
  }
};

window.addEventListener("load", () => updateLinks());

export {};
