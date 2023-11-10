import { parse } from "html-to-ast";
//import type { MaybeDoc } from "html-to-ast";

// Type Defs
type UrlCheckResult = { isValidUrl: boolean };

type QueryOptions = {
  active: boolean;
  currentWindow: boolean;
};

type Response = {
  isValidUrl: boolean;
};

type CheckValidUrlMessage = {
  type: "CHECK_VALID_URL";
};

type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

// Union of all message types
type Message = CheckValidUrlMessage | ProcessLinksMessage;

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

const extractOfficials = (ast: MaybeDoc[]): string[] => {
  const officials: string[] = [];
  const stack: (MaybeDoc | undefined)[] = [...ast];

  while (stack.length > 0) {
    const node: MaybeDoc | undefined = stack.pop();

    if (!node) {
      continue;
    }

    // If element meets conditions signifying it is official, add it
    if (
      node.type === "tag" &&
      node.name === "input" &&
      node.attrs?.readonly !== undefined
    ) {
      officials.push(node.attrs.value as string);
    }

    // If node has children, shallow copy them and add to stack
    if (node.children) {
      stack.push(...node.children.slice().reverse());
    }
  }

  return officials;
};

const fetchGameData = async (link: string): Promise<OfficialsData> => {
  const response = await fetch(link);
  const html: string = await response.text();
  const ast: MaybeDoc[] = parse(html);
  const officials: string[] = extractOfficials(ast);

  const gameId: number = Number(link.split("/").pop());

  const data: OfficialsData = {
    gameId: gameId,
    referee1: officials[0],
    referee2: officials[1],
    linesPerson1: officials[2],
    linesPerson2: officials[3],
    timeKeeper1: officials[4],
    timeKeeper2: officials[5],
  };

  return data;
};

const processLinks = async (links: any) => {
  const chunkSize = 5;
  for (let i = 0; i < links.length; i += chunkSize) {
    const chunk = links.slice(i, i + chunkSize);
    // async scrape data for each link in the chunk
    //wait for them all to complete
    // add all data to arr
    // Find way to mark any errors for retry logic
  }
};

chrome.runtime.onMessage.addListener(
  async (
    message: Message,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: Response) => void
  ) => {
    switch (message.type) {
      case "CHECK_VALID_URL":
        checkActiveTabUrl()
          .then((result: Response) => {
            sendResponse(result);
          })
          .catch((error: Error) => {
            console.error("Error checking active tab URL: ", error);
            sendResponse({ isValidUrl: false });
          });
        // Indicate that sendResponse will be called asynchronously
        return true;

      case "PROCESS_LINKS":
        // Begin logic to parse and then save link data to storage
        await fetchGameData(message.links[1]);
      // Save all processed links to chrome storage

      // Retry logic?
    }
  }
);

export {};
