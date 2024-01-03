import { Cache } from "./cache";
import { scrapeGameDivs, retry } from "./utils";

const scrapeLinks = async (): Promise<string[]> => {
  const gameDivs = scrapeGameDivs();

  const links = gameDivs.flatMap((div) =>
    Array.from(div.querySelectorAll("a[href]")).map(
      (link) => (link as HTMLAnchorElement).href
    )
  );

  if (links && links.length) {
    return links;
  }

  throw new Error("Empty list of links received");
};

const updateLinks = async () => {
  try {
    const scrapedLinks = await retry(scrapeLinks);
    const cachedGames = await Cache.get("games");

    if (!cachedGames) {
      chrome.runtime.sendMessage({
        type: "PROCESS_LINKS",
        links: scrapedLinks,
      });
      return;
    }

    // Get new games to scrape
    const newGamesToScrape = scrapedLinks.filter(
      (link) => !((link.split("/").pop() as string) in cachedGames)
    );

    if (newGamesToScrape.length) {
      chrome.runtime.sendMessage({
        type: "PROCESS_LINKS",
        links: newGamesToScrape,
      });
    }

    // Get old games to remove
    const currentIds: Set<string> = new Set(
      scrapedLinks.map((game) => game.split("/").pop() as string)
    );

    const oldGamesToRemove = Object.keys(cachedGames).filter(
      (id) => !currentIds.has(id)
    );

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
