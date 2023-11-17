import { useEffect, useState } from "react";

import InvalidPage from "./InvalidPage/InvalidPage";
import SearchPage from "./SearchPage/SearchPage";
import LoadingPage from "./LoadingPage/LoadingPage";

// Type Defs
type CheckValidUrlMessage = {
  type: string;
};

type CheckValidUrlResponse = {
  isValidUrl: boolean;
};

const Popup = () => {
  const [onValidPage, setOnValidPage] = useState<boolean | null>(null);

  // App component in the popup script
  useEffect(() => {
    const message: CheckValidUrlMessage = { type: "CHECK_VALID_URL" };
    const sendMessage = (): Promise<CheckValidUrlResponse> => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          message,
          (response: CheckValidUrlResponse) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            }
            resolve(response ?? { isValidUrl: false });
          }
        );
      });
    };

    sendMessage()
      .then((response) => {
        setOnValidPage(response.isValidUrl);
      })
      .catch((error: Error) => {
        console.error("Error:", JSON.stringify(error));
        setOnValidPage(false);
      });

    // No dependencies array - this effect should not re-run
  }, []);

  // Render based on the state, including a loading state if onValidPage is null
  if (onValidPage === null) {
    // TODO: Make a loading page
    return <LoadingPage />;
  }

  // EXCHANGEED WITH LOADING FOR TESTING
  return <div>{onValidPage ? <SearchPage /> : <LoadingPage />}</div>;
};

export default Popup;
