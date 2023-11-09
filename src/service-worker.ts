import { parse } from "html-to-ast";

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

interface ASTNode {
  type?: string;
  name?: string;
  voidElement?: boolean;
  attrs?: { [key: string]: any };
  children?: ASTNode[];
  content?: string;
}

// Flatten the AST into a single array of nodes
function extractOfficials(
  ast: ASTNode[],
  officials: ASTNode[] = []
): ASTNode[] {
  for (const node of ast) {
    if (
      node.type === "tag" &&
      node.name === "input" &&
      node.attrs?.["readonly"] !== undefined
    ) {
      // Push the officials name
      officials.push(node.attrs.value);
    }
    // Recurse into the children if there are any
    if (node.children) {
      extractOfficials(node.children, officials); // Recursively flatten the children
    }
  }
  return officials;
}

const fetchGameData = async (link: any) => {
  // Can this be done faster?
  const response = await fetch(link);
  const html = await response.text();

  const ast = parse(html);

  const officials = extractOfficials(ast);

  const [
    referee1,
    referee2,
    linesPerson1,
    linesPerson2,
    timeKeeper1,
    timeKeeper2,
  ] = officials;

  const data = {
    gameId: link.split("/").at(-1),
    referee1,
    referee2,
    linesPerson1,
    linesPerson2,
    timeKeeper1,
    timeKeeper2,
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
