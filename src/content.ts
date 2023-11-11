// Define types for your messages and responses
type ProcessLinksMessage = {
  type: "PROCESS_LINKS";
  links: string[];
};

type ErrorScrapingLinksMessage = {
  type: "ERROR_SCRAPING_LINKS";
};

type Message = ProcessLinksMessage | ErrorScrapingLinksMessage;

type Response = {
  requestRescrape?: boolean;
};

const sendMessage = async (message: Message): Promise<Response> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: Response | undefined) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response ?? {});
      }
    });
  });
};

// The scrapeLinks function now takes an attempt parameter to track retries
const scrapeLinks = async (attempt = 1) => {
  const gameDivs = Array.from(document.querySelectorAll(".single-game"));
  const links = gameDivs.flatMap((div) =>
    Array.from(div.querySelectorAll("a[href]")).map(
      (link) => (link as HTMLAnchorElement).href
    )
  );

  try {
    const message: Message = { type: "PROCESS_LINKS", links };
    const response = await sendMessage(message);

    // Handle the response
    if (response.requestRescrape) {
      console.warn(`Rescrape requested. Attempt ${attempt}`);

      if (attempt < 3) {
        setTimeout(() => scrapeLinks(attempt + 1), 1000 * attempt);
      } else {
        throw Error(
          "Maximum rescrape attempts reached. Please refresh the page."
        );
      }
    }
  } catch (error) {
    console.error("Error scraping links:", error);
    const message: Message = { type: "ERROR_SCRAPING_LINKS" };
    sendMessage(message);
  }
};

// Content does not update frequently
// scraping on page load should provide recent enough content
window.addEventListener("load", () => scrapeLinks());

export {};
