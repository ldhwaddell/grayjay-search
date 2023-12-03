import { useEffect, useState } from "react";

import InvalidPage from "./Pages/InvalidPage/InvalidPage";
import SearchPage from "./Pages/SearchPage/SearchPage";

import { Cache } from "./Cache";

import { GameData } from "./types";

const regex: RegExp =
  /^https?:\/\/(?:www\.)?grayjayleagues\.com\/.*[?&]all_games=1(&|$).*/;

const isValidUrl = (url: string): boolean => regex.test(url);

const Popup = () => {
  const [onValidPage, setOnValidPage] = useState<boolean | null>(null);
  const [gameData, setGameData] = useState<GameData[]>([]);

  useEffect(() => {
    const checkValidUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        const valid: boolean = !!tab.url && isValidUrl(tab.url);

        if (valid) {
          const games: GameData[] = await Cache.get();
          setGameData(games);
        }

        setOnValidPage(valid);
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

  return <>{onValidPage ? <SearchPage games={gameData} /> : <InvalidPage />}</>;
};

export default Popup;
