import { GameData } from "./types";

import { Cache } from "./Cache";
import { delay, scrapeGameDivs } from "./utils";

const scrapeLinks = async (
  retries = 3,
  delayMs: number = 1000
): Promise<string[]> => {
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
      return scrapeLinks(retries - 1, delayMs);
    }

    throw new Error(`Unable to scrape game links after ${retries} retries`);
  }
};

const getNewGamesToScrape = (
  scrapedLinks: string[],
  cachedGames: GameData[]
): string[] => {
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
    const scrapedLinks = await scrapeLinks();
    const cachedGames = await Cache.get("games");

    if (!cachedGames) {
      chrome.runtime.sendMessage({
        type: "PROCESS_LINKS",
        links: scrapedLinks,
      });
      return;
    }

    const newGamesToScrape = getNewGamesToScrape(scrapedLinks, cachedGames);
    const oldGamesToRemove = getoldGamesToRemove(scrapedLinks, cachedGames);

    if (newGamesToScrape.length) {
      chrome.runtime.sendMessage({
        type: "PROCESS_LINKS",
        links: newGamesToScrape,
      });
    }

    if (oldGamesToRemove.length) {
      Cache.removeGames(oldGamesToRemove);
    }
  } catch (error) {
    // more of a "ERROR_UPDATING_LINKS"
    console.error("Error updating links: ", error);
    chrome.runtime.sendMessage({
      type: "ERROR_SCRAPING_LINKS",
    });
  }
};

window.addEventListener("load", () => updateLinks());

export {};
