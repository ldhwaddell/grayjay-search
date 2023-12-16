import { parse } from "html-to-ast";
import { Cache } from "./Cache";

import {
  ErrorScrapingLinksMessage,
  ProcessLinksMessage,
  GameData,
  MaybeDoc,
  OfficialNode,
} from "./types";

type Message = ErrorScrapingLinksMessage | ProcessLinksMessage;

// State flag
let isProcessingLinks = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isOfficial = (node: MaybeDoc): node is OfficialNode => {
  return (
    node.type === "tag" &&
    node.name === "input" &&
    node.attrs?.readonly !== undefined &&
    typeof node.attrs.value === "string"
  );
};

const extractOfficials = (ast: MaybeDoc[]): string[] => {
  const officials: string[] = [];
  const stack: MaybeDoc[] = [...ast];

  while (stack.length > 0) {
    const node: MaybeDoc | undefined = stack.pop();

    if (!node) {
      continue;
    }

    // If element meets conditions signifying it is official, add it
    if (isOfficial(node)) {
      officials.push(node.attrs.value);
    }

    // If node has children, shallow copy them and add to stack
    if (node.children) {
      stack.push(...node.children);
    }
  }

  return officials;
};

const fetchRetry = async (
  url: string,
  retries: number,
  delayMs: number = 1000
): Promise<string> => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
    throw new Error(`Invalid response code: ${response.status} for ${url}`);
  } catch (error) {
    console.error(`Error fetching ${url}: ${error}`);
    if (retries > 1) {
      await delay(delayMs);
      return fetchRetry(url, retries - 1, delayMs);
    }
    throw new Error(`Unable to scrape: ${url} after ${retries} retries`);
  }
};

const fetchGameData = async (url: string): Promise<GameData | null> => {
  try {
    const html: string = await fetchRetry(url, 3);

    const ast: MaybeDoc[] = parse(html);
    const officials: string[] = extractOfficials(ast);
    const id: number = Number(url.split("/").pop());

    const data: GameData = {
      url,
      id,
      referee1: officials[5],
      referee2: officials[4],
      linesman1: officials[3],
      linesman2: officials[2],
      timeKeeper1: officials[1],
      timeKeeper2: officials[0],
    };

    return data;
  } catch (error) {
    console.error(`Error fetching game data for URL: ${url}`, error);
    return null;
  }
};

const scrapeLinks = async (links: string[]) => {
  if (!links || !links.length) {
    return;
  }

  const chunkSize = 5;
  const allGameData: GameData[] = [];

  for (let i = 0; i < links.length; i += chunkSize) {
    const chunk = links.slice(i, i + chunkSize);

    try {
      const dataChunk = await Promise.all(
        chunk.map((link) => fetchGameData(link))
      );

      // Add non null data chunks to cache
      Cache.add(dataChunk.filter((game): game is GameData => game !== null));
    } catch (error) {
      // Log the error and the chunk that caused it
      console.error("Error with a chunk:", chunk, error);
    }
  }

  isProcessingLinks = false;

  return allGameData;
};

const diffArrays = (
  newLinks: string[],
  cached: GameData[]
): [string[], number[]] => {
  // Extract IDs from URLs
  const currentIds: Set<number> = new Set(
    newLinks.map((game) => Number(game.split("/").pop()))
  );
  // Extract id property from game objects
  const cachedIds: Set<number> = new Set(cached.map((game) => game.id));

  // Return URLs to scrape
  const newGamesToScrape = newLinks.filter(
    (link) => !cachedIds.has(Number(link.split("/").pop()))
  );

  // Return IDs of games to remove
  const oldGamesToRemove = cached
    .filter((game) => !currentIds.has(game.id))
    .map((game) => game.id);

  return [newGamesToScrape, oldGamesToRemove];
};

const handleProcessLinks = async (message: ProcessLinksMessage) => {
  // If current scrape in process, ignore request
  if (isProcessingLinks) {
    console.warn(
      "Already processing links. Ignoring new request to process links."
    );
    return;
  }

  isProcessingLinks = true;
  const { links } = message;

  // If there are links, check the cache for links
  const cachedGames: GameData[] = await Cache.get();

  // If there are links, diff the list received and the cache
  const [newGamesToScrape, oldGamesToRemove] = diffArrays(links, cachedGames);

  try {
    scrapeLinks(newGamesToScrape);
    Cache.remove(oldGamesToRemove);
  } catch (error) {
    console.error("Error processing links. Please refresh page");
    return;
  }
};

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    switch (message.type) {
      case "PROCESS_LINKS":
        handleProcessLinks(message);
        break;

      case "ERROR_SCRAPING_LINKS":
        console.error("Unable to scrape game links. Please refresh page");
        // Add logic to make sure popup reflects this, maybe set a flag in memory
        return;
    }
  }
);
