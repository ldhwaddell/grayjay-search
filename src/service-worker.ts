import { parse } from "html-to-ast";
import { Cache } from "./Cache";

// Type Defs
type UrlCheckResult = { isValidUrl: boolean };

type QueryOptions = {
  active: boolean;
  currentWindow: boolean;
};

type CheckUrlResponse = {
  isValidUrl: boolean;
};

type ProcessLinksResponse = {};

type MessageResponse = CheckUrlResponse | ProcessLinksResponse;

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

// Union of all message types
type Message =
  | CheckValidUrlMessage
  | ProcessLinksMessage
  | ErrorScrapingLinksMessage;

type Attr = Record<string, string | boolean | number>;

interface MaybeDoc {
  type?: string;
  text?: string;
  content?: string;
  voidElement?: boolean;
  name?: string;
  style?: string[];
  attrs?: Attr;
  children?: MaybeDoc[];
  comment?: string;
}

interface OfficialNode extends MaybeDoc {
  attrs: {
    readonly: string;
    value: string; // Assuming value is always a string
  };
}

type OfficialsData = {
  gameId: number;
  referee1: string;
  referee2: string;
  linesPerson1: string;
  linesPerson2: string;
  timeKeeper1: string;
  timeKeeper2: string;
};

const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

const isValidUrl = (url: string | undefined): boolean => {
  return url ? regex.test(url) : false;
};

// Conditions may change in future so make them easy to update
// Add return type so no need to check typeof in extractOffials function
const isOfficial = (node: MaybeDoc): node is OfficialNode => {
  return (
    node.type === "tag" &&
    node.name === "input" &&
    node.attrs != null && // Check if attrs is not null or undefined
    node.attrs.readonly !== undefined &&
    typeof node.attrs.value === "string" // Ensure value is a string
  );
};

const checkActiveTabUrl = async (): Promise<UrlCheckResult> => {
  try {
    const queryOptions: QueryOptions = { active: true, currentWindow: true };
    const [tab]: chrome.tabs.Tab[] = await chrome.tabs.query(queryOptions);
    const isValid: boolean = tab ? isValidUrl(tab.url) : false;
    return { isValidUrl: isValid };
  } catch (error: any) {
    // If an error occurs, log it and return isValidUrl as false
    console.error("Error checking if the tab URL is valid:", error);
    return { isValidUrl: false };
  }
};

const handleCheckValidUrl = async (sendResponse: any) => {
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
  const stack: (MaybeDoc | undefined)[] = [...ast];

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

const fetchGameData = async (link: string): Promise<OfficialsData | null> => {
  try {
    const response = await fetch(link);

    if (response.status !== 200) {
      console.error(
        `Invalid status response code for link: ${link}. Status code: ${response.status}`
      );
      return null;
    }

    const html: string = await response.text();
    const ast: MaybeDoc[] = parse(html);
    const officials: string[] = extractOfficials(ast);
    const gameId: number = Number(link.split("/").pop());

    const data: OfficialsData = {
      gameId: gameId,
      referee1: officials[5],
      referee2: officials[4],
      linesPerson1: officials[3],
      linesPerson2: officials[2],
      timeKeeper1: officials[1],
      timeKeeper2: officials[0],
    };

    return data;
  } catch (error) {
    console.error(`Error fetching game data for link: ${link}`, error);
    return null;
  }
};

const scrapeLinks = async (links: string[]) => {
  const chunkSize = 5;
  const allGameData: (OfficialsData | null)[] = [];
  const failedScrapes: string[] = [];

  for (let i = 0; i < links.length; i += chunkSize) {
    const chunk = links.slice(i, i + chunkSize);

    try {
      // Fetch game data for each link in the chunk concurrently
      const dataChunk = await Promise.all(
        chunk.map((link) => fetchGameData(link))
      );

      allGameData.push(...dataChunk.filter((item) => item !== null));
      // Collect links that resulted in null, signifying error
      failedScrapes.push(
        ...chunk.filter((_, index) => dataChunk[index] === null)
      );
    } catch (error) {
      // Log the error and the chunk that caused it
      console.error("Error with a chunk:", chunk, error);
      failedScrapes.push(...chunk); // Assume the entire chunk failed
    }
  }

  // Add retry logic here

  return allGameData;
};

const diffArrays = (current: any[], cached: any[]) => {
  const currentSet = new Set(current.map((game) => game.gameId));
  const cachedSet = new Set(cached.map((game) => game.gameId));

  const newGamesToScrape = current.filter((id) => !cachedSet.has(id));
  const oldGamesToRemove = cached.filter((id) => !currentSet.has(id));

  return [newGamesToScrape, oldGamesToRemove];
};

const handleProcessLinks = async (sendResponse: any, message: any) => {
  const { links } = message;
  let newGameData: (OfficialsData | null)[] = [];

  // If there are no links, request a re-scrape
  if (!links || !links.length) {
    console.warn("Empty list of game links received. Requesting re-scrape");
    sendResponse({ requestRescrape: true });
    return;
  }

  sendResponse({ requestRescrape: false });

  // If there are links, check the cache for links
  const cachedGames: any[] = await Cache.get();

  // If no links, then scrape everything
  if (!cachedGames || !cachedGames.length) {
    // Process all links
    newGameData = await scrapeLinks(links);
    Cache.update(newGameData);
    return;
  }

  // If there are links, diff the list received and the cache
  const [newGamesToScrape, oldGamesToRemove] = diffArrays(links, cachedGames);

  if (newGamesToScrape && newGamesToScrape.length) {
    newGameData = await scrapeLinks(newGamesToScrape);
  }

  Cache.update(newGameData, oldGamesToRemove);
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

// const badLinks = [
//   "https://grayjayleagues.com/47/115/173/311/0/officials/games/landing/42650",
//   "https://grayjayleagues.com/47/115/173/311/0/officials/games/landing/43122",
//   "https://grayjayleagues.com/47/115/173/311/0/officials/games/landing/sadasda",
//   "https://grayjayleagues.com/47/115/173/311/0/officials/games/landing/43123",
// ];
