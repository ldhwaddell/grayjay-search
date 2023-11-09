// Type Defs
type UrlCheckResult = { isValidUrl: boolean };

type QueryOptions = {
  active: boolean;
  currentWindow: boolean;
};

type Response = {
  isValidUrl: boolean;
};

type Message = {
  type: "CHECK_VALID_URL";
  // Include other possible message types
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

chrome.runtime.onMessage.addListener(
  (
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
    }
  }
);

export {};
