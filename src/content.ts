// Define types for your messages and responses
type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

const scrapeLinks = (retries = 3, delayMs: number = 1000) => {
  try {
    const gameDivs = Array.from(document.querySelectorAll(".single-game"));
    const links = gameDivs.flatMap((div) =>
      Array.from(div.querySelectorAll("a[href]")).map(
        (link) => (link as HTMLAnchorElement).href
      )
    );

    if (!links || !links.length) {
      throw new Error("Empty list of links received");
    }

    const message: ProcessLinksMessage = { type: "PROCESS_LINKS", links };
    chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error(error);
    if (retries > 1) {
      setTimeout(() => scrapeLinks(retries - 1, delayMs), delayMs);
    } else {
      console.warn("Maximum retries reached for scraping links.");
      const message: ErrorScrapingLinksMessage = {
        type: "ERROR_SCRAPING_LINKS",
      };
      chrome.runtime.sendMessage(message);
    }
  }
};

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", () => scrapeLinks());

export {};

// ADD LITTLE REF LOGOS TO EACH GAME WITH WHOS ON IT
