import { useEffect, useState } from "react";

import InvalidPage from "./Pages/InvalidPage/InvalidPage";
import SearchPage from "./Pages/SearchPage/SearchPage";

import { Cache } from "./Cache";

// Type Defs
type CheckValidUrlMessage = {
  type: string;
};

type CheckValidUrlResponse = {
  isValidUrl: boolean;
};

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
  const [gameData, setGameData] = useState<GameData[]>([]);

  useEffect(() => {
    const checkValidUrl = async () => {
      try {
        const response = await sendMessage();
        if (response.isValidUrl) {
          const data: GameData[] = await Cache.get();
          setGameData(data);
        }

        setOnValidPage(response.isValidUrl);
      } catch (error) {
        console.error("Error:", JSON.stringify(error));
        setOnValidPage(false);
      }
    };

    checkValidUrl();
  }, []);

  // If page has not yet been verified, show invalid page
  if (onValidPage === null) {
    return <InvalidPage />;
  }

  return <>{onValidPage ? <SearchPage data={gameData} /> : <InvalidPage />}</>;
};

export default Popup;
