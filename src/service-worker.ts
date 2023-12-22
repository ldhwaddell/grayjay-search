import { parse } from "html-to-ast";
import { Cache } from "./Cache";
import { retry, getCurrentTab } from "./utils";

import {
  ErrorScrapingLinksMessage,
  ProcessLinksMessage,
  GameDataRecord,
  MaybeDoc,
  OfficialNode,
  InjectTooltipMessage,
} from "./types";

type Message = ErrorScrapingLinksMessage | ProcessLinksMessage;

// State flag
let isProcessingLinks = false;

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

const fetchGameData = async (url: string): Promise<GameDataRecord | null> => {
  try {
    const html: string = await retry(async () => {
      const response = await fetch(url);

      if (response.ok) {
        return await response.text();
      }

      throw new Error(`Invalid response code: ${response.status} for ${url}`);
    });

    const ast: MaybeDoc[] = parse(html);
    const officials: string[] = extractOfficials(ast);
    const id: string = url.split("/").pop() as string;

    const data: GameDataRecord = {
      [id]: {
        url,
        referee1: officials[5],
        referee2: officials[4],
        linesman1: officials[3],
        linesman2: officials[2],
        timeKeeper1: officials[1],
        timeKeeper2: officials[0],
      },
    };

    return data;
  } catch (error) {
    console.error(`Error fetching game data for URL: ${url}`, error);
    return null;
  }
};

const scrapeLinks = async (activeTabId: number, links: string[]) => {
  const chunkSize = 5;

  for (let i = 0; i < links.length; i += chunkSize) {
    const chunk = links.slice(i, i + chunkSize);

    try {
      const dataChunk = await Promise.all(
        chunk.map((link) => fetchGameData(link))
      );

      const combinedDataChunk: GameDataRecord = {};

      for (const game of dataChunk) {
        if (game) {
          // Construct the message
          const message: InjectTooltipMessage = {
            type: "INJECT_TOOLTIP",
            game,
          };

          // Send message to the tab
          try {
            chrome.tabs.sendMessage(activeTabId, message);
          } catch (error) {
            console.error("Error sending message to tab:", error);
          }

          // Combine the data
          const [key] = Object.keys(game);
          combinedDataChunk[key] = game[key];
        }
      }

      // Add combined, non null data chunks to cache
      Cache.addGames(combinedDataChunk);
    } catch (error) {
      // Log the error and the chunk that caused it
      console.error("Error with a chunk:", chunk, error);
    }
  }

  isProcessingLinks = false;
};

const handleProcessLinks = async (message: ProcessLinksMessage) => {
  // If current scrape in process, ignore request
  if (isProcessingLinks) {
    console.warn(
      "Already processing links. Ignoring new request to process links."
    );
    return;
  }
  // Get active tab to send messages to
  const tab = await getCurrentTab();
  if (!tab || !tab.id) {
    console.error("No active tab found.");
    return;
  }

  const { links } = message;
  isProcessingLinks = true;
  scrapeLinks(tab.id, links);
};

chrome.runtime.onMessage.addListener(
  async (
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
