import { useEffect, useState } from "react";

import InvalidPage from "./Pages/InvalidPage/InvalidPage";
import SearchPage from "./Pages/SearchPage/SearchPage";

// Type Defs
type CheckValidUrlMessage = {
  type: string;
};

type CheckValidUrlResponse = {
  isValidUrl: boolean;
};

// Send message helper function
const message: CheckValidUrlMessage = { type: "CHECK_VALID_URL" };
const sendMessage = (): Promise<CheckValidUrlResponse> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: CheckValidUrlResponse) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      }
      resolve(response);
    });
  });
};

const Popup = () => {
  const [onValidPage, setOnValidPage] = useState<boolean | null>(null);

  useEffect(() => {
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

  // If page has not yet been verified, show invalid page
  if (onValidPage === null) {
    return <InvalidPage />;
  }

  return <>{onValidPage ? <SearchPage /> : <SearchPage />}</>;
};

export default Popup;
