import { parse } from "html-to-ast";
import { Cache } from "./Cache";

// Type Defs
type UrlCheckResult = { isValidUrl: boolean };

// Response types
type CheckUrlResponse = {
  isValidUrl: boolean;
};

type ProcessLinksResponse = {
  requestRescrape: boolean;
};

type MessageResponse = CheckUrlResponse | ProcessLinksResponse;

// sendResponse function types
type CheckUrlResponseFunction = (response: CheckUrlResponse) => void;

type ProcessLinksResponseFunction = (response: ProcessLinksResponse) => void;

// Message types
type CheckValidUrlMessage = {
  type: "CHECK_VALID_URL";
};

type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

type Message =
  | CheckValidUrlMessage
  | ProcessLinksMessage
  | ErrorScrapingLinksMessage;

// HTML node types
interface MaybeDoc {
  type?: string;
  text?: string;
  content?: string;
  voidElement?: boolean;
  name?: string;
  style?: string[];
  attrs?: Record<string, string | boolean | number>;
  children?: MaybeDoc[];
  comment?: string;
}

interface OfficialNode extends MaybeDoc {
  attrs: {
    readonly: string;
    value: string;
  };
}

// Game object types
interface GameData {
  url: string;
  id: number;
  referee1: string;
  referee2: string;
  linesPerson1: string;
  linesPerson2: string;
  timeKeeper1: string;
  timeKeeper2: string;
}

const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

const isValidUrl = (url: string): boolean => regex.test(url);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// State flag
let isProcessingLinks = false;

const isOfficial = (node: MaybeDoc): node is OfficialNode =>
  node.type === "tag" &&
  node.name === "input" &&
  node.attrs?.readonly !== undefined &&
  typeof node.attrs.value === "string";

const checkActiveTabUrl = async (): Promise<UrlCheckResult> => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return { isValidUrl: !!tab.url && isValidUrl(tab.url) };
  } catch (error) {
    console.error("Error checking if the tab URL is valid:", error);
    return { isValidUrl: false };
  }
};

const handleCheckValidUrl = async (sendResponse: CheckUrlResponseFunction) => {
  try {
    const isValid: CheckUrlResponse = await checkActiveTabUrl();
    sendResponse(isValid);
  } catch (error) {
    console.error("Error checking active tab URL: ", error);
    sendResponse({ isValidUrl: false });
  }
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
      linesPerson1: officials[3],
      linesPerson2: officials[2],
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
  const currentIds: Set<number> = new Set(
    newLinks.map((game) => Number(game.split("/").pop()))
  );
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

const handleProcessLinks = async (
  sendResponse: ProcessLinksResponseFunction,
  message: ProcessLinksMessage
) => {
  // If current scrape in process, ignore request
  if (isProcessingLinks) {
    console.warn(
      "Already processing links. Ignoring new request to process links."
    );
    sendResponse({ requestRescrape: false });
    return;
  }

  isProcessingLinks = true;
  const { links } = message;

  // If there are no links, request a re-scrape
  if (!links || !links.length) {
    console.warn("Empty list of game links received. Requesting re-scrape");
    sendResponse({ requestRescrape: true });
    return;
  }

  sendResponse({ requestRescrape: false });

  // If there are links, check the cache for links
  const cachedGames: GameData[] = await Cache.get();

  // If there are links, diff the list received and the cache
  const [newGamesToScrape, oldGamesToRemove] = diffArrays(links, cachedGames);

  scrapeLinks(newGamesToScrape);
  Cache.remove(oldGamesToRemove);
};

chrome.runtime.onMessage.addListener(
  (
    message: Message,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void
  ) => {
    switch (message.type) {
      case "CHECK_VALID_URL":
        handleCheckValidUrl(sendResponse);
        return true;

      case "PROCESS_LINKS":
        handleProcessLinks(sendResponse, message);
        return true;

      case "ERROR_SCRAPING_LINKS":
        console.error("Unable to scrape game links. Please refresh page");
        // Add logic to make sure popup reflects this, maybe set a flag in memory
        return true;
    }
  }
);
